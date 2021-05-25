using System;
using System.Collections.Generic;
using System.Linq;
using System.Runtime.Serialization;
using System.ServiceModel;
using System.Text;
using CargoFlash.Cargo.Model.Rate;
using CargoFlash.SoftwareFactory.Data;
using CargoFlash.Cargo.Business;
using System.Data;
using System.Data.SqlClient;
using System.ServiceModel.Activation;
using System.ServiceModel.Web;
using System.Configuration;
using System.Net;

namespace CargoFlash.Cargo.DataService.Rate
{
    // NOTE: You can use the "Rename" command on the "Refactor" menu to change the class name "TaxRateService" in both code and config file together.
    [GlobalErrorHandlerBehaviour(typeof(GlobalErrorHandler))]   [ServiceBehavior(IncludeExceptionDetailInFaults = true)]
    [AspNetCompatibilityRequirements(RequirementsMode = AspNetCompatibilityRequirementsMode.Allowed)]
    public class TaxRateService : SignatureAuthenticate, ITaxRateService
    {
        CargoFlash.Cargo.Business.BaseBusiness basebusiness = new CargoFlash.Cargo.Business.BaseBusiness();
     

        //public string GetTaxAppliedOn()
        //{
        //    DataSet ds = SqlHelper.ExecuteDataset(ReadConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, "GetTaxAppliedOn");
        //    return CargoFlash.Cargo.Business.Common.CompleteDStoJSON(ds);
        //}

        public string GetAirlineCurrency(int AirlineSNo)
        {
            try
            { 
            SqlParameter[] Parameters = { new SqlParameter("@AirlineSNo", AirlineSNo) };
            DataSet ds = SqlHelper.ExecuteDataset(DMLConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, "Tax_spAirlineCurrency", Parameters);
            return CargoFlash.Cargo.Business.Common.CompleteDStoJSON(ds);
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
                string filters = GridFilter.ProcessFilters<TaxRateGrid>(filter);

                SqlParameter[] Parameters = { new SqlParameter("@PageNo", page), new SqlParameter("@PageSize", pageSize), new SqlParameter("@WhereCondition", filters), new SqlParameter("@OrderBy", sorts),
                new SqlParameter("@UserSNo",Convert.ToString(((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).UserSNo))};
                DataSet ds = SqlHelper.ExecuteDataset(DMLConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, "TaxRate_GetTaxRateListService", Parameters);
                var TaxRateList = ds.Tables[0].AsEnumerable().Select(e => new TaxRateGrid
                {
                    SNo = Convert.ToInt32(e["SNo"]),
                    Airline = e["Airline"].ToString().ToUpper(),
                    EndDate = e["EndDate"].ToString().ToUpper(),
                    StartDate = e["StartDate"].ToString().ToUpper(),
                    Status = e["Status"].ToString().ToUpper(),
                    // TaxDefination = e["TaxDefination"].ToString().ToUpper(),
                    OriginLevel = e["OriginLevel"].ToString().ToUpper(),
                    DestinationLevel = e["DestinationLevel"].ToString().ToUpper(),
                    TaxType = e["TaxType"].ToString().ToUpper(),
                    Createduser = e["Createduser"].ToString().ToUpper(),
                    UpdatedUser = e["UpdatedUser"].ToString().ToUpper(),
                    ReferenceNo = e["ReferenceNo"].ToString().ToUpper(),
                    TaxCode = e["TaxCode"].ToString().ToUpper(),
                    TaxAppliedOn = e["TaxAppliedOn"].ToString().ToUpper(),
                });

                ds.Dispose();
                return new DataSourceResult
                {
                    Data = TaxRateList.AsQueryable().ToList(),
                    Total = Convert.ToInt32(ds.Tables[1].Rows[0][0].ToString())
                };
            }
            catch(Exception ex)//
            {
                throw ex;
            }
        }



        ReadTaxRateDetails ITaxRateService.GetTaxRateRecord(string recordID, string UserID)
        {
            try
            { 
            ReadTaxRateDetails TaxRate = new ReadTaxRateDetails();
            SqlParameter[] Parameters = { new SqlParameter("@SNo", Convert.ToInt32(recordID)) };
            SqlDataReader dr = SqlHelper.ExecuteReader(DMLConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, "TaxRate_GetTaxRateRecord", Parameters);
            if (dr.Read())
            {
                TaxRate.SNo = Convert.ToInt32(dr["SNo"]);
                TaxRate.AirlineCode = Convert.ToInt32(dr["AirlineCode"]);
                TaxRate.Text_AirlineCode = dr["Text_AirlineCode"].ToString();
                TaxRate.TaxCode = dr["TaxCode"].ToString();
                TaxRate.TaxName = dr["TaxName"].ToString();
                //TaxRate.TaxDefinition = Convert.ToInt32(dr["TaxDefinition"]);
                //TaxRate.Text_TaxDefinition = Convert.ToString(dr["Text_TaxDefinition"]);
                TaxRate.OriginLevel = Convert.ToInt32(dr["OriginLevel"]);
                TaxRate.Text_OriginLevel = dr["Text_OriginLevel"].ToString();
                TaxRate.DestinationLevel = Convert.ToInt32(dr["DestinationLevel"]);
                TaxRate.Text_DestinationLevel = dr["Text_DestinationLevel"].ToString();
                TaxRate.OriginSNo = Convert.ToInt32(dr["OriginSNo"].ToString());
                TaxRate.Text_OriginSNo = dr["Text_OriginSNo"].ToString();
                TaxRate.DestinationSNo = Convert.ToInt32(dr["DestinationSNo"].ToString());
                TaxRate.Text_DestinationSNo = dr["Text_DestinationSNo"].ToString();
                TaxRate.REFNo = dr["REFNo"].ToString();
                TaxRate.CurrencySNo = Convert.ToInt32(dr["CurrencySNo"].ToString());
                TaxRate.Text_CurrencySNo = dr["Text_CurrencySNo"].ToString();
                TaxRate.Status = Convert.ToInt32(dr["Status"].ToString());
                TaxRate.Text_Status = dr["Text_Status"].ToString();
                TaxRate.Minimum = Convert.ToInt32(dr["Minimum"].ToString());
                TaxRate.StartDate = DateTime.SpecifyKind(Convert.ToDateTime(dr["StartDate"]), DateTimeKind.Utc);
                TaxRate.EndDate = DateTime.SpecifyKind(Convert.ToDateTime(dr["EndDate"]), DateTimeKind.Utc);
                TaxRate.Tax = Convert.ToInt32(dr["Tax"].ToString());
                TaxRate.TaxType = Convert.ToInt32(dr["TaxType"].ToString());
                TaxRate.Text_TaxType = dr["Text_TaxType"].ToString();
                TaxRate.AppliedAt = dr["AppliedAt"].ToString();
                TaxRate.TaxAppliedOn = dr["TaxAppliedOn"].ToString();
                TaxRate.Text_TaxAppliedOn = dr["Text_TaxAppliedOn"].ToString();
                TaxRate.Type = dr["Type"].ToString();
                TaxRate.Text_Type = dr["Text_Type"].ToString();
                TaxRate.ApplicableTaxAmount = Convert.ToDecimal(dr["ApplicableTaxAmount"].ToString());
                TaxRate.TaxExpiryEmailID = (dr["TaxExpiryEmailID"].ToString());
                TaxRate.Createduser = (dr["CreatedUser"].ToString());
                TaxRate.UpdatedUser = (dr["UpdatedUser"].ToString());
            }
           
            dr.Close();




            return TaxRate;
             }
            catch(Exception ex)//
            {
                throw ex;
            }

        }

       

        public KeyValuePair<string, List<TaxRateRemarks>> GetRemarks(string recordID, int page, int pageSize, string whereCondition, string sort)
        {
            try
            {
                whereCondition = "TaxRateSNo=" + recordID;

                SqlParameter[] Parameters = { new SqlParameter("@PageNo", page), new SqlParameter("@PageSize", pageSize), new SqlParameter("@WhereCondition", whereCondition), new SqlParameter("@OrderBy", sort), new SqlParameter("@TaxRateSNo", recordID) };
                DataSet ds = SqlHelper.ExecuteDataset(DMLConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, "TaxRate_GetRemarks", Parameters);
                var RateSlabList = ds.Tables[0].AsEnumerable().Select(e => new TaxRateRemarks
                {
                    SNo = Convert.ToInt32(e["SNo"]),
                    // RateSNo = Convert.ToInt32(e["RateSNo"].ToString()),
                    Remarks = e["Remarks"].ToString(),
                });
                return new KeyValuePair<string, List<TaxRateRemarks>>(ds.Tables[1].Rows[0][0].ToString(), RateSlabList.AsQueryable().ToList());
            }
            catch(Exception ex)//
            {
                throw ex;
            }
        }

        public string GetTaxRateParameter(int TaxRateSNo)
        {
            try
            {
                SqlParameter[] Parameters = { new SqlParameter("@SNo", TaxRateSNo) };
                DataSet ds = SqlHelper.ExecuteDataset(DMLConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, "TaxRate_GetTaxRateParameter", Parameters);
                ds.Dispose();
                return CargoFlash.Cargo.Business.Common.CompleteDStoJSON(ds);
            }
            catch(Exception ex)//
            {
                throw ex;
            }
        }
        public string GetTaxAppliedOnEdit(int TaxRateSNo)
        {
            try
            {
                SqlParameter[] Parameters = { new SqlParameter("@SNo", TaxRateSNo) };
                DataSet ds = SqlHelper.ExecuteDataset(DMLConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, "TaxRate_GetTaxApplicableOn", Parameters);
                ds.Dispose();
                return CargoFlash.Cargo.Business.Common.CompleteDStoJSON(ds);
            }
            catch(Exception ex)//
           {
               throw ex;
           }
        }

        public string SaveTaxRateDetais(int TaxRateSNo, string Action, SaveTaxRateDetails TaxRateDetails, List<TaxRateRemarks> TaxRateRemarks, TaxRateOriginCity TaxRateOriginCity, TaxRateOriginCountry TaxRateOriginCountry, TaxRateDestinationCity TaxRateDestinationCity, TaxRateDestinationCountry TaxRateDestinationCountry, TaxRateProduct TaxRateProduct, TaxRateCommodity TaxRateCommodity, TaxRateAgent TaxRateAgent, TaxRateAgentShipper TaxRateAgentShipper, TaxRateOtherChargeCode TaxRateOtherChargeCode, TaxRateIssueCarrier TaxRateIssueCarrier, TaxRateFlightNo TaxRateFlightNo)//, )//, TaxRateCommodity TaxRateCommodity,   )
        {
            string Result = "";
            //return null;
            try
            {
              
            List<SaveTaxRateDetails> lstTaxRateDetails = new List<SaveTaxRateDetails>();
            lstTaxRateDetails.Add(TaxRateDetails);

            List<TaxRateOriginCountry> lstTaxRateOriginCountry = new List<TaxRateOriginCountry>();
            lstTaxRateOriginCountry.Add(TaxRateOriginCountry);

            List<TaxRateDestinationCountry> lstTaxRateDestinationCountry = new List<TaxRateDestinationCountry>();
            lstTaxRateDestinationCountry.Add(TaxRateDestinationCountry);

            List<TaxRateOriginCity> lstTaxRateOriginCity = new List<TaxRateOriginCity>();
            lstTaxRateOriginCity.Add(TaxRateOriginCity);

            List<TaxRateDestinationCity> lstTaxRateDestinationCity = new List<TaxRateDestinationCity>();
            lstTaxRateDestinationCity.Add(TaxRateDestinationCity);

            List<TaxRateProduct> lstTaxRateProduct = new List<TaxRateProduct>();
            lstTaxRateProduct.Add(TaxRateProduct);

            List<TaxRateCommodity> lstTaxRateCommodity = new List<TaxRateCommodity>();
            lstTaxRateCommodity.Add(TaxRateCommodity);

            List<TaxRateAgent> lstTaxRateAgent = new List<Model.Rate.TaxRateAgent>();
            lstTaxRateAgent.Add(TaxRateAgent);

            List<TaxRateAgentShipper> lstTaxRateAgentShipper = new List<Model.Rate.TaxRateAgentShipper>();
            lstTaxRateAgentShipper.Add(TaxRateAgentShipper);

            List<TaxRateOtherChargeCode> lstTaxRateOtherChargeCode = new List<Model.Rate.TaxRateOtherChargeCode>();
            lstTaxRateOtherChargeCode.Add(TaxRateOtherChargeCode);

            List<TaxRateIssueCarrier> lstTaxRateIssueCarrier = new List<TaxRateIssueCarrier>();
            lstTaxRateIssueCarrier.Add(TaxRateIssueCarrier);

            List<TaxRateFlightNo> lstTaxRateFlightNo = new List<TaxRateFlightNo>();
            lstTaxRateFlightNo.Add(TaxRateFlightNo);

            //List<RateParam> lstRateParam = new List<RateParam>();
            //lstRateParam.Add(RateParamList);

            DataTable dtTaxRateDetails = CollectionHelper.ConvertTo(lstTaxRateDetails, "");
            DataTable dtTaxRateRemarks = CollectionHelper.ConvertTo(TaxRateRemarks, "");
            DataTable dtTaxRateOriginCountry = CollectionHelper.ConvertTo(lstTaxRateOriginCountry, "");
            DataTable dtTaxRateDestinationCountry = CollectionHelper.ConvertTo(lstTaxRateDestinationCountry, "");
            DataTable dtTaxRateOriginCity = CollectionHelper.ConvertTo(lstTaxRateOriginCity, "");
            DataTable dtTaxRateDestinationCity = CollectionHelper.ConvertTo(lstTaxRateDestinationCity, "");
            DataTable dtTaxRateProduct = CollectionHelper.ConvertTo(lstTaxRateProduct, "");
            DataTable dtTaxRateCommodity = CollectionHelper.ConvertTo(lstTaxRateCommodity, "");
            DataTable dtTaxRateAgent = CollectionHelper.ConvertTo(lstTaxRateAgent, "");
            DataTable dtTaxRateAgentShipper = CollectionHelper.ConvertTo(lstTaxRateAgentShipper, "");
            DataTable dtTaxRateOtherChargeCode = CollectionHelper.ConvertTo(lstTaxRateOtherChargeCode, "");
            DataTable dtTaxRateIssueCarrier = CollectionHelper.ConvertTo(lstTaxRateIssueCarrier, "");
            DataTable dtTaxRateFlightNo = CollectionHelper.ConvertTo(lstTaxRateFlightNo, "");


            BaseBusiness baseBusiness = new BaseBusiness();
            SqlParameter paramTaxRateDetails = new SqlParameter();
            paramTaxRateDetails.ParameterName = "@TaxRateDetails";
            paramTaxRateDetails.SqlDbType = System.Data.SqlDbType.Structured;
            paramTaxRateDetails.Value = dtTaxRateDetails;

            SqlParameter paramTaxRateRemarks = new SqlParameter();
            paramTaxRateRemarks.ParameterName = "@TaxRateRemarks";
            paramTaxRateRemarks.SqlDbType = System.Data.SqlDbType.Structured;
            paramTaxRateRemarks.Value = dtTaxRateRemarks;

            SqlParameter paramTaxRateOriginCity = new SqlParameter();
            paramTaxRateOriginCity.ParameterName = "@TaxRateCity";
            paramTaxRateOriginCity.SqlDbType = System.Data.SqlDbType.Structured;
            paramTaxRateOriginCity.Value = dtTaxRateOriginCity;

            SqlParameter paramTaxRateDestinationCity = new SqlParameter();
            paramTaxRateDestinationCity.ParameterName = "@TaxDestinationCity";
            paramTaxRateDestinationCity.SqlDbType = System.Data.SqlDbType.Structured;
            paramTaxRateDestinationCity.Value = dtTaxRateDestinationCity;

            SqlParameter paramTaxRateOriginCountry = new SqlParameter();
            paramTaxRateOriginCountry.ParameterName = "@TaxRateCountry";
            paramTaxRateOriginCountry.SqlDbType = System.Data.SqlDbType.Structured;
            paramTaxRateOriginCountry.Value = dtTaxRateOriginCountry;

            SqlParameter paramTaxRateDestinationCountry = new SqlParameter();
            paramTaxRateDestinationCountry.ParameterName = "@TaxRateDestinationCountry";
            paramTaxRateDestinationCountry.SqlDbType = System.Data.SqlDbType.Structured;
            paramTaxRateDestinationCountry.Value = dtTaxRateDestinationCountry;

            SqlParameter paramTaxRateAgent = new SqlParameter();
            paramTaxRateAgent.ParameterName = "@TaxRateAgent";
            paramTaxRateAgent.SqlDbType = System.Data.SqlDbType.Structured;
            paramTaxRateAgent.Value = dtTaxRateAgent;

            SqlParameter paramTaxRateAgentShipper = new SqlParameter();
            paramTaxRateAgentShipper.ParameterName = "@TaxRateAgentShipper";
            paramTaxRateAgentShipper.SqlDbType = System.Data.SqlDbType.Structured;
            paramTaxRateAgentShipper.Value = dtTaxRateAgentShipper;

            SqlParameter paramTaxRateProduct = new SqlParameter();
            paramTaxRateProduct.ParameterName = "@TaxRateProduct";
            paramTaxRateProduct.SqlDbType = System.Data.SqlDbType.Structured;
            paramTaxRateProduct.Value = dtTaxRateProduct;

            SqlParameter paramTaxRateCommodity = new SqlParameter();
            paramTaxRateCommodity.ParameterName = "@TaxRateCommodity";
            paramTaxRateCommodity.SqlDbType = System.Data.SqlDbType.Structured;
            paramTaxRateCommodity.Value = dtTaxRateCommodity;

            SqlParameter paramTaxRateOtherChargeCode = new SqlParameter();
            paramTaxRateOtherChargeCode.ParameterName = "@TaxRateOtherChargeCode";
            paramTaxRateOtherChargeCode.SqlDbType = System.Data.SqlDbType.Structured;
            paramTaxRateOtherChargeCode.Value = dtTaxRateOtherChargeCode;

            SqlParameter paramTaxRateIssueCarrier = new SqlParameter();
            paramTaxRateIssueCarrier.ParameterName = "@TaxRateIssueCarrier";
            paramTaxRateIssueCarrier.SqlDbType = System.Data.SqlDbType.Structured;
            paramTaxRateIssueCarrier.Value = dtTaxRateIssueCarrier;


            SqlParameter paramTaxRateFlightNo = new SqlParameter();
            paramTaxRateFlightNo.ParameterName = "@TaxRateFlightNo";
            paramTaxRateFlightNo.SqlDbType = System.Data.SqlDbType.Structured;
            paramTaxRateFlightNo.Value = dtTaxRateFlightNo;

            SqlParameter[] Parameters = {                                     
                                            new SqlParameter("@TaxRateSNo", TaxRateSNo),      
                                             new SqlParameter("@PerformAction", Action)  ,
                                           paramTaxRateDetails,
                                           paramTaxRateRemarks,
                                           paramTaxRateOriginCity,
                                           paramTaxRateOriginCountry,
                                           paramTaxRateDestinationCity,
                                           paramTaxRateDestinationCountry,
                                           paramTaxRateProduct,
                                           paramTaxRateCommodity,
                                           paramTaxRateAgent,
                                           paramTaxRateAgentShipper,
                                           paramTaxRateOtherChargeCode,
                                           paramTaxRateIssueCarrier,
                                           paramTaxRateFlightNo,
                                          new SqlParameter("@CreatedBy", ((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).UserSNo.ToString()),
                                           new SqlParameter("@UpdatedBy", ((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).UserSNo.ToString()), 
                                        };

            
             DataSet ds = SqlHelper.ExecuteDataset(DMLConnectionString.WebConfigConnectionString, "TaxRate_SplitDate_SaveTaxRateDetails", Parameters);
                return CargoFlash.Cargo.Business.Common.CompleteDStoJSON(ds);
               
            }
            catch(Exception ex)//
            {
                throw ex;
            }
            return Result;
        }

        public string UpdateTaxRateDetais(int TaxRateSNo, string Action, SaveTaxRateDetails TaxRateDetails, List<TaxRateRemarks> TaxRateRemarks, TaxRateOriginCity TaxRateOriginCity, TaxRateOriginCountry TaxRateOriginCountry, TaxRateDestinationCity TaxRateDestinationCity, TaxRateDestinationCountry TaxRateDestinationCountry, TaxRateProduct TaxRateProduct, TaxRateCommodity TaxRateCommodity, TaxRateAgent TaxRateAgent, TaxRateAgentShipper TaxRateAgentShipper, TaxRateOtherChargeCode TaxRateOtherChargeCode, TaxRateIssueCarrier TaxRateIssueCarrier, TaxRateFlightNo TaxRateFlightNo, string ErrorMSG)
        {
            string Result = "";
            //return null;
            try
            {
            List<SaveTaxRateDetails> lstTaxRateDetails = new List<SaveTaxRateDetails>();
            lstTaxRateDetails.Add(TaxRateDetails);

            List<TaxRateOriginCountry> lstTaxRateOriginCountry = new List<TaxRateOriginCountry>();
            lstTaxRateOriginCountry.Add(TaxRateOriginCountry);

            List<TaxRateDestinationCountry> lstTaxRateDestinationCountry = new List<TaxRateDestinationCountry>();
            lstTaxRateDestinationCountry.Add(TaxRateDestinationCountry);

            List<TaxRateOriginCity> lstTaxRateOriginCity = new List<TaxRateOriginCity>();
            lstTaxRateOriginCity.Add(TaxRateOriginCity);

            List<TaxRateDestinationCity> lstTaxRateDestinationCity = new List<TaxRateDestinationCity>();
            lstTaxRateDestinationCity.Add(TaxRateDestinationCity);

            List<TaxRateProduct> lstTaxRateProduct = new List<TaxRateProduct>();
            lstTaxRateProduct.Add(TaxRateProduct);

            List<TaxRateCommodity> lstTaxRateCommodity = new List<TaxRateCommodity>();
            lstTaxRateCommodity.Add(TaxRateCommodity);

            List<TaxRateAgent> lstTaxRateAgent = new List<Model.Rate.TaxRateAgent>();
            lstTaxRateAgent.Add(TaxRateAgent);

            List<TaxRateAgentShipper> lstTaxRateAgentShipper = new List<Model.Rate.TaxRateAgentShipper>();
            lstTaxRateAgentShipper.Add(TaxRateAgentShipper);

            List<TaxRateOtherChargeCode> lstTaxRateOtherChargeCode = new List<Model.Rate.TaxRateOtherChargeCode>();
            lstTaxRateOtherChargeCode.Add(TaxRateOtherChargeCode);

            List<TaxRateIssueCarrier> lstTaxRateIssueCarrier = new List<TaxRateIssueCarrier>();
            lstTaxRateIssueCarrier.Add(TaxRateIssueCarrier);

            List<TaxRateFlightNo> lstTaxRateFlightNo = new List<TaxRateFlightNo>();
            lstTaxRateFlightNo.Add(TaxRateFlightNo);
           
            DataTable dtTaxRateDetails = CollectionHelper.ConvertTo(lstTaxRateDetails, "");
            DataTable dtTaxRateRemarks = CollectionHelper.ConvertTo(TaxRateRemarks, "");
            DataTable dtTaxRateOriginCountry = CollectionHelper.ConvertTo(lstTaxRateOriginCountry, "");
            DataTable dtTaxRateDestinationCountry = CollectionHelper.ConvertTo(lstTaxRateDestinationCountry, "");
            DataTable dtTaxRateOriginCity = CollectionHelper.ConvertTo(lstTaxRateOriginCity, "");
            DataTable dtTaxRateDestinationCity = CollectionHelper.ConvertTo(lstTaxRateDestinationCity, "");
            DataTable dtTaxRateProduct = CollectionHelper.ConvertTo(lstTaxRateProduct, "");
            DataTable dtTaxRateCommodity = CollectionHelper.ConvertTo(lstTaxRateCommodity, "");
            DataTable dtTaxRateAgent = CollectionHelper.ConvertTo(lstTaxRateAgent, "");
            DataTable dtTaxRateAgentShipper = CollectionHelper.ConvertTo(lstTaxRateAgentShipper, "");
            DataTable dtTaxRateOtherChargeCode = CollectionHelper.ConvertTo(lstTaxRateOtherChargeCode, "");
            DataTable dtTaxRateIssueCarrier = CollectionHelper.ConvertTo(lstTaxRateIssueCarrier, "");
            DataTable dtTaxRateFlightNo = CollectionHelper.ConvertTo(lstTaxRateFlightNo, "");

            BaseBusiness baseBusiness = new BaseBusiness();
            SqlParameter paramTaxRateDetails = new SqlParameter();
            paramTaxRateDetails.ParameterName = "@TaxRateDetails";
            paramTaxRateDetails.SqlDbType = System.Data.SqlDbType.Structured;
            paramTaxRateDetails.Value = dtTaxRateDetails;

            SqlParameter paramTaxRateRemarks = new SqlParameter();
            paramTaxRateRemarks.ParameterName = "@TaxRateRemarks";
            paramTaxRateRemarks.SqlDbType = System.Data.SqlDbType.Structured;
            paramTaxRateRemarks.Value = dtTaxRateRemarks;

            SqlParameter paramTaxRateOriginCity = new SqlParameter();
            paramTaxRateOriginCity.ParameterName = "@TaxRateCity";
            paramTaxRateOriginCity.SqlDbType = System.Data.SqlDbType.Structured;
            paramTaxRateOriginCity.Value = dtTaxRateOriginCity;

            SqlParameter paramTaxRateDestinationCity = new SqlParameter();
            paramTaxRateDestinationCity.ParameterName = "@TaxDestinationCity";
            paramTaxRateDestinationCity.SqlDbType = System.Data.SqlDbType.Structured;
            paramTaxRateDestinationCity.Value = dtTaxRateDestinationCity;

            SqlParameter paramTaxRateOriginCountry = new SqlParameter();
            paramTaxRateOriginCountry.ParameterName = "@TaxRateCountry";
            paramTaxRateOriginCountry.SqlDbType = System.Data.SqlDbType.Structured;
            paramTaxRateOriginCountry.Value = dtTaxRateOriginCountry;

            SqlParameter paramTaxRateDestinationCountry = new SqlParameter();
            paramTaxRateDestinationCountry.ParameterName = "@TaxRateDestinationCountry";
            paramTaxRateDestinationCountry.SqlDbType = System.Data.SqlDbType.Structured;
            paramTaxRateDestinationCountry.Value = dtTaxRateDestinationCountry;

            SqlParameter paramTaxRateAgent = new SqlParameter();
            paramTaxRateAgent.ParameterName = "@TaxRateAgent";
            paramTaxRateAgent.SqlDbType = System.Data.SqlDbType.Structured;
            paramTaxRateAgent.Value = dtTaxRateAgent;

            SqlParameter paramTaxRateAgentShipper = new SqlParameter();
            paramTaxRateAgentShipper.ParameterName = "@TaxRateAgentShipper";
            paramTaxRateAgentShipper.SqlDbType = System.Data.SqlDbType.Structured;
            paramTaxRateAgentShipper.Value = dtTaxRateAgentShipper;

            SqlParameter paramTaxRateProduct = new SqlParameter();
            paramTaxRateProduct.ParameterName = "@TaxRateProduct";
            paramTaxRateProduct.SqlDbType = System.Data.SqlDbType.Structured;
            paramTaxRateProduct.Value = dtTaxRateProduct;

            SqlParameter paramTaxRateCommodity = new SqlParameter();
            paramTaxRateCommodity.ParameterName = "@TaxRateCommodity";
            paramTaxRateCommodity.SqlDbType = System.Data.SqlDbType.Structured;
            paramTaxRateCommodity.Value = dtTaxRateCommodity;

            SqlParameter paramTaxRateOtherChargeCode = new SqlParameter();
            paramTaxRateOtherChargeCode.ParameterName = "@TaxRateOtherChargeCode";
            paramTaxRateOtherChargeCode.SqlDbType = System.Data.SqlDbType.Structured;
            paramTaxRateOtherChargeCode.Value = dtTaxRateOtherChargeCode;

            SqlParameter paramTaxRateIssueCarrier = new SqlParameter();
            paramTaxRateIssueCarrier.ParameterName = "@TaxRateIssueCarrier";
            paramTaxRateIssueCarrier.SqlDbType = System.Data.SqlDbType.Structured;
            paramTaxRateIssueCarrier.Value = dtTaxRateIssueCarrier;

            SqlParameter paramTaxRateFlightNo = new SqlParameter();
            paramTaxRateFlightNo.ParameterName = "@TaxRateFlightNo";
            paramTaxRateFlightNo.SqlDbType = System.Data.SqlDbType.Structured;
            paramTaxRateFlightNo.Value = dtTaxRateFlightNo;

            SqlParameter[] Parameters = {                                     
                                            new SqlParameter("@TaxRateSNo", TaxRateSNo),      
                                            new SqlParameter("@PerformAction", Action)  ,
                                           paramTaxRateDetails,
                                           paramTaxRateRemarks,
                                           paramTaxRateOriginCity,
                                           paramTaxRateOriginCountry,
                                           paramTaxRateDestinationCity,
                                           paramTaxRateDestinationCountry,
                                           paramTaxRateProduct,
                                           paramTaxRateCommodity,
                                           paramTaxRateAgent,
                                           paramTaxRateAgentShipper,
                                           paramTaxRateOtherChargeCode,
                                           paramTaxRateIssueCarrier,
                                           paramTaxRateFlightNo,
                                           new SqlParameter("@CreatedBy", ((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).UserSNo.ToString()),
                                           new SqlParameter("@UpdatedBy", ((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).UserSNo.ToString()), 
                                           new SqlParameter("@ErrorMSg", ErrorMSG),
                                        };


           
                DataSet ds = SqlHelper.ExecuteDataset(DMLConnectionString.WebConfigConnectionString, "TaxRate_UpdateTaxRateDetails", Parameters);
                return CargoFlash.Cargo.Business.Common.CompleteDStoJSON(ds);
               
            }
            catch(Exception ex)//
            {
                throw ex;
            }
            return Result;
        }

        public string GetCountrySNo(int CitySNo)
        {
            try
            {
                SqlParameter[] Parameters = { new SqlParameter("@CitySNo", CitySNo) };
                DataSet ds = SqlHelper.ExecuteDataset(DMLConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, "usp_GetCountrySNo", Parameters);
                ds.Dispose();
                return CargoFlash.Cargo.Business.Common.CompleteDStoJSON(ds);
            }
            catch(Exception ex)//
            {
                throw ex;
            }
        }
    }

    
}


   