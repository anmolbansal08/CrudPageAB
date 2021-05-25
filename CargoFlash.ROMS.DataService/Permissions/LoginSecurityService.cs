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
using CargoFlash.Cargo.Model.Permissions;
using CargoFlash.SoftwareFactory.Data;
using CargoFlash.Cargo.Business;
using System.Collections;

namespace CargoFlash.Cargo.DataService.Permissions
{
    [GlobalErrorHandlerBehaviour(typeof(GlobalErrorHandler))]   [ServiceBehavior(IncludeExceptionDetailInFaults = true)]
    [AspNetCompatibilityRequirements(RequirementsMode = AspNetCompatibilityRequirementsMode.Allowed)]
    public class LoginSecurityService : SignatureAuthenticate, ILoginSecurityService
    {
        CargoFlash.Cargo.Business.BaseBusiness basebusiness = new CargoFlash.Cargo.Business.BaseBusiness();
        public LoginSecurity GetLoginSecurityRecord(string recid, string UserID, string UserSNo)
        {
            LoginSecurity loginsecurity = new LoginSecurity();
            try
            {
                DataSet ds = new DataSet();
                SqlParameter[] Parameters = { new SqlParameter("@UserID", Convert.ToInt32(UserSNo))};
                string[] tableNames = null;
                SqlHelper.FillDataset(ReadConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, "GetListSystemSettings", ds, tableNames, Parameters);
                if (ds.Tables[0].Rows.Count > 0)
                {
                    loginsecurity.CountMaximumDayNoActivity = Convert.ToString(ds.Tables[0].Rows[0]["CountMaximumDayNoActivity"]);
                    loginsecurity.NoOfBadAttemps = Convert.ToString(ds.Tables[0].Rows[0]["NoOfBadAttemps"]);
                    loginsecurity.CountPasswoedExpiryDate = Convert.ToString(ds.Tables[0].Rows[0]["CountPasswoedExpiryDate"]);
                    loginsecurity.ISCaptcha = Convert.ToString(ds.Tables[0].Rows[0]["ISCaptcha"]);
                    loginsecurity.LogoURL = Convert.ToString(ds.Tables[0].Rows[0]["LogoURL"]);
                    loginsecurity.FooterHTML = Convert.ToString(ds.Tables[0].Rows[0]["FooterHTML"]);
                }
            }
            catch(Exception ex)// (Exception ex)
            {
            }
            return loginsecurity;
        }

        public List<string> UpdateLoginSecurity(List<LoginSecurity> loginsecurity)
        {
            List<string> ErrorMessage = new List<string>();
            try
            {
                DataTable loginsecurities = CollectionHelper.ConvertTo(loginsecurity, "");
                DataTable loginsecuritys = new DataTable();
                loginsecuritys.Columns.Add("SysKey");
                loginsecuritys.Columns.Add("SysValue");
                loginsecuritys.Rows.Add(new object[] { "CountMaximumDayNoActivity", loginsecurities.Rows[0]["CountMaximumDayNoActivity"] });
                loginsecuritys.Rows.Add(new object[] { "NoOfBadAttemps", loginsecurities.Rows[0]["NoOfBadAttemps"] });
                loginsecuritys.Rows.Add(new object[] { "CountPasswoedExpiryDate", loginsecurities.Rows[0]["CountPasswoedExpiryDate"] });
                loginsecuritys.Rows.Add(new object[] { "ISCaptcha", loginsecurities.Rows[0]["ISCaptcha"] });
                loginsecuritys.Rows.Add(new object[] { "LogoURL", loginsecurities.Rows[0]["LogoURL"] });
                loginsecuritys.Rows.Add(new object[] { "FooterHTML", loginsecurities.Rows[0]["FooterHTML"] });

                if (!basebusiness.ValidateBaseBusiness("LoginSecurity", loginsecuritys, "UPDATE"))
                {
                    ErrorMessage = basebusiness.ErrorMessage;
                    return ErrorMessage;
                }
                SqlParameter param = new SqlParameter();
                param.ParameterName = "@SystemSettingTable";
                param.SqlDbType = System.Data.SqlDbType.Structured;
                param.Value = loginsecuritys;

                SqlParameter[] Parameters = { param };
                int ret = 0;
                ret = (int)SqlHelper.ExecuteScalar(DMLConnectionString.WebConfigConnectionString, "UpdateSystemSetting", Parameters);
                if (ret > 0)
                {
                    if (ret > 1000)
                    {
                        //For Customised Validation Messages like 'Record Already Exists' etc
                        string serverErrorMessage = basebusiness.ReadServerErrorMessages(ret, "LoginSecurity");
                        if (!string.IsNullOrEmpty(serverErrorMessage))
                            ErrorMessage.Add(serverErrorMessage);
                    }
                    else
                    {

                        //For DataBase Exceptions like 'Foreign Key refrence Errors' etc
                        string dataBaseExceptionMessage = basebusiness.ReadServerErrorMessages(ret, basebusiness.DatabaseExceptionFileName);
                        if (!string.IsNullOrEmpty(dataBaseExceptionMessage))
                            ErrorMessage.Add(dataBaseExceptionMessage);
                    }
                }
            }
            catch(Exception ex)// (Exception e)
            {
            }
            return ErrorMessage;
        }
    }
}
