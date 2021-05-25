using System;
using System.Collections.Generic;
using System.Configuration;
using System.Data;
using System.Data.SqlClient;
using System.Globalization;
using System.IO;
using System.Linq;
using System.ServiceModel;
using System.ServiceModel.Activation;
using System.ServiceModel.Web;
using System.Text;
using System.Web;
using CargoFlash.Cargo.Business;
using CargoFlash.Cargo.DataService.Schedule;
using CargoFlash.SoftwareFactory.Data;
using CargoFlash.SoftwareFactory.WebUI;
using CargoFlash.SoftwareFactory.WebUI.Controls;
using Newtonsoft.Json;
using CargoFlash.Cargo.Model.ULD;
using System.Net;


namespace CargoFlash.Cargo.DataService.ULD
{
    [GlobalErrorHandlerBehaviour(typeof(GlobalErrorHandler))]   [ServiceBehavior(IncludeExceptionDetailInFaults = true)]
    [AspNetCompatibilityRequirements(RequirementsMode = AspNetCompatibilityRequirementsMode.Allowed)]
    public class UldChargeService : BaseWebUISecureObject, IUldChargeService
    {
        public ULD_Charge GetULDChargeRecord(int recordID, string UserSNo)
        {
            try
            {
            BaseBusiness baseBusiness = new BaseBusiness();
            List<string> ErrorMessage = new List<string>();
            ULD_Charge ULD_Charge = new ULD_Charge();
           
                SqlParameter[] Parameters = { new SqlParameter("@SNo", recordID), new SqlParameter("@UserID", UserSNo) };
                DataSet ds = SqlHelper.ExecuteDataset(ReadConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, "getdataByRecordID", Parameters);
                if (ds.Tables[0].Rows.Count > 0)
                {

                    ULD_Charge.SNo = Convert.ToInt32(ds.Tables[0].Rows[0]["SNo"]);


                    ULD_Charge.ULDType = ds.Tables[0].Rows[0]["ULDTypeSNo"].ToString();

                    ULD_Charge.Text_ULDType = ds.Tables[0].Rows[0]["ULDName"].ToString();

                    ULD_Charge.SDate = ds.Tables[0].Rows[0]["EffectiveDate"].ToString();

                    ULD_Charge.Text_SDate = ds.Tables[0].Rows[0]["EffectiveDate"].ToString();

                    ULD_Charge.AgentName = Convert.ToInt32(ds.Tables[0].Rows[0]["AgentName"]);

                    ULD_Charge.Text_AgentName = ds.Tables[0].Rows[0]["Text_AgentName"].ToString();

                    ULD_Charge.Owner = Convert.ToInt32(ds.Tables[0].Rows[0]["Owner"]);

                    ULD_Charge.Text_Owner = ds.Tables[0].Rows[0]["Text_Owner"].ToString();

                    ULD_Charge.TarriffTo = Convert.ToInt32(ds.Tables[0].Rows[0]["TarriffTo"]);

                    ULD_Charge.Text_TarriffTo = ds.Tables[0].Rows[0]["Text_TarriffTo"].ToString();

                    ULD_Charge.AirlineName = Convert.ToInt32(ds.Tables[0].Rows[0]["AirlineNameSno"]);

                    ULD_Charge.Text_AirlineName = ds.Tables[0].Rows[0]["AirlineName"].ToString();

                    ULD_Charge.Currency = Convert.ToInt32(ds.Tables[0].Rows[0]["CurrencySNo"]);

                    ULD_Charge.Text_Currency = ds.Tables[0].Rows[0]["CurrencyCode"].ToString();

                    if (ds.Tables[0].Rows[0]["FreeType"].ToString().ToUpper() == "DAYS")
                    {
                        ULD_Charge.FreeType = 0;
                    }
                    else
                    {
                        ULD_Charge.FreeType = 1;
                    }
                    ULD_Charge.Text_FreeType = ds.Tables[0].Rows[0]["FreeType"].ToString();

                    ULD_Charge.FreePeriod = Convert.ToInt32(ds.Tables[0].Rows[0]["FreePeriodsDays"]);

                    ULD_Charge.DemurrageCharge = Convert.ToDecimal(ds.Tables[0].Rows[0]["DemrageFees"]);

                    ULD_Charge.NonReturnDays = Convert.ToInt32(ds.Tables[0].Rows[0]["NoReturnDays"]);

                    ULD_Charge.NoReturnValues = Convert.ToInt32(ds.Tables[0].Rows[0]["NoReturnValues"]);

                    ULD_Charge.TAX = Convert.ToInt32(ds.Tables[0].Rows[0]["TAX"]);

                    ULD_Charge.IsActive = Convert.ToBoolean(ds.Tables[0].Rows[0]["IsActive"]);

                    ULD_Charge.Active = ds.Tables[0].Rows[0]["Active"].ToString();

                    ULD_Charge.CreatedBy = ds.Tables[0].Rows[0]["CreatedUser"].ToString();

                    ULD_Charge.UpdatedBy = ds.Tables[0].Rows[0]["UpdatedUser"].ToString();

                    ULD_Charge.Text_country = ds.Tables[0].Rows[0]["Text_country"].ToString();

                    ULD_Charge.country = ds.Tables[0].Rows[0]["country"].ToString();

                    ULD_Charge.Text_City = ds.Tables[0].Rows[0]["Text_City"].ToString();

                    ULD_Charge.City = ds.Tables[0].Rows[0]["City"].ToString();

                    ULD_Charge.endDate = ds.Tables[0].Rows[0]["endDate"].ToString();
                    ULD_Charge.Text_endDate = ds.Tables[0].Rows[0]["endDate"].ToString();

                    ULD_Charge.ULDCharge = "ULD Charge";
                    ULD_Charge.Owner1 = "";
                }
            return ULD_Charge;
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
            string filters = GridFilter.ProcessFilters<ULDCharges>(filter);
            SqlParameter[] Parameters = { new SqlParameter("@PageNo", page), new SqlParameter("@PageSize", pageSize), new SqlParameter("@WhereCondition", filters), new SqlParameter("@OrderBy", sorts) };
            DataSet ds = SqlHelper.ExecuteDataset(ReadConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, "GetListULDcharge", Parameters);
                var ChargesList = ds.Tables[0].AsEnumerable().Select(e => new ULDCharges
                    {
                        SNo = Convert.ToInt32(e["SNo"]),
                        AgentName = Convert.ToString(e["AgentName"]),
                        AirlineName = Convert.ToString(e["AirlineName"]),
                        CountryName = Convert.ToString(e["CountryName"]),
                        currencycode = Convert.ToString(e["currencycode"]),
                        uldname = Convert.ToString(e["uldname"]),
                        FreeType = Convert.ToString(e["FreeType"]),
                        FreePeriodsDays = Convert.ToInt32(e["FreePeriodsDays"]),
                        ReferenceNo = Convert.ToString(e["ReferenceNo"]),
                        Active = Convert.ToString(e["Active"]),
                    });
                ds.Dispose();
                return new DataSourceResult
                {
                    Data = ChargesList.AsQueryable().ToList(),
                    Total = Convert.ToInt32(ds.Tables[1].Rows[0][0].ToString())
                };
             }
            catch(Exception ex)//
            {
                throw ex;
            }
        }
        public List<string> SaveULDCharge(List<ULD_Charge> ULDCharge)
        {
            try
            {
            List<string> ErrorMessage = new List<string>();
            DataTable dtCreateULDCharge = CollectionHelper.ConvertTo(ULDCharge, "Active,Owner1,Text_country,Text_City,Text_AgentName,Text_endDate,Text_SDate,Text_ULDType,Text_Owner,Text_FreeType,Text_AirlineName,Text_Currency,Text_TarriffTo,Text_DemurrageCharge,Text_NonReturnValue,TAX1,ULDCharge");
            BaseBusiness baseBusiness = new BaseBusiness();

            if (!baseBusiness.ValidateBaseBusiness("ULDCharge", dtCreateULDCharge, "SAVE"))
            {
                ErrorMessage = baseBusiness.ErrorMessage;
                return ErrorMessage;
            }
            
                SqlParameter param = new SqlParameter();
                param.ParameterName = "@UldChargeDetail";
                param.SqlDbType = System.Data.SqlDbType.Structured;
                param.Value = dtCreateULDCharge;
                SqlParameter[] Parameters = { param };

                int ret = (int)SqlHelper.ExecuteScalar(DMLConnectionString.WebConfigConnectionString, "spUldChargesSavedetails", Parameters);
                if (ret > 0)
                {
                    if (ret > 1000)
                    {
                        //For Customised Validation Messages like 'Record Already Exists' etc
                        string serverErrorMessage = baseBusiness.ReadServerErrorMessages(ret, "ULDCharge");
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
        public List<string> UpdateULDCharge(List<ULD_Charge> ULDCharge)
        {
            try
            {
            List<string> ErrorMessage = new List<string>();
            DataTable dtCreateULDCharge = CollectionHelper.ConvertTo(ULDCharge, "Active,Owner1,Text_country,Text_City,Text_AgentName,Text_endDate,Text_SDate,Text_ULDType,Text_Owner,Text_FreeType,Text_AirlineName,Text_Currency,Text_TarriffTo,Text_DemurrageCharge,Text_NonReturnValue,TAX1,ULDCharge");
            BaseBusiness baseBusiness = new BaseBusiness();

            if (!baseBusiness.ValidateBaseBusiness("ULDCharge", dtCreateULDCharge, "UPDATE"))
            {
                ErrorMessage = baseBusiness.ErrorMessage;
                return ErrorMessage;
            }
            
                SqlParameter param = new SqlParameter();
                param.ParameterName = "@UldChargeDetail";
                param.SqlDbType = System.Data.SqlDbType.Structured;
                param.Value = dtCreateULDCharge;
                SqlParameter[] Parameters = { param };

                int ret = (int)SqlHelper.ExecuteScalar(DMLConnectionString.WebConfigConnectionString, "SpUpdateUldCharge", Parameters);
                if (ret > 0)
                {
                    if (ret > 1000)
                    {
                        //For Customised Validation Messages like 'Record Already Exists' etc
                        string serverErrorMessage = baseBusiness.ReadServerErrorMessages(ret, "ULDCharge");
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
        public List<string> DeleteULDCharge(List<string> listID)
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

                    int ret = (int)SqlHelper.ExecuteScalar(DMLConnectionString.WebConfigConnectionString, "SpDeleteULDCharges", Parameters);
                    if (ret > 0)
                    {
                        if (ret > 1000)
                        {
                            //For Customised Validation Messages like 'Record Already Exists' etc
                            string serverErrorMessage = baseBusiness.ReadServerErrorMessages(ret, "ULDCharge");
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
