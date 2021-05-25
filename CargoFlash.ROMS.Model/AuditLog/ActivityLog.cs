using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Runtime.Serialization;
namespace CargoFlash.Cargo.Model.AuditLog
{
    [KnownType(typeof(ActivityLog))]
    class ActivityLog
    {
        public int SNo { get; set; }
        public string UserId { get; set; }
        public string Module { get; set; }
        public int Page { get; set; }
        public int Action { get; set; }
        public string ToDate { get; set; }
        public string FromDate { get; set; }
    }


    [KnownType(typeof(ActivityLogReport))]
    public class ActivityLogReport
    {
        public int SNo { get; set; }
        public string UserID { get; set; }
        public string SessionKey { get; set; }
        public string City { get; set; }
        public string Module { get; set; }
        public string Page { get; set; }
        public string Action { get; set; }
        public string IpAddress { get; set; }
        public string TerminalName { get; set; }
        public string Browser { get; set; }
        public string RequestedOn { get; set; }
    }

    public class ActivityLogRequest
    {
        public string UserId { get; set; }
        public string Module { get; set; }
        public string Page { get; set; }
        public string Action { get; set; }
        public string StartDate { get; set; }
        public string EndDate { get; set; }
    }



}
