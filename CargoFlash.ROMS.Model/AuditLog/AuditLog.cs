using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Runtime.Serialization;
using System.ComponentModel.DataAnnotations;
namespace CargoFlash.Cargo.Model.AuditLog
{
    [KnownType(typeof(AuditLog))]
    public class AuditLog
    {
        public int SNo { get; set; }
        public string PageName { get; set; }
        public string MasterFieldName { get; set; }
        public int AuditLogFormConfigSNo { get; set; }
        public int MasterSNo { get; set; }
        public string UpdatedOn { get; set; }
        public string UpdatedBy { get; set; }
    }

    [KnownType(typeof(AuditLog))]
    public class AuditLog_Trans
    {
        public int SNo { get; set; }
        public string FieldName { get; set; }
        public string OldValue { get; set; }
        public string NewValue { get; set; }
    }


    [KnownType(typeof(AuditLogForExcel))]
    public class AuditLogForExcel
    {
        public string ApplicationName { get; set; }
        public string KeyColumn { get; set; }
        public string KeyValue { get; set; }
        public string UserName { get; set; }
        public string StartDate { get; set; }
        public string EndDate { get; set; }
        public string FieldName { get; set; }
        // public string AgentName { get; set; }
        //public int StockStatus { get; set; }
    }
    [KnownType(typeof(AuditLogReport))]
    public class AuditLogReport
    {
        public int SNo { get; set; }
        public string KeyColumn { get; set; }
        public string KeyValue { get; set; }
        public string OldValue { get; set; }
        public string NewValue { get; set; }
        public string TerminalID { get; set; }
        public string TerminalName { get; set; }
        public string FormAction { get; set; }
        public string UserName { get; set; }
        public string subprocessname { get; set; }
        //[DataType(DataType.Date)]
        //[DisplayFormat(DataFormatString = "{0:dd/MM/yyyy}")]
        public string RequestedOn { get; set; }
    }

    public class AuditLogRequest
    {
        public string prefix { get; set; }
        public string awbno { get; set; }
        public string pagename { get; set; }
        public string keyvalue { get; set; }

        public string startdate { get; set; }
        public string enddate { get; set; }
    }

}
