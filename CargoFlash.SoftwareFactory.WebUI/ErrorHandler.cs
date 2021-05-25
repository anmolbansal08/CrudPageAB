using System;
using System.Collections.Generic;
using System.Text;
using System.Xml;
using System.Reflection;
using System.Diagnostics;
using System.IO;
using System.Security.AccessControl;
namespace CargoFlash.SoftwareFactory.WebUI
{
    public class ErrorHandler
    {
        string ErrorMessage, Details, ClassName, MethodName;
        
        
        DateTime OccuranceTime = new DateTime();

        public ErrorHandler()
        {

        }

        public ErrorHandler(DateTime time, string className, string methodName, string errorMessage, string details)
        {
            OccuranceTime = time;
            ClassName = className;
            Details = details;
            ErrorMessage = errorMessage;
            MethodName = methodName;
        }

     
        public static void WriteError(Exception ex)
        {
            WriteError(ex, "");
        }

      
        public static void WriteError(Exception ex, string fileName)
        {
            XmlDocument doc = new XmlDocument();
            string strRootPath = System.Configuration.ConfigurationManager.AppSettings ["logfilepath"].ToString();
            string xmlPath = System.Web.HttpContext.Current.Server.MapPath(strRootPath);
            
            GrantAccess(xmlPath);
            doc.Load(@xmlPath);
            XmlNode newXMLNode, oldXMLNode;
            oldXMLNode = doc.ChildNodes[1].ChildNodes[0];
            newXMLNode = oldXMLNode.CloneNode(true);

            StackTrace stackTrace = new StackTrace();
            StackFrame stackFrame = stackTrace.GetFrame(1);
            MethodBase methodBase = stackFrame.GetMethod();

            newXMLNode.ChildNodes[0].InnerText = DateTime.Now.ToString();
            newXMLNode.ChildNodes[1].InnerText = fileName;
            newXMLNode.ChildNodes[2].InnerText = methodBase.DeclaringType.FullName;
            newXMLNode.ChildNodes[3].InnerText = methodBase.Name;
            newXMLNode.ChildNodes[4].InnerText = ex.TargetSite.Name;
            newXMLNode.ChildNodes[5].InnerText = ex.Message;
            newXMLNode.ChildNodes[6].InnerText = ex.StackTrace;
            newXMLNode.ChildNodes[7].InnerText =
            System.Web.HttpContext.Current.Request.UserHostAddress;
            newXMLNode.ChildNodes[8].InnerText =
            System.Web.HttpContext.Current.Request.Url.OriginalString;
            doc.ChildNodes[1].AppendChild(newXMLNode);
            doc.Save(@xmlPath);
            doc.RemoveAll();
        }
        private static bool GrantAccess(string fullPath)
        {
            DirectoryInfo dInfo = new DirectoryInfo(fullPath);
            DirectorySecurity dSecurity = dInfo.GetAccessControl();
            dSecurity.AddAccessRule(new FileSystemAccessRule("everyone", FileSystemRights.FullControl,
                                                             InheritanceFlags.ObjectInherit | InheritanceFlags.ContainerInherit,
                                                             PropagationFlags.NoPropagateInherit, AccessControlType.Allow));
            dInfo.SetAccessControl(dSecurity);
            return true;
        }
    }
}

