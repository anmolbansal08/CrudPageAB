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
using CargoFlash.Cargo.Model;
using CargoFlash.Cargo.Model.Permissions;

namespace CargoFlash.Cargo.DataService.Permissions
{
    [GlobalErrorHandlerBehaviour(typeof(GlobalErrorHandler))]   [ServiceBehavior(IncludeExceptionDetailInFaults = true)]
    [AspNetCompatibilityRequirements(RequirementsMode = AspNetCompatibilityRequirementsMode.Allowed)]
    public class SystemSettingService : SignatureAuthenticate, ISystemSettingService
    {
        CargoFlash.Cargo.Business.BaseBusiness basebusiness = new CargoFlash.Cargo.Business.BaseBusiness();
        public SystemSetting GetSystemSettingRecord(string recid, string UserID, string UserSNo)
        {
            
            SystemSetting SystemSetting = new SystemSetting();

            try
            {
                SqlParameter[] Parameters = { new SqlParameter("@UserID", Convert.ToInt32(UserSNo)) };
               
                DataSet ds =new DataSet();
                string[] tableNames=null;
                SqlHelper.FillDataset(DMLConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, "GetListSystemSettings", ds, tableNames, Parameters);
                DataTable dt = new DataTable();
                  
                  dt = ds.Tables[0];
                  if (!String.IsNullOrEmpty(dt.Rows[0]["IsSendMail"].ToString()))
                  {
                      SystemSetting.IsSendMail = Convert.ToBoolean(dt.Rows[0]["IsSendMail"]);
                      SystemSetting.SendMail = dt.Rows[0]["IsSendMail"].ToString();
                  }
                  if (!String.IsNullOrEmpty(dt.Rows[0]["IsSendSMS"].ToString()))
                  {
                      SystemSetting.IsSendSMS = Convert.ToBoolean(dt.Rows[0]["IsSendSMS"]);
                      SystemSetting.SendSMS = dt.Rows[0]["IsSendSMS"].ToString();

                  }
                  SystemSetting.SenderEmailId = Convert.ToString(dt.Rows[0]["SenderEmailId"]);
                  SystemSetting.GridServiceURL = Convert.ToString(dt.Rows[0]["GridServiceURL"]);
                  SystemSetting.DateFormat = Convert.ToString(dt.Rows[0]["DateFormat"]);
                  SystemSetting.JSVersion = Convert.ToInt32(dt.Rows[0]["JSVersion"]);
                  SystemSetting.LongDateFormat = Convert.ToString(dt.Rows[0]["LongDateFormat"]);
                  SystemSetting.CRAServiceURL = Convert.ToString(dt.Rows[0]["CRAServiceURL"]);
                  SystemSetting.SessionTimeout = Convert.ToInt32(dt.Rows[0]["SessionTimeout"]);
                  SystemSetting.TimeFormat = Convert.ToString(dt.Rows[0]["TimeFormat"]);
                  SystemSetting.EmailAttachmentWServicePath = Convert.ToString(dt.Rows[0]["EmailAttachmentWServicePath"]);
                  if (!String.IsNullOrEmpty(dt.Rows[0]["IsPartialRCS"].ToString()))
                    {
                        SystemSetting.IsPartialRCS = Convert.ToBoolean(dt.Rows[0]["IsPartialRCS"]);
                        SystemSetting.PartialRCS = dt.Rows[0]["IsPartialRCS"].ToString();
                    }
                  SystemSetting.SLICaption = Convert.ToString(dt.Rows[0]["SLICaption"]);
                  SystemSetting.CCSUrl = Convert.ToString(dt.Rows[0]["CCSUrl"]);
                  SystemSetting.CCSGroups = Convert.ToString(dt.Rows[0]["CCSGroups"]);                              
                  //SystemSetting.ShowTickerOnPublish = Convert.ToInt32(dt.Rows[0]["ShowTickerOnPublish"]);
                  if (!String.IsNullOrEmpty(dt.Rows[0]["ShowTickerOnPublish"].ToString()))
                  {
                      SystemSetting.IsShowTickerOnPublish = Convert.ToBoolean(dt.Rows[0]["ShowTickerOnPublish"]);
                      SystemSetting.ShowTickerOnPublish = dt.Rows[0]["ShowTickerOnPublish"].ToString();
                  }
                  SystemSetting.ShowTickerOnPublishText = Convert.ToString(dt.Rows[0]["ShowTickerOnPublishText"]);                                                
            }
            catch(Exception ex)// (Exception e)
            {         
            }      
            return SystemSetting;
        }
        public List<string> UpdateSystemSetting(List<SystemSetting> SystemSetting)
        {
            List<string> ErrorMessage = new List<string>();
            try
            {
                DataTable dtSystemSetting = CollectionHelper.ConvertTo(SystemSetting, "SendMail,SendSMS,ShowTickerOnPublish");//,Text_VolumeConversionCM,Text_VolumeConversionInch
                BaseBusiness baseBusiness = new BaseBusiness();
                DataTable dtCreateSystemSetting = new DataTable();
                dtCreateSystemSetting.Columns.Add("SysKey");
                dtCreateSystemSetting.Columns.Add("SysValue");
                dtCreateSystemSetting.Rows.Add(new object[] { "IsSendMail", dtSystemSetting.Rows[0]["IsSendMail"] });
                dtCreateSystemSetting.Rows.Add(new object[] { "IsSendSMS", dtSystemSetting.Rows[0]["IsSendSMS"] });
                dtCreateSystemSetting.Rows.Add(new object[] { "SenderEmailId", dtSystemSetting.Rows[0]["SenderEmailId"] });
                dtCreateSystemSetting.Rows.Add(new object[] { "GridServiceURL", dtSystemSetting.Rows[0]["GridServiceURL"] });
                dtCreateSystemSetting.Rows.Add(new object[] { "DateFormat", dtSystemSetting.Rows[0]["DateFormat"] });
                dtCreateSystemSetting.Rows.Add(new object[] { "JSVersion", dtSystemSetting.Rows[0]["JSVersion"] });
                dtCreateSystemSetting.Rows.Add(new object[] { "LongDateFormat", dtSystemSetting.Rows[0]["LongDateFormat"] });
                dtCreateSystemSetting.Rows.Add(new object[] { "CRAServiceURL", dtSystemSetting.Rows[0]["CRAServiceURL"] });
                dtCreateSystemSetting.Rows.Add(new object[] { "SessionTimeout", dtSystemSetting.Rows[0]["SessionTimeout"] });
                dtCreateSystemSetting.Rows.Add(new object[] { "TimeFormat", dtSystemSetting.Rows[0]["TimeFormat"] });
                dtCreateSystemSetting.Rows.Add(new object[] { "EmailAttachmentWServicePath", dtSystemSetting.Rows[0]["EmailAttachmentWServicePath"] });
                dtCreateSystemSetting.Rows.Add(new object[] { "IsPartialRCS", dtSystemSetting.Rows[0]["IsPartialRCS"] });
                dtCreateSystemSetting.Rows.Add(new object[] { "SLICaption", dtSystemSetting.Rows[0]["SLICaption"] });
                dtCreateSystemSetting.Rows.Add(new object[] { "CCSUrl", dtSystemSetting.Rows[0]["CCSUrl"] });
                dtCreateSystemSetting.Rows.Add(new object[] { "CCSGroups", dtSystemSetting.Rows[0]["CCSGroups"] });
                dtCreateSystemSetting.Rows.Add(new object[] { "ShowTickerOnPublish", dtSystemSetting.Rows[0]["IsShowTickerOnPublish"] });
                dtCreateSystemSetting.Rows.Add(new object[] { "ShowTickerOnPublishText", dtSystemSetting.Rows[0]["ShowTickerOnPublishText"] });


                if (!baseBusiness.ValidateBaseBusiness("SystemSetting", dtSystemSetting, "UPDATE"))
                {
                    ErrorMessage = baseBusiness.ErrorMessage;
                    return ErrorMessage;
                }
                SqlParameter param = new SqlParameter();
                param.ParameterName = "@SystemSettingTable";
                param.SqlDbType = System.Data.SqlDbType.Structured;
                param.Value = dtCreateSystemSetting;

                SqlParameter[] Parameters = { param };
                int ret=0;
                ret = (int)SqlHelper.ExecuteScalar(DMLConnectionString.WebConfigConnectionString, "UpdateSystemSetting", Parameters);
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
