using System;
using System.Collections.Generic;
using System.Linq;
using System.ServiceModel;
using System.ServiceModel.Activation;
using System.Text;
using CargoFlash.SoftwareFactory.Data;
using System.Data;
using System.Data.SqlClient;
using System.Configuration;
using CargoFlash.Cargo.Model.Shipment;
using CargoFlash.SoftwareFactory.WebUI.Controls;
using CargoFlash.SoftwareFactory.WebUI;
using System.ServiceModel.Web;
using System.IO;
using CargoFlash.SoftwareFactory.WebUI.Adapters;

using CargoFlash.Cargo.Business;
using Newtonsoft.Json;



using CargoFlash.Cargo.Model;

namespace CargoFlash.Cargo.DataService.Shipment
{
    [GlobalErrorHandlerBehaviour(typeof(GlobalErrorHandler))]
    [ServiceBehavior(IncludeExceptionDetailInFaults = true)]
    [AspNetCompatibilityRequirements(RequirementsMode = AspNetCompatibilityRequirementsMode.Allowed)]


    public class MarineInsuranceService : BaseWebUISecureObject, IMarineInsuranceService
    {
        public DataSourceResult GetGridData(int skip, int take, int page, int pageSize, List<GridSort> sort, GridFilter filter)
        {
            try
            {
                string sorts = GridSort.ProcessSorting(sort);
                string filters = GridFilter.ProcessFilters<MarineInsuranceGridData>(filter);
                SqlParameter[] Parameters = { new SqlParameter("@PageNo", page), new SqlParameter("@PageSize", pageSize), new SqlParameter("@WhereCondition", filters), new SqlParameter("@OrderBy", sorts) };
                DataSet ds = SqlHelper.ExecuteDataset(ReadConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, "GetListMarineInsurance", Parameters);
                var TaxRateList = ds.Tables[0].AsEnumerable().Select(e => new MarineInsuranceGridData
                {
                    SNo = Convert.ToInt32(e["SNo"]),
                    Commodity = Convert.ToString(e["Commodity"]).ToUpper(),
                    InsuranceCategory = Convert.ToString(e["InsuranceCategory"]).ToUpper(),
                    InsuranceBasedOn = Convert.ToString(e["InsuranceBasedOn"]).ToUpper(),
                    InsuranceValue = Convert.ToDecimal(e["InsuranceValue"]),
                    Airline = Convert.ToString(e["Airline"]).ToUpper(),
                    ValidFrom = Convert.ToString(e["ValidFrom"]).ToUpper(),
                    ValidTo = Convert.ToString(e["ValidTo"]).ToUpper(),

                    Active = Convert.ToString(e["Active"]).ToUpper(),
                    Createdby = Convert.ToString(e["Createdby"]).ToUpper(),



                });

                ds.Dispose();
                return new DataSourceResult
                {
                    Data = TaxRateList.AsQueryable().ToList(),
                    Total = Convert.ToInt32(ds.Tables[1].Rows[0][0].ToString())
                };
            }
            catch (Exception ex)//(Exception ex)
            {
                throw ex;
            }
        }

        public List<Tuple<string, int>> createUpdateMarineInsuranceSlab(string strData)
        {
            try
            {
                BaseBusiness baseBussiness = new BaseBusiness();
                List<Tuple<string, int>> ErrorMessage = new List<Tuple<string, int>>();
                int ret = 0;
                DataTable dt = (DataTable)JsonConvert.DeserializeObject(CargoFlash.Cargo.Business.Common.Base64ToString(strData), (typeof(DataTable)));
                if (dt.Rows.Count > 0)
                {

                    DataTable dtCreateMarineInsurance = new DataTable();
                    dtCreateMarineInsurance.Columns.Add("SNo");
                    dtCreateMarineInsurance.Columns.Add("CommoditySno");
                    dtCreateMarineInsurance.Columns.Add("InsuranceCategorySno");
                    dtCreateMarineInsurance.Columns.Add("InsuranceBasedOn");
                    dtCreateMarineInsurance.Columns.Add("InsuranceValue");
                    dtCreateMarineInsurance.Columns.Add("AirlineSno");
                    dtCreateMarineInsurance.Columns.Add("ValidFrom");
                    dtCreateMarineInsurance.Columns.Add("ValidTo");
                    dtCreateMarineInsurance.Columns.Add("IsActive");
                    dtCreateMarineInsurance.Columns.Add("CurrencySno");
                    foreach (DataRow dr in dt.Rows)
                    {
                        DataRow drRow = dtCreateMarineInsurance.NewRow();
                        drRow["SNo"] = dr["SNo"].ToString() == "" ? Convert.ToInt32("0") : Convert.ToInt32(dr["SNo"].ToString());
                        drRow["CommoditySno"] = Convert.ToInt32(dr["HdnCommoditySno"].ToString());
                        drRow["InsuranceCategorySno"] = Convert.ToInt32("1");
                        drRow["InsuranceBasedOn"] = Convert.ToInt32(dr["HdnInsuranceBasedOn"].ToString());
                        drRow["InsuranceValue"] = Convert.ToDecimal(dr["InsuranceValue"].ToString());
                        drRow["AirlineSno"] = Convert.ToInt32(dr["AirlineSno"].ToString());
                        drRow["ValidFrom"] = (dr["ValidFrom"].ToString());
                        drRow["ValidTo"] = dr["ValidTo"].ToString();
                        drRow["IsActive"] = dr["Active"].ToString();
                        drRow["CurrencySno"] = dr["HdnCurrencyCode"].ToString();
                        dtCreateMarineInsurance.Rows.Add(drRow);
                    }
                    string UserSNo = ((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).UserSNo.ToString();
                    SqlParameter[] param = {
                                            
                                            new SqlParameter("@MarineInsuranceTable",dtCreateMarineInsurance),
                                            new SqlParameter("@UserSno",UserSNo),
                                        };
                    ret = (int)SqlHelper.ExecuteScalar(DMLConnectionString.WebConfigConnectionString, "CreateMarineInsurance", param);
                }
                if (ret >= 0)
                {
                    if (ret > 1000)
                    {
                        string serverErrorMessage = baseBussiness.ReadServerErrorMessages(ret, "MarineInsurance");
                        if (!string.IsNullOrEmpty(serverErrorMessage))
                            ErrorMessage.Add(new Tuple<string, int>(serverErrorMessage, 0));
                    }
                    else
                    {
                        //For DataBase Exceptions like 'Foreign Key refrence Errors' etc
                        string dataBaseExceptionMessage = baseBussiness.ReadServerErrorMessages(ret, baseBussiness.DatabaseExceptionFileName);
                        if (dataBaseExceptionMessage == "Related Information Not Found.")
                        {
                            dataBaseExceptionMessage = "Record Updated Successfully";
                            if (!string.IsNullOrEmpty(dataBaseExceptionMessage))
                                ErrorMessage.Add(new Tuple<string, int>(dataBaseExceptionMessage, 1));
                        }
                        else
                        {
                            if (!string.IsNullOrEmpty(dataBaseExceptionMessage))
                                ErrorMessage.Add(new Tuple<string, int>(dataBaseExceptionMessage, 1));
                        }
                    }
                }


                return ErrorMessage;
            }
            catch (Exception ex)//(Exception ex)
            {
                throw ex;
            }
        }

        public KeyValuePair<string, List<MarineInsuranceRecord>> GetMarineInsuranceResponseRecord(string recordID, int pageNo, int pageSize, string whereCondition, MarineInsuranceResponseRequest model, string sort)
        {
            try
            {

                SqlParameter[] Parameters = {
                                           //new SqlParameter("@IrregularitySNo", recordID),
                                           new SqlParameter("@AirlineSNo", model.Airline),
                                           new SqlParameter("@PageNo", pageNo), 
                                           new SqlParameter("@PageSize", pageSize),
                                           new SqlParameter("@WhereCondition", ""),
                                           new SqlParameter("@OrderBy", sort),
                                           new SqlParameter("@UserID", ((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).UserSNo.ToString()),
                                           new SqlParameter("@SNo", model.SNo)
                                        };
                DataSet ds = SqlHelper.ExecuteDataset(DMLConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, "GetMarineInsuranceRecord", Parameters);

                if (ds.Tables[0].Rows.Count != 0)
                {

                    var MarineResponseList = ds.Tables[0].AsEnumerable().Select(e => new MarineInsuranceRecord
                    {
                        SNo = Convert.ToInt32(e["SNo"]),
                        CommoditySno = e["CommoditySno"].ToString(),
                        HdnCommoditySno = Convert.ToInt32(e["HdnCommoditySno"].ToString()),
                        InsuranceCategorySno = e["InsuranceCategorySno"].ToString(),
                        HdnInsuranceBasedOn = Convert.ToInt32(e["HdnInsuranceBasedOn"].ToString()),
                        InsuranceBasedOn = e["InsuranceBasedOn"].ToString(),//Convert.ToInt32(
                        InsuranceValue = Convert.ToDecimal(e["InsuranceValue"].ToString()),
                        AirlineSno = e["AirlineSno"].ToString(),
                        HdnAirlineSno = Convert.ToInt32(e["HdnAirlineSno"].ToString()),
                        ValidFrom = e["ValidFrom"].ToString(),
                        ValidTo = e["ValidTo"].ToString(),
                        Active = e["Active"].ToString(),
                        IsActive = e["IsActive"].ToString(),
                        HdnCurrencyCode = Convert.ToInt32(e["HdnCurrencyCode"].ToString()),
                        CurrencyCode = (e["CurrencyCode"].ToString()),
                        //Station = e["Station"].ToString(),

                    });
                    return new KeyValuePair<string, List<MarineInsuranceRecord>>(ds.Tables[0].Rows[0][0].ToString(), MarineResponseList.AsQueryable().ToList());
                }
                var abc = ds.Tables[0].AsEnumerable().Select(e => new MarineInsuranceRecord
                {
                    SNo = Convert.ToInt32(e["SNo"])
                });
                return new KeyValuePair<string, List<MarineInsuranceRecord>>(ds.Tables[0].ToString(), abc.AsQueryable().ToList());
            }
            catch (Exception ex)//(Exception ex)
            {
                throw ex;
            }
        }

        public string GetMarineInsuranceRecord(string SNo)
        {
            DataSet ds = new DataSet();
            try
            {
                SqlParameter[] Parameters = {
                                            new SqlParameter("@AirlineSno",SNo)
                                        };
                ds = SqlHelper.ExecuteDataset(DMLConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, "sp_GetMarineInsuranceRecord", Parameters);
            }
            catch (Exception ex)// (Exception ex)
            {
                // do something for error
                DataSet dsError;
                System.Data.SqlClient.SqlParameter[] ParametersError = {
                                                                   new System.Data.SqlClient.SqlParameter("@ErrorMessage",ex.Message),
                                                                    new System.Data.SqlClient.SqlParameter("@ProcName","sp_GetMarineInsuranceRecord"),
                                                                    new System.Data.SqlClient.SqlParameter("@UserSNo", ((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).UserSNo.ToString())
                                                              };
                dsError = CargoFlash.SoftwareFactory.Data.SqlHelper.ExecuteDataset(CargoFlash.SoftwareFactory.Data.DMLConnectionString.WebConfigConnectionString, System.Data.CommandType.StoredProcedure, "ProcOfHandleErrors", ParametersError);
                throw ex;
            }
            return CargoFlash.Cargo.Business.Common.CompleteDStoJSON(ds);
        }
    }
}
