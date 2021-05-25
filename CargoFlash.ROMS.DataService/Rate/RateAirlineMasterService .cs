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
using CargoFlash.Cargo.Model.Tariff;
using CargoFlash.SoftwareFactory.Data;
using CargoFlash.Cargo.Business;
using System.Net;

namespace CargoFlash.Cargo.DataService.Rate
{
    #region RateAirlineMasterService Class Description

    /*
	*****************************************************************************
	Class Name:		RateAirlineMasterService      
	Purpose:		This class used to Extend Interface IRateAirlineMasterService. This Class Communicate with SQL Server for CRUD Operation.
	Company:		CargoFlash 
	Author:			Madhav Kumar Jha
	Created On:		24 Feb 2014
	Approved By:    
	Approved On:	
	*****************************************************************************
	*/
    #endregion
    [GlobalErrorHandlerBehaviour(typeof(GlobalErrorHandler))]   [ServiceBehavior(IncludeExceptionDetailInFaults = true)]
    [AspNetCompatibilityRequirements(RequirementsMode = AspNetCompatibilityRequirementsMode.Allowed)]
    public class RateAirlineMasterService : SignatureAuthenticate, IRateAirlineMasterService
    {
        /// <summary>
        /// Retrieve RateAirlineMaster infromation from database 
        /// </summary> 
        /// <param name="recordID">Record id according to which touple is to be retrieved</param>
        /// <returns></returns>
        /// 
 
        public DataSourceResult GetGridData(int skip, int take, int page, int pageSize, List<GridSort> sort, GridFilter filter)
        {
            try
            {
                string sorts = GridSort.ProcessSorting(sort);
                string filters = GridFilter.ProcessFilters<RateAirlineMasterGridData>(filter);
                //string _connectionStringName = ConfigurationManager.AppSettings.Get("DataProvider");
                SqlParameter[] Parameters = { new SqlParameter("@PageNo", page), new SqlParameter("@PageSize", pageSize), new SqlParameter("@WhereCondition", filters), new SqlParameter("@OrderBy", sorts) };
                DataSet ds = SqlHelper.ExecuteDataset(DMLConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, "GetListRateAirlineMaster", Parameters);
                var RateAirlineMasterList = ds.Tables[0].AsEnumerable().Select(e => new RateAirlineMasterGridData
                {
                    Text_TruckType = e["Text_TruckType"].ToString(),
                    Text_SHCSNo = e["Text_SHCSNo"].ToString(),
                    TruckCode = e["TruckCode"].ToString() == "" ? " " : e["TruckCode"].ToString(),
                    AirlineName = e["AirlineName"].ToString(),
                    //OfficeName = e["OfficeName"].ToString(),
                    //AccountName = e["AccountName"].ToString(),
                    // CommoditySubGroupName = e["CommoditySubGroupName"].ToString(),
                    // ProductName = e["ProductName"].ToString(),
                    SPHCGroupName = e["SPHCGroupName"].ToString(),
                    // FlightTypeName = e["FlightTypeName"].ToString(),
                    //OriginCityCode = e["OriginCityCode"].ToString(),
                    //DestinationCityCode = e["DestinationCityCode"].ToString(),
                    OriginAirportCode = e["OriginAirportCode"].ToString(),
                    DestinationAirportCode = e["DestinationAirportCode"].ToString(),
                    // ValidFrom = Convert.ToDateTime(e["ValidFrom"]).ToString(DateFormat.DateFormatString),
                    // ValidTo = Convert.ToDateTime(e["ValidTo"]).ToString(DateFormat.DateFormatString),
                    ValidFrom = e["ValidFrom"] == DBNull.Value ? (DateTime?)null : DateTime.SpecifyKind(Convert.ToDateTime(e["ValidFrom"]), DateTimeKind.Utc),
                    ValidTo = e["ValidTo"] == DBNull.Value ? (DateTime?)null : DateTime.SpecifyKind(Convert.ToDateTime(e["ValidTo"]), DateTimeKind.Utc),
                    Active = e["Active"].ToString(),
                    SNo = e["RateAirlineMasterSNo"].ToString()


                });
                DataSourceResult d = new DataSourceResult
                {
                    Data = RateAirlineMasterList.AsQueryable().ToList(),
                    Total = Convert.ToInt32(ds.Tables[1].Rows[0][0].ToString())
                };

                ds.Dispose();
                return d;
            }
            catch(Exception ex)//
            {

                throw ex;
            }
        }
        public RateAirlineMaster GetRateAirlineMasterRecord(string recordID, string UserID)
        {
            try
            {
                int number = 0;

                RateAirlineMaster RateAirlineMaster = new RateAirlineMaster();
                SqlParameter[] Parameters = { new SqlParameter("@SNo", recordID), new SqlParameter("@UserID", Convert.ToInt32(UserID)) };
                SqlDataReader dr = SqlHelper.ExecuteReader(DMLConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, "GetRecordRateAirlineMaster", Parameters);
                if (dr.Read())
                {
                    RateAirlineMaster.AirlineSNo = Int32.TryParse(dr["AirlineSNo"].ToString(), out number) ? number : 0;
                    RateAirlineMaster.RateType = Int32.TryParse(dr["RateType"].ToString(), out number) ? number : 0;
                    //  RateAirlineMaster.RateClassCode = dr["RateClassCode"].ToString().ToString();
                    // RateAirlineMaster.CommoditySubGroupSNo = Int32.TryParse(dr["CommoditySubGroupSNo"].ToString(), out number) ? number : 0;
                    // RateAirlineMaster.CommoditySNo = Int32.TryParse(dr["CommoditySNo"].ToString(), out number) ? number : 0;
                    // RateAirlineMaster.CommodityPackageSNo = Int32.TryParse(dr["CommoditySNo"].ToString(), out number) ? number : 0;
                    RateAirlineMaster.SHCSNo = Int32.TryParse(dr["SHCSNo"].ToString(), out number) ? number : 0;
                    RateAirlineMaster.SPHCGroupSNo = Int32.TryParse(dr["SPHCGroupSNo"].ToString(), out number) ? number : 0;
                    RateAirlineMaster.WeightType = Int32.TryParse(dr["WeightType"].ToString(), out number) ? number : 0;
                    // RateAirlineMaster.OfficeSNo = Int32.TryParse(dr["OfficeSNo"].ToString(), out number) ? number : 0;
                    // RateAirlineMaster.AccountSNo = Int32.TryParse(dr["AccountSNo"].ToString(), out number) ? number : 0;
                    // RateAirlineMaster.AccountGroupSNo = Int32.TryParse(dr["AccountGroupSNo"].ToString(), out number) ? number : 0;
                    // RateAirlineMaster.OriginZoneSNo = Int32.TryParse(dr["OriginZoneSNo"].ToString(), out number) ? number : 0;
                    //RateAirlineMaster.DestinationZoneSNo = Int32.TryParse(dr["DestinationZoneSNo"].ToString(), out number) ? number : 0;
                    //RateAirlineMaster.OriginCitySNo = Int32.TryParse(dr["OriginCitySNo"].ToString(), out number) ? number : 0;
                    // RateAirlineMaster.DestinationCitySNo = Int32.TryParse(dr["DestinationCitySNo"].ToString(), out number) ? number : 0;
                    //RateAirlineMaster.OriginCityCode = dr["OriginCityCode"].ToString().ToString();
                    //RateAirlineMaster.DestinationCityCode = dr["DestinationCityCode"].ToString().ToString();
                    RateAirlineMaster.OriginAirportSNo = Int32.TryParse(dr["OriginAirPortSNo"].ToString(), out number) ? number : 0;
                    RateAirlineMaster.DestinationAirportSNo = Int32.TryParse(dr["DestinationAirPortSNo"].ToString(), out number) ? number : 0;
                    // RateAirlineMaster.ProductSNo = Int32.TryParse(dr["ProductSNo"].ToString(), out number) ? number : 0;
                    // RateAirlineMaster.FlightTypeSNo = Int32.TryParse(dr["FlightTypeSNo"].ToString(), out number) ? number : 0;
                    RateAirlineMaster.CurrencySNo = 11;// Int32.TryParse(dr["CurrencySNo"].ToString(), out number) ? number : 0;
                    RateAirlineMaster.MinimumRate = Convert.ToDecimal(dr["MinimumRate"].ToString() == "" ? "0" : dr["MinimumRate"].ToString());
                    RateAirlineMaster.Tax = Convert.ToDecimal(dr["Tax"].ToString() == "" ? "0" : dr["Tax"].ToString());
                    //RateAirlineMaster.IsGlobalSurCharge =Convert.ToBoolean(dr["IsGlobalSurCharge"].ToString());
                    RateAirlineMaster.IsGlobalDueCarrier = Convert.ToBoolean(dr["IsGlobalDueCarrier"].ToString());
                    RateAirlineMaster.Remarks = dr["Remarks"].ToString().ToString();
                    RateAirlineMaster.IsApproved = dr["IsApproved"].ToString() == "1";
                    RateAirlineMaster.ValidFrom = Convert.ToDateTime(dr["ValidFrom"].ToString());
                    RateAirlineMaster.ValidTo = Convert.ToDateTime(dr["ValidTo"].ToString());
                    RateAirlineMaster.IsActive = Convert.ToBoolean(dr["IsActive"].ToString());
                    RateAirlineMaster.CreatedBy = dr["UpdatedUser"].ToString().ToString();
                    RateAirlineMaster.UpdatedBy = Convert.ToString(dr["UpdatedUser"].ToString());


                    RateAirlineMaster.Text_IsGlobalDueCarrier = dr["Text_IsGlobalDueCarrier"].ToString();
                    RateAirlineMaster.Text_IsActive = dr["Text_IsActive"].ToString();

                    RateAirlineMaster.Text_WeightType = dr["Text_WeightType"].ToString();
                    RateAirlineMaster.Text_RateType = dr["Text_RateType"].ToString();
                    RateAirlineMaster.Text_AirlineSNo = dr["Text_AirlineSNo"].ToString();
                    // RateAirlineMaster.Text_OfficeSNo = dr["Text_OfficeSNo"].ToString();
                    // RateAirlineMaster.Text_AccountSNo = dr["Text_AccountSNo"].ToString();
                    //RateAirlineMaster.Text_AccountGroupSNo = dr["AccountGroupName"].ToString();
                    // RateAirlineMaster.Text_ProductSNo = dr["Text_ProductSNo"].ToString();
                    // RateAirlineMaster.Text_CommoditySubGroupSNo = dr["Text_CommoditySubGroupSNo"].ToString();
                    // RateAirlineMaster.Text_CommoditySNo = dr["Text_CommoditySNo"].ToString();
                    // RateAirlineMaster.Text_CommodityPackageSNo = dr["CommodityPackageName"].ToString();
                    //RateAirlineMaster.Text_OfficeSNo = dr["Text_OfficeSNo"].ToString();
                    //RateAirlineMaster.Text_AccountSNo = dr["Text_AccountSNo"].ToString();
                    //RateAirlineMaster.Text_OriginZoneSNo = dr["Text_OriginZoneSNo"].ToString();
                    //RateAirlineMaster.Text_DestinationZoneSNo = dr["Text_DestinationZoneSNo"].ToString();
                    RateAirlineMaster.Text_CurrencySNo = (((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"]))).CurrencyCode;// dr["Text_CurrencySNo"].ToString();
                    RateAirlineMaster.Text_SHCSNo = dr["Text_SHCSNo"].ToString();
                    RateAirlineMaster.Text_SPHCGroupSNo = dr["SPHCGroupName"].ToString();
                    //RateAirlineMaster.Text_FlightTypeSNo = dr["Text_FlightTypeSNo"].ToString();
                    //RateAirlineMaster.Text_OriginCitySNo = dr["Text_OriginCitySNo"].ToString();
                    // RateAirlineMaster.Text_DestinationCitySNo = dr["Text_DestinationCitySNo"].ToString();
                    RateAirlineMaster.Text_OriginAirportSNo = dr["Text_OriginAirportSNo"].ToString();
                    RateAirlineMaster.Text_DestinationAirportSNo = dr["Text_DestinationAirportSNo"].ToString();
                    RateAirlineMaster.TruckType = Convert.ToInt16(dr["TruckType"]);
                    RateAirlineMaster.Text_TruckType = dr["Text_TruckType"].ToString().ToUpper();
                    RateAirlineMaster.TruckCode = dr["TruckCode"].ToString();
                    RateAirlineMaster.AirportName = dr["AirportName"].ToString();
                    RateAirlineMaster.Text_AirportName = dr["Text_AirportName"].ToString();
                    RateAirlineMaster.Text_TruckCode = dr["Text_TruckCode"].ToString();

                }
                dr.Close();
                return RateAirlineMaster;
            }
            catch(Exception ex)//
            {

                throw ex;
            }
        }
        /// <summary>
        ///  Get list of the records to be shown in the grid
        /// </summary>
        /// <param name="skip">nos. of records to be Skipped</param>
        /// <param name="take">nos. of records to be Retrieved</param>
        /// <param name="page">page no</param>
        /// <param name="pageSize">Size of the page i.e. No of record to be displayed</param>
        /// <param name="sort">column no according to which records to be ordered</param>
        /// <param name="filter">values/parameter According to which record are filtered</param>
        /// <returns>List of the records</returns>

        /// <summary>
        /// Save the RateAirlineMaster Information into RateAirlineMaster and CreditLimit Entity 
        /// </summary>
        /// <param name="RateAirlineMaster">object of the Entity</param>
        public List<string> SaveRateAirlineMaster(List<RateAirlineMasterCollection> RateAirlineMasterCollection)
        {
            try
            {
                //validate Business Rule
                List<string> ErrorMessage = new List<string>();
                List<RateAirlineMaster> listRateAirlineMaster = new List<RateAirlineMaster>();
                List<RateAirlineTrans> listRateAirlineTrans = new List<RateAirlineTrans>();
                List<RateDueCarrierTrans> listRateDueCarrierTrans = new List<RateDueCarrierTrans>();
                List<RateAirlineCustomCharges> listRateAirlineCustomCharges = new List<RateAirlineCustomCharges>();
                listRateAirlineMaster = RateAirlineMasterCollection[0].rateAirlineMaster;
                listRateAirlineTrans = RateAirlineMasterCollection[0].rateAirlineTrans;
                listRateDueCarrierTrans = RateAirlineMasterCollection[0].rateDueCarrierTrans;
                listRateAirlineCustomCharges = RateAirlineMasterCollection[0].rateAirlineCustomCharges;
                DataTable dtCreateRateAirlineMaster = CollectionHelper.ConvertTo(listRateAirlineMaster, "Text_TruckCode,Text_AirportName,Text_AirlineSNo,Text_SPHCSNo,Text_OriginAirportSNo,Text_DestinationAirportSNo,Text_CurrencySNo,Active,GlobalDueCarrier,Approved,Text_WeightType,Text_RateType,Text_SPHCGroupSNo,Text_SHCSNo,Text_IsGlobalDueCarrier,Text_IsActive,Text_TruckType");
                DataTable dtCreateRateAirlineTrans = CollectionHelper.ConvertTo(listRateAirlineTrans, "");
                DataTable dtCreateRateDueCarrierTrans = CollectionHelper.ConvertTo(listRateDueCarrierTrans, "HdnName,ChargeableWeight,Mandatory,Name,IsCarrier,Carrier,FreightType,IsFreightType,DueCarrierTransSNo,IsMandatory,");
                DataTable dtRateAirlineCustomCharges = CollectionHelper.ConvertTo(listRateAirlineCustomCharges, "");
                BaseBusiness baseBusiness = new BaseBusiness();
                if (!baseBusiness.ValidateBaseBusiness("RateAirlineMaster", dtCreateRateAirlineMaster, "SAVE"))
                {
                    ErrorMessage = baseBusiness.ErrorMessage;
                    return ErrorMessage;
                }



                SqlParameter paramRateAirlineMaster = new SqlParameter();
                paramRateAirlineMaster.ParameterName = "@RateAirlineMasterTable";
                paramRateAirlineMaster.SqlDbType = System.Data.SqlDbType.Structured;
                paramRateAirlineMaster.Value = dtCreateRateAirlineMaster;

                SqlParameter paramRateAirlineTrans = new SqlParameter();
                paramRateAirlineTrans.ParameterName = "@RateAirlineTransTable";
                paramRateAirlineTrans.SqlDbType = System.Data.SqlDbType.Structured;
                paramRateAirlineTrans.Value = dtCreateRateAirlineTrans;

                SqlParameter paramRateDueCarrierTrans = new SqlParameter();
                paramRateDueCarrierTrans.ParameterName = "@RateDueCarrierTransTable";
                paramRateDueCarrierTrans.SqlDbType = System.Data.SqlDbType.Structured;
                paramRateDueCarrierTrans.Value = dtCreateRateDueCarrierTrans;


                SqlParameter paramRateAirlineCustomCharges = new SqlParameter();
                paramRateAirlineCustomCharges.ParameterName = "@RateAirlineCustomChargesTable";
                paramRateAirlineCustomCharges.SqlDbType = System.Data.SqlDbType.Structured;
                paramRateAirlineCustomCharges.Value = dtRateAirlineCustomCharges;

                SqlParameter[] Parameters = { paramRateAirlineMaster, paramRateAirlineTrans, paramRateDueCarrierTrans, paramRateAirlineCustomCharges };
                int ret = (int)SqlHelper.ExecuteScalar(DMLConnectionString.WebConfigConnectionString, "CreateRateAirlineMaster", Parameters);
                if (ret > 0)
                {
                    if (ret == 1001)
                    {
                        //For Customised Validation Messages like 'Record Already Exists' etc
                        string serverErrorMessage = baseBusiness.ReadServerErrorMessages(ret, "RateAirlineMaster");
                        if (!string.IsNullOrEmpty(serverErrorMessage))
                            ErrorMessage.Add(serverErrorMessage);
                    }
                    else if (ret == 2000)
                    {
                        //For Customised Validation Messages like 'Record Already Exists' etc
                        string serverErrorMessage = baseBusiness.ReadServerErrorMessages(ret, "RateAirlineMaster");
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

        //public KeyValuePair<string, List<TariffSlab>> GetRateAirlineMasterSlabRecord(string recordID, int page, int pageSize, string whereCondition, string sort)
        //{
        //    whereCondition = "TariffSNo=" + recordID;
        //    TariffSlab tariffSlab = new TariffSlab();
        //    SqlParameter[] Parameters = { new SqlParameter("@PageNo", page), new SqlParameter("@PageSize", pageSize), new SqlParameter("@WhereCondition", whereCondition), new SqlParameter("@OrderBy", sort) };
        //    DataSet ds = SqlHelper.ExecuteDataset(connectionString, CommandType.StoredProcedure, "GetTariffSlabRecord", Parameters);
        //    var tariffSlabList = ds.Tables[0].AsEnumerable().Select(e => new TariffSlab
        //    {
        //        SNo = Convert.ToInt32(e["SNo"]),
        //        SlabSNo = Convert.ToInt32(e["SlabSNo"].ToString()),
        //        TariffSNo = Convert.ToInt32(e["TariffSNo"].ToString()),
        //        SlabType = e["SlabType"].ToString(),
        //        StartValue = Convert.ToDecimal(e["StartValue"].ToString()),
        //        EndValue = Convert.ToDecimal(e["EndValue"].ToString()),
        //        SlabValue = Convert.ToDecimal(e["SlabValue"].ToString()),
        //        IsFlatRate = Convert.ToBoolean(e["IsFlatRate"].ToString())
        //    });
        //    return new KeyValuePair<string, List<TariffSlab>>(ds.Tables[1].Rows[0][0].ToString(), tariffSlabList.AsQueryable().ToList());
        //}

        /// <summary>
        /// Update the RateAirlineMaster Information into RateAirlineMaster and Credit Limit Entity
        /// </summary>
        /// <param name="RateAirlineMaster">list of RateAirlineMaster to be updated</param>
        public List<string> UpdateRateAirlineMaster(List<RateAirlineMasterCollection> RateAirlineMasterCollection)
        {
            try
            {
                List<string> ErrorMessage = new List<string>();
                List<RateAirlineMaster> listRateAirlineMaster = new List<RateAirlineMaster>();
                List<RateAirlineTrans> listRateAirlineTrans = new List<RateAirlineTrans>();
                List<RateDueCarrierTrans> listRateDueCarrierTrans = new List<RateDueCarrierTrans>();
                List<RateAirlineCustomCharges> listRateAirlineCustomCharges = new List<RateAirlineCustomCharges>();
                listRateAirlineMaster = RateAirlineMasterCollection[0].rateAirlineMaster;
                listRateAirlineTrans = RateAirlineMasterCollection[0].rateAirlineTrans;
                listRateDueCarrierTrans = RateAirlineMasterCollection[0].rateDueCarrierTrans;
                listRateAirlineCustomCharges = RateAirlineMasterCollection[0].rateAirlineCustomCharges;
                DataTable dtCreateRateAirlineMaster = CollectionHelper.ConvertTo(listRateAirlineMaster, "Text_TruckCode,Text_AirportName,Text_AirlineSNo,Text_SPHCSNo,Text_OriginAirportSNo,Text_DestinationAirportSNo,Text_CurrencySNo,Active,GlobalDueCarrier,Approved,Text_WeightType,Text_RateType,Text_SPHCGroupSNo,Text_SHCSNo,Text_IsGlobalSurCharge,Text_IsGlobalDueCarrier,Text_IsActive,Text_TruckType");
                DataTable dtCreateRateAirlineTrans = CollectionHelper.ConvertTo(listRateAirlineTrans, "");
                DataTable dtCreateRateDueCarrierTrans = CollectionHelper.ConvertTo(listRateDueCarrierTrans, "HdnName,ChargeableWeight,Mandatory,Name,IsCarrier,Carrier,FreightType,IsFreightType,DueCarrierTransSNo,IsMandatory,");
                DataTable dtRateAirlineCustomCharges = CollectionHelper.ConvertTo(listRateAirlineCustomCharges, "");
                BaseBusiness baseBusiness = new BaseBusiness();
                if (!baseBusiness.ValidateBaseBusiness("RateAirlineMaster", dtCreateRateAirlineMaster, "EDIT"))
                {
                    ErrorMessage = baseBusiness.ErrorMessage;
                    return ErrorMessage;
                }



                SqlParameter paramRateAirlineMaster = new SqlParameter();
                paramRateAirlineMaster.ParameterName = "@RateAirlineMasterTable";
                paramRateAirlineMaster.SqlDbType = System.Data.SqlDbType.Structured;
                paramRateAirlineMaster.Value = dtCreateRateAirlineMaster;

                SqlParameter paramRateAirlineTrans = new SqlParameter();
                paramRateAirlineTrans.ParameterName = "@RateAirlineTransTable";
                paramRateAirlineTrans.SqlDbType = System.Data.SqlDbType.Structured;
                paramRateAirlineTrans.Value = dtCreateRateAirlineTrans;

                SqlParameter paramRateDueCarrierTrans = new SqlParameter();
                paramRateDueCarrierTrans.ParameterName = "@RateDueCarrierTransTable";
                paramRateDueCarrierTrans.SqlDbType = System.Data.SqlDbType.Structured;
                paramRateDueCarrierTrans.Value = dtCreateRateDueCarrierTrans;

                SqlParameter paramRateAirlineCustomCharges = new SqlParameter();
                paramRateAirlineCustomCharges.ParameterName = "@RateAirlineCustomChargesTable";
                paramRateAirlineCustomCharges.SqlDbType = System.Data.SqlDbType.Structured;
                paramRateAirlineCustomCharges.Value = dtRateAirlineCustomCharges;


                SqlParameter[] Parameters = { paramRateAirlineMaster, paramRateAirlineTrans, paramRateDueCarrierTrans, paramRateAirlineCustomCharges };
                int ret = (int)SqlHelper.ExecuteScalar(DMLConnectionString.WebConfigConnectionString, "UpdateRateAirlineMaster", Parameters);
                if (ret > 0)
                {
                    if (ret == 5000)
                    {
                        //For Customised Validation Messages like 'Record Already Exists' etc
                        string serverErrorMessage = "Airline Rate Aready Exists.";
                        if (!string.IsNullOrEmpty(serverErrorMessage))
                            ErrorMessage.Add(serverErrorMessage);
                    }
                    else if (ret == 2001)
                    {
                        //For Customised Validation Messages like 'Record Already Exists' etc
                        string serverErrorMessage = baseBusiness.ReadServerErrorMessages(ret, "RateAirlineMaster");
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
        /// <summary>
        /// InActive the perticular RateAirlineMaster information
        /// </summary>
        /// <param name="RecordID">Id of that RateAirlineMaster </param>
        public List<string> DeleteRateAirlineMaster(List<string> listID)
        {
            try
            {
                List<string> ErrorMessage = new List<string>();
                BaseBusiness baseBussiness = new BaseBusiness();
                if (listID.Count > 0)
                {
                    string RecordId = listID[0].ToString();
                    string UserId = listID[1].ToString();
                    SqlParameter[] Parameters = { new SqlParameter("@RateAirlineMasterCode", RecordId), new SqlParameter("@UserID", Convert.ToInt32(UserId)) };
                    int ret = (int)SqlHelper.ExecuteScalar(DMLConnectionString.WebConfigConnectionString, "DeleteRateAirlineMaster", Parameters);

                    if (ret > 1000)
                    {
                        string serverErrorMessage = baseBussiness.ReadServerErrorMessages(ret, "RateAirlineMaster");
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


        public DataSourceResult GetCurrency(String CityCode)
        {
            try
            {
                List<String> cur = new List<String>();
                SqlParameter[] Parameters = { new SqlParameter("@CityCode", CityCode) };
                SqlDataReader dr = SqlHelper.ExecuteReader(ReadConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, "GetRecordCurrencyCity", Parameters);
                if (dr.Read())
                {
                    cur.Add(dr["CurrencyCode"].ToString());
                    cur.Add(dr["CurrencyName"].ToString());
                }
                return new DataSourceResult
                {
                    Data = cur,
                    Total = cur.Count()
                };
            }
            catch(Exception ex)//
            {

                throw ex;
            }
        }

    }

}
