using CargoFlash.Cargo.Business;
using CargoFlash.Cargo.DataService.Schedule;
using CargoFlash.Cargo.Model.Rate;
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

namespace CargoFlash.Cargo.DataService.Rate
{
    #region Spot Rate Description
    /*
	*****************************************************************************
	Class Name:	    Spot Rate  
	Purpose:		This class used to handle
	Company:		CargoFlash Infotech Pvt Ltd.
	Author:			Akash
	Created On:		
    Updated By:    
	Updated On:
	Approved By:    
	Approved On:	
	*****************************************************************************
	*/
    #endregion
    [GlobalErrorHandlerBehaviour(typeof(GlobalErrorHandler))]
    [ServiceBehavior(IncludeExceptionDetailInFaults = true)]
    [AspNetCompatibilityRequirements(RequirementsMode = AspNetCompatibilityRequirementsMode.Allowed)]
    public class SpotRateService : SignatureAuthenticate, ISpotRateService
    {
        CargoFlash.Cargo.Business.BaseBusiness basebusiness = new CargoFlash.Cargo.Business.BaseBusiness();

        public DataSourceResult GetGridData(int skip, int take, int page, int pageSize, List<GridSort> sort, GridFilter filter)
        {

            System.Data.DataSet ds = new DataSet();
            IEnumerable<SpotRate> RateServiceList = null;
            try
            {

                string sorts = GridSort.ProcessSorting(sort);
                string filters = GridFilter.ProcessFilters<SpotRate>(filter);
                SqlParameter[] Parameters = { new SqlParameter("@PageNo", page),
                                            new SqlParameter("@AgentSNo", ((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).AgentSNo.ToString()),
                                            new SqlParameter("@UserSNo", ((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).UserSNo.ToString()),
                                            new SqlParameter("@PageSize", pageSize), new SqlParameter("@WhereCondition", filters), new SqlParameter("@OrderBy", sorts) };
                ds = SqlHelper.ExecuteDataset(DMLConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, "GetListSpotRateService", Parameters);
                RateServiceList = ds.Tables[0].AsEnumerable().Select(e => new SpotRate
                {
                    SNo = Convert.ToInt32(e["SNo"]),
                    AirlineSNo = Convert.ToInt32(e["AirlineSNo"]),
                    Text_AirlineSNo = e["Text_AirlineSNo"].ToString().ToUpper(),
                    Text_RateAdhocType = e["Text_RateAdhocType"].ToString().ToUpper(),
                    AWBNo = e["AWBNo"].ToString().ToUpper(),
                    OriginCitySNo = e["OriginCitySNo"].ToString(),
                    Text_OriginCitySNo = e["Text_OriginCitySNo"].ToString().ToUpper(),
                    DestinationCitySNo = Convert.ToInt32(e["DestinationCitySNo"]),
                    Text_DestinationCitySNo = e["Text_DestinationCitySNo"].ToString().ToUpper(),
                    Name = e["Name"].ToString().ToUpper(),
                    Reference = e["Reference"].ToString().ToUpper(),
                    SectorRate = Convert.ToDecimal(e["SectorRate"].ToString()),
                    RequestedRate = Convert.ToDecimal(e["RequestedRate"].ToString()),
                    Text_IsApproved = e["Text_IsApproved"].ToString().ToUpper(),
                    Active = e["Active"].ToString().ToUpper(),
                    IsActive = Convert.ToBoolean(e["IsActive"]),
                    ValidFr = Convert.ToDateTime(e["ValidFr"].ToString().ToUpper()),
                    ValidTo = Convert.ToDateTime(e["ValidTo"].ToString().ToUpper()),
                    spotcode = e["spotcode"].ToString().ToUpper(),
                    //nehal
                    Pieces = Convert.ToInt32(e["Pieces"]),
                    ChargeableWeight=Convert.ToDecimal(e["ChargeableWeight"]),
                    ApprovedRate=Convert.ToDecimal(e["ApprovedRate"]),

                });
                ds.Dispose();
            }
            catch (Exception ex)// (Exception ex)
            {
                // do something for error
                DataSet dsError;
                System.Data.SqlClient.SqlParameter[] ParametersError = {
                                                                   new System.Data.SqlClient.SqlParameter("@ErrorMessage",ex.Message),
                                                                    new System.Data.SqlClient.SqlParameter("@ProcName","GetListSpotRateService"),
                                                                    new System.Data.SqlClient.SqlParameter("@UserSNo", ((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).UserSNo.ToString())
                                                              };
                dsError = CargoFlash.SoftwareFactory.Data.SqlHelper.ExecuteDataset(CargoFlash.SoftwareFactory.Data.DMLConnectionString.WebConfigConnectionString, System.Data.CommandType.StoredProcedure, "ProcOfHandleErrors", ParametersError);
                throw ex;
            }
            return new DataSourceResult
            {
                Data = ds.Tables.Count > 0 ? RateServiceList.AsQueryable().ToList() : Enumerable.Empty<SpotRate>().ToList<SpotRate>(),
                Total = ds.Tables.Count > 0 ? Convert.ToInt32(ds.Tables[1].Rows[0][0].ToString()) : 0
            };
        }

        //  To get  AWB details
        public string GetAWBData(string str)
        {
            DataSet ds = new DataSet();

            try
            {

                SqlParameter[] Parameters = { new SqlParameter("@AWBNo", str) };
                ds = SqlHelper.ExecuteDataset(ReadConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, "SpSpotRate_GetRecordForSpotRate", Parameters);
                //return DStoJSON(ds);
            }
            catch (Exception ex)// (Exception ex)
            {
                // do something for error
                DataSet dsError;
                System.Data.SqlClient.SqlParameter[] ParametersError = {
                                                                   new System.Data.SqlClient.SqlParameter("@ErrorMessage",ex.Message),
                                                                    new System.Data.SqlClient.SqlParameter("@ProcName","SpSpotRate_GetRecordForSpotRate"),
                                                                    new System.Data.SqlClient.SqlParameter("@UserSNo", ((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).UserSNo.ToString())
                                                              };
                dsError = CargoFlash.SoftwareFactory.Data.SqlHelper.ExecuteDataset(CargoFlash.SoftwareFactory.Data.DMLConnectionString.WebConfigConnectionString, System.Data.CommandType.StoredProcedure, "ProcOfHandleErrors", ParametersError);
                throw ex;
            }
            return Newtonsoft.Json.JsonConvert.SerializeObject(ds, Newtonsoft.Json.Formatting.Indented);
        }

        public string DStoJSON(DataSet ds)
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


        public string SaveSpotRateDetais(string SNo, SpotRate SpotRate, List<SpotRateRemarks> spotRateRemarks, List<SpotRateFlightInfo> SpotRateFlightInfo, List<SpotRateULDAirlineSLAB> SpotRateULDSLABInfoArray, string[] ApproveType, int IsAgentGroup, string AccountGroupSNo, decimal DiscountedPercentage, decimal SurchargePercentage, decimal ApprovedDiscountedPercentage, decimal ApprovedSurchargePercentage,decimal isFlatRate,decimal IsWeiveDueCarrierCharges)
        {
            List<SpotRate> lstRateDetails = new List<SpotRate>();
            lstRateDetails.Add(SpotRate);
            string ActionType = SpotRate.ActionType;
            var Approve = string.Join(",", ApproveType);
            DataTable dtSpotRateDetails = CollectionHelper.ConvertTo(lstRateDetails, "CompaignSpotCode,IsCodeUsed,Text_IsCodeUsed,Text_CodeType,ValidFr,ValidTo,ActionType,Text_WeightType,Text_VolumeUnit,Text_AllinRate,Text_IsCommissionable,ApprovedUser,CreatedUser,UpdatedUser,Text_IsApproved,AWBcode,AWBNo,Text_AirlineSNo,Text_AWBTypeSNo,Text_RateAdhocType,Text_OriginCitySNo,Text_DestinationCitySNo,Text_OfficeSNo,Text_AccountSNo,Text_ProductSNo,Text_CommoditySNo,Active,Text_CurrencySNo,Text_BasedOnSNo,Text_SHCSNo,spotcode,HdnCampaignType,HdnNoofCodes,HdnPageSNo,HdnCodeType,IsAgentGroup,AccountGroupSNo,Text_AccountGroupSNo,Name,IsFlatRate,IsWeiveDueCarrierCharges");

            DataTable dtSpotRateRemarks = CollectionHelper.ConvertTo(spotRateRemarks, "CreatedBy");
            DataTable dtSpotRateFlight = CollectionHelper.ConvertTo(SpotRateFlightInfo, "FlightOriginSNo,FlightDestinationSNo,FlightNumSNo");
            DataTable dtULDSLABInfoArray = CollectionHelper.ConvertTo(SpotRateULDSLABInfoArray, "RateClassSNo,HdnULDSNo,Text_RateClassSNo,IsULDRate");


            BaseBusiness baseBusiness = new BaseBusiness();
            SqlParameter paramRateDetails = new SqlParameter();
            paramRateDetails.ParameterName = "@SpotRateDetails";
            paramRateDetails.SqlDbType = System.Data.SqlDbType.Structured;
            paramRateDetails.Value = dtSpotRateDetails;

            SqlParameter paramRateRemarks = new SqlParameter();
            paramRateRemarks.ParameterName = "@SpotRateRemarks";
            paramRateRemarks.SqlDbType = System.Data.SqlDbType.Structured;
            paramRateRemarks.Value = dtSpotRateRemarks;

            SqlParameter paramRateSlab = new SqlParameter();
            paramRateSlab.ParameterName = "@SpotRateFlight";
            paramRateSlab.SqlDbType = System.Data.SqlDbType.Structured;
            paramRateSlab.Value = dtSpotRateFlight;

            SqlParameter paramRateSlabULD = new SqlParameter();
            paramRateSlabULD.ParameterName = "@SpotRateULDSLABInfoArray";
            paramRateSlabULD.SqlDbType = System.Data.SqlDbType.Structured;
            paramRateSlabULD.Value = dtULDSLABInfoArray;

            DataSet ds = new DataSet();
            SqlParameter[] Parameters = {
                                            new SqlParameter("@SNo",Convert.ToInt32(SNo)),
                                            new SqlParameter("@ActionType",ActionType),

                                            paramRateDetails,
                                            paramRateRemarks,
                                            paramRateSlab,
                                            paramRateSlabULD,
                                            new SqlParameter("@CreatedBy", ((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).UserSNo.ToString()),
                                            new SqlParameter("@ApproveType",Approve),
                                            new SqlParameter("@IsAgentGroup",IsAgentGroup),
                                            new SqlParameter("@AccountGroupSNo",AccountGroupSNo),
                                            new SqlParameter("@DiscountedPercentage",DiscountedPercentage),
                                            new SqlParameter("@SurchargePercentage",SurchargePercentage),
                                            new SqlParameter("@ApprovedDiscountedPercentage",ApprovedDiscountedPercentage),
                                            new SqlParameter("@ApprovedSurchargePercentage",ApprovedSurchargePercentage),
                                            new SqlParameter("@IsFlatRate",isFlatRate),
                                            new SqlParameter("@IsWeiveDueCarrierCharges",IsWeiveDueCarrierCharges)
                                        };
            try
            {
                ds = SqlHelper.ExecuteDataset(DMLConnectionString.WebConfigConnectionString, "spSpotRate_SaveDetails", Parameters);
                return ds.Tables[ds.Tables.Count - 1].Rows[0][0].ToString();
            }
            catch (Exception ex)// (Exception ex)
            {
                // do something for error
                DataSet dsError;
                System.Data.SqlClient.SqlParameter[] ParametersError = {
                                                                   new System.Data.SqlClient.SqlParameter("@ErrorMessage",ex.Message),
                                                                    new System.Data.SqlClient.SqlParameter("@ProcName","spSpotRate_SaveDetails"),
                                                                    new System.Data.SqlClient.SqlParameter("@UserSNo", ((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).UserSNo.ToString())
                                                              };
                dsError = CargoFlash.SoftwareFactory.Data.SqlHelper.ExecuteDataset(CargoFlash.SoftwareFactory.Data.DMLConnectionString.WebConfigConnectionString, System.Data.CommandType.StoredProcedure, "ProcOfHandleErrors", ParametersError);
                throw ex;

            }
        }

        public KeyValuePair<string, List<SpotRateRemarks>> GetRemarks(string recordID, int page, int pageSize, string whereCondition, string sort)
        {
            System.Data.DataSet ds = new DataSet();
            IEnumerable<SpotRateRemarks> RateSlabList = null;
            try
            {
                whereCondition = "RateAirlineAdhocRequestSNo=" + recordID;
                SqlParameter[] Parameters = { new SqlParameter("@SNo", recordID), new SqlParameter("@PageNo", page), new SqlParameter("@PageSize", pageSize), new SqlParameter("@WhereCondition", whereCondition), new SqlParameter("@OrderBy", sort) };
                ds = SqlHelper.ExecuteDataset(DMLConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, "spSpotRate_GetRemarks", Parameters);
                if (ds.Tables.Count > 0 && ds.Tables != null)
                {
                    RateSlabList = ds.Tables[0].AsEnumerable().Select(e => new SpotRateRemarks
                    {
                        SNo = Convert.ToInt32(e["RSNo"]),
                        // RateSNo = Convert.ToInt32(e["RateSNo"].ToString()),
                        Remarks = Convert.ToString(e["Remarks"]),
                        IsAgentRemarks = Convert.ToBoolean(e["IsAgentRemarks"]),
                        CreatedBy = Convert.ToString(e["UpdatedUser"]),
                    });
                }
            }
            catch (Exception ex)// (Exception ex)
            {
                // do something for error
                DataSet dsError;
                System.Data.SqlClient.SqlParameter[] ParametersError = {
                                                                   new System.Data.SqlClient.SqlParameter("@ErrorMessage",ex.Message),
                                                                    new System.Data.SqlClient.SqlParameter("@ProcName","spSpotRate_GetRemarks"),
                                                                    new System.Data.SqlClient.SqlParameter("@UserSNo", ((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).UserSNo.ToString())
                                                              };
                dsError = CargoFlash.SoftwareFactory.Data.SqlHelper.ExecuteDataset(CargoFlash.SoftwareFactory.Data.DMLConnectionString.WebConfigConnectionString, System.Data.CommandType.StoredProcedure, "ProcOfHandleErrors", ParametersError);
                throw ex;
            }
            return new KeyValuePair<string, List<SpotRateRemarks>>(ds.Tables[1].Rows[0][0].ToString(), RateSlabList.AsQueryable().ToList());
        }
        public KeyValuePair<string, List<SpotRateULDAirlineSLAB>> GetULDRate(string recordID, int page, int pageSize, string whereCondition, string sort)
        {
            System.Data.DataSet ds = new DataSet();
            IEnumerable<SpotRateULDAirlineSLAB> RateSlabList = null;
            try
            {

                whereCondition = "RateSNo=" + recordID;

                SqlParameter[] Parameters = { new SqlParameter("@PageNo", page), new SqlParameter("@PageSize", pageSize), new SqlParameter("@WhereCondition", whereCondition), new SqlParameter("@OrderBy", sort) };
                ds = SqlHelper.ExecuteDataset(DMLConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, "spSpotRate_GetULD", Parameters);
                if (ds.Tables.Count > 0 && ds.Tables != null)
                {
                    RateSlabList = ds.Tables[0].AsEnumerable().Select(e => new SpotRateULDAirlineSLAB
                    {
                        SNo = Convert.ToInt32(e["USNo"]),
                        //   SlabSNo = Convert.ToInt32(e["SlabSNo"].ToString()),
                        SpotRateSNo = Convert.ToInt32(e["RateSNo"].ToString()),
                        //  SLABName = e["SlabName"].ToString(),
                        // StartWt = Convert.ToDecimal(e["StartWt"].ToString()),
                        //  EndWt = Convert.ToDecimal(e["EndWt"].ToString()),
                        RateClassSNo = e["Text_RateClassSNo"].ToString(),
                        HdnRateClassSNo = Convert.ToInt32(e["RateClassSNo"].ToString()),
                        ULDSNo = e["Text_ULDSNo"].ToString(),
                        Rate = Convert.ToDecimal(e["Rate"].ToString()),
                        //Based = e["Based"].ToString(),
                        HdnULDSNo = Convert.ToInt32(e["ULDSNo"].ToString()),
                        RequestedRate = Convert.ToDecimal(e["RequestedRate"].ToString()),
                        ApprovedRate = Convert.ToDecimal(e["ApprovedRate"].ToString()),
                        IsULDRate = Convert.ToInt16(e["IsULDRate"].ToString()) 


                    });
                }
            }
            catch (Exception ex)// (Exception ex)
            {
                // do something for error
                DataSet dsError;
                System.Data.SqlClient.SqlParameter[] ParametersError = {
                                                                   new System.Data.SqlClient.SqlParameter("@ErrorMessage",ex.Message),
                                                                    new System.Data.SqlClient.SqlParameter("@ProcName","spSpotRate_GetULD"),
                                                                    new System.Data.SqlClient.SqlParameter("@UserSNo", ((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).UserSNo.ToString())
                                                              };
                dsError = CargoFlash.SoftwareFactory.Data.SqlHelper.ExecuteDataset(CargoFlash.SoftwareFactory.Data.DMLConnectionString.WebConfigConnectionString, System.Data.CommandType.StoredProcedure, "ProcOfHandleErrors", ParametersError);
                throw ex;
            }
            return new KeyValuePair<string, List<SpotRateULDAirlineSLAB>>(ds.Tables[1].Rows[0][0].ToString(), RateSlabList.AsQueryable().ToList());
        }

        public KeyValuePair<string, List<SpotRateFlightInfo>> GetFlightInfo(string recordID, int page, int pageSize, string whereCondition, string sort)
        {
            System.Data.DataSet ds = new DataSet();
            IEnumerable<SpotRateFlightInfo> RateFlightInfo = null;
            try
            {
                whereCondition = "RateAirlineAdhocSNo=" + recordID;
                SqlParameter[] Parameters = { new SqlParameter("@PageNo", page), new SqlParameter("@PageSize", pageSize), new SqlParameter("@WhereCondition", whereCondition), new SqlParameter("@OrderBy", sort) };
                ds = SqlHelper.ExecuteDataset(DMLConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, "spSpotRate_GetFlightInfo", Parameters);
                if (ds.Tables.Count > 0 && ds.Tables != null)
                {
                    RateFlightInfo = ds.Tables[0].AsEnumerable().Select(e => new SpotRateFlightInfo
                    {
                        SNo = Convert.ToInt32(e["FlightSNo"]),
                        HdnFlightOriginSNo = Convert.ToInt32(e["OriginAirportSNo"].ToString()),
                        FlightOriginSNo = e["Text_OriginAirportSNo"].ToString(),
                        FlightDestinationSNo = e["Text_DestinationAirportSNo"].ToString(),
                        HdnFlightDestinationSNo = Convert.ToInt32(e["DestinationAirportSNo"].ToString()),
                        HdnFlightNumSNo = e["FlightNo"].ToString(),
                        FlightNumSNo = e["FlightNo"].ToString(),
                        FlightDate = e["FlightDate"].ToString()
                    });
                }
            }
            catch (Exception ex)// (Exception ex)
            {
                // do something for error
                DataSet dsError;
                System.Data.SqlClient.SqlParameter[] ParametersError = {
                                                                   new System.Data.SqlClient.SqlParameter("@ErrorMessage",ex.Message),
                                                                    new System.Data.SqlClient.SqlParameter("@ProcName","spSpotRate_GetFlightInfo"),
                                                                    new System.Data.SqlClient.SqlParameter("@UserSNo", ((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).UserSNo.ToString())
                                                              };
                dsError = CargoFlash.SoftwareFactory.Data.SqlHelper.ExecuteDataset(CargoFlash.SoftwareFactory.Data.DMLConnectionString.WebConfigConnectionString, System.Data.CommandType.StoredProcedure, "ProcOfHandleErrors", ParametersError);
                throw ex;
            }
            return new KeyValuePair<string, List<SpotRateFlightInfo>>(ds.Tables[1].Rows[0][0].ToString(), RateFlightInfo.AsQueryable().ToList());
        }


        public KeyValuePair<string, List<SpotRate>> GetSpotCode(string recordID, int page, int pageSize, string whereCondition, string sort)
        {

            System.Data.DataSet ds = new DataSet();
            IEnumerable<SpotRate> CodeInfo = null;
            try
            {
                whereCondition = "RateAirlineAdhocSNo=" + recordID;
                SqlParameter[] Parameters = { new SqlParameter("@PageNo", page), new SqlParameter("@PageSize", pageSize), new SqlParameter("@WhereCondition", whereCondition), new SqlParameter("@OrderBy", sort) };
                ds = SqlHelper.ExecuteDataset(DMLConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, "spSpotRate_GetSpotCode", Parameters);

                CodeInfo = ds.Tables[0].AsEnumerable().Select(e => new SpotRate
                {
                    SNo = Convert.ToInt32(e["CSNo"]),
                    CompaignSpotCode = e["CompaignSpotCode"].ToString(),
                    IsCodeUsed = Convert.ToBoolean(e["IsCodeUsed"].ToString()),
                    Text_IsCodeUsed = e["Text_IsCodeUsed"].ToString(),
                    //FlightOriginSNo = e["Text_IsCodeUsed"].ToString(),
                    //FlightDestinationSNo = e["Text_DestinationAirportSNo"].ToString(),
                    //HdnFlightDestinationSNo = Convert.ToBoolean(e["IsCodeUsed"].ToString()),
                    //HdnFlightNumSNo = e["FlightNo"].ToString(),
                    //FlightNumSNo = e["FlightNo"].ToString(),
                    //FlightDate = e["FlightDate"].ToString()
                });

            }
            catch (Exception ex)// (Exception ex)
            {
                // do something for error
                DataSet dsError;
                System.Data.SqlClient.SqlParameter[] ParametersError = {
                                                                   new System.Data.SqlClient.SqlParameter("@ErrorMessage",ex.Message),
                                                                    new System.Data.SqlClient.SqlParameter("@ProcName","spSpotRate_GetSpotCode"),
                                                                    new System.Data.SqlClient.SqlParameter("@UserSNo", ((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).UserSNo.ToString())
                                                              };
                dsError = CargoFlash.SoftwareFactory.Data.SqlHelper.ExecuteDataset(CargoFlash.SoftwareFactory.Data.DMLConnectionString.WebConfigConnectionString, System.Data.CommandType.StoredProcedure, "ProcOfHandleErrors", ParametersError);
                throw ex;
            }
            return new KeyValuePair<string, List<SpotRate>>(ds.Tables[1].Rows[0][0].ToString(), CodeInfo.AsQueryable().ToList());
        }



        public SpotRate GetSpotRateRecord(string recordID, string UserID)
        {
            SpotRate Rate = new SpotRate();
            try
            {
                SqlParameter[] Parameters = { new SqlParameter("@SNo", Convert.ToInt32(recordID)) };
                SqlDataReader dr = SqlHelper.ExecuteReader(ReadConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, "spSpotRate_GetRecord", Parameters);
                if (dr.Read())
                {
                    Rate.SNo = Convert.ToInt32(dr["SNo"]);
                    Rate.HdnPageSNo = Convert.ToInt32(dr["SNo"]);
                    //SNo,AirlineSNo,Text_AirlineName,RateAdhocType,AWBType,AWBNo,OriginCitySNo,Text_OriginCitySNo,DestinationCitySNo,Text_DestinationCitySNo,OfficeSNo,Text_OfficeSNo,
                    //AccountSNo,Text_AccountSNo,ProductSNo,Text_ProductSNo,CommoditySNo,Text_CommoditySNo,Pieces,Text_SHCSNo,SHCSNo,ReferenceNo,ValidTill,WeightType,VolumeUnit,
                    //GrossWeight,PlusVarainceGrossPercentage,MinusVarainceGrossPercentage,Volume,PlusVarainceVolumePercentage,MinusVarainceVolumePercentage,ChargeableWeight,
                    Rate.RateAdhocType = Convert.ToInt32(dr["RateAdhocType"]);
                    Rate.Text_RateAdhocType = dr["Text_RateAdhocType"].ToString();
                    Rate.AirlineSNo = Convert.ToInt32(dr["AirlineSNo"]);
                    Rate.Text_AirlineSNo = dr["Text_AirlineName"].ToString();
                    Rate.AWBTypeSNo = Convert.ToInt32(dr["AWBType"]);
                    Rate.Text_AWBTypeSNo = dr["Text_AWBType"].ToString();
                    Rate.AWBcode = dr["AWBCode"].ToString();
                    Rate.AWBNo = dr["AWBNo"].ToString();
                    Rate.OriginCitySNo = dr["OriginCitySNo"].ToString();
                    Rate.Text_OriginCitySNo = dr["Text_OriginCitySNo"].ToString();
                    Rate.DestinationCitySNo = Convert.ToInt32(dr["DestinationCitySNo"]);
                    Rate.Text_DestinationCitySNo = dr["Text_DestinationCitySNo"].ToString();
                    Rate.OfficeSNo = Convert.ToInt32(dr["OfficeSNo"]);
                    Rate.Text_OfficeSNo = dr["Text_OfficeSNo"].ToString();
                    Rate.AccountSNo = Convert.ToInt32(dr["AccountSNo"]);
                    Rate.Text_AccountSNo = dr["Text_AccountSNo"].ToString();

                    Rate.IsAgentGroup = Convert.ToInt32(dr["IsAgentGroup"]);
                    Rate.AccountGroupSNo = dr["AccountGroupSNo"].ToString();
                    Rate.Text_AccountGroupSNo = dr["Text_AccountGroupSNo"].ToString();

                    Rate.ProductSNo = Convert.ToInt32(dr["ProductSNo"]);
                    Rate.Text_ProductSNo = dr["Text_ProductSNo"].ToString();
                    Rate.CommoditySNo = Convert.ToInt32(dr["CommoditySNo"]);
                    Rate.Text_CommoditySNo = dr["Text_CommoditySNo"].ToString();
                    Rate.SHCSNo = dr["SHCSNo"].ToString().TrimEnd(',');
                    Rate.Text_SHCSNo = dr["Text_SHCSNo"].ToString().TrimEnd(',');
                    Rate.Pieces = Convert.ToInt32(dr["Pieces"].ToString());
                    Rate.Reference = dr["ReferenceNo"].ToString();
                    Rate.ValidFrom = dr["ValidFrom"].ToString();
                    Rate.ValidFr = Convert.ToDateTime(dr["ValidFrom"].ToString());
                    Rate.ValidTill = dr["ValidTill"].ToString();
                    Rate.ValidTo = Convert.ToDateTime(dr["ValidTill"].ToString());
                    Rate.WeightType = Convert.ToInt32(dr["WeightType"]);
                    Rate.Text_WeightType = dr["Text_WeightType"].ToString();
                    Rate.Text_VolumeUnit = dr["Text_VolumeUnit"].ToString();
                    Rate.VolumeUnit = Convert.ToInt32(dr["VolumeUnit"]);
                    Rate.GrossWeight = Convert.ToDecimal(dr["GrossWeight"]);
                    Rate.PlusVarainceGrossPercentage = Convert.ToInt32(dr["PlusVarainceGrossPercentage"]);
                    Rate.MinusVarainceGrossPercentage = Convert.ToInt32(dr["MinusVarainceGrossPercentage"]);
                    Rate.Volume = Convert.ToDecimal(dr["Volume"]);
                    Rate.PlusVarainceVolumePercentage = Convert.ToInt32(dr["PlusVarainceVolumePercentage"]);
                    Rate.MinusVarainceVolumePercentage = Convert.ToInt32(dr["MinusVarainceVolumePercentage"]);
                    Rate.ChargeableWeight = Convert.ToDecimal(dr["ChargeableWeight"]);
                    Rate.SectorRate = Convert.ToDecimal(dr["SectorRate"]);
                    //SectorRate,RequestedRate,IsApproved,ApprovedRate,CurrencySNo,Text_CurrencySNo,IsActive,Active,Approved,Text_BasedOnSNo,BasedOnSNo,IsCommissionable,
                    //AllinRate,Text_AllinRate,Text_IsCommissionable,ApprovedUser,CreatedUser,UpdatedUser
                    Rate.RequestedRate = Convert.ToDecimal(dr["RequestedRate"]);
                    Rate.IsApproved = Convert.ToInt16(dr["IsApproved"]);
                    Rate.Text_IsApproved = dr["Approved"].ToString();
                    Rate.ApprovedRate = Convert.ToDecimal(dr["ApprovedRate"].ToString());
                    Rate.CurrencySNo = Convert.ToInt32(dr["CurrencySNo"]);
                    Rate.Text_CurrencySNo = dr["Text_CurrencySNo"].ToString();
                    Rate.IsActive = Convert.ToBoolean(dr["IsActive"]);
                    Rate.Active = dr["Active"].ToString();
                    Rate.BasedOnSNo = Convert.ToInt32(dr["BasedOnSNo"]);
                    Rate.Text_BasedOnSNo = dr["Text_BasedOnSNo"].ToString();
                    Rate.IsCommissionable = Convert.ToBoolean(dr["IsCommissionable"]);
                    Rate.Text_IsCommissionable = dr["Text_IsCommissionable"].ToString();
                    Rate.AllInRate = Convert.ToBoolean(dr["AllinRate"]);
                    Rate.Text_AllinRate = dr["Text_AllinRate"].ToString();
                    Rate.ApprovedUser = dr["ApprovedUser"].ToString();
                    Rate.CreatedUser = dr["CreatedUser"].ToString();
                    Rate.UpdatedUser = dr["UpdatedUser"].ToString();
                    Rate.CodeType = Convert.ToInt32(dr["CodeType"].ToString());

                    //Rate.CampaignType = dr["Text_CampaignType"].ToString();

                    Rate.HdnCampaignType = Convert.ToInt32(dr["CampaignType"].ToString());
                    //Rate.Text_CampaignType = dr["Text_CampaignType"].ToString();
                    Rate.Text_CodeType = dr["Text_CodeType"].ToString();
                    Rate.CodeNo = Convert.ToInt32(dr["NoofCompaignAgentTransaction"].ToString());
                    Rate.NoofTransaction = Convert.ToInt32(dr["NoofTransaction"].ToString());

                    Rate.HdnNoofCodes = Convert.ToInt32(dr["NoofCodes"].ToString());
                    Rate.HdnCodeType = Convert.ToInt32(dr["CodeType"].ToString());
                    Rate.IsFlatRate = Convert.ToBoolean(dr["IsFlatRate"].ToString());
                    Rate.IsWeiveDueCarrierCharges= Convert.ToBoolean(dr["IsWeiveDueCarrierCharges"].ToString());

                }
                dr.Close();
            }
            catch (Exception ex)// (Exception ex)
            {
                // do something for error
                DataSet dsError;
                System.Data.SqlClient.SqlParameter[] ParametersError = {
                                                                   new System.Data.SqlClient.SqlParameter("@ErrorMessage",ex.Message),
                                                                    new System.Data.SqlClient.SqlParameter("@ProcName","spSpotRate_GetRecord"),
                                                                    new System.Data.SqlClient.SqlParameter("@UserSNo", ((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).UserSNo.ToString())
                                                              };
                dsError = CargoFlash.SoftwareFactory.Data.SqlHelper.ExecuteDataset(CargoFlash.SoftwareFactory.Data.DMLConnectionString.WebConfigConnectionString, System.Data.CommandType.StoredProcedure, "ProcOfHandleErrors", ParametersError);
                throw ex;
            }
            return Rate;
        }

        public List<string> DeleteSpotRate(List<string> listID)
        {
            List<string> ErrorMessage = new List<string>();
            try
            {
                BaseBusiness baseBussiness = new BaseBusiness();
                if (listID.Count > 0)
                {
                    string RecordId = listID[0].ToString();
                    string UserId = listID[1].ToString();
                    SqlParameter[] Parameters = { new SqlParameter("@SNo", Convert.ToInt32(RecordId)), new SqlParameter("@UserID", Convert.ToInt32(UserId)) };
                    int ret = (int)SqlHelper.ExecuteScalar(DMLConnectionString.WebConfigConnectionString, "spSpotRate_DeleteDetails", Parameters);

                    if (ret > 0)
                    {
                        if (ret > 1000)
                        {
                            string serverErrorMessage = baseBussiness.ReadServerErrorMessages(ret, "SpotRate");
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
            catch (Exception ex)// (Exception ex)
            {
                // do something for error
                DataSet dsError;
                System.Data.SqlClient.SqlParameter[] ParametersError = {
                                                                   new System.Data.SqlClient.SqlParameter("@ErrorMessage",ex.Message),
                                                                    new System.Data.SqlClient.SqlParameter("@ProcName","spSpotRate_DeleteDetails"),
                                                                    new System.Data.SqlClient.SqlParameter("@UserSNo", ((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).UserSNo.ToString())
                                                              };
                dsError = CargoFlash.SoftwareFactory.Data.SqlHelper.ExecuteDataset(CargoFlash.SoftwareFactory.Data.DMLConnectionString.WebConfigConnectionString, System.Data.CommandType.StoredProcedure, "ProcOfHandleErrors", ParametersError);
                throw ex;
            }
            return ErrorMessage;
        }

        public List<string> DeleteUldTrans(string recordID)
        {
            int ret = 0;
            List<string> ErrorMessage = new List<string>();
            try
            {
                BaseBusiness baseBussiness = new BaseBusiness();
                SqlParameter[] Parameters = { new SqlParameter("@SNo", recordID) };
                ret = (int)SqlHelper.ExecuteScalar(DMLConnectionString.WebConfigConnectionString, "DeleteUldTrans", Parameters);
                if (ret > 0)
                {
                    if (ret > 1000)
                    {
                        string serverErrorMessage = baseBussiness.ReadServerErrorMessages(ret, "SpotRate");
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
            catch (Exception ex)// (Exception ex)
            {
                // do something for error
                DataSet dsError;
                System.Data.SqlClient.SqlParameter[] ParametersError = {
                                                                   new System.Data.SqlClient.SqlParameter("@ErrorMessage",ex.Message),
                                                                    new System.Data.SqlClient.SqlParameter("@ProcName","DeleteUldTrans"),
                                                                    new System.Data.SqlClient.SqlParameter("@UserSNo", ((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).UserSNo.ToString())
                                                              };
                dsError = CargoFlash.SoftwareFactory.Data.SqlHelper.ExecuteDataset(CargoFlash.SoftwareFactory.Data.DMLConnectionString.WebConfigConnectionString, System.Data.CommandType.StoredProcedure, "ProcOfHandleErrors", ParametersError);
                throw ex;
            }
            return ErrorMessage;
        }

        public List<string> DeleteFlightTrans(string recordID)
        {
            int ret = 0;
            List<string> ErrorMessage = new List<string>();
            try
            {
                BaseBusiness baseBussiness = new BaseBusiness();
                SqlParameter[] Parameters = { new SqlParameter("@SNo", recordID) };
                ret = (int)SqlHelper.ExecuteScalar(DMLConnectionString.WebConfigConnectionString, "DeleteFlightTrans", Parameters);
                if (ret > 0)
                {
                    if (ret > 1000)
                    {
                        string serverErrorMessage = baseBussiness.ReadServerErrorMessages(ret, "SpotRate");
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
            catch (Exception ex)// (Exception ex)
            {
                // do something for error
                DataSet dsError;
                System.Data.SqlClient.SqlParameter[] ParametersError = {
                                                                   new System.Data.SqlClient.SqlParameter("@ErrorMessage",ex.Message),
                                                                    new System.Data.SqlClient.SqlParameter("@ProcName","DeleteFlightTrans"),
                                                                    new System.Data.SqlClient.SqlParameter("@UserSNo", ((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).UserSNo.ToString())
                                                              };
                dsError = CargoFlash.SoftwareFactory.Data.SqlHelper.ExecuteDataset(CargoFlash.SoftwareFactory.Data.DMLConnectionString.WebConfigConnectionString, System.Data.CommandType.StoredProcedure, "ProcOfHandleErrors", ParametersError);
                throw ex;
            }
            return ErrorMessage;
        }


        public string ViewRate(SpotRate spotRate , int ULDRate , string ULDNo)
        {
            DataSet ds = new DataSet();
            DataSet DSTD = new DataSet();
            //DataView DV = (DataView)SqlDataSource1.Select(DataSourceSelectArguments.Empty);
            try
            {
                DateTime now = DateTime.Now;
                string date = now.GetDateTimeFormats('d')[0];
                if (spotRate.ValidFrom == null)
                {
                    spotRate.ValidFrom = DateTime.Now.ToString("yyyy-MM-dd");
                }
                SqlParameter[] Parameters = {
                                           new SqlParameter("@OriginCityCode", spotRate.Text_OriginCitySNo),
                                           new SqlParameter("@DestinationCityCode", spotRate.Text_DestinationCitySNo),
                                           new SqlParameter("@BFlightDate",spotRate.ValidFrom),
                                           new SqlParameter("@AWBSNo",""),
                                           new SqlParameter("@AWBNo",""),
                                           new SqlParameter("@REFCode",spotRate.Reference),
                                           new SqlParameter("@AWBRefSNo",""),
                                           new SqlParameter("@AirlineSNo",spotRate.AirlineSNo),
                                           new SqlParameter("@Pcs", spotRate.Pieces),
                                           new SqlParameter("@CWt", spotRate.ChargeableWeight),
                                           new SqlParameter("@GWt", spotRate.GrossWeight),
                                           new SqlParameter("@VWt", spotRate.Volume),
                                           new SqlParameter("@UnitSNo", spotRate.WeightType),
                                           new SqlParameter("@IsShipperBup",""),
                                           new SqlParameter("@ULDNO",ULDNo),
                                           new SqlParameter("@ProductSNo", spotRate.ProductSNo),
                                           new SqlParameter("@AccountSNo", spotRate.AccountSNo),
                                           new SqlParameter("@SHCs", spotRate.SHCSNo),
                                           new SqlParameter("@CommoditySNo",spotRate.CommoditySNo),
                                           new SqlParameter("@FlightNo", ""),
                                           new SqlParameter("@CurrencySNo", spotRate.CurrencySNo),
                                           new SqlParameter("@ShipperSNo", ""),
                                           new SqlParameter("@WeekDay", ""),
                                           new SqlParameter("@ETD", ""),
                                           new SqlParameter("@TransitStaionsSNo", ""),
                                           new SqlParameter("@RateProcessOn", ""),
                                           new SqlParameter("@OfficeSNo", spotRate.OfficeSNo),
                                           new SqlParameter("@AllotmentSNo", ""),
                                           new SqlParameter("@PaymentType", ""),
                                           new SqlParameter("@ErrorMessage", "") ,
                                           new SqlParameter("@ULDRate", ULDRate) ,
                                           new SqlParameter("@ISSpotRate", ULDRate) 
                                        };
                ds = SqlHelper.ExecuteDataset(ReadConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, "spRate_GetRateSearch", Parameters);
                //DataTable dt = ds.Tables[0];
                DataSet ds1 = (DataSet)ds;

                //DataTable dt = ds1.Tables[1];

                DataView dv = new DataView();
                dv.Table = ds1.Tables[0];
                ///


                DSTD.Tables.Add(dv.ToTable());
            }
            catch (Exception ex)// (Exception ex)
            {
                // do something for error
                DataSet dsError;
                System.Data.SqlClient.SqlParameter[] ParametersError = {
                                                                   new System.Data.SqlClient.SqlParameter("@ErrorMessage",ex.Message),
                                                                    new System.Data.SqlClient.SqlParameter("@ProcName","spRate_GetRateSearch"),
                                                                    new System.Data.SqlClient.SqlParameter("@UserSNo", ((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).UserSNo.ToString())
                                                              };
                dsError = CargoFlash.SoftwareFactory.Data.SqlHelper.ExecuteDataset(CargoFlash.SoftwareFactory.Data.DMLConnectionString.WebConfigConnectionString, System.Data.CommandType.StoredProcedure, "ProcOfHandleErrors", ParametersError);
                throw ex;
            }
            return DStoJSON(DSTD);
        }

        public string GetAWbForSpotRate(SpotRate spotRate)
        {

            DataSet DStd = new DataSet();
            //DataView DV = (DataView)SqlDataSource1.Select(DataSourceSelectArguments.Empty);
            DataSet ds = new DataSet();
            try
            {
                DateTime now = DateTime.Now;

                SqlParameter[] Parameters = {
                                           new SqlParameter("@AWbSno", 5)
                                        };
                ds = SqlHelper.ExecuteDataset(ReadConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, "spSpotRate_GetAWbForSpotRate", Parameters);
                //DataTable dt = ds.Tables[0];
                DataSet ds1 = (DataSet)ds;

                //DataTable dt = ds1.Tables[1];

                DataView dv = new DataView();
                dv.Table = ds1.Tables[0];
                ///
                DStd.Tables.Add(dv.ToTable());
            }
            catch (Exception ex)// (Exception ex)
            {
                // do something for error
                DataSet dsError;
                System.Data.SqlClient.SqlParameter[] ParametersError = {
                                                                   new System.Data.SqlClient.SqlParameter("@ErrorMessage",ex.Message),
                                                                    new System.Data.SqlClient.SqlParameter("@ProcName","spSpotRate_GetAWbForSpotRate"),
                                                                    new System.Data.SqlClient.SqlParameter("@UserSNo", ((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).UserSNo.ToString())
                                                              };
                dsError = CargoFlash.SoftwareFactory.Data.SqlHelper.ExecuteDataset(CargoFlash.SoftwareFactory.Data.DMLConnectionString.WebConfigConnectionString, System.Data.CommandType.StoredProcedure, "ProcOfHandleErrors", ParametersError);
                throw ex;
            }
            return DStoJSON(DStd);
        }
        public string GetGeneratedCode(SpotRate spotRate)
        {
            DataSet ds = new DataSet();
            DataSet DStd = new DataSet();
            try
            {
                DateTime now = DateTime.Now;

                SqlParameter[] Parameters = {
                                           new SqlParameter("@SNO", spotRate.HdnPageSNo),
                                             new SqlParameter("@IsSingleCompaignCode", spotRate.IsSingleCompaignCode)
                                        };
                ds = SqlHelper.ExecuteDataset(ReadConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, "spSpotRate_GetGeneratedCode", Parameters);

                DataSet ds1 = (DataSet)ds;
                DataView dv = new DataView();
                dv.Table = ds1.Tables[0];
                DStd.Tables.Add(dv.ToTable());
            }
            catch (Exception ex)// (Exception ex)
            {
                // do something for error
                DataSet dsError;
                System.Data.SqlClient.SqlParameter[] ParametersError = {
                                                                   new System.Data.SqlClient.SqlParameter("@ErrorMessage",ex.Message),
                                                                    new System.Data.SqlClient.SqlParameter("@ProcName","spSpotRate_GetGeneratedCode"),
                                                                    new System.Data.SqlClient.SqlParameter("@UserSNo", ((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).UserSNo.ToString())
                                                              };
                dsError = CargoFlash.SoftwareFactory.Data.SqlHelper.ExecuteDataset(CargoFlash.SoftwareFactory.Data.DMLConnectionString.WebConfigConnectionString, System.Data.CommandType.StoredProcedure, "ProcOfHandleErrors", ParametersError);
                throw ex;
            }
            return DStoJSON(DStd);



        }



        public string ViewGeneratedCode(SpotRate spotRate)
        {
            DataSet ds = new DataSet();
            try
            {
                DateTime now = DateTime.Now;

                SqlParameter[] Parameters = {
                                           new SqlParameter("@SNO", spotRate.SNo)
                                        };
                ds = SqlHelper.ExecuteDataset(ReadConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, "spSpotRate_ViewGeneratedCode", Parameters);
            }
            catch (Exception ex)// (Exception ex)
            {
                // do something for error
                DataSet dsError;
                System.Data.SqlClient.SqlParameter[] ParametersError = {
                                                                   new System.Data.SqlClient.SqlParameter("@ErrorMessage",ex.Message),
                                                                    new System.Data.SqlClient.SqlParameter("@ProcName","spSpotRate_ViewGeneratedCode"),
                                                                    new System.Data.SqlClient.SqlParameter("@UserSNo", ((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).UserSNo.ToString())
                                                              };
                dsError = CargoFlash.SoftwareFactory.Data.SqlHelper.ExecuteDataset(CargoFlash.SoftwareFactory.Data.DMLConnectionString.WebConfigConnectionString, System.Data.CommandType.StoredProcedure, "ProcOfHandleErrors", ParametersError);
                throw ex;
            }
            return CargoFlash.Cargo.Business.Common.CompleteDStoJSON(ds);

        }

        public string GetDestination(string CitySNo)
        {
            DataSet ds = new DataSet();
            try
            {
                SqlParameter[] Parameters = { new SqlParameter("@SNo", CitySNo) };
                ds = SqlHelper.ExecuteDataset(ReadConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, "spSpotRate_GetDestination", Parameters);
            }
            catch (Exception ex)// (Exception ex)
            {
                // do something for error
                DataSet dsError;
                System.Data.SqlClient.SqlParameter[] ParametersError = {
                                                                   new System.Data.SqlClient.SqlParameter("@ErrorMessage",ex.Message),
                                                                    new System.Data.SqlClient.SqlParameter("@ProcName","spSpotRate_GetDestination"),
                                                                    new System.Data.SqlClient.SqlParameter("@UserSNo", ((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).UserSNo.ToString())
                                                              };
                dsError = CargoFlash.SoftwareFactory.Data.SqlHelper.ExecuteDataset(CargoFlash.SoftwareFactory.Data.DMLConnectionString.WebConfigConnectionString, System.Data.CommandType.StoredProcedure, "ProcOfHandleErrors", ParametersError);
                throw ex;
            }
            return CargoFlash.Cargo.Business.Common.CompleteDStoJSON(ds);

        }
        public string BindProductOnAWBType(string AWBTypeName)
        {
            DataSet ds = new DataSet();
            try
            {
                SqlParameter[] Parameters = { new SqlParameter("@AWBTypeName", AWBTypeName) };
                ds = SqlHelper.ExecuteDataset(ReadConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, "spSpotRate_BindProductOnAWBType", Parameters);
            }
            catch (Exception ex)// (Exception ex)
            {
                // do something for error
                DataSet dsError;
                System.Data.SqlClient.SqlParameter[] ParametersError = {
                                                                   new System.Data.SqlClient.SqlParameter("@ErrorMessage",ex.Message),
                                                                    new System.Data.SqlClient.SqlParameter("@ProcName","spSpotRate_BindProductOnAWBType"),
                                                                    new System.Data.SqlClient.SqlParameter("@UserSNo", ((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).UserSNo.ToString())
                                                              };
                dsError = CargoFlash.SoftwareFactory.Data.SqlHelper.ExecuteDataset(CargoFlash.SoftwareFactory.Data.DMLConnectionString.WebConfigConnectionString, System.Data.CommandType.StoredProcedure, "ProcOfHandleErrors", ParametersError);
                throw ex;
            }
            return CargoFlash.Cargo.Business.Common.CompleteDStoJSON(ds);

        }

        //public string DeleteSpotRate(int SNo)
        //{
        //    DataSet ds = new DataSet();
        //    SqlParameter[] Parameters = { new SqlParameter("@SNo", SNo) };
        //    ds = SqlHelper.ExecuteDataset(ReadConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, "spSpotRate_DeleteSpotRate", Parameters);
        //    return CargoFlash.Cargo.Business.Common.CompleteDStoJSON(ds);

        //}


        public string DeleteSpotRateRequest(string SNo)
        {
            DataSet ds = new DataSet();
            try
            {
                SqlParameter[] Parameters = { new SqlParameter("@SNo", SNo) };
                ds = SqlHelper.ExecuteDataset(ReadConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, "spSpotRate_DeleteSpotRate", Parameters);
            }
            catch (Exception ex)// (Exception ex)
            {
                // do something for error
                DataSet dsError;
                System.Data.SqlClient.SqlParameter[] ParametersError = {
                                                                   new System.Data.SqlClient.SqlParameter("@ErrorMessage",ex.Message),
                                                                    new System.Data.SqlClient.SqlParameter("@ProcName","spSpotRate_DeleteSpotRate"),
                                                                    new System.Data.SqlClient.SqlParameter("@UserSNo", ((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).UserSNo.ToString())
                                                              };
                dsError = CargoFlash.SoftwareFactory.Data.SqlHelper.ExecuteDataset(CargoFlash.SoftwareFactory.Data.DMLConnectionString.WebConfigConnectionString, System.Data.CommandType.StoredProcedure, "ProcOfHandleErrors", ParametersError);
                throw ex;
            }
            return CargoFlash.Cargo.Business.Common.CompleteDStoJSON(ds);

        }

        public string InActiveSpotRate(int id)
        {
            DataSet ds = new DataSet();
            try
            {
                DateTime now = DateTime.Now;

                SqlParameter[] Parameters = {
                                           new SqlParameter("@SNO", id),
                                            new System.Data.SqlClient.SqlParameter("@UserSNo", ((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).UserSNo.ToString())
                                        };
                ds = SqlHelper.ExecuteDataset(ReadConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, "spSpotRate_InActiveSpotRate", Parameters);
            }
            catch (Exception ex)// (Exception ex)
            {
                // do something for error
                DataSet dsError;
                System.Data.SqlClient.SqlParameter[] ParametersError = {
                                                                   new System.Data.SqlClient.SqlParameter("@ErrorMessage",ex.Message),
                                                                    new System.Data.SqlClient.SqlParameter("@ProcName","spSpotRate_InActiveSpotRate"),
                                                                    new System.Data.SqlClient.SqlParameter("@UserSNo", ((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).UserSNo.ToString())
                                                              };
                dsError = CargoFlash.SoftwareFactory.Data.SqlHelper.ExecuteDataset(CargoFlash.SoftwareFactory.Data.DMLConnectionString.WebConfigConnectionString, System.Data.CommandType.StoredProcedure, "ProcOfHandleErrors", ParametersError);
                throw ex;
            }
            return CargoFlash.Cargo.Business.Common.CompleteDStoJSON(ds);

        }
    }
}
