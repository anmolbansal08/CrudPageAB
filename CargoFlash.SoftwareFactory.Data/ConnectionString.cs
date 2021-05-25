using System.Web.Configuration;

namespace CargoFlash.SoftwareFactory.Data
{
    public sealed class DMLConnectionString
    {
        public static string WebConfigConnectionString
        {
            get
            {
                //return WebConfigurationManager.AppSettings["DBMSClientString"].ToString();
                return System.Configuration.ConfigurationManager.ConnectionStrings["DBMSClientString"].ConnectionString;
            }
        }
    }

    public sealed class ReadConnectionString
    {
        public static string WebConfigConnectionString { get { return System.Configuration.ConfigurationManager.ConnectionStrings["ReadConnectionString"].ConnectionString; } }
    }

    public sealed class CRAConnectionString
    {
        public static string WebConfigConnectionString
        {
            get
            {
                return System.Configuration.ConfigurationManager.ConnectionStrings["DBMSClientStringCRA"].ConnectionString;
            }
        }
    }

    public sealed class SMTPConnection
    {
        public static string SMTPServer { get { return WebConfigurationManager.AppSettings["SMTPServer"].ToString(); } }
        public static string ServerUserId { get { return WebConfigurationManager.AppSettings["ServerUserId"].ToString(); } }
        public static string MailPassword { get { return WebConfigurationManager.AppSettings["MailPassword"].ToString(); } }
        public static string SMTPSenderId { get { return WebConfigurationManager.AppSettings["SMTPSenderId"].ToString(); } }
        public static int MailserverPort { get { return int.Parse(WebConfigurationManager.AppSettings["MailserverPort"].ToString()); } }
        public static string ReceiverCCId { get { return WebConfigurationManager.AppSettings["ReceiverCCId"].ToString(); } }
    }
    public sealed class DateFormat
    {
        public static string DateFormatString { get { return WebConfigurationManager.AppSettings["DateFormat"].ToString(); } }
    }
    
}