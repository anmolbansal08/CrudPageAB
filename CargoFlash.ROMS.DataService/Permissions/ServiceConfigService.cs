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

    public class ServiceConfigService : SignatureAuthenticate, IServiceConfigService
    {
       CargoFlash.Cargo.Business.BaseBusiness basebusiness = new CargoFlash.Cargo.Business.BaseBusiness();
       public ServiceConfigs GetServiceConfigRecord(string recid, string UserID, string UserSNo)
        {
            ServiceConfigs config = new ServiceConfigs();
            try
            {
                DataSet ds = new DataSet();
                SqlParameter[] Parameters = {new SqlParameter("@UserID", Convert.ToInt32(UserSNo)) };
                string[] tableNames = null;
                SqlHelper.FillDataset(ReadConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, "GetListSystemSettings",ds ,tableNames, Parameters);
                if(ds.Tables[0].Rows.Count > 0)
                {
                    config.RosterFTPHostName = Convert.ToString(ds.Tables[0].Rows[0]["RosterFTPHostName"]);
                    config.RosterFTPUserId = Convert.ToString(ds.Tables[0].Rows[0]["RosterFTPUserId"]);
                    config.RosterFTPPassword = Convert.ToString(ds.Tables[0].Rows[0]["RosterFTPPassword"]);
                    config.RosterFtpFolderPath = Convert.ToString(ds.Tables[0].Rows[0]["RosterFtpFolderPath"]);
                    config.RosterTimeInterval = Convert.ToString(ds.Tables[0].Rows[0]["RosterTimeInterval"]);
                    config.AttendanceFTPHostName = Convert.ToString(ds.Tables[0].Rows[0]["AttendanceFTPHostName"]);
                    config.AttendanceFTPUserId = Convert.ToString(ds.Tables[0].Rows[0]["AttendanceFTPUserId"]);
                    config.AttendanceFTPPassword = Convert.ToString(ds.Tables[0].Rows[0]["AttendanceFTPPassword"]);
                    config.AttendanceFtpFolderPath = Convert.ToString(ds.Tables[0].Rows[0]["AttendanceFtpFolderPath"]);
                    config.AttendanceTimeInterval = Convert.ToString(ds.Tables[0].Rows[0]["AttendanceTimeInterval"]);
                    config.StaffFTPHostName = Convert.ToString(ds.Tables[0].Rows[0]["StaffFTPHostName"]);
                    config.StaffFTPUserId = Convert.ToString(ds.Tables[0].Rows[0]["StaffFTPUserId"]);
                    config.StaffFTPPassword = Convert.ToString(ds.Tables[0].Rows[0]["StaffFTPPassword"]);
                    config.StaffFtpFolderPath = Convert.ToString(ds.Tables[0].Rows[0]["StaffFtpFolderPath"]);
                    config.SITAFTPHostName = Convert.ToString(ds.Tables[0].Rows[0]["SITAFTPHostName"]);
                    config.SITAFTPUserId = Convert.ToString(ds.Tables[0].Rows[0]["SITAFTPUserId"]);
                    config.SITAFTPPassword = Convert.ToString(ds.Tables[0].Rows[0]["SITAFTPPassword"]);
                    config.SITAMAILBOXServerName = Convert.ToString(ds.Tables[0].Rows[0]["SITAMAILBOXServerName"]);
                    config.EmailAttachmentWServicePath = Convert.ToString(ds.Tables[0].Rows[0]["EmailAttachmentWServicePath"]);
                    config.SITAFtpFolderPath = Convert.ToString(ds.Tables[0].Rows[0]["SITAFtpFolderPath"]);
                    config.SITAMAILBOXServerName = Convert.ToString(ds.Tables[0].Rows[0]["SITAMAILBOXServerName"]);
                    config.SITAMAILBOXUserId = Convert.ToString(ds.Tables[0].Rows[0]["SITAMAILBOXUserId"]);
                    config.SITAMAILBOXPassword = Convert.ToString(ds.Tables[0].Rows[0]["SITAMAILBOXPassword"]);
                    config.EmailFTPHostName = Convert.ToString(ds.Tables[0].Rows[0]["EmailFTPHostName"]);
                    config.EmailFTPUserId = Convert.ToString(ds.Tables[0].Rows[0]["EmailFTPUserId"]);
                    config.EmailFTPPassword = Convert.ToString(ds.Tables[0].Rows[0]["EmailFTPPassword"]);
                    config.EmailFtpFolderPath = Convert.ToString(ds.Tables[0].Rows[0]["EmailFtpFolderPath"]);
                    if (!string.IsNullOrEmpty(Convert.ToString("IsActiveAttendanceWService")))
                    {
                        config.IsActiveAttendanceWService = Convert.ToBoolean(ds.Tables[0].Rows[0]["IsActiveAttendanceWService"]);
                    }
                    if (!string.IsNullOrEmpty(Convert.ToString("IsActiveShiftWService")))
                    {
                        config.IsActiveShiftWService = Convert.ToBoolean(ds.Tables[0].Rows[0]["IsActiveShiftWService"]);
                    }
                    if (!string.IsNullOrEmpty(Convert.ToString("IsActiveRosterWService")))
                    {
                        config.IsActiveRosterWService = Convert.ToBoolean(ds.Tables[0].Rows[0]["IsActiveRosterWService"]);
                    }
                    if (!string.IsNullOrEmpty(Convert.ToString("IsActiveEmailWService")))
                    {
                        config.IsActiveEmailWService = Convert.ToBoolean(ds.Tables[0].Rows[0]["IsActiveEmailWService"]);
                    }
                    if (!string.IsNullOrEmpty(Convert.ToString("IsActiveEDIOutboundWService")))
                    {
                        config.IsActiveEDIOutboundWService = Convert.ToBoolean(ds.Tables[0].Rows[0]["IsActiveEDIOutboundWService"]);
                    }
                    if (!string.IsNullOrEmpty(Convert.ToString("IsActiveEdiInboundWService")))
                    {
                        config.IsActiveEdiInboundWService = Convert.ToBoolean(ds.Tables[0].Rows[0]["IsActiveEdiInboundWService"]);
                    }
                    if (!string.IsNullOrEmpty(Convert.ToString("IsActiveEDIProcessWService")))
                    {
                        config.IsActiveEDIProcessWService = Convert.ToBoolean(ds.Tables[0].Rows[0]["IsActiveEDIProcessWService"]);
                    }
                    if (!string.IsNullOrEmpty(Convert.ToString("IsActiveNilManifestWService")))
                    {
                        config.IsActiveNilManifestWService = Convert.ToBoolean(ds.Tables[0].Rows[0]["IsActiveNilManifestWService"]);
                    }
                    if (!string.IsNullOrEmpty(Convert.ToString("IsActiveSMSWService")))
                    {
                        config.IsActiveSMSWService = Convert.ToBoolean(ds.Tables[0].Rows[0]["IsActiveSMSWService"]);
                    }
                    config.AttendanceTimeInterval = Convert.ToString(ds.Tables[0].Rows[0]["AttendanceTimeInterval"]);
                    config.ShiftTimeInterval = Convert.ToString(ds.Tables[0].Rows[0]["ShiftTimeInterval"]);
                    config.RosterTimeInterval = Convert.ToString(ds.Tables[0].Rows[0]["RosterTimeInterval"]);
                    config.EmailTimeInterval = Convert.ToString(ds.Tables[0].Rows[0]["EmailTimeInterval"]);
                    config.EDIOutboundTimeInterval = Convert.ToString(ds.Tables[0].Rows[0]["EDIOutboundTimeInterval"]);
                    config.EDIOutboundTimeInterval = Convert.ToString(ds.Tables[0].Rows[0]["EDIOutboundTimeInterval"]);
                    config.EDIInboundTimeInterval = Convert.ToString(ds.Tables[0].Rows[0]["EDIInboundTimeInterval"]);
                    config.NilManifestTimeInterval = Convert.ToString(ds.Tables[0].Rows[0]["NilManifestTimeInterval"]);
                    config.EDIProcessTimeInterval = Convert.ToString(ds.Tables[0].Rows[0]["EDIProcessTimeInterval"]);
                    config.SMSTimeInterval = Convert.ToString(ds.Tables[0].Rows[0]["SMSTimeInterval"]);
                    if (!string.IsNullOrEmpty(Convert.ToString("IsActiveLyingListWService")))
                    {
                        config.IsActiveLyingListWService = Convert.ToBoolean(ds.Tables[0].Rows[0]["IsActiveLyingListWService"]);
                    }
                    config.LyingListTimeInterval = Convert.ToString(ds.Tables[0].Rows[0]["LyingListTimeInterval"]);
                    if (!string.IsNullOrEmpty(Convert.ToString("IsActiveLyingListService")))
                    {
                        config.IsActiveLyingListService = Convert.ToBoolean(ds.Tables[0].Rows[0]["IsActiveLyingListService"]);
                    }
                    config.LyingListTimepmInterval = Convert.ToString(ds.Tables[0].Rows[0]["LyingListTimepmInterval"]);
                    if (!string.IsNullOrEmpty(Convert.ToString("IsActiveAutoSCMCreation")))
                    {
                        config.IsActiveAutoSCMCreation = Convert.ToBoolean(ds.Tables[0].Rows[0]["IsActiveAutoSCMCreation"]);
                    }
                    config.AutoSCMCreation = Convert.ToString(ds.Tables[0].Rows[0]["AutoSCMCreation"]);
                    if (!string.IsNullOrEmpty(Convert.ToString("IsActiveCustomsAPIWService")))
                    {
                        config.IsActiveCustomsAPIWService = Convert.ToBoolean(ds.Tables[0].Rows[0]["IsActiveCustomsAPIWService"]);
                    }
                    config.CustomsAPITimeInterval = Convert.ToString(ds.Tables[0].Rows[0]["CustomsAPITimeInterval"]);
                    config.INBOUNDMAILBOXServerName = Convert.ToString(ds.Tables[0].Rows[0]["INBOUNDMAILBOXServerName"]);
                    config.INBOUNDMAILBOXUserId = Convert.ToString(ds.Tables[0].Rows[0]["INBOUNDMAILBOXUserId"]);
                    config.INBOUNDMAILBOXPassword = Convert.ToString(ds.Tables[0].Rows[0]["INBOUNDMAILBOXPassword"]);
                    config.BNICreateVATimeInterval = Convert.ToString(ds.Tables[0].Rows[0]["BNICreateVATimeInterval"]);
                    if (!string.IsNullOrEmpty(Convert.ToString("IsActiveBNICreateVAAPIWService")))
                    {
                        config.IsActiveBNICreateVAAPIWService = Convert.ToBoolean(ds.Tables[0].Rows[0]["IsActiveBNICreateVAAPIWService"]);
                    }
                    if (!string.IsNullOrEmpty(Convert.ToString("IsActivePushAWBDataToCRAWService")))
                    {
                        config.IsActivePushAWBDataToCRAWService = Convert.ToBoolean(ds.Tables[0].Rows[0]["IsActivePushAWBDataToCRAWService"]);
                    }
                    config.PushAWBDataToCRATimeInterval = Convert.ToString(ds.Tables[0].Rows[0]["PushAWBDataToCRATimeInterval"]);
                }
            }
            catch(Exception ex)// (Exception ex)
            {
            }
            return config;
        }

       public List<string> UpdateServiceConfig(List<ServiceConfigs> serviceconfigs)
       {
           List<string> ErrorMessage = new List<string>();
           try
           {
               DataTable serviceconfig = CollectionHelper.ConvertTo(serviceconfigs, "");
               DataTable dtCreateserviceconfig = new DataTable();
               dtCreateserviceconfig.Columns.Add("SysKey");
               dtCreateserviceconfig.Columns.Add("SysValue");
               dtCreateserviceconfig.Rows.Add(new object[] { "RosterFTPHostName", serviceconfig.Rows[0]["RosterFTPHostName"] });
               dtCreateserviceconfig.Rows.Add(new object[] { "RosterFTPUserId", serviceconfig.Rows[0]["RosterFTPUserId"] });
               dtCreateserviceconfig.Rows.Add(new object[] { "RosterFTPPassword", serviceconfig.Rows[0]["RosterFTPPassword"] });
               dtCreateserviceconfig.Rows.Add(new object[] { "RosterFtpFolderPath", serviceconfig.Rows[0]["RosterFtpFolderPath"] });
               dtCreateserviceconfig.Rows.Add(new object[] { "RosterTimeInterval", serviceconfig.Rows[0]["RosterTimeInterval"] });
               dtCreateserviceconfig.Rows.Add(new object[] { "AttendanceFTPHostName", serviceconfig.Rows[0]["AttendanceFTPHostName"] });
               dtCreateserviceconfig.Rows.Add(new object[] { "AttendanceFTPUserId", serviceconfig.Rows[0]["AttendanceFTPUserId"] });
               dtCreateserviceconfig.Rows.Add(new object[] { "AttendanceFTPPassword", serviceconfig.Rows[0]["AttendanceFTPPassword"] });
               dtCreateserviceconfig.Rows.Add(new object[] { "AttendanceFtpFolderPath", serviceconfig.Rows[0]["AttendanceFtpFolderPath"] });
               dtCreateserviceconfig.Rows.Add(new object[] { "StaffFTPHostName", serviceconfig.Rows[0]["StaffFTPHostName"] });
               dtCreateserviceconfig.Rows.Add(new object[] { "StaffFTPUserId", serviceconfig.Rows[0]["StaffFTPUserId"] });
               dtCreateserviceconfig.Rows.Add(new object[] { "StaffFTPPassword", serviceconfig.Rows[0]["StaffFTPPassword"] });
               dtCreateserviceconfig.Rows.Add(new object[] { "StaffFtpFolderPath", serviceconfig.Rows[0]["StaffFtpFolderPath"] });
               dtCreateserviceconfig.Rows.Add(new object[] { "SITAFTPHostName", serviceconfig.Rows[0]["SITAFTPHostName"] });
               dtCreateserviceconfig.Rows.Add(new object[] { "SITAFTPUserId", serviceconfig.Rows[0]["SITAFTPUserId"] });
               dtCreateserviceconfig.Rows.Add(new object[] { "SITAFTPPassword", serviceconfig.Rows[0]["SITAFTPPassword"] });
               dtCreateserviceconfig.Rows.Add(new object[] { "SITAFtpFolderPath", serviceconfig.Rows[0]["SITAFtpFolderPath"] });
               dtCreateserviceconfig.Rows.Add(new object[] { "SITAMAILBOXServerName", serviceconfig.Rows[0]["SITAMAILBOXServerName"] });
               dtCreateserviceconfig.Rows.Add(new object[] { "SITAMAILBOXUserId", serviceconfig.Rows[0]["SITAMAILBOXUserId"] });
               dtCreateserviceconfig.Rows.Add(new object[] { "SITAMAILBOXPassword", serviceconfig.Rows[0]["SITAMAILBOXPassword"] });
               dtCreateserviceconfig.Rows.Add(new object[] { "EmailFTPHostName", serviceconfig.Rows[0]["EmailFTPHostName"] });
               dtCreateserviceconfig.Rows.Add(new object[] { "EmailFTPUserId", serviceconfig.Rows[0]["EmailFTPUserId"] });
               dtCreateserviceconfig.Rows.Add(new object[] { "EmailFtpFolderPath", serviceconfig.Rows[0]["EmailFtpFolderPath"] });
               dtCreateserviceconfig.Rows.Add(new object[] { "IsActiveAttendanceWService", serviceconfig.Rows[0]["IsActiveAttendanceWService"] });
               dtCreateserviceconfig.Rows.Add(new object[] { "IsActiveShiftWService", serviceconfig.Rows[0]["IsActiveShiftWService"] });
               dtCreateserviceconfig.Rows.Add(new object[] { "IsActiveEmailWService", serviceconfig.Rows[0]["IsActiveEmailWService"] });
               dtCreateserviceconfig.Rows.Add(new object[] { "IsActiveEDIOutboundWService", serviceconfig.Rows[0]["IsActiveEDIOutboundWService"] });

               dtCreateserviceconfig.Rows.Add(new object[] { "IsActiveEdiInboundWService", serviceconfig.Rows[0]["IsActiveEdiInboundWService"] });
               dtCreateserviceconfig.Rows.Add(new object[] { "IsActiveEDIProcessWService", serviceconfig.Rows[0]["IsActiveEDIProcessWService"] });
               dtCreateserviceconfig.Rows.Add(new object[] { "IsActiveNilManifestWService", serviceconfig.Rows[0]["IsActiveNilManifestWService"] });
               dtCreateserviceconfig.Rows.Add(new object[] { "IsActiveSMSWService", serviceconfig.Rows[0]["IsActiveSMSWService"] });
               dtCreateserviceconfig.Rows.Add(new object[] { "AttendanceTimeInterval", serviceconfig.Rows[0]["AttendanceTimeInterval"] });

               dtCreateserviceconfig.Rows.Add(new object[] { "ShiftTimeInterval", serviceconfig.Rows[0]["ShiftTimeInterval"] });
               dtCreateserviceconfig.Rows.Add(new object[] { "RosterTimeInterval", serviceconfig.Rows[0]["RosterTimeInterval"] });
               dtCreateserviceconfig.Rows.Add(new object[] { "EmailTimeInterval", serviceconfig.Rows[0]["EmailTimeInterval"] });
               dtCreateserviceconfig.Rows.Add(new object[] { "EDIOutboundTimeInterval", serviceconfig.Rows[0]["EDIOutboundTimeInterval"] });
               dtCreateserviceconfig.Rows.Add(new object[] { "EDIInboundTimeInterval", serviceconfig.Rows[0]["EDIInboundTimeInterval"] });
               dtCreateserviceconfig.Rows.Add(new object[] { "NilManifestTimeInterval", serviceconfig.Rows[0]["NilManifestTimeInterval"] });
               dtCreateserviceconfig.Rows.Add(new object[] { "EDIProcessTimeInterval", serviceconfig.Rows[0]["EDIProcessTimeInterval"] });
               dtCreateserviceconfig.Rows.Add(new object[] { "SMSTimeInterval", serviceconfig.Rows[0]["SMSTimeInterval"] });
               dtCreateserviceconfig.Rows.Add(new object[] { "IsActiveLyingListWService", serviceconfig.Rows[0]["IsActiveLyingListWService"] });
               dtCreateserviceconfig.Rows.Add(new object[] { "LyingListTimeInterval", serviceconfig.Rows[0]["LyingListTimeInterval"] });

               if (!basebusiness.ValidateBaseBusiness("ServiceConfig", serviceconfig, "UPDATE"))
               {
                   ErrorMessage = basebusiness.ErrorMessage;
                   return ErrorMessage;
               }
               SqlParameter param = new SqlParameter();
               param.ParameterName = "@SystemSettingTable";
               param.SqlDbType = System.Data.SqlDbType.Structured;
               param.Value = dtCreateserviceconfig;

               SqlParameter[] Parameters = { param };
               int ret = 0;
               ret = (int)SqlHelper.ExecuteScalar(DMLConnectionString.WebConfigConnectionString, "UpdateSystemSetting", Parameters);
               if (ret > 0)
               {
                   if (ret > 1000)
                   {
                       //For Customised Validation Messages like 'Record Already Exists' etc
                       string serverErrorMessage = basebusiness.ReadServerErrorMessages(ret, "ServiceConfig");
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
