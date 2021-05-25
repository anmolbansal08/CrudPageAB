using System;
using System.Collections.Generic;
using System.Linq;
using System.Runtime.Serialization;
using System.ServiceModel;
using System.ServiceModel.Activation;
using System.Text;
using System.ServiceModel.Web;
using System.Configuration;
using System.Data;
using System.Data.SqlClient;
using CargoFlash.Cargo.Model.Permissions;
using Newtonsoft.Json;
using CargoFlash.SoftwareFactory.Data;
using CargoFlash.Cargo.Business;
using System.Net;
namespace CargoFlash.Cargo.DataService.Permissions
{
    [GlobalErrorHandlerBehaviour(typeof(GlobalErrorHandler))]   [ServiceBehavior(IncludeExceptionDetailInFaults = true)]
    [AspNetCompatibilityRequirements(RequirementsMode = AspNetCompatibilityRequirementsMode.Allowed)]
    public class SystemSettingsService : SignatureAuthenticate, ISystemSettingsService
    {


        public KeyValuePair<string, List<SystemSettings>> GetSystemSettings(string recordID, int page, int pageSize, string whereCondition, string sort)
        {
            try
            {
             
                SystemSettings GetSystemSettingsTables = new SystemSettings();
                //string searchby = whereCondition.ToString();

                whereCondition = "";
                SqlParameter[] Parameters = { new SqlParameter("@SNo", recordID), new SqlParameter("@PageNo", page), new SqlParameter("@PageSize", pageSize), new SqlParameter("@WhereCondition", whereCondition), new SqlParameter("@OrderBy", sort) };
                DataSet ds = SqlHelper.ExecuteDataset(DMLConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, "GetSystemSettingsRecord", Parameters);
                var pageSystemSettingsList = ds.Tables[0].AsEnumerable().Select(e => new SystemSettings
                {
                    SNo = Convert.ToInt16(e["SNo"].ToString()),
                    CategoryName = e["CategoryName"].ToString(),
                    SysKey = e["SysKey"].ToString(),
                    SysValue = e["SysValue"].ToString(),
                    Status = Convert.ToBoolean(e["Status"].ToString()),

                });
                return new KeyValuePair<string, List<SystemSettings>>(ds.Tables[0].Rows[0][0].ToString(), pageSystemSettingsList.AsQueryable().ToList());
            }
            catch(Exception ex)// (Exception ex)
            {
                KeyValuePair<string, List<SystemSettings>> syssetting = new KeyValuePair<string, List<SystemSettings>>();
                return syssetting;

            }
        }




        public List<string> UpdateSystemSettings(string strData)
        {
            List<string> ErrorMessage = new List<string>();
            BaseBusiness baseBusiness = new BaseBusiness();
            var dtSystemSettings = JsonConvert.DeserializeObject<DataTable>(CargoFlash.Cargo.Business.Common.Base64ToString(strData));


            try
            {
                if (!baseBusiness.ValidateBaseBusiness("SystemSetting", dtSystemSettings, "UPDATE"))
                {
                    ErrorMessage = baseBusiness.ErrorMessage;
                    return ErrorMessage;
                }

                int SNo = Convert.ToInt16(dtSystemSettings.Rows[0]["SNo"]);
                string SysKey = dtSystemSettings.Rows[0]["SysKey"].ToString();
                string SysValue = dtSystemSettings.Rows[0]["SysValue"].ToString();
                int Status = Convert.ToInt16(dtSystemSettings.Rows[0]["Status"].ToString());
                string ipAddress = System.Web.HttpContext.Current.Request.ServerVariables["HTTP_FORWARDED_FOR"];
                if (!string.IsNullOrEmpty(ipAddress))
                {
                    string[] forwardedIps = ipAddress.Split(new char[] { ',' }, StringSplitOptions.RemoveEmptyEntries);
                    ipAddress = forwardedIps[forwardedIps.Length - 1];
                }
                else
                {
                    ipAddress = System.Web.HttpContext.Current.Request.ServerVariables["REMOTE_ADDR"];
                }
                SqlParameter[] Parameters = { new SqlParameter("@SNo", SNo), new SqlParameter("@SysKey", SysKey), new SqlParameter("@SysValue", SysValue), new SqlParameter("@Status", Status), new SqlParameter("@IP", ipAddress) };

                int ret = (int)SqlHelper.ExecuteScalar(DMLConnectionString.WebConfigConnectionString, "UpdateSystemSetting", Parameters);
                if (ret > 0)
                {
                    if (ret > 1000)
                    {
                        //For Customised Validation Messages like 'Record Already Exists' etc
                        string serverErrorMessage = baseBusiness.ReadServerErrorMessages(ret, "SystemSetting");
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
            catch(Exception ex)// (Exception e)
            {

            }
            return ErrorMessage;
        }
    }
}
