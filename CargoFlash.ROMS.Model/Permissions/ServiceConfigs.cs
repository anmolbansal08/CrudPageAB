using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Runtime.Serialization;

namespace CargoFlash.Cargo.Model.Permissions
{
 [KnownType(typeof(ServiceConfigs))]
  public  class ServiceConfigs
    {
        /*------Property of Service Config-----*/
        public string RosterFTPHostName { get; set; }
        public string RosterFTPUserId { get; set; }
        public string RosterFTPPassword { get; set; }
        public string RosterFtpFolderPath { get; set; }
        public string AttendanceFTPHostName { get; set; }
        public string AttendanceFTPUserId { get; set; }
        public string AttendanceFTPPassword { get; set; }
        public string AttendanceFtpFolderPath { get; set; }
        public string StaffFTPHostName { get; set; }
        public string StaffFTPUserId { get; set; }
        public string StaffFTPPassword { get; set; }
        public string StaffFtpFolderPath { get; set; }
        public string SITAFTPHostName { get; set; }
        public string SITAFTPUserId { get; set; }
        public string SITAFTPPassword { get; set; }
        public string SITAFtpFolderPath { get; set; }
        public string SITAMAILBOXServerName { get; set; }
        public string SITAMAILBOXUserId { get; set; }
        public string SITAMAILBOXPassword { get; set; }
        public string EmailFTPHostName { get; set; }
        public string EmailFTPUserId { get; set; }
        public string EmailFTPPassword { get; set; }
        public string EmailFtpFolderPath { get; set; }
        public bool IsActiveAttendanceWService { get; set; }
        public bool IsActiveShiftWService { get; set; }
        public bool IsActiveRosterWService { get; set; }
        public bool IsActiveEmailWService { get; set; }
        public bool IsActiveEDIOutboundWService { get; set; }
        public bool IsActiveEdiInboundWService { get; set; }
        public bool IsActiveEDIProcessWService { get; set; }
        public bool IsActiveNilManifestWService { get; set; }
        public bool IsActiveSMSWService { get; set; }
        public string AttendanceTimeInterval { get; set; }
        public string ShiftTimeInterval { get; set; }
        public string RosterTimeInterval { get; set; }
        public string EmailTimeInterval { get; set; }
        public string EDIOutboundTimeInterval { get; set; }
        public string EDIInboundTimeInterval { get; set; }
        public string NilManifestTimeInterval { get; set; }
        public string EDIProcessTimeInterval { get; set; }
        public string SMSTimeInterval { get; set; }
        public bool IsActiveLyingListWService { get; set; }
        public string LyingListTimepmInterval { get; set; }
        public bool IsActiveAutoSCMCreation { get; set; }
        public string AutoSCMCreation { get; set; }
        public bool IsActiveCustomsAPIWService { get; set; }
        public string CustomsAPITimeInterval { get; set; }
        public string INBOUNDMAILBOXServerName { get; set; }
        public string INBOUNDMAILBOXUserId { get; set; }
        public string INBOUNDMAILBOXPassword { get; set; }
        public string BNICreateVATimeInterval { get; set; }
        public string LyingListTimeInterval { get; set; }
        public bool IsActiveBNICreateVAAPIWService { get; set; }
        public bool IsActiveLyingListService { get; set; }
        public bool IsActivePushAWBDataToCRAWService { get; set; }
        public string PushAWBDataToCRATimeInterval { get; set; }
        public string EmailAttachmentWServicePath { get; set; }
        /*---------------------------------------------------*/
    }
}
