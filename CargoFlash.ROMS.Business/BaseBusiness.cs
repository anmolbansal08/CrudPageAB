using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

using CargoFlash.Cargo.Model;
using System.Xml.Linq;
using System.IO;
using System.Web.UI;
using System.Data;

namespace CargoFlash.Cargo.Business
{
    public class BaseBusiness : IDisposable
    {

        public BaseBusiness()
        {
            Dictionary<string, string> dict = new Dictionary<string, string>();
            RequiredValidationDict = dict;
        }

        private List<string> _ErrorMessage;
        public List<string> ErrorMessage
        {
            get { return _ErrorMessage; }
            set { _ErrorMessage = value; }
        }

        private string databaseExceptionFileName;
        public string DatabaseExceptionFileName
        {
            get { return databaseExceptionFileName == null ? "DataBaseExceptions" : databaseExceptionFileName; }
            set { databaseExceptionFileName = value; }
        }
        /// <summary>
        /// Create By:Dhiraj Kumar on Dated 15 April 2013
        /// Purpose: To validate Business rules and check required fields and validate them.
        /// </summary>
        /// <param name="validationDict"></param>
        /// <param name="gp"></param>
        /// <returns></returns>
        public bool ValidateBaseBusiness(Dictionary<string, string> validationDict, DataTable dt, string OperationMode)
        {
            bool returnValue = true;
            try
            {
                //  string[] operationArr = OperationMode.Split('.');
                List<string> ErrorMessageGroup = new List<string>();
                foreach (KeyValuePair<string, string> keyValue in validationDict)
                {
                    switch (OperationMode)
                    {
                        case "SAVE":
                            //Check for Null or empty value.
                            foreach (DataRow dr in dt.Rows)
                                if (string.IsNullOrEmpty(dr[keyValue.Key].ToString()))
                                    ErrorMessageGroup.Add(keyValue.Value);
                            break;
                        case "UPDATE":
                            break;

                    }
                }
                ErrorMessage = ErrorMessageGroup;
            }
            catch (Exception ex)
            {
                ErrorMessage.Add(ex.Message);
            }

            if (ErrorMessage.Count > 0)
                returnValue = false;
            return returnValue;
        }

        /// <summary>
        /// Default distructor of the BaseBusiness Claas
        /// </summary>
        ~BaseBusiness()
        {
            if (this != null)
                this.Dispose();
        }

        /// <summary>
        /// Clean all the use variable of this class
        /// </summary>
        public virtual void Dispose()
        {

        }

        public IEnumerable<XElement> MessageXML { get; set; }
        private static Dictionary<string, string> requiredValidationArray;
        public static Dictionary<string, string> RequiredValidationDict
        {
            get { return requiredValidationArray; }
            set { requiredValidationArray = value; }
        }

        public bool ValidateBaseBusiness(string ClassName, DataTable dt, string OperationMode)
        {
            string path = AppDomain.CurrentDomain.BaseDirectory + "Messages/" + ClassName + ".xml";
            XElement webformDocument = XElement.Load(path);
            MessageXML = from messageXML in webformDocument.Elements("DataFieldName") select messageXML;
            foreach (var xml in MessageXML)
            {
                RequiredValidationDict.Add(xml.Element("Name").Value.ToString(), xml.Element("Message").Value.ToString());

            }
            bool returnValue = ValidateBaseBusiness(RequiredValidationDict, dt, OperationMode);

            return returnValue;
        }

        public string ReadServerErrorMessages(int errorKey, string ClassName)
        {
            string path = AppDomain.CurrentDomain.BaseDirectory + "Messages/" + ClassName + ".xml";
            XElement webformDocument = XElement.Load(path);
            MessageXML = from messageXML in webformDocument.Elements("ServerMessage") where (int)messageXML.Element("Key") == errorKey select messageXML;
            if (MessageXML.Count() > 0)
                return MessageXML.First().Element("value").ToString();// + "~^~ Error No: " + errorKey.ToString();
            else
                return "Related Information Not Found.";
        }
    }
}
