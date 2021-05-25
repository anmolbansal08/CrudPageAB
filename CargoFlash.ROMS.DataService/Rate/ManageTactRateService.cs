using System;
using System.Collections.Generic;
using System.Linq;
using System.ServiceModel;
using System.ServiceModel.Activation;
using System.Configuration;
using System.Data;
using System.Data.SqlClient;
using CargoFlash.Cargo.Model.Rate;
using CargoFlash.Cargo.Model.Master;
using CargoFlash.SoftwareFactory.Data;
using CargoFlash.Cargo.Business;
using Newtonsoft.Json;
using System.ServiceModel.Web;
using System.Net;

namespace CargoFlash.Cargo.DataService.Rate
{
    [GlobalErrorHandlerBehaviour(typeof(GlobalErrorHandler))]   [ServiceBehavior(IncludeExceptionDetailInFaults = true)]
    [AspNetCompatibilityRequirements(RequirementsMode = AspNetCompatibilityRequirementsMode.Allowed)]
    public class ManageTactRateService : SignatureAuthenticate, IManageTactRateService
    {
        CargoFlash.Cargo.Business.BaseBusiness basebusiness = new CargoFlash.Cargo.Business.BaseBusiness();
   
   //     Cargo.Model.Master.f
        FFRManagement m = new FFRManagement();
        public DataSourceResult GetGridData(int skip, int take, int page, int pageSize, List<GridSort> sort, GridFilter filter)
        {
            try
            {
                string sorts = GridSort.ProcessSorting(sort);
                string filters = GridFilter.ProcessFilters<ManageTactRate>(filter);

                SqlParameter[] Parameters = { new SqlParameter("@PageNo", page), new SqlParameter("@PageSize", pageSize), new SqlParameter("@WhereCondition", filters), new SqlParameter("@OrderBy", sorts) };
                DataSet ds = SqlHelper.ExecuteDataset(DMLConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, "GetListAirlineTactRate", Parameters);
                var ManageTactRateList = ds.Tables[0].AsEnumerable().Select(e => new ManageTactRate
                {
                    SNo = Convert.ToInt32(e["SNo"]),
                    RefNo = e["RefNo"].ToString().ToUpper(),
                    Text_OriginSNo = e["Text_OriginSNo"].ToString().ToUpper(),
                    Text_DestinationSNo = e["Text_DestinationSNo"].ToString().ToUpper(),
                    CarrierCode = e["CarrierCode"].ToString().ToUpper(),
                    Text_CommoditySNo = e["Text_CommoditySNo"].ToString().ToUpper(),
                    Text_CurrencyCode = e["Text_CurrencyCode"].ToString().ToUpper(),
                    ////Text_OriginSNo = e["Text_OriginSNo"].ToString().ToUpper(),
                    ////Text_ProductSNo = e["Text_ProductSNo"].ToString().ToUpper(),
                    ExpiryDate = e["ExpiryDate"] == DBNull.Value ? (DateTime?)null : DateTime.SpecifyKind(Convert.ToDateTime(e["ExpiryDate"]), DateTimeKind.Utc),
                    ////ValidTo = e["ValidTo"] == DBNull.Value ? (DateTime?)null : DateTime.SpecifyKind(Convert.ToDateTime(e["ValidTo"]), DateTimeKind.Utc)

                    //Active = e["Active"].ToString().ToUpper(),

                });
                ds.Dispose();
                return new DataSourceResult
                {
                    Data = ManageTactRateList.AsQueryable().ToList(),
                    Total = Convert.ToInt32(ds.Tables[1].Rows[0][0].ToString())
                };
            }
            catch(Exception ex)//
            {
                
                throw ex;
            }
        }
        public List<string> SaveManageTactRate(List<ManageTactRate> ManageTactRate)
        {
            //validate Business Rule
            try
            {
                List<string> ErrorMessage = new List<string>();
                //DataTable dtCreateManageTactRate = CollectionHelper.ConvertTo(ManageTactRate, "Active,Text_OriginCitySNo,Text_OriginCountrySNo,Text_DestinationSNo,Text_DestinationCountrySNo,Text_CommoditySNo,Text_RateTypeSNo,Text_CommoditySNo,Text_GoverentStatus,Text_ActionCode,Text_DirectionCode,Text_ProportionalCode,Text_DecimalPlace,");
                DataTable dtCreateManageTactRate = CollectionHelper.ConvertTo(ManageTactRate, "Active,RefNo,OriginSNo,OriginCountrySNo,DestinationSNo,DestinationCountrySNo,CommoditySNo,Text_RateTypeSNo,CommoditySNo,GoverentStatus,ActionCode,DirectionCode,ProportionalCode,DecimalPlace,DestinationCitySNo,GovernmentStatus,AreaSNo,CurrencyCode,Category,Text_ULDClass,TactULDTrans");
                DataTable dtcreateuldtrans = CollectionHelper.ConvertTo(ManageTactRate[0].TactULDTrans, "");
                BaseBusiness baseBusiness = new BaseBusiness();

                if (!baseBusiness.ValidateBaseBusiness("ManageTactRate", dtCreateManageTactRate, "SAVE"))
                {
                    ErrorMessage = baseBusiness.ErrorMessage;
                    return ErrorMessage;
                }

                SqlParameter param = new SqlParameter();
                param.ParameterName = "@AirLineTactRateTable";
                param.SqlDbType = System.Data.SqlDbType.Structured;
                param.Value = dtCreateManageTactRate;
                //SqlParameter[] Parameters = { param };

                SqlParameter param1 = new SqlParameter();
                param1.ParameterName = "@AirLineTactRateULDTable";
                param1.SqlDbType = System.Data.SqlDbType.Structured;
                param1.Value = dtcreateuldtrans;
                SqlParameter[] Parameters = { param, param1 };

                int ret = (int)SqlHelper.ExecuteScalar(DMLConnectionString.WebConfigConnectionString, "SPTactRate_CreateAirlineTactRate", Parameters);
                if (ret > 0)
                {
                    if (ret > 1000)
                    {
                        //For Customised Validation Messages like 'Record Already Exists' etc
                        string serverErrorMessage = baseBusiness.ReadServerErrorMessages(ret, "ManageTactRate");
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


        public ManageTactRate GetManageTactRateRecord(string recordID, string UserID)
        {
            ManageTactRate ManageTactRate = new ManageTactRate();
            SqlDataReader dr = null;
            try
            {
                SqlParameter[] Parameters = { new SqlParameter("@SNo", recordID), new SqlParameter("@UserID", Convert.ToInt32(UserID)) };
                dr = SqlHelper.ExecuteReader(DMLConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, "GetRecordAirLineTactRate", Parameters);
                if (dr.Read())
                {
                    ManageTactRate.SNo = Convert.ToInt32(dr["SNo"]);
                    ManageTactRate.RefNo = dr["RefNo"].ToString();
                    ManageTactRate.OriginCountrySNo = Convert.ToInt32(dr["OriginCountrySNo"] == null ? 0 : dr["OriginCountrySNo"]);
                    ManageTactRate.Text_OriginCountrySNo = dr["Text_OriginCountrySNo"].ToString();
                    ManageTactRate.OriginNumeric = Convert.ToInt32(dr["OriginNumeric"].ToString()==null?"0":dr["OriginNumeric"].ToString());
                    ManageTactRate.DestinationCountrySNo = Convert.ToInt32(dr["DestinationCountrySNo"] == null ? 0 : dr["DestinationCountrySNo"]);
                    ManageTactRate.Text_DestinationCountrySNo = (dr["Text_DestinationCountrySNo"] == null ? "" : dr["Text_DestinationCountrySNo"]).ToString();
                    ManageTactRate.DestinationSNo = Convert.ToInt32(dr["DestinationSNo"] == null ? 0 : dr["DestinationSNo"]);
                    ManageTactRate.Text_DestinationSNo = (dr["Text_DestinationSNo"] == null ? "" : dr["Text_DestinationSNo"]).ToString();
                    ManageTactRate.DestinationNumeric = Convert.ToInt32(dr["DestinationNumeric"] == null ? 0 : dr["DestinationNumeric"]);
                    ManageTactRate.OriginSNo = Convert.ToInt32(dr["OriginSNo"] == null ? 0 : dr["OriginSNo"]);
                    ManageTactRate.Text_OriginSNo = (dr["Text_OriginSNo"] == null ? "" : dr["Text_OriginSNo"]).ToString();
                    ManageTactRate.Category = Convert.ToInt32(dr["Category"] == null ? 0 : dr["Category"]);
                    ManageTactRate.Text_Category = (dr["Text_Category"] == null ? "" : dr["Text_Category"]).ToString();
                    ManageTactRate.AreaSNo = Convert.ToInt32(dr["AreaSNo"] == null ? 0 : dr["AreaSNo"]);
                    ManageTactRate.Text_AreaSNo = (dr["Text_AreaSNo"] == null ? "" : dr["Text_AreaSNo"]).ToString();
                    ManageTactRate.Note = (dr["Note"] == null ? "" : dr["Note"]).ToString();
                    ManageTactRate.CarrierCode = (dr["CarrierCode"] == null ? "" : dr["CarrierCode"]).ToString();
                    ManageTactRate.RateTypeSNo = Convert.ToInt32(dr["RateTypeSNo"] == null ? "1" : dr["RateTypeSNo"]);
                    ManageTactRate.Text_RateTypeSNo = (dr["Text_RateTypeSNo"] == null ? "" : dr["Text_RateTypeSNo"]).ToString();
                    ManageTactRate.CommoditySNo = Convert.ToInt32(dr["CommoditySNo"].ToString().Trim() == "" ? 0 : dr["CommoditySNo"]);
                    ManageTactRate.Text_CommoditySNo = (dr["Text_CommoditySNo"] == null ? "" : dr["Text_CommoditySNo"]).ToString();
                    ManageTactRate.ChangeIndicator = (dr["ChangeIndicator"]).ToString();
                    ManageTactRate.IntendedDate = Convert.ToDateTime(dr["IntendedDate"] == DBNull.Value ? (DateTime?)null : dr["IntendedDate"]);
                    ManageTactRate.ActualDate = Convert.ToDateTime(dr["ActualDate"] == DBNull.Value ? (DateTime?)null : dr["ActualDate"]);
                    ManageTactRate.ExpiryDate = Convert.ToDateTime(dr["ExpiryDate"] == DBNull.Value ? "31-Dec-9999" : dr["ExpiryDate"]);
                    ManageTactRate.GovernmentStatus = Convert.ToInt32(dr["GovernmentStatus"] == null ? 0 : dr["GovernmentStatus"]);
                    ManageTactRate.Text_GovernmentStatus = (dr["Text_GovernmentStatus"] == null ? "" : dr["Text_GovernmentStatus"]).ToString();
                    ManageTactRate.OriginGateway = (dr["OriginGateway"] == null ? "" : dr["OriginGateway"]).ToString();
                    ManageTactRate.DestinationGateway = (dr["DestinationGateway"] == null ? "" : dr["DestinationGateway"]).ToString();
                    ManageTactRate.UniqueAreaCode = (dr["UniqueAreaCode"] == null ? "" : dr["UniqueAreaCode"]).ToString();
                    ManageTactRate.SourceCode = (dr["SourceCode"] == null ? "" : dr["SourceCode"]).ToString();
                    ManageTactRate.ActionCode = Convert.ToInt32(dr["ActionCode"] == null ? 0 : dr["ActionCode"]);
                    ManageTactRate.Text_ActionCode = (dr["Text_ActionCode"] == null ? "" : dr["Text_ActionCode"]).ToString();
                    ManageTactRate.ConstrunctionAllowed = (dr["ConstrunctionAllowed"] == null ? "" : dr["ConstrunctionAllowed"]).ToString();
                    ManageTactRate.CategorySortIndicator = (dr["CategorySortIndicator"] == null ? "" : dr["CategorySortIndicator"]).ToString();
                    ManageTactRate.IdentificationCode = (dr["IdentificationCode"] == null ? "" : dr["IdentificationCode"]).ToString();
                    ManageTactRate.CurrencyCode = Convert.ToInt32(dr["CurrencyCode"] == null ? 0 : dr["CurrencyCode"]);
                    ManageTactRate.Text_CurrencyCode = (dr["Text_CurrencyCode"] == null ? "" : dr["Text_CurrencyCode"]).ToString();
                    ManageTactRate.Text_DirectionCode = (dr["Text_DirectionCode"] == null ? "" : dr["Text_DirectionCode"]).ToString();
                    ManageTactRate.Text_ProportionalCode = (dr["Text_ProportionalCode"] == null ? "" : dr["Text_ProportionalCode"]).ToString();
                    ManageTactRate.ProportionalCode = Convert.ToInt32(dr["ProportionalCode"] == null ? 0 : dr["ProportionalCode"]);
                    ManageTactRate.DirectionCode = Convert.ToInt32(dr["DirectionCode"] == null ? 0 : dr["DirectionCode"]);
                    ManageTactRate.DecimalPlace = Convert.ToInt32(dr["DecimalPlace"] == null ? 0 : dr["DecimalPlace"]);
                    ManageTactRate.Text_DecimalPlace = (dr["Text_DecimalPlace"] == null ? "" : dr["Text_DecimalPlace"]).ToString();
                    ManageTactRate.Rate = Convert.ToInt32(dr["Rate"] == null ? 0 : dr["Rate"]);
                    ManageTactRate.CreatedBy = (dr["CreatedBy"]).ToString();
                    ManageTactRate.UpdatedBy = (dr["UpdatedBy"]).ToString();
                  //  ExRate.ValidTo = dr["ValidTo"].ToString() == string.Empty ? "31-Dec-9999" : DateTime.Parse(dr["ValidTo"].ToString()).ToString("dd-MMM-yyyy");
                }
            }
           
            catch(Exception ex)//
            {
                dr.Close();
                throw ex;
            }
         
            return ManageTactRate;
        }

        public string GetTactRate(int RateSNo)
        {
            try
            {
                SqlParameter[] Parameters = { new SqlParameter("@TactRateSNo", RateSNo) };
                DataSet ds = SqlHelper.ExecuteDataset(DMLConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, "spTactRate_GetTactRateSlab", Parameters);
                ds.Dispose();
                return CargoFlash.Cargo.Business.Common.CompleteDStoJSON(ds);
            }
            catch(Exception ex)//
            {
              
                throw ex;
            }
        }

        public List<string> UpdateManageTactRate(List<ManageTactRate> ManageTactRate)
        {
            //validate Business Rule
            try
            {
                List<string> ErrorMessage = new List<string>();
                DataTable dtCreateManageTactRate = CollectionHelper.ConvertTo(ManageTactRate, "Active,RefNo,OriginSNo,OriginCountrySNo,DestinationSNo,DestinationCountrySNo,CommoditySNo,Text_RateTypeSNo,CommoditySNo,GoverentStatus,ActionCode,DirectionCode,ProportionalCode,DecimalPlace,DestinationCitySNo,GovernmentStatus,AreaSNo,CurrencyCode,Category,Text_ULDClass,TactULDTrans");

                DataTable dtcreateuldtrans = CollectionHelper.ConvertTo(ManageTactRate[0].TactULDTrans, "");
                BaseBusiness baseBusiness = new BaseBusiness();

                if (!baseBusiness.ValidateBaseBusiness("ManageTactRate", dtCreateManageTactRate, "UPDATE"))
                {
                    ErrorMessage = baseBusiness.ErrorMessage;
                    return ErrorMessage;
                }

                SqlParameter param = new SqlParameter();
                param.ParameterName = "@AirLineTactRateTable";
                param.SqlDbType = System.Data.SqlDbType.Structured;
                param.Value = dtCreateManageTactRate;

                SqlParameter param1 = new SqlParameter();
                param1.ParameterName = "@AirLineTactRateULDTable";
                param1.SqlDbType = System.Data.SqlDbType.Structured;
                param1.Value = dtcreateuldtrans;
                SqlParameter[] Parameters = { param, param1 };

                int ret = (int)SqlHelper.ExecuteScalar(DMLConnectionString.WebConfigConnectionString, "spTactRate_UpdateAirlineTactRate", Parameters);
                if (ret > 0)
                {
                    if (ret > 1000)
                    {
                        //For Customised Validation Messages like 'Record Already Exists' etc
                        string serverErrorMessage = baseBusiness.ReadServerErrorMessages(ret, "ManageTactRate");
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

        public string GetWeightRecord(string SNo)
        {
            try
            {
                SqlParameter[] Parameters = { new SqlParameter("@SNo", SNo) };
                DataSet ds = SqlHelper.ExecuteDataset(ReadConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, "GetULDMinWeight", Parameters);
                return CargoFlash.Cargo.Business.Common.CompleteDStoJSON(ds);
            }
            catch(Exception ex)//
            {
               
                throw ex;
            }
        }

     
    }
}
