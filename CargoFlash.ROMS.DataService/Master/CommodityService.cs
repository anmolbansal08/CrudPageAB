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
using System.Net;
using WCF.Validation.Engine;

namespace CargoFlash.Cargo.DataService.Master
{
    [GlobalErrorHandlerBehaviour(typeof(GlobalErrorHandler))]   [ServiceBehavior(IncludeExceptionDetailInFaults = true)]
    [AspNetCompatibilityRequirements(RequirementsMode = AspNetCompatibilityRequirementsMode.Allowed)]
    public class CommodityService : SignatureAuthenticate, ICommodityService
    {
        public ModelState ModelState { get; set; }
        public Commodity GetCommodityRecord(string recordID, string UserSNo)
        {
            try
            {
                Commodity c = new Commodity();
                SqlParameter[] Parameters = { new SqlParameter("@SNo", Convert.ToInt32(recordID)), new SqlParameter("@UserID", Convert.ToInt32(UserSNo)) };
                SqlDataReader dr = SqlHelper.ExecuteReader(DMLConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, "GetRecordCommodity", Parameters);
                if (dr.Read())
                {
                    c.SNo = Convert.ToInt32(dr["SNo"]);
                    c.CommoditySubGroupSNo = Convert.ToString(dr["CommoditySubGroupSNo"]);
                    c.Text_CommoditySubGroupSNo = Convert.ToString(dr["SubGroupName"]).ToUpper();
                    c.CommodityCode = dr["CommodityCode"].ToString().ToUpper();
                    c.CommodityDescription = dr["CommodityDescription"].ToString().ToUpper();
                    c.DensityGroupSNo = Convert.ToString(dr["DensityGroupSNo"]);
                    c.Text_DensityGroupSNo = Convert.ToString(dr["GroupName"]);
                    c.IsHeavyWeightExempt = Convert.ToBoolean(dr["IsHeavyWeightExempt"]);
                    c.HeavyWeightExempt = dr["HeavyWeightExempt"].ToString();
                    c.IsGeneral = Convert.ToBoolean(dr["IsGeneral"]);
                    c.General = dr["General"].ToString();
                    c.IsActive = Convert.ToBoolean(dr["IsActive"]);
                    c.Active = dr["Active"].ToString();
                    c.CreatedBy = dr["CreatedUser"].ToString();
                    c.UpdatedBy = dr["UpdatedUser"].ToString();
                    c.CommodityClass = (dr["CommodityClass"]).ToString().ToUpper();
                    c.SHCSNo = dr["SHCSNo"].ToString();
                    c.Text_SHCSNo = dr["Text_SHCSNo"].ToString();
                    if (!String.IsNullOrEmpty(dr["InsurancedCommodity"].ToString()))
                    {
                        c.InsurancedCommodity = Convert.ToBoolean(dr["InsurancedCommodity"]);
                        c.Text_InsurancedCommodity = dr["Text_InsurancedCommodity"].ToString().ToUpper();
                    }
                    c.InsuranceCategory = Convert.ToInt32(dr["InsuranceCategory"]);
                    c.Text_InsuranceCategory = Convert.ToString(dr["Text_InsuranceCategory"]).ToUpper();
                }
                c.MinimumChargeableWeight = Convert.ToDecimal(dr["MinimumChargeableWeight"]);

                dr.Close();
                return c;
            }
            catch
            {
                throw new WebFaultException<string>("Bad Request.", HttpStatusCode.BadRequest);
            }
        }

        public DataSourceResult GetGridData(int skip, int take, int page, int pageSize, List<GridSort> sort, GridFilter filter)
        {
            try
            {
                string sorts = GridSort.ProcessSorting(sort);
                string filters = GridFilter.ProcessFilters<Commodity>(filter);

                SqlParameter[] Parameters = { new SqlParameter("@PageNo", page), new SqlParameter("@PageSize", pageSize), new SqlParameter("@WhereCondition", filters), new SqlParameter("@OrderBy", sorts) };
                DataSet ds = SqlHelper.ExecuteDataset(DMLConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, "GetListCommodity", Parameters);

                var commodityList = ds.Tables[0].AsEnumerable().Select(e => new Commodity
                {
                    SNo = Convert.ToInt32(e["SNo"]),
                    CommodityCode = e["CommodityCode"].ToString().ToUpper(),
                    CommodityDescription = e["CommodityDescription"].ToString().ToUpper(),
                    UpdatedBy = e["UpdatedBy"].ToString(),
                    Active = e["ACTIVE"].ToString(),
                    Text_InsurancedCommodity = e["Text_InsurancedCommodity"].ToString().ToUpper(),
                    UpdatedOn = Convert.ToDateTime(e["UpdatedOn"])
                });
                ds.Dispose();
                return new DataSourceResult
                {
                    Data = commodityList.AsQueryable().ToList(),
                    Total = Convert.ToInt32(ds.Tables[1].Rows[0][0].ToString())
                };
            }
            catch
            {

                throw new WebFaultException<string>("Bad Request.", HttpStatusCode.BadRequest);
            }
        }

        
        public List<string> SaveCommodity(List<Commodity> Commodity)
        {
            //validate Business Rule
            List<string> ErrorMessage = new List<string>();
            try
            {
                DataTable dtCreateCommodity = CollectionHelper.ConvertTo(Commodity, "Active,Text_CommoditySubGroupSNo,Text_DensityGroupSNo,HeavyWeightExempt,General,CreatedOn,UpdatedOn,GroupName,SubGroupName,Text_SHCSNo,Text_InsurancedCommodity,Text_InsuranceCategory");
                BaseBusiness baseBusiness = new BaseBusiness();

                if (!baseBusiness.ValidateBaseBusiness("Commodity", dtCreateCommodity, "SAVE"))
                {
                    ErrorMessage = baseBusiness.ErrorMessage;
                    return ErrorMessage;
                }
                SqlParameter param = new SqlParameter();
                param.ParameterName = "@CommodityTable";
                param.SqlDbType = System.Data.SqlDbType.Structured;
                param.Value = dtCreateCommodity;
                SqlParameter[] Parameters = { param };

                int ret = (int)SqlHelper.ExecuteScalar(DMLConnectionString.WebConfigConnectionString, "CreateCommodity", Parameters);
                if (ret > 0)
                {
                    if (ret > 1000)
                    {
                        //For Customised Validation Messages like 'Record Already Exists' etc
                        string serverErrorMessage = baseBusiness.ReadServerErrorMessages(ret, "Commodity");
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
            catch
            {

                throw new WebFaultException<string>("Bad Request.", HttpStatusCode.BadRequest);
            }
            return ErrorMessage;
        }

        //[ParameterValidator]
        public List<string> UpdateCommodity(List<Commodity> Commodity)
        {
            //validate Business Rule
            List<string> ErrorMessage = new List<string>();
            try
            {
                DataTable dtCreateCommodity = CollectionHelper.ConvertTo(Commodity, "Active,Text_CommoditySubGroupSNo,Text_DensityGroupSNo,HeavyWeightExempt,General,CreatedOn,UpdatedOn,GroupName,SubGroupName,Text_SHCSNo,Text_InsurancedCommodity,Text_InsuranceCategory");
                BaseBusiness baseBusiness = new BaseBusiness();

                if (!baseBusiness.ValidateBaseBusiness("Commodity", dtCreateCommodity, "UPDATE"))
                {
                    ErrorMessage = baseBusiness.ErrorMessage;
                    return ErrorMessage;
                }

                SqlParameter param = new SqlParameter();
                param.ParameterName = "@CommodityTable";
                param.SqlDbType = System.Data.SqlDbType.Structured;
                param.Value = dtCreateCommodity;
                SqlParameter[] Parameters = { param };

                int ret = (int)SqlHelper.ExecuteScalar(DMLConnectionString.WebConfigConnectionString, "UpdateCommodity", Parameters);
                if (ret > 0)
                {
                    if (ret > 1000)
                    {
                        //For Customised Validation Messages like 'Record Already Exists' etc
                        string serverErrorMessage = baseBusiness.ReadServerErrorMessages(ret, "Commodity");
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
            catch
            {

                throw new WebFaultException<string>("Bad Request.", HttpStatusCode.BadRequest);
            }
            return ErrorMessage;
        }

        public List<string> DeleteCommodity(List<string> listID)
        {
            List<string> ErrorMessage = new List<string>();
            BaseBusiness baseBusiness = new BaseBusiness();
            try
            {
                if (listID.Count > 1)
                {
                    string RecordID = listID[0].ToString();
                    string UserID = listID[1].ToString();

                    SqlParameter[] Parameters = { new SqlParameter("@SNo", Convert.ToInt32(RecordID)),
                                             new SqlParameter("@UserID",  Convert.ToInt32(UserID))};

                    int ret = (int)SqlHelper.ExecuteScalar(DMLConnectionString.WebConfigConnectionString, "DeleteCommodity", Parameters);
                    if (ret > 0)
                    {
                        if (ret > 1000)
                        {
                            //For Customised Validation Messages like 'Record Already Exists' etc
                            string serverErrorMessage = baseBusiness.ReadServerErrorMessages(ret, "Commodity");
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
            }
            catch
            {

                throw new WebFaultException<string>("Bad Request.", HttpStatusCode.BadRequest);
            }
            return ErrorMessage;
        }

        public string GetCommoditySubGroupType(string Code)
        {
            try
            {
                SqlParameter[] Parameters = { new SqlParameter("@Code", Code) };
                DataSet ds = SqlHelper.ExecuteDataset(DMLConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, "GetCommoditySubGroupType", Parameters);
                ds.Dispose();
                return CargoFlash.Cargo.Business.Common.CompleteDStoJSON(ds);
            }
            catch
            {

                throw new WebFaultException<string>("Bad Request.", HttpStatusCode.BadRequest);
            }
        }

    }
}
