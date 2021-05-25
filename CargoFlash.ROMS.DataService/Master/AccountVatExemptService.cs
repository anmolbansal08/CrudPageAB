using CargoFlash.Cargo.Business;
using CargoFlash.Cargo.Model.Master;
using CargoFlash.SoftwareFactory.Data;
using Newtonsoft.Json;
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

namespace CargoFlash.Cargo.DataService.Master
{
    [GlobalErrorHandlerBehaviour(typeof(GlobalErrorHandler))]   [ServiceBehavior(IncludeExceptionDetailInFaults = true)]
    [AspNetCompatibilityRequirements(RequirementsMode = AspNetCompatibilityRequirementsMode.Allowed)]
    public class AccountVatExemptService : SignatureAuthenticate, IAccountVatExemptService
    {
        public KeyValuePair<string, List<AccountVatExempt>> GetCountryVatRecord(string recordID, int page, int pageSize, string whereCondition, string sort)
        {
            try
            {
                AccountVatExempt AccountVatExempt = new AccountVatExempt();
                SqlParameter[] Parameters = { new SqlParameter("@AccountSNo", recordID), new SqlParameter("@PageNo", page), new SqlParameter("@PageSize", pageSize), new SqlParameter("@WhereCondition", whereCondition), new SqlParameter("@OrderBy", sort) };
                DataSet ds = SqlHelper.ExecuteDataset(DMLConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, "GetListAccountVatExempt", Parameters);
                var AccountVatExemptList = ds.Tables[0].AsEnumerable().Select(e => new AccountVatExempt
                {
                    SNo = Convert.ToInt32(e["SNo"]),
                    AccountSNo = Convert.ToInt32(e["AccountSNo"].ToString()),
                    AccountName = Convert.ToString(e["Name"]),
                    Value = Convert.ToDecimal(e["Value"].ToString()),
                    IsDomsticVatExempt = Convert.ToBoolean(e["IsDomsticVatExempt"]),
                    DomsticVatExempt = e["DomsticVatExempt"].ToString(),
                    ValidFrom = (DateTime.Parse(e["ValidFrom"].ToString()).ToString("dd-MMM-yyyy")),
                    ValidTo = (DateTime.Parse(e["ValidTo"].ToString()).ToString("dd-MMM-yyyy")),
                    IsActive = Convert.ToBoolean(e["IsActive"]),
                    Active = e["Active"].ToString(),
                    CreatedBy = ((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).UserSNo.ToString(),
                    UpdatedBy = ((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).UserSNo.ToString()
                });
                return new KeyValuePair<string, List<AccountVatExempt>>(ds.Tables[1].Rows[0][0].ToString(), AccountVatExemptList.AsQueryable().ToList());
            }
            catch(Exception ex)//
            {
                throw ex;
            }
        }

        public List<string> createUpdateAccountVatExempt(string strData)
        {
            List<string> ErrorMessage = new List<string>();
            try
            {
                int ret = 0;
                
                BaseBusiness baseBussiness = new BaseBusiness();
                // Convert JSON string into datatable
                var dtAccountVatExempt = JsonConvert.DeserializeObject<DataTable>(CargoFlash.Cargo.Business.Common.Base64ToString(strData));
                var dtCreateAccountVatExempt = (new DataView(dtAccountVatExempt, "SNo=0", "SNo", DataViewRowState.CurrentRows)).ToTable();
                var dtUpdateAccountVatExempt = (new DataView(dtAccountVatExempt, "SNo>0", "SNo", DataViewRowState.CurrentRows)).ToTable();
                SqlParameter param = new SqlParameter();
                param.ParameterName = "@AccountVatExemptType";
                param.SqlDbType = System.Data.SqlDbType.Structured;
                // for create new record
                if (dtCreateAccountVatExempt.Rows.Count > 0)
                {
                    param.Value = dtCreateAccountVatExempt;
                    SqlParameter[] Parameters = { param };
                    ret = (int)SqlHelper.ExecuteScalar(DMLConnectionString.WebConfigConnectionString, "CreateAccountVatExempt", Parameters);
                }
                // for update existing record
                if (dtUpdateAccountVatExempt.Rows.Count > 0)
                {
                    param.Value = dtUpdateAccountVatExempt;
                    SqlParameter[] Parameters = { param };
                    ret = (int)SqlHelper.ExecuteScalar(DMLConnectionString.WebConfigConnectionString, "UpdateAccountVatExempt", Parameters);
                }
                if (ret > 0)
                {
                    if (ret > 1000)
                    {
                        string serverErrorMessage = baseBussiness.ReadServerErrorMessages(ret, "AccountVatExempt");
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
            catch(Exception ex)//
            {
                throw ex;
            }
            return ErrorMessage;
        }
        public List<string> deleteAccountVatExempt(string recordID)
        {
            List<string> ErrorMessage = new List<string>();
            try
            {
                int ret = 0;
              
                BaseBusiness baseBussiness = new BaseBusiness();
                SqlParameter[] Parameters = { new SqlParameter("@SNo", recordID) };
                ret = (int)SqlHelper.ExecuteScalar(DMLConnectionString.WebConfigConnectionString, "DeleteAccountVatExempt", Parameters);
                if (ret > 0)
                {
                    if (ret > 1000)
                    {
                        string serverErrorMessage = baseBussiness.ReadServerErrorMessages(ret, "AccountVatExempt");
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
            catch(Exception ex)//
            {
                throw ex;
            }
            return ErrorMessage;
        }
    }
}
