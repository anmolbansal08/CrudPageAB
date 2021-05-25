using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Runtime.Serialization;

namespace CargoFlash.Cargo.Model.Permissions
{
    [KnownType(typeof(SystemSetting))]
    public class SystemSetting
    {
        /*------Property of System Config------*/
        public string SendMail { get; set; }
        public bool IsSendMail { get; set; }
        public string SendSMS { get; set; }
        public bool IsSendSMS { get; set; }
        public string SenderEmailId { get; set; }
        public string GridServiceURL { get; set; }
        public string DateFormat { get; set; }
        public int JSVersion { get; set; }
        public string LongDateFormat { get; set; }
        public string CRAServiceURL { get; set; }
        public int SessionTimeout { get; set; }
        public string TimeFormat { get; set; }
        public string EmailAttachmentWServicePath { get; set; }
        public string PartialRCS { get; set; }
        public bool IsPartialRCS { get; set; }
        public string SLICaption { get; set; }
        public string CCSUrl { get; set; }   
        public string CCSGroups { get; set; }     
        public string ShowTickerOnPublish { get; set; }
        public bool IsShowTickerOnPublish { get; set; }
        public String ShowTickerOnPublishText { get; set; }
       /*---------------------------------------------------*/
      
    }
} 
