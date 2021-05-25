using CargoFlash.Cargo.Business;
using CargoFlash.Cargo.Model.Rate;
using CargoFlash.SoftwareFactory.Data;
using System;
using System.Collections.Generic;
using System.Configuration;
using System.Data;
using System.Data.SqlClient;
using System.Linq;
using System.ServiceModel;
using System.ServiceModel.Activation;
using System.Text;
using CargoFlash.Cargo.DataService.Common;
using System.ServiceModel.Web;
using System.Net;

namespace CargoFlash.Cargo.DataService.Rate
{
    [GlobalErrorHandlerBehaviour(typeof(GlobalErrorHandler))]   [ServiceBehavior(IncludeExceptionDetailInFaults = true)]
    [AspNetCompatibilityRequirements(RequirementsMode = AspNetCompatibilityRequirementsMode.Allowed)]
    public class OtherChargesService : SignatureAuthenticate, IOtherChargesService
    {
        CargoFlash.Cargo.Business.BaseBusiness basebusiness = new CargoFlash.Cargo.Business.BaseBusiness();
       
        public DataSourceResult GetGridData(int skip, int take, int page, int pageSize, List<GridSort> sort, GridFilter filter)
        {
            try
            {
            string sorts = GridSort.ProcessSorting(sort);
            string filters = GridFilter.ProcessFilters<OtherChargesGrid>(filter);
            SqlParameter[] Parameters = { new SqlParameter("@PageNo", page), new SqlParameter("@PageSize", pageSize), new SqlParameter("@WhereCondition", filters), new SqlParameter("@OrderBy", sorts),
                 new SqlParameter("@UserSNo",Convert.ToString(((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).UserSNo))};
            DataSet ds = SqlHelper.ExecuteDataset(DMLConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, "GetOtherChargesServiceDetails", Parameters);
            CommonService grid = new CommonService();
            var RateServiceList = ds.Tables[0].AsEnumerable().Select(e => new OtherChargesGrid
            {
                //SNo = grid.Encrypt(Convert.ToString(e["SNo"])),
                SNo = Convert.ToString(e["SNo"]),
                Airline = Convert.ToString(e["Airline"]).ToUpper(),
                OtherCharges = Convert.ToString(e["OtherCharges"]).ToUpper(),
                ChargeType = Convert.ToString(e["ChargeType"]).ToUpper(),
                PaymentType = Convert.ToString(e["PaymentType"]).ToUpper(),
                Currency = Convert.ToString(e["Currency"]).ToUpper(),
                ValidFrom = e["ValidFrom"] == DBNull.Value ? (DateTime?)null : DateTime.SpecifyKind(Convert.ToDateTime(e["ValidFrom"]), DateTimeKind.Utc),
                //Convert.ToDateTime(e["ValidFrom"]),
                ValidTo = e["ValidTo"] == DBNull.Value ? (DateTime?)null : DateTime.SpecifyKind(Convert.ToDateTime(e["ValidTo"]), DateTimeKind.Utc),
                //Convert.ToDateTime(e["ValidTo"]),
                OriginLevel = Convert.ToString(e["OriginLevel"]).ToUpper(),
                DestinationLevel = Convert.ToString(e["DestinationLevel"]).ToUpper(),
                Status = Convert.ToString(e["Status"]).ToUpper(),
                ReferenceNumber = Convert.ToString(e["ReferenceNumber"]).ToUpper(),
                CreatedUser = Convert.ToString(e["CreatedUser"]).ToUpper(),
                UpdatedUser = Convert.ToString(e["UpdatedUser"]).ToUpper(),
                //StartWeight = Convert.ToString(e["StartWeight"]).ToUpper(),
                //EndWeight = Convert.ToString(e["EndWeight"]).ToUpper(),
                //Rate = Convert.ToString(e["Rate"]).ToUpper(),
                //BasedOn = Convert.ToString(e["BasedOn"]).ToUpper(),
               
            });
            ds.Dispose();
            return new DataSourceResult
            {
                Data = RateServiceList.AsQueryable().ToList(),
                Total = Convert.ToInt32(ds.Tables[1].Rows[0][0].ToString())
            };
        }
            catch(Exception ex)//
            {

                throw ex;
            }
        }
        public DataSourceResult DownloadExcelGridData(int skip, int take, int page, int pageSize, List<GridSort> sort, GridFilter filter)
        {
            try
            {
                string sorts = GridSort.ProcessSorting(sort);
                string filters = GridFilter.ProcessFilters<OtherChargesGrid>(filter);
                SqlParameter[] Parameters = { new SqlParameter("@PageNo", page), new SqlParameter("@PageSize", pageSize), new SqlParameter("@WhereCondition", filters), new SqlParameter("@OrderBy", sorts) };
                DataSet ds = SqlHelper.ExecuteDataset(DMLConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, "GetOtherChargesServiceDetails_Excel", Parameters);
                CommonService grid = new CommonService();
                var RateServiceList = ds.Tables[0].AsEnumerable().Select(e => new OtherChargesGrid
                {
                    //SNo = grid.Encrypt(Convert.ToString(e["SNo"])),
                    SNo = Convert.ToString(e["SNo"]),
                    Airline = Convert.ToString(e["Airline"]).ToUpper(),
                    OtherCharges = Convert.ToString(e["OtherCharges"]).ToUpper(),
                    ChargeType = Convert.ToString(e["ChargeType"]).ToUpper(),
                    PaymentType = Convert.ToString(e["PaymentType"]).ToUpper(),
                    Currency = Convert.ToString(e["Currency"]).ToUpper(),
                    ValidFrom = Convert.ToDateTime(e["ValidFrom"]),
                    ValidTo = Convert.ToDateTime(e["ValidTo"]),
                    OriginLevel = Convert.ToString(e["OriginLevel"]).ToUpper(),
                    DestinationLevel = Convert.ToString(e["DestinationLevel"]).ToUpper(),
                    Status = Convert.ToString(e["Status"]).ToUpper(),
                    ReferenceNumber = Convert.ToString(e["ReferenceNumber"]).ToUpper(),
                    CreatedUser = Convert.ToString(e["CreatedUser"]).ToUpper(),
                    UpdatedUser = Convert.ToString(e["UpdatedUser"]).ToUpper(),
                    //StartWeight = Convert.ToString(e["StartWeight"]).ToUpper(),
                    //EndWeight = Convert.ToString(e["EndWeight"]).ToUpper(),
                    //Rate = Convert.ToString(e["Rate"]).ToUpper(),
                    //BasedOn = Convert.ToString(e["BasedOn"]).ToUpper(),
                    SlabName = Convert.ToString(e["SlabName"]).ToUpper(),
                    SlabDetails = Convert.ToString(e["SlabDetails"]).ToUpper(),
                    REMARKS = Convert.ToString(e["REMARKS"]).ToUpper(),
                    CarrierCode = Convert.ToString(e["CarrierCode"]).ToUpper(),
                    IssueCarrier = Convert.ToString(e["IssueCarrier"]).ToUpper(),
                    FlightNumber = Convert.ToString(e["FlightNumber"]).ToUpper(),
                    ProductName = Convert.ToString(e["ProductName"]).ToUpper(),
                    Commodity = Convert.ToString(e["Commodity"]).ToUpper(),
                    Shipper = Convert.ToString(e["Shipper"]).ToUpper(),
                    Agent = Convert.ToString(e["Agent"]).ToUpper(),

                    SPHC = Convert.ToString(e["SPHC"]).ToUpper(),
                    SPHCGroup = Convert.ToString(e["SPHCGroup"]).ToUpper(),
                    TransitStation = Convert.ToString(e["TransitStation"]).ToUpper(),
                    WeekDays = Convert.ToString(e["WeekDays"]).ToUpper(),
                    ETDT = Convert.ToString(e["ETDT"]).ToUpper(),

                    FlightCarrier_IsInclude = Convert.ToString(e["FlightCarrier_IsInclude"]).ToUpper(),
                    FlightNumber_IsInclude = Convert.ToString(e["FlightNumber_IsInclude"]).ToUpper(),
                    IssueCarrier_IsInclude = Convert.ToString(e["IssueCarrier_IsInclude"]).ToUpper(),
                    Product_IsInclude = Convert.ToString(e["Product_IsInclude"]).ToUpper(),
                    Commodity_IsInclude = Convert.ToString(e["Commodity_IsInclude"]).ToUpper(),
                    AccountShipper_IsInclude = Convert.ToString(e["AccountShipper_IsInclude"]).ToUpper(),
                    Account_IsInclude = Convert.ToString(e["Account_IsInclude"]).ToUpper(),
                    SPHC_IsInclude = Convert.ToString(e["SPHC_IsInclude"]).ToUpper(),
                    SPHCGroup_IsInclude = Convert.ToString(e["SPHCGroup_IsInclude"]).ToUpper(),
                    Transit_IsInclude = Convert.ToString(e["Transit_IsInclude"]).ToUpper(),
                    WeekDays_IsInclude = Convert.ToString(e["WeekDays_IsInclude"]).ToUpper(),
                    ETDT_IsInclude = Convert.ToString(e["ETDT_IsInclude"]).ToUpper(),

                    Mandatory = Convert.ToString(e["Mandatory"]).ToUpper(),
                    Taxable = Convert.ToString(e["Taxable"]).ToUpper(),
                    Commissionable = Convert.ToString(e["Commissionable"]).ToUpper(),
                    Unit = Convert.ToString(e["Unit"]).ToUpper(),
                    ApplicableOn = Convert.ToString(e["ApplicableOn"]).ToUpper(),
                    IsReplanCharges = Convert.ToString(e["IsReplanCharges"]).ToUpper(),
                    MinimumCharge = Convert.ToString(e["MinimumCharge"]).ToUpper(),
                    Charge = Convert.ToString(e["Charge"]).ToUpper(),
                    Charge_Type = Convert.ToString(e["Charge_Type"]).ToUpper(),
                    AgentGroup = Convert.ToString(e["AgentGroup"]).ToUpper(),
                    AccountGroup_IsInclude = Convert.ToString(e["AccountGroup_IsInclude"]).ToUpper(),
                });
                ds.Dispose();
                return new DataSourceResult
                {
                    Data = RateServiceList.AsQueryable().ToList(),
                    Total = Convert.ToInt32(ds.Tables[1].Rows[0][0].ToString())
                };
            }
            catch (Exception ex)//
            {

                throw ex;
            }
        }
        public KeyValuePair<string, List<OtherChargesRemarks>> GetRemarks(int recordID, int page, int pageSize, string whereCondition, string sort)
        {
            try
            {
            whereCondition = "RateSNo=" + recordID;

            SqlParameter[] Parameters = { new SqlParameter("@SNo", recordID), new SqlParameter("@PageNo", page), new SqlParameter("@PageSize", pageSize), new SqlParameter("@WhereCondition", whereCondition), new SqlParameter("@OrderBy", sort) };
            //SqlParameter[] Parameters = { new SqlParameter("@PageNo", page), new SqlParameter("@PageSize", pageSize), new SqlParameter("@WhereCondition", whereCondition), new SqlParameter("@OrderBy", sort) };
            DataSet ds = SqlHelper.ExecuteDataset(DMLConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, "spRate_GetRemarks_DueCarrier", Parameters);
            var RateSlabList = ds.Tables[0].AsEnumerable().Select(e => new OtherChargesRemarks
            {
                SNo = Convert.ToInt32(e["SNo"]),
                Remarks = e["Remarks"].ToString(),
            });
            return new KeyValuePair<string, List<OtherChargesRemarks>>(ds.Tables[1].Rows[0][0].ToString(), RateSlabList.AsQueryable().ToList());
        }
            catch(Exception ex)//
            {

                throw ex;
            }
        }
        public KeyValuePair<string, List<OtherChargesSlabParameter>> GetRateSLAB(decimal recordID, int page, int pageSize, OtherChargesRequest model, string sort)
        {
            try
            {
            string whereCondition = "";

         

                if (model == null)
            {
                whereCondition = "IsDefaultSlab=1";
            }


            SqlParameter[] Parameters = { new SqlParameter("@SNo",Convert.ToInt32( model.recordID)), new SqlParameter("@PageNo", page), new SqlParameter("@PageSize", pageSize), new SqlParameter("@WhereCondition", whereCondition), new SqlParameter("@OrderBy", sort), new SqlParameter("@AirlineSNo",  model.AirlineSNo), new SqlParameter("@Origin", model.OriginType), new SqlParameter("@OriginSNo", model.OriginSNo) };
            //SqlParameter[] Parameters = { new SqlParameter("@PageNo", page), new SqlParameter("@PageSize", pageSize), new SqlParameter("@WhereCondition", whereCondition), new SqlParameter("@OrderBy", sort), new SqlParameter("@AirlineSNo", AirlineSNo), new SqlParameter("@Origin", Origin), new SqlParameter("@OriginSNo", OriginSNo), new SqlParameter("@RateSNo", recordID) };
            DataSet ds = SqlHelper.ExecuteDataset(DMLConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, "spRate_GetSLAB_DueCarrier", Parameters);
         // if(ds != null && ds.Tables.Count >0 && ds != und)
            var RateSlabList = ds.Tables[0].AsEnumerable().Select(e => new OtherChargesSlabParameter
            {
                 
                SNo = Convert.ToInt32(e["SlabSNo"]),
                SlabSNo = Convert.ToInt32(e["SlabSNo"].ToString()),
                RateSNo = Convert.ToInt32(e["RateSNo"].ToString()),
                SlabName = Convert.ToString(e["SlabName"]),
                StartWt = Convert.ToDecimal(e["StartWt"].ToString()),
                EndWt = Convert.ToDecimal(e["EndWt"].ToString()),
                RateClassSNo = Convert.ToInt32(e["RateClassSNo"]), //== "" ? 0 : Convert.ToInt32(e["Type"].ToString()),
                Text_RateClassSNo = "",
                RateValue = Convert.ToDecimal(e["Rate"]),
                Based = Convert.ToString(e["Based"]),// == "" ? 0 : Convert.ToInt32(e["Based"].ToString()),
                //
                // { name: "SNo", type: "hidden" },
                //{ name: "SlabName", display: "Slab Name", ctrlAttr: { maxlength: 50 }, ctrlCss: { width: "150px" }, isRequired: pageType == "NEW" || pageType == "DUPLICATE" || pageType == "EDIT" ? true : false },
                //{ name: "StartWt", display: "Start Weight", type: pageType == "NEW" || pageType == "DUPLICATE" || pageType == "EDIT" ? "text" : "label", ctrlAttr: { maxlength: 7, controltype: pageType == "NEW" || pageType == "DUPLICATE" || pageType == "EDIT" ? "text" : "", onblur: "return CheckValidation(this.id);" }, ctrlCss: { width: "100px" }, isRequired: pageType == "NEW" || pageType == "DUPLICATE" || pageType == "EDIT" ? true : false },
                //{ name: "EndWt", display: "End Weight", type: pageType == "NEW" || pageType == "DUPLICATE" || pageType == "EDIT" ? "text" : "label", ctrlAttr: { maxlength: 7, controltype: pageType == "NEW" || pageType == "DUPLICATE" || pageType == "EDIT" ? "number" : "", onblur: "return CheckValidation(this.id);" }, ctrlCss: { width: "100px" }, isRequired: pageType == "NEW" || pageType == "DUPLICATE" || pageType == "EDIT" ? true : false },
                //{ name: "RateClassSNo", display: "Type", type: "select", ctrlAttr: {  maxlength: 100 }, ctrlOptions: { 0: "M", 1: "N", 2: "Q" }, ctrlCss: { width: "100px" }, isRequired: pageType == "NEW" || pageType == "DUPLICATE" || pageType == "EDIT" ? true : false },
                //{ name: "RateValue", display: "Rate", type: "text", ctrlAttr: { controltype: "decimal3", maxlength: 11 }, ctrlCss: { width: "100px" }, isRequired: pageType == "NEW" || pageType == "EDIT" ? true : false },
                //


            });
            return new KeyValuePair<string, List<OtherChargesSlabParameter>>(ds.Tables[1].Rows[0][0].ToString(), RateSlabList.AsQueryable().ToList());
        }
            catch(Exception ex)//
            {

                throw ex;
            }
        }

        public List<string> SaveOtherCharges(List<OtherCharges> OtherChargesDetails)
        //, OtherCharges OtherChargesInfo, List<OtherChargesRemarks> RateRemarks, List<OtherChargesSLAB> RateSLABInfoarray, List<OtherChargesULDAirlineSLAB> RateULDSLABInfoArray, OtherChargesParam RateParamList
        {
            List<string> ErrorMessage = new List<string>();
            try
            {
                //List<OtherChargesRemarks> listOtherChargesRemarks = new List<OtherChargesRemarks>();
                //List<OtherChargesSlabParameter> listOtherChargesSLABParameter = new List<OtherChargesSlabParameter>();
                //List<OtherChargesRateParameter> listOtherChargesRateParameter = new List<OtherChargesRateParameter>();
                DataTable dtOtherChargesDetails = CollectionHelper.ConvertTo(OtherChargesDetails, "DueChargeType,RemarksCount,SlabCount,Text_OriginSNo,Text_DestinationSNo,OtherChargeMandatory,Taxable,Commissionable,Text_PaymentType,Text_ChargeType,DueChargeTypeText,Text_CurrencySNo,Text_Active,UnitText,ChargeTypeText,Text_DestinationType,Text_OriginType,OriginType,Text_OCCodeSNo,Text_AirlineSNo,OriginZoneSNo,DestinationZoneSNo,OriginAirPortSNo,DestinationAirPortSNo,OriginCountrySNo,DestinationCountrySNo,OriginRegionSNo,DestinationRegionSNo,Remarks,MaximumCharge,listOtherChargesRemarks,listOtherChargesSLABParameter,listOtherChargesRateParameter,CreatedOn,UpdatedOn,CreatedUser,UpdatedUser,Text_OriginAirPortSNo,Text_DestinationAirPortSNo,DestinationType,Text_ApplicableOn,Text_IsReplanCharges");
                DataTable dtOtherChargesRemarks = CollectionHelper.ConvertTo(OtherChargesDetails[0].listOtherChargesRemarks, "");
                DataTable dtOtherChargesSLABParameter = CollectionHelper.ConvertTo(OtherChargesDetails[0].listOtherChargesSLABParameter, "RateSNo,Text_RateClassSNo,Based");
                DataTable dtOtherChargesRateParameter = CollectionHelper.ConvertTo(OtherChargesDetails[0].listOtherChargesRateParameter, "Text_IssueCarrierSNo,Text_FlightSNo,Text_TransitStationsSNo,Text_ProductSNo,Text_AgentGroupSNo,Text_CommoditySNo,Text_AccountSNo,Text_SHCSNo,Text_ShipperSNo,Text_SPHCGroupSNo");

                //lstRateDetails.Add(RateInfo);

                //List<RateParam> lstRateParam = new List<RateParam>();
                //lstRateParam.Add(RateParamList);

                //DataTable dtRateDetails = CollectionHelper.ConvertTo(lstRateDetails, "");
                //DataTable dtRateRemarks = CollectionHelper.ConvertTo(RateRemarks, "");
                //DataTable dtRateSlab = CollectionHelper.ConvertTo(RateSLABInfoarray, "HdnRateClassSNo");
                //DataTable dtRateULDSlab = CollectionHelper.ConvertTo(RateULDSLABInfoArray, "HdnRateClassSNo,HdnULDSNo");
                //DataTable dtRateParam = CollectionHelper.ConvertTo(lstRateParam, "");

                BaseBusiness baseBusiness = new BaseBusiness();
                SqlParameter paramChargesDetails = new SqlParameter();
                paramChargesDetails.ParameterName = "@OtherChargesDetailsTable";
                paramChargesDetails.SqlDbType = System.Data.SqlDbType.Structured;
                paramChargesDetails.Value = dtOtherChargesDetails;

                SqlParameter paramOtherChargesRemarks = new SqlParameter();
                paramOtherChargesRemarks.ParameterName = "@OtherChargesRemarksTable";
                paramOtherChargesRemarks.SqlDbType = System.Data.SqlDbType.Structured;
                paramOtherChargesRemarks.Value = dtOtherChargesRemarks;

                SqlParameter paramOtherChargesSlab = new SqlParameter();
                paramOtherChargesSlab.ParameterName = "@OtherChargesSlabTable";
                paramOtherChargesSlab.SqlDbType = System.Data.SqlDbType.Structured;
                paramOtherChargesSlab.Value = dtOtherChargesSLABParameter;

                SqlParameter paramOtherChargesRate = new SqlParameter();
                paramOtherChargesRate.ParameterName = "@OtherChargesRateTable";
                paramOtherChargesRate.SqlDbType = System.Data.SqlDbType.Structured;
                paramOtherChargesRate.Value = dtOtherChargesRateParameter;

                DataSet ds = new DataSet();
                SqlParameter[] Parameters = { paramChargesDetails, paramOtherChargesRemarks, paramOtherChargesSlab, paramOtherChargesRate };
            //  ds = SqlHelper.ExecuteDataset(DMLConnectionString.WebConfigConnectionString, "usp_DueCarrier_SaveDetails_tmp", Parameters);
               int ret = (int)SqlHelper.ExecuteScalar(DMLConnectionString.WebConfigConnectionString, "usp_DueCarrier_SaveDetails", Parameters);
                if (ret > 0)
                {
                    if (ret > 1000)
                    {
                        //For Customised Validation Messages like 'Record Already Exists' etc
                        string serverErrorMessage = baseBusiness.ReadServerErrorMessages(ret, "OtherCharges");
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
            catch(Exception ex)//
            {

                throw ex;
            }
            return ErrorMessage;
        }

        public OtherCharges GetOtherChargesRecord(string recordID, string UserSNo)
        {
           
            OtherCharges otherCharges = new OtherCharges();
            SqlDataReader dr = null;
            try
            {
                SqlParameter[] Parameters = { new SqlParameter("@SNo", recordID), new SqlParameter("@UserID", Convert.ToInt32(UserSNo)) };
                dr = SqlHelper.ExecuteReader(DMLConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, "GetOtherChargesRecord", Parameters);
                if (dr.Read())
                {
                    //SNo,AirlineSNo,AirLine,OtherChargesSNo,OtherCharges,IsOtherChargeMandatory,OriginLevelSNo,OriginLevel,DestinationLevelSNo,DestinationLevel,DueChargeType,
                    //Status,StatusText,UnitText,CurrencySNo,Currency,ChargeType,ChargeTypeText,PaymentType,PaymentText,MinimumCharge,Charge,IsTaxable,
                    //IsCommissionable,ValidFrom,ValidTo,OriginSNo,OriginText,DestinationSNo,DestinationText,CreatedUser,UpdatedUser
                    otherCharges.SNo = Convert.ToInt32(dr["SNo"]);
                    otherCharges.AirlineSNo = Convert.ToString(dr["AirlineSNo"]);
                    otherCharges.Text_AirlineSNo = Convert.ToString(dr["AirLine"]);
                    otherCharges.DueCarrierCodeSNo = Convert.ToString(dr["OtherChargesSNo"]);
                    otherCharges.Text_OCCodeSNo = Convert.ToString(dr["OtherCharges"]);
                    otherCharges.IsOtherChargeMandatory = Convert.ToBoolean(dr["IsOtherChargeMandatory"]);
                    otherCharges.OtherChargeMandatory = Convert.ToString(dr["OtherChargeMandatory"]);
                    otherCharges.OriginType = Convert.ToInt32(dr["OriginLevelSNo"]);
                    otherCharges.Text_OriginType = Convert.ToString(dr["OriginLevel"]);
                    otherCharges.DestinationType = Convert.ToInt32(dr["DestinationLevelSNo"]);
                    otherCharges.Text_DestinationType = Convert.ToString(dr["DestinationLevel"]);
                    otherCharges.DueChargeTypeText = Convert.ToString(dr["DueChargeType"]);
                    otherCharges.Text_ApplicableOn = Convert.ToString(dr["Text_ApplicableOn"]);
                    otherCharges.DueChargeType = Convert.ToString(dr["DueChargeTypeText"]);
                    otherCharges.Status = Convert.ToInt32(dr["Status"]);
                    otherCharges.Text_Active = Convert.ToString(dr["StatusText"]);
                    otherCharges.UnitText = Convert.ToString(dr["UnitText"]);
                    otherCharges.CurrencySNo = Convert.ToInt32(dr["CurrencySNo"]);
                    otherCharges.Text_CurrencySNo = Convert.ToString(dr["Currency"]);
                    otherCharges.ChargeType = Convert.ToInt32(dr["ChargeType"]);
                    otherCharges.Text_ChargeType = Convert.ToString(dr["ChargeTypeText"]);
                    otherCharges.PaymentType = Convert.ToInt32(dr["PaymentType"]);
                    otherCharges.Text_PaymentType = Convert.ToString(dr["PaymentText"]);
                    otherCharges.MinimumCharge = Convert.ToDecimal(dr["MinimumCharge"]);
                    otherCharges.Charge = Convert.ToDecimal(dr["Charge"]);
                    otherCharges.IsTaxable = Convert.ToBoolean(dr["IsTaxable"]);
                    otherCharges.Taxable = Convert.ToString(dr["Taxable"]);
                    otherCharges.IsCommissionable = Convert.ToBoolean(dr["IsCommissionable"]);
                    otherCharges.ReferenceNumber = Convert.ToString(dr["ReferenceNumber"]);
                    otherCharges.Commissionable = Convert.ToString(dr["Commissionable"]);
                    otherCharges.ValidFrom = Convert.ToDateTime(dr["ValidFrom"]);
                    otherCharges.ValidTo = Convert.ToDateTime(dr["ValidTo"]);
                    otherCharges.OriginAirPortSNo = Convert.ToInt32(dr["OriginSNo"]);
                    otherCharges.Text_OriginAirPortSNo = Convert.ToString(dr["OriginText"]);
                    otherCharges.Text_OriginSNo = Convert.ToString(dr["OriginText"]);
                    otherCharges.DestinationAirPortSNo = Convert.ToInt32(dr["DestinationSNo"]);
                    otherCharges.Text_DestinationAirPortSNo = Convert.ToString(dr["DestinationText"]);
                    otherCharges.Text_DestinationSNo = Convert.ToString(dr["DestinationText"]);
                    otherCharges.CreatedUser = Convert.ToString(dr["CreatedUser"]);
                    otherCharges.UpdatedUser = Convert.ToString(dr["UpdatedUser"]);
                    otherCharges.IsReplanCharges = Convert.ToBoolean(dr["IsReplanCharges"]);
                    otherCharges.Text_IsReplanCharges = Convert.ToString(dr["Text_IsReplanCharges"]);
                    otherCharges.SlabCount = 0;
                    otherCharges.RemarksCount = 0;
                }
            }
                 catch(Exception ex)//
            {
                dr.Close();
                throw ex;
            }
          
            return otherCharges;
        }

        public string GetRateParameterDetails(int SNo)
        {
            try
            {
            DataSet ds = new DataSet();
            SqlParameter[] Parameters = { new SqlParameter("@SNo", SNo) };
            ds = SqlHelper.ExecuteDataset(ReadConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, "getDueCarrierRateParameterDetails", Parameters);
            return DStoJSON(ds);
        }
            catch(Exception ex)//
            {
               
                throw ex;
            }
        }

        public static string DStoJSON(DataSet ds)
        {
            try
            {
            StringBuilder json = new StringBuilder();
            json.Append("[");
            if (ds != null && ds.Tables.Count > 0)
            {
                int lInteger = 0;
                foreach (DataRow dr in ds.Tables[ds.Tables.Count - 1].Rows)
                {
                    lInteger = lInteger + 1;
                    json.Append("{");
                    int i = 0;
                    int colcount = dr.Table.Columns.Count;
                    foreach (DataColumn dc in dr.Table.Columns)
                    {
                        json.Append("\"");
                        json.Append(dc.ColumnName);
                        json.Append("\":\"");
                        json.Append(dr[dc].ToString() == "" ? "" : dr[dc].ToString().Trim());
                        json.Append("\"");
                        i++;
                        if (i < colcount) json.Append(",");
                    }

                    if (lInteger < ds.Tables[ds.Tables.Count - 1].Rows.Count)
                    {
                        json.Append("},");
                    }
                    else
                    {
                        json.Append("}");
                    }
                }
            }
            json.Append("]");


            return json.ToString();
        }
            catch(Exception ex)//
            {
               
                throw ex;
            }
        }

        public List<string> UpdateOtherCharges(List<OtherCharges> OtherChargesDetails)
        {
            List<string> ErrorMessage = new List<string>();
            try
            {
                //List<OtherChargesRemarks> listOtherChargesRemarks = new List<OtherChargesRemarks>();
                //List<OtherChargesSlabParameter> listOtherChargesSLABParameter = new List<OtherChargesSlabParameter>();
                //List<OtherChargesRateParameter> listOtherChargesRateParameter = new List<OtherChargesRateParameter>();
                DataTable dtOtherChargesDetails = CollectionHelper.ConvertTo(OtherChargesDetails, "DueChargeType,RemarksCount,SlabCount,Text_OriginSNo,Text_DestinationSNo,OtherChargeMandatory,Taxable,Commissionable,Text_PaymentType,Text_ChargeType,DueChargeTypeText,Text_CurrencySNo,Text_Active,UnitText,ChargeTypeText,Text_DestinationType,Text_OriginType,Text_OCCodeSNo,Text_AirlineSNo,OriginZoneSNo,DestinationZoneSNo,OriginAirPortSNo,DestinationAirPortSNo,OriginCountrySNo,DestinationCountrySNo,OriginRegionSNo,DestinationRegionSNo,Remarks,MaximumCharge,listOtherChargesRemarks,listOtherChargesSLABParameter,listOtherChargesRateParameter,CreatedOn,UpdatedOn,CreatedUser,UpdatedUser,Text_OriginAirPortSNo,Text_DestinationAirPortSNo,DestinationType,OriginType,Text_ApplicableOn,Text_IsReplanCharges");
                DataTable dtOtherChargesRemarks = CollectionHelper.ConvertTo(OtherChargesDetails[0].listOtherChargesRemarks, "");
                DataTable dtOtherChargesSLABParameter = CollectionHelper.ConvertTo(OtherChargesDetails[0].listOtherChargesSLABParameter, "RateSNo,Text_RateClassSNo,Based");
                DataTable dtOtherChargesRateParameter = CollectionHelper.ConvertTo(OtherChargesDetails[0].listOtherChargesRateParameter, "Text_IssueCarrierSNo,Text_FlightSNo,Text_TransitStationsSNo,Text_ProductSNo,Text_AgentGroupSNo,Text_CommoditySNo,Text_AccountSNo,Text_SHCSNo,Text_ShipperSNo,Text_SPHCGroupSNo");

                //lstRateDetails.Add(RateInfo);

                //List<RateParam> lstRateParam = new List<RateParam>();
                //lstRateParam.Add(RateParamList);

                //DataTable dtRateDetails = CollectionHelper.ConvertTo(lstRateDetails, "");
                //DataTable dtRateRemarks = CollectionHelper.ConvertTo(RateRemarks, "");
                //DataTable dtRateSlab = CollectionHelper.ConvertTo(RateSLABInfoarray, "HdnRateClassSNo");
                //DataTable dtRateULDSlab = CollectionHelper.ConvertTo(RateULDSLABInfoArray, "HdnRateClassSNo,HdnULDSNo");
                //DataTable dtRateParam = CollectionHelper.ConvertTo(lstRateParam, "");

                BaseBusiness baseBusiness = new BaseBusiness();
                SqlParameter paramChargesDetails = new SqlParameter();
                paramChargesDetails.ParameterName = "@OtherChargesDetailsTable";
                paramChargesDetails.SqlDbType = System.Data.SqlDbType.Structured;
                paramChargesDetails.Value = dtOtherChargesDetails;

                SqlParameter paramOtherChargesRemarks = new SqlParameter();
                paramOtherChargesRemarks.ParameterName = "@OtherChargesRemarksTable";
                paramOtherChargesRemarks.SqlDbType = System.Data.SqlDbType.Structured;
                paramOtherChargesRemarks.Value = dtOtherChargesRemarks;

                SqlParameter paramOtherChargesSlab = new SqlParameter();
                paramOtherChargesSlab.ParameterName = "@OtherChargesSlabTable";
                paramOtherChargesSlab.SqlDbType = System.Data.SqlDbType.Structured;
                paramOtherChargesSlab.Value = dtOtherChargesSLABParameter;

                SqlParameter paramOtherChargesRate = new SqlParameter();
                paramOtherChargesRate.ParameterName = "@OtherChargesRateTable";
                paramOtherChargesRate.SqlDbType = System.Data.SqlDbType.Structured;
                paramOtherChargesRate.Value = dtOtherChargesRateParameter;

                DataSet ds = new DataSet();
                SqlParameter[] Parameters = { paramChargesDetails, paramOtherChargesRemarks, paramOtherChargesSlab, paramOtherChargesRate };
               // ds = SqlHelper.ExecuteDataset(DMLConnectionString.WebConfigConnectionString, "usp_DueCarrier_UpdateDetails", Parameters);
                int ret = (int)SqlHelper.ExecuteScalar(DMLConnectionString.WebConfigConnectionString, "usp_DueCarrier_UpdateDetails", Parameters);
               // ds = SqlHelper.ExecuteDataset(DMLConnectionString.WebConfigConnectionString, "usp_DueCarrier_UpdateDetails", Parameters);
                // int = 0;
                if (ret > 0)
                {
                    if (ret > 1000)
                    {
                        //For Customised Validation Messages like 'Record Already Exists' etc
                        string serverErrorMessage = baseBusiness.ReadServerErrorMessages(ret, "OtherCharges");
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
            catch(Exception ex)//
            {
               
                throw ex;
            }
            return ErrorMessage;
        }

        public List<string> DeleteOtherCharges(List<string> RecordID)
        {
            List<string> ErrorMessage = new List<string>();
            BaseBusiness baseBussiness = new BaseBusiness();
            try
            {
                if (RecordID.Count > 0)
                {
                    string RecordId = RecordID[0].ToString();
                    string UserId = RecordID[1].ToString();
                    SqlParameter[] Parameters = { new SqlParameter("@SNo", Convert.ToString(RecordId)), new SqlParameter("@UserID", Convert.ToInt32(UserId)) };
                    int ret = (int)SqlHelper.ExecuteScalar(DMLConnectionString.WebConfigConnectionString, "DeleteOtherChargesRecord", Parameters);
                    if (ret > 0)
                    {
                        if (ret > 1000)
                        {
                            string serverErrorMessage = baseBussiness.ReadServerErrorMessages(ret, "OtherCharges");
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
                }
            }
            catch(Exception ex)//
            {

                throw ex;
            }
            return ErrorMessage;
        }
    }
}
