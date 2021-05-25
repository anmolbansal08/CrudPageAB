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
using CargoFlash.Cargo.Model.Master;
using CargoFlash.SoftwareFactory.Data;
using CargoFlash.Cargo.Business;
using Newtonsoft.Json;
using System.Net;

namespace CargoFlash.Cargo.DataService.Master
{
    [GlobalErrorHandlerBehaviour(typeof(GlobalErrorHandler))]   [ServiceBehavior(IncludeExceptionDetailInFaults = true)]
    [AspNetCompatibilityRequirements(RequirementsMode = AspNetCompatibilityRequirementsMode.Allowed)]
    public class PenaltyParametersService : SignatureAuthenticate, IPenaltyParametersService
    {
        public DataSourceResult GetGridData(int skip, int take, int page, int pageSize, List<GridSort> sort, GridFilter filter)
        {
            try
            {
                string sorts = GridSort.ProcessSorting(sort);
                string filters = GridFilter.ProcessFilters<PenaltyParametersGrid>(filter);
                SqlParameter[] Parameters = { new SqlParameter("@PageNo", page), new SqlParameter("@PageSize", pageSize), 
                new SqlParameter("@WhereCondition", filters), new SqlParameter("@OrderBy", sorts),
                new SqlParameter("@UserSNo",Convert.ToString(((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).UserSNo))};
                DataSet ds = SqlHelper.ExecuteDataset(ReadConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, "GetListPenaltyParameters", Parameters);
                var PenaltyParametersList = ds.Tables[0].AsEnumerable().Select(e => new PenaltyParametersGrid
                {
                    SNo = Convert.ToInt32(e["SNo"]),
                    PenaltyType = Convert.ToString(e["PenaltyType"]).ToUpper(),
                    AirlineSNo = Convert.ToString(e["AirlineSNo"]).ToUpper(),
                    //  CountrySNo = Convert.ToString(e["CountrySNo"]),
                    ProductSNo = Convert.ToString(e["ProductSNo"]).ToUpper(),
                    Text_CitySNo = Convert.ToString(e["Text_CitySNo"]).ToUpper(),
                    Text_CountrySNo = Convert.ToString(e["Text_CountrySNo"]).ToUpper(),
                    Text_IsInternational = Convert.ToString(e["Text_IsInternational"]).ToUpper(),
                    MinimumCharge = Convert.ToString(e["MinimumCharge"]),
                    CreatedBy = Convert.ToString(e["CreatedBy"]),
                    UpdatedBy = Convert.ToString(e["UpdatedBy"]),
                    RefNo = Convert.ToString(e["RefNo"]),
                    Active = e["Active"].ToString().ToUpper(),
                    ValidFrom = DateTime.SpecifyKind(Convert.ToDateTime(e["ValidFrom"]), DateTimeKind.Utc),
                    ValidTo = DateTime.SpecifyKind(Convert.ToDateTime(e["ValidTo"]), DateTimeKind.Utc),
                    BasedOn= e["BasedOn"].ToString().ToUpper()
                });
                ds.Dispose();
                return new DataSourceResult
                {
                    Data = PenaltyParametersList.AsQueryable().ToList(),
                    Total = Convert.ToInt32(ds.Tables[1].Rows[0][0].ToString()),
                    FilterCondition = filters,
                    SortCondition = sorts,
                    StoredProcedure = "GetListPenaltyParameters"
                };
            }
            catch(Exception ex)//
            {
                throw ex;
            }

        }



        public List<string> SavePenaltyParameters(List<PenaltyParameters> PenaltyParameters)
        {
            //validate Business Rule
            List<string> ErrorMessage = new List<string>();
            try
            {
                DataTable dtCreatePenaltyParameters = CollectionHelper.ConvertTo(PenaltyParameters, "Text_PenaltyType,Text_AirlineSNo,Text_ProductSNo,Text_IsExceludeSHC,Text_SHCSNo,Text_IsExcludeAgent,Text_AccountSNo,PenaltyParametersSlab,Text_IsInternational,Text_LocationBasis,Text_LocationBasisSNo,Text_AppliedOn,Text_CitySNo,Text_CountrySNo,Text_ValidTo,Text_ValidFrom,IsActive,Text_CurrencySNo,Text_Commodity,Text_OtherAirlineSNo,RefNo");
                                                                                                                                                                                                                                                                                                                                                                                              
                DataTable dtCreatePenaltyParametersSlab = CollectionHelper.ConvertTo(PenaltyParameters[0].PenaltyParametersSlab, "BasedOn,ChargeBasis,AppliedOn");
                BaseBusiness baseBusiness = new BaseBusiness();

                if (!baseBusiness.ValidateBaseBusiness("PenaltyParameters", dtCreatePenaltyParameters, "SAVE"))
                {
                    ErrorMessage = baseBusiness.ErrorMessage;
                    return ErrorMessage;
                }
                SqlParameter param = new SqlParameter();
                param.ParameterName = "@PenaltyParametersTable";
                param.SqlDbType = System.Data.SqlDbType.Structured;
                param.Value = dtCreatePenaltyParameters;

                SqlParameter param1 = new SqlParameter();
                param1.ParameterName = "@PenaltyParametersSlabTable";
                param1.SqlDbType = System.Data.SqlDbType.Structured;
                param1.Value = dtCreatePenaltyParametersSlab;

                SqlParameter[] Parameters = { param, param1 };
                int ret = (int)SqlHelper.ExecuteScalar(DMLConnectionString.WebConfigConnectionString, "CreatePenaltyParameters", Parameters);
                if (ret > 0)
                {
                    if (ret > 1000)
                    {
                        //For Customised Validation Messages like 'Record Already Exists' etc
                        string serverErrorMessage = baseBusiness.ReadServerErrorMessages(ret, "PenaltyParameters");
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



        public PenaltyParameters GetPenaltyParametersRecord(string recordID, string UserID)
        {
            SqlDataReader dr = null;
            try
            {
                PenaltyParameters penaltyParameters = new PenaltyParameters();
                SqlParameter[] Parameters = { new SqlParameter("@SNo", Convert.ToInt32(recordID)),
                                          new SqlParameter("@UserID",  Convert.ToInt32(UserID))};

                dr = SqlHelper.ExecuteReader(ReadConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, "dbo.GetRecordPenaltyParameters", Parameters);

                if (dr.Read())
                {
                    penaltyParameters.SNo = Convert.ToInt32(recordID);
                    penaltyParameters.PenaltyType = Convert.ToInt32(dr["PenaltyType"]);
                    penaltyParameters.Text_PenaltyType = Convert.ToString(dr["Text_PenaltyType"]);
                    penaltyParameters.IsInternational = Convert.ToInt32(dr["IsInternational"]);
                    penaltyParameters.Text_IsInternational = Convert.ToString(dr["Text_IsInternational"]);
                    penaltyParameters.AirlineSNo =Convert.ToInt32( dr["AirlineSNo"]);
                    penaltyParameters.Text_AirlineSNo = Convert.ToString(dr["Text_AirlineSNo"]);
                    penaltyParameters.ProductSNo = Convert.ToInt32(dr["ProductSNo"]);
                    penaltyParameters.Text_ProductSNo = Convert.ToString(dr["Text_ProductSNo"]);
                    penaltyParameters.SHCSNo = Convert.ToString(dr["SHCSNo"]);
                    penaltyParameters.Text_SHCSNo = Convert.ToString(dr["Text_SHCSNo"]);
                    penaltyParameters.AccountSNo = Convert.ToString(dr["AccountSNo"]);
                    penaltyParameters.MinimumCharge = Convert.ToInt32(dr["MinimumCharge"]);
                    penaltyParameters.TaxOnPenalty = Convert.ToInt32(dr["TaxOnPenalty"] == null ? 0 : dr["TaxOnPenalty"]);
                    penaltyParameters.CitySNo = Convert.ToInt32(dr["CitySNo"]);
                    penaltyParameters.CountrySNo = Convert.ToInt32(dr["CountrySNo"]);
                    penaltyParameters.Text_CitySNo = Convert.ToString(dr["Text_CitySNo"]);
                    penaltyParameters.Text_CountrySNo = Convert.ToString(dr["Text_CountrySNo"]);
                    penaltyParameters.Text_AccountSNo = Convert.ToString(dr["Text_AccountSNo"]);
                    penaltyParameters.CreatedUser = dr["CreatedUser"].ToString();
                    penaltyParameters.UpdatedUser = dr["UpdatedUser"].ToString();
                    penaltyParameters.ValidFrom = DateTime.Parse(dr["ValidFrom"].ToString());
                    penaltyParameters.ValidTo = DateTime.Parse(dr["ValidTo"].ToString());
                    if (!String.IsNullOrEmpty(dr["IsActive"].ToString()))
                    {
                        penaltyParameters.IsActive = Convert.ToBoolean(dr["IsActive"]);
                    }
                    penaltyParameters.Active = dr["Active"].ToString().ToUpper();
                }
                penaltyParameters.Commodity = Convert.ToString(dr["Commodity"]);
                penaltyParameters.Text_Commodity = Convert.ToString(dr["Text_Commodity"]);
                penaltyParameters.Text_CurrencySNo = Convert.ToString(dr["Text_Currency"]);
                penaltyParameters.CurrencySNo = Convert.ToInt32(dr["Currency"]);
                penaltyParameters.OtherAirlineSNo= Convert.ToString(dr["OtherAirlineSNo"]);
                penaltyParameters.Text_OtherAirlineSNo = Convert.ToString(dr["Text_OtherAirlineSNo"]);
                penaltyParameters.RefNo = Convert.ToString(dr["RefNo"]);
                dr.Close();
                return penaltyParameters;
            }
            catch(Exception ex)//
            {
                dr.Close();
                throw ex;
            }
        }



        public List<string> UpdatePenaltyParameters(List<PenaltyParameters> PenaltyParameters)
        {
            try
            {
                //validate Business Rule
                List<string> ErrorMessage = new List<string>();
                DataTable dtCreatePenaltyParameters = CollectionHelper.ConvertTo(PenaltyParameters, "Text_PenaltyType,Text_AirlineSNo,Text_ProductSNo,Text_IsExceludeSHC,Text_SHCSNo,Text_IsExcludeAgent,Text_AccountSNo,PenaltyParametersSlab,Text_IsInternational,Text_LocationBasis,Text_LocationBasisSNo,Text_AppliedOn,Text_CitySNo,Text_CountrySNo,Text_ValidTo,Text_ValidFrom,Active,Text_CurrencySNo,Text_Commodity,Text_OtherAirlineSNo,RefNo");

                DataTable dtCreatePenaltyParametersSlab = CollectionHelper.ConvertTo(PenaltyParameters[0].PenaltyParametersSlab, "BasedOn,ChargeBasis,AppliedOn");
                BaseBusiness baseBusiness = new BaseBusiness();

                if (!baseBusiness.ValidateBaseBusiness("PenaltyParameters", dtCreatePenaltyParameters, "UPDATE"))
                {
                    ErrorMessage = baseBusiness.ErrorMessage;
                    return ErrorMessage;
                }
                SqlParameter param = new SqlParameter();
                param.ParameterName = "@PenaltyParametersTable";
                param.SqlDbType = System.Data.SqlDbType.Structured;
                param.Value = dtCreatePenaltyParameters;

                SqlParameter param1 = new SqlParameter();
                param1.ParameterName = "@PenaltyParametersSlabTable";
                param1.SqlDbType = System.Data.SqlDbType.Structured;
                param1.Value = dtCreatePenaltyParametersSlab;

                SqlParameter[] Parameters = { param, param1 };
                int ret = (int)SqlHelper.ExecuteScalar(DMLConnectionString.WebConfigConnectionString, "UpdatePenaltyParameters", Parameters);

                if (ret > 0)
                {
                    if (ret > 1000)
                    {
                        //For Customised Validation Messages like 'Record Already Exists' etc
                        string serverErrorMessage = baseBusiness.ReadServerErrorMessages(ret, "PenaltyParameters");
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

        public List<string> DeletePenaltyParameters(List<string> listID)
        {
            try
            {
                List<string> ErrorMessage = new List<string>();
                BaseBusiness baseBussiness = new BaseBusiness();
                if (listID.Count > 0)
                {
                    string RecordId = listID[0].ToString();
                    string UserId = listID[1].ToString();
                    SqlParameter[] Parameters = { new SqlParameter("@SNo", Convert.ToInt32(RecordId)), new SqlParameter("@UserID", Convert.ToInt32(UserId)) };
                    int ret = (int)SqlHelper.ExecuteScalar(DMLConnectionString.WebConfigConnectionString, "DeletePenaltyParameters", Parameters);
                    if (ret > 0)
                    {
                        if (ret > 1000)
                        {
                            string serverErrorMessage = baseBussiness.ReadServerErrorMessages(ret, "PenaltyParameters");
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

        public KeyValuePair<string, List<PenaltyParametersSlab>> GetPenaltyParametersSlabRecord(string recordID, int page, int pageSize, string whereCondition, string sort)
        {
            try
            {
                whereCondition = "PenaltyParameterSNo=" + recordID;
                PenaltyParametersSlab penaltyParametersSlab = new PenaltyParametersSlab();
                SqlParameter[] Parameters = { new SqlParameter("@PageNo", page), new SqlParameter("@PageSize", pageSize), new SqlParameter("@WhereCondition", whereCondition), new SqlParameter("@OrderBy", sort) };
                DataSet ds = SqlHelper.ExecuteDataset(DMLConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, "GetPenaltyParametersSlabRecord", Parameters);
                var penaltyParametersSlabList = ds.Tables[0].AsEnumerable().Select(e => new PenaltyParametersSlab
                {
                    SNo = Convert.ToInt32(e["Sno"]),
                    PenaltyParameterSNo = Convert.ToInt32(e["PenaltyParameterSNo"]),
                    StartRange = Convert.ToInt32(e["StartRange"]),
                    EndRange = Convert.ToInt32(e["EndRange"].ToString()),
                    HdnBasedOn = Convert.ToInt32(e["BasedOn"].ToString()),
                    PenaltyCharge = Convert.ToDecimal(e["PenaltyCharge"].ToString()),
                    HdnChargeBasis = Convert.ToInt32(e["ChargeBasis"].ToString()),
                    ChargeBasis = e["Text_ChargeBasic"].ToString(),
                    BasedOn = e["Text_BasedOn"].ToString(),
                    AppliedOn = e["Text_AppliedOn"].ToString(),
                    // BasedON = (e["BasedONSNo"].ToString()),
                    HdnAppliedOn = Convert.ToInt32(e["AppliedOn"].ToString())

                });
                return new KeyValuePair<string, List<PenaltyParametersSlab>>(ds.Tables[1].Rows[0][0].ToString(), penaltyParametersSlabList.AsQueryable().ToList());
            }
            catch(Exception ex)//
            {
                throw ex;
            }
        }
    
    
    
    }

}
