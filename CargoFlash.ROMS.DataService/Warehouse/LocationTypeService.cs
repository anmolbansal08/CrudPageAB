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
using CargoFlash.Cargo.Model.Warehouse;
using CargoFlash.SoftwareFactory.Data;
using CargoFlash.Cargo.Business;
using System.Net;
namespace CargoFlash.Cargo.DataService.Warehouse
{
    #region Location Type Service Description
    /*
	*****************************************************************************
	Service Name:	LocationTypeService      
	Purpose:		This Service used to get details of LocationType save update and delete
	Company:		CargoFlash Infotech Pvt Ltd.
	Author:			Santosh Gupta.
	Created On:		16 jan 2016
    Updated By:    
	Updated On:	
	Approved By:    
	Approved On:	
	*****************************************************************************
	*/
    #endregion
    [GlobalErrorHandlerBehaviour(typeof(GlobalErrorHandler))]   [ServiceBehavior(IncludeExceptionDetailInFaults = true)]
    [AspNetCompatibilityRequirements(RequirementsMode = AspNetCompatibilityRequirementsMode.Allowed)]
    public class LocationTypeService : SignatureAuthenticate,ILocationTypeService
    {
        public LocationType GetLocationTypeRecord(int recordID, string UserID)
        {
            try
            {
                LocationType locationType = new LocationType();
                SqlParameter[] Parameters = { new SqlParameter("@SNo", Convert.ToInt32(recordID)), new SqlParameter("@UserID", Convert.ToInt32(UserID)) };
                SqlDataReader dr = SqlHelper.ExecuteReader(ReadConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, "GetRecordLocationType", Parameters);
                if (dr.Read())
                {
                    locationType.SNo = Convert.ToInt32(dr["SNo"]);
                    locationType.IsEditable = Convert.ToBoolean(dr["IsEditable"]);
                    locationType.LocationType1 = dr["LocationType1"].ToString().ToUpper();
                    locationType.LocationCode = dr["LocationCode"].ToString().ToUpper();
                    locationType.OpsType = Convert.ToInt32(dr["OpsType"]);
                    locationType.Text_OpsType = dr["Text_OpsType"].ToString();
                    locationType.IsActive = Convert.ToBoolean(dr["IsActive"]);
                    locationType.Active = dr["ACTIVE"].ToString();
                    locationType.UpdatedBy = dr["UpdatedUser"].ToString();
                    locationType.CreatedBy = dr["CreatedUser"].ToString();
                }
                dr.Close();
                return locationType;
            }          
            catch(Exception ex)//
            {
                throw ex;
            }
            
        }
        public DataSourceResult GetGridData(int skip, int take, int page, int pageSize, List<GridSort> sort, GridFilter filter)
        {
            try
            {
                string sorts = GridSort.ProcessSorting(sort);
                string filters = GridFilter.ProcessFilters<LocationType>(filter);
                SqlParameter[] Parameters = { new SqlParameter("@PageNo", page), new SqlParameter("@PageSize", pageSize), new SqlParameter("@WhereCondition", filters), new SqlParameter("@OrderBy", sorts) };
                DataSet ds = SqlHelper.ExecuteDataset(ReadConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, "GetListLocationType", Parameters);
                var IrrList = ds.Tables[0].AsEnumerable().Select(e => new LocationType
                {
                    SNo = Convert.ToInt32(e["SNo"]),
                    Editable = e["Editable"].ToString().ToUpper(),
                    LocationType1 = e["LocationType1"].ToString().ToUpper(),
                    LocationCode = e["LocationCode"].ToString().ToUpper(),
                    Active = Convert.ToString(e["Active"]),
                });
                ds.Dispose();
                return new DataSourceResult
                {
                    Data = IrrList.AsQueryable().ToList(),
                    Total = Convert.ToInt32(ds.Tables[1].Rows[0][0].ToString())
                };
            }            
            catch(Exception ex)//
            {
                throw ex;
            }            
        }
        public List<string> SaveLocationType(List<LocationType> LocationType)
        {
            try
            {
                //validate Business Rule
                List<string> ErrorMessage = new List<string>();
                DataTable dtLocationType = CollectionHelper.ConvertTo(LocationType, "Text_OpsType,Editable,Active,IsEditable");
                BaseBusiness baseBusiness = new BaseBusiness();
                if (!baseBusiness.ValidateBaseBusiness("LocationType", dtLocationType, "SAVE"))
                {
                    ErrorMessage = baseBusiness.ErrorMessage;
                    return ErrorMessage;
                }
                SqlParameter param = new SqlParameter();
                param.ParameterName = "@LocationTypeTable";
                param.SqlDbType = System.Data.SqlDbType.Structured;
                param.Value = dtLocationType;
                SqlParameter[] Parameters = { param };
                int ret = (int)SqlHelper.ExecuteScalar(DMLConnectionString.WebConfigConnectionString, "CreateLocationType", Parameters);
                if (ret > 0)
                {
                    if (ret > 1000)
                    {
                        //For Customised Validation Messages like 'Record Already Exists' etc
                        string serverErrorMessage = baseBusiness.ReadServerErrorMessages(ret, "LocationType");
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
        public List<string> UpdateLocationType(List<LocationType> LocationType)
        {
            try
            {
                List<string> ErrorMessage = new List<string>();
                DataTable dtCreateIrr = CollectionHelper.ConvertTo(LocationType, "Text_OpsType,Editable,Active,IsEditable");
                BaseBusiness baseBusiness = new BaseBusiness();

                if (!baseBusiness.ValidateBaseBusiness("LocationType", dtCreateIrr, "UPDATE"))
                {
                    ErrorMessage = baseBusiness.ErrorMessage;
                    return ErrorMessage;
                }

                SqlParameter param = new SqlParameter();
                param.ParameterName = "@LocationTypeTable";
                param.SqlDbType = System.Data.SqlDbType.Structured;
                param.Value = dtCreateIrr;
                SqlParameter[] Parameters = { param };

                int ret = (int)SqlHelper.ExecuteScalar(DMLConnectionString.WebConfigConnectionString, "UpdateLocationType", Parameters);
                if (ret > 0)
                {
                    if (ret > 1000)
                    {
                        //For Customised Validation Messages like 'Record Already Exists' etc
                        string serverErrorMessage = baseBusiness.ReadServerErrorMessages(ret, "LocationType");
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
        public List<string> DeleteLocationType(List<string> listID)
        {
            try
            {
                List<string> ErrorMessage = new List<string>();
                BaseBusiness baseBusiness = new BaseBusiness();
                if (listID.Count > 1)
                {
                    string RecordID = listID[0].ToString();
                    string UserID = listID[1].ToString();

                    SqlParameter[] Parameters = { new SqlParameter("@SNo", Convert.ToInt32(RecordID)),
                                             new SqlParameter("@UserID",  Convert.ToInt32(UserID))};

                    int ret = (int)SqlHelper.ExecuteScalar(DMLConnectionString.WebConfigConnectionString, "DeleteLocationType", Parameters);
                    if (ret > 0)
                    {
                        if (ret > 1000)
                        {
                            //For Customised Validation Messages like 'Record Already Exists' etc
                            string serverErrorMessage = baseBusiness.ReadServerErrorMessages(ret, "LocationType");
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
