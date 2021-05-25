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
    #region WarehouseLocation Service Description
    /*
	*****************************************************************************
	Service Name:	WarehouseLocationService      
	Purpose:		This Service used to get details of WarehouseLocation save update and delete
	Company:		CargoFlash Infotech Pvt Ltd.
	Author:			Swati Rastogi.
	Created On:		06 Nov 2015
    Updated By:    
	Updated On:	
	Approved By:    
	Approved On:	
	*****************************************************************************
	*/
    #endregion
    [GlobalErrorHandlerBehaviour(typeof(GlobalErrorHandler))]   [ServiceBehavior(IncludeExceptionDetailInFaults = true)]
    [AspNetCompatibilityRequirements(RequirementsMode = AspNetCompatibilityRequirementsMode.Allowed)]
    public class WarehouseLocationService :SignatureAuthenticate,IWarehouseLocationService
    {
        public WarehouseLocation GetWarehouseLocationRecord(int recordID, string UserID)
        {
            try
            {
                WarehouseLocation warehouseloc = new WarehouseLocation();
                SqlParameter[] Parameters = { new SqlParameter("@SNo", Convert.ToInt32(recordID)), new SqlParameter("@UserID", Convert.ToInt32(UserID)) };
                SqlDataReader dr = SqlHelper.ExecuteReader(ReadConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, "GetRecordWarehouseLocation", Parameters);
                if (dr.Read())
                {
                    warehouseloc.SNo = Convert.ToInt32(dr["SNo"]);
                    warehouseloc.CityCode = dr["CityCode"].ToString();
                    warehouseloc.Text_CityCode = dr["CityCode"].ToString();
                    warehouseloc.LocationNo = dr["LocationNo"].ToString().ToUpper();
                    warehouseloc.RowNo = Convert.ToInt32(dr["RowNo"]);
                    warehouseloc.ColumnNo = Convert.ToInt32(dr["ColumnNo"]);
                    warehouseloc.AirlineSNo = Convert.ToInt32(dr["AirlineSNo"]);
                    warehouseloc.Text_AirlineSNo = dr["Airline"].ToString().ToUpper();
                    warehouseloc.SPHCSNo = Convert.ToInt32(dr["SPHCSNo"]);
                    warehouseloc.Text_SPHCSNo = dr["SPHC"].ToString().ToUpper();
                    warehouseloc.CommoditySNo = Convert.ToInt32(dr["CommoditySNo"]);
                    warehouseloc.Text_CommoditySNo = dr["Commodity"].ToString().ToUpper();
                    warehouseloc.DestinationCitySNo = Convert.ToInt32(dr["DestinationCitySNo"]);
                    warehouseloc.Text_DestinationCitySNo = dr["DestinationCity"].ToString().ToUpper();
                    warehouseloc.CountrySNo = Convert.ToInt32(dr["CountrySNo"]);
                    warehouseloc.Text_CountrySNo = dr["Country"].ToString().ToUpper();
                    warehouseloc.LocationTypeSNo = Convert.ToInt32(dr["LocationTypeSNo"]);
                    warehouseloc.Text_LocationTypeSNo = dr["LocationType"].ToString().ToUpper();
                    warehouseloc.LocationSubTypeSNo = Convert.ToInt32(dr["LocationSubTypeSNo"]);
                    warehouseloc.Text_LocationSubTypeSNo = dr["LocationSubType"].ToString().ToUpper();
                    warehouseloc.Description = dr["Description"].ToString();
                    warehouseloc.IsActive = Convert.ToBoolean(dr["IsActive"]);
                    warehouseloc.Active = dr["ACTIVE"].ToString();
                    warehouseloc.UpdatedBy = dr["UpdatedUser"].ToString();
                    warehouseloc.CreatedBy = dr["CreatedUser"].ToString();
                }
                dr.Close();
                return warehouseloc;
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
                string filters = GridFilter.ProcessFilters<WarehouseLocation>(filter);
                SqlParameter[] Parameters = { new SqlParameter("@PageNo", page), new SqlParameter("@PageSize", pageSize), new SqlParameter("@WhereCondition", filters), new SqlParameter("@OrderBy", sorts) };
                DataSet ds = SqlHelper.ExecuteDataset(ReadConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, "GetListWarehouseLocation", Parameters);
                var IrrList = ds.Tables[0].AsEnumerable().Select(e => new WarehouseLocation
                {
                    SNo = Convert.ToInt32(e["SNo"]),
                    LocationNo = e["LocationNo"].ToString().ToUpper(),
                    Airline = e["Airline"].ToString().ToUpper(),
                    SPHC = e["SPHC"].ToString(),
                    Commodity = e["Commodity"].ToString(),
                    DestinationCity = e["DestinationCity"].ToString().ToUpper(),
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
        public List<string> SaveWarehouseLocation(List<WarehouseLocation> WarehouseLocation)
        {
            try
            {
                //validate Business Rule
                List<string> ErrorMessage = new List<string>();
                DataTable dtCreateIrr = CollectionHelper.ConvertTo(WarehouseLocation, "Active,Airline,Text_CityCode,Text_AirlineSNo,Text_SPHCSNo,SPHC,Text_CommoditySNo,Commodity,Text_DestinationCitySNo,DestinationCity,Text_CountrySNo,Country,Text_LocationTypeSNo,LocationType,Text_LocationSubTypeSNo,LocationSubType");
                BaseBusiness baseBusiness = new BaseBusiness();

                if (!baseBusiness.ValidateBaseBusiness("WarehouseLocation", dtCreateIrr, "SAVE"))
                {
                    ErrorMessage = baseBusiness.ErrorMessage;
                    return ErrorMessage;
                }
                SqlParameter param = new SqlParameter();
                param.ParameterName = "@WarehouseLocationTable";
                param.SqlDbType = System.Data.SqlDbType.Structured;
                param.Value = dtCreateIrr;
                SqlParameter[] Parameters = { param };

                int ret = (int)SqlHelper.ExecuteScalar(DMLConnectionString.WebConfigConnectionString, "CreateWarehouseLocation", Parameters);
                if (ret > 0)
                {
                    if (ret > 1000)
                    {
                        //For Customised Validation Messages like 'Record Already Exists' etc
                        string serverErrorMessage = baseBusiness.ReadServerErrorMessages(ret, "WarehouseLocation");
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
        public List<string> UpdateWarehouseLocation(List<WarehouseLocation> WarehouseLocation)
        {
            try
            {
                List<string> ErrorMessage = new List<string>();
                DataTable dtCreateIrr = CollectionHelper.ConvertTo(WarehouseLocation, "Active,Airline,Text_CityCode,Text_AirlineSNo,Text_SPHCSNo,SPHC,Text_CommoditySNo,Commodity,Text_DestinationCitySNo,DestinationCity,Text_CountrySNo,Country,Text_LocationTypeSNo,LocationType,Text_LocationSubTypeSNo,LocationSubType");
                BaseBusiness baseBusiness = new BaseBusiness();

                if (!baseBusiness.ValidateBaseBusiness("WarehouseLocation", dtCreateIrr, "UPDATE"))
                {
                    ErrorMessage = baseBusiness.ErrorMessage;
                    return ErrorMessage;
                }

                SqlParameter param = new SqlParameter();
                param.ParameterName = "@WarehouseLocationTable";
                param.SqlDbType = System.Data.SqlDbType.Structured;
                param.Value = dtCreateIrr;
                SqlParameter[] Parameters = { param };

                int ret = (int)SqlHelper.ExecuteScalar(DMLConnectionString.WebConfigConnectionString, "UpdateWarehouseLocation", Parameters);
                if (ret > 0)
                {
                    if (ret > 1000)
                    {
                        //For Customised Validation Messages like 'Record Already Exists' etc
                        string serverErrorMessage = baseBusiness.ReadServerErrorMessages(ret, "WarehouseLocation");
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
        public List<string> DeleteWarehouseLocation(List<string> listID)
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

                    int ret = (int)SqlHelper.ExecuteScalar(DMLConnectionString.WebConfigConnectionString, "DeleteWarehouseLocation", Parameters);
                    if (ret > 0)
                    {
                        if (ret > 1000)
                        {
                            //For Customised Validation Messages like 'Record Already Exists' etc
                            string serverErrorMessage = baseBusiness.ReadServerErrorMessages(ret, "WarehouseLocation");
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
