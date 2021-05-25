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
        /*
     *****************************************************************************
     Class Name:	AccountCommisionService      
     Purpose:		This class used to Extend Interface IAccountCommisionService. This Class Communicate with SQL Server for CRUD Operation.
     Company:		CargoFlash 
     Author:	    Amit Kumar Gupta
     Created On:    05 March 2014
     Approved By:    
     Approved On:	
     *****************************************************************************
     */

    [GlobalErrorHandlerBehaviour(typeof(GlobalErrorHandler))]   [ServiceBehavior(IncludeExceptionDetailInFaults = true)]
    [AspNetCompatibilityRequirements(RequirementsMode = AspNetCompatibilityRequirementsMode.Allowed)]
    public class AccountCommisionService : SignatureAuthenticate, IAccountCommisionService
    {
        //Interface implementation for AccountCommission Method
        //public List<AccountCommission> GetAccountCommissionRecord(string recordID)
        //{
        //    AccountCommission AccountCommission = new AccountCommission();
        //    SqlParameter[] Parameters = { new SqlParameter("@SNo", recordID) };
        //    DataSet ds = SqlHelper.ExecuteDataset(DMLConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, "GetRecordAccountCommission", Parameters);
        //    var AccountCommissionList = ds.Tables[0].AsEnumerable().Select(e => new AccountCommission
        //    {
        //        SNo = Convert.ToInt32(e["SNo"]),
        //        AccountSNo = Convert.ToInt32(e["AccountSNo"]),
        //        CommisionType = Convert.ToInt32(e["CommisionType"]),
        //        CommisionAmount = Convert.ToDecimal(e["CommisionAmount"].ToString()),
        //        IncentiveType = Convert.ToInt32(e["IncentiveType"]),
        //        IncentiveAmount = Convert.ToDecimal(e["IncentiveAmount"]),
        //        NetNet=Convert.ToInt32(e["NetNet"]),
        //        ValidFrom = e["ValidFrom"].ToString(),
        //        ValidTo = e["ValidTo"].ToString(),
        //        IsActive = Convert.ToInt32(e["IsActive"]),
        //        CreatedBy = ((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).UserSNo.ToString(),
        //        UpdatedBy = ((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).UserSNo.ToString()

        //    });
        //    return AccountCommissionList.AsQueryable().ToList();
        //}
        public KeyValuePair<string, List<AccountCommission>> GetAccountCommisionRecord(string recordID, int page, int pageSize, string whereCondition, string sort)
        {
            AccountCommission AccountCommission = new AccountCommission();
            try
            {

                SqlParameter[] Parameters = { new SqlParameter("@AccountSNo", recordID), new SqlParameter("@PageNo", page), new SqlParameter("@PageSize", pageSize), new SqlParameter("@WhereCondition", whereCondition), new SqlParameter("@OrderBy", sort) };
                DataSet ds = SqlHelper.ExecuteDataset(DMLConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, "GetListAccountCommission", Parameters);
                var AccountCommissionList = ds.Tables[0].AsEnumerable().Select(e => new AccountCommission
                {
                    SNo = Convert.ToInt32(e["SNo"]),
                    AccountSNo = Convert.ToInt32(e["AccountSNo"]),
                    CommisionType = Convert.ToInt32(e["CommisionType"]),
                    CommisionAmount = Convert.ToDecimal(e["CommisionAmount"].ToString()),
                    IncentiveType = Convert.ToInt32(e["IncentiveType"]),
                    IncentiveAmount = Convert.ToDecimal(e["IncentiveAmount"]),
                    DisPlayCommisionType = e["DisPlayCommisionType"].ToString(),
                    DisPlayIncentiveType = e["DisPlayIncentiveType"].ToString(),
                    AccountCommisionType = e["NetNet"].ToString(),
                    NetNetCommision = e["NetNetCommision"].ToString(),
                    ValidFrom = (DateTime.Parse(e["ValidFrom"].ToString()).ToString("dd-MMM-yyyy")),
                    ValidTo = (DateTime.Parse(e["ValidTo"].ToString()).ToString("dd-MMM-yyyy")),
                    IsActive = Convert.ToInt32(e["IsActive"]),
                    Active = e["Active"].ToString(),
                    CreatedBy = ((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).UserSNo.ToString(),
                    UpdatedBy = ((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).UserSNo.ToString()
                });
                return new KeyValuePair<string, List<AccountCommission>>(ds.Tables[1].Rows[0][0].ToString(), AccountCommissionList.AsQueryable().ToList());
            }
            catch(Exception ex)//
            {
                throw ex;
            }
        }
        public List<string> createUpdateAccountCommision(string strData)
         {
             List<string> ErrorMessage = new List<string>();
             try
             {
                 int ret = 0;
                
                 BaseBusiness baseBussiness = new BaseBusiness();
                 // convert JSON string into datatable
                 var dtAccountCommision = JsonConvert.DeserializeObject<DataTable>(CargoFlash.Cargo.Business.Common.Base64ToString(strData));
                 if (dtAccountCommision.Columns.Contains("AccountCommisionType"))
                     dtAccountCommision.Columns.Remove("AccountCommisionType");
                 var dtCreateCommoditySubGroup = (new DataView(dtAccountCommision, "SNo=0", "SNo", DataViewRowState.CurrentRows)).ToTable();
                 var dtUpdateCommoditySubGroup = (new DataView(dtAccountCommision, "SNo>0", "SNo", DataViewRowState.CurrentRows)).ToTable();
                 SqlParameter param = new SqlParameter();
                 param.ParameterName = "@_AccountCommision";
                 param.SqlDbType = System.Data.SqlDbType.Structured;
                 // for create new record
                 if (dtCreateCommoditySubGroup.Rows.Count > 0)
                 {
                     param.Value = dtCreateCommoditySubGroup;
                     SqlParameter[] Parameters = { param };
                     ret = (int)SqlHelper.ExecuteScalar(DMLConnectionString.WebConfigConnectionString, "CreateAccountCommision", Parameters);
                 }
                 // for update existing record
                 if (dtUpdateCommoditySubGroup.Rows.Count > 0)
                 {
                     param.Value = dtUpdateCommoditySubGroup;
                     SqlParameter[] Parameters = { param };
                     ret = (int)SqlHelper.ExecuteScalar(DMLConnectionString.WebConfigConnectionString, "UpdateAccountCommision", Parameters);
                 }
                 if (ret > 0)
                 {
                     if (ret > 1000)
                     {
                         string serverErrorMessage = baseBussiness.ReadServerErrorMessages(ret, "AccountCommission");
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

        public List<string> deleteAccountCommision(string recordID)
        {
            List<string> ErrorMessage = new List<string>();
            try
            {
                int ret = 0;
               
                BaseBusiness baseBussiness = new BaseBusiness();
                SqlParameter[] Parameters = { new SqlParameter("@SNo", recordID) };
                ret = (int)SqlHelper.ExecuteScalar(DMLConnectionString.WebConfigConnectionString, "DeleteAccountCommision", Parameters);
                if (ret > 0)
                {
                    if (ret > 1000)
                    {
                        string serverErrorMessage = baseBussiness.ReadServerErrorMessages(ret, "AccountCommission");
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
