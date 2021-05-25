using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Web;
using System.Text.RegularExpressions;
using System.Collections;
using System.Configuration;
using System.Reflection;
using System.Threading;
using System.Runtime.Serialization;
using CargoFlash.SoftwareFactory.WebUI;
using System.Net;
using CargoFlash.Cargo.Model.Common;
using System.Xml.Linq;

namespace CargoFlash.Cargo.WebUI
{  public class ApplicationWebUI : BaseWebUISecureObject
    {
        #region JavaScriptReference
        string currentVersion = string.Empty;

        /// <summary>
        /// The get java script master page reference.
        /// </summary>
        /// <returns> An array of string that contains the locations of the javascript files that needs to be loaded.
        /// </returns>
        public string[] GetJavaScriptReference(string pageNames)
        {

            string[] pageNameArrary = HttpContext.Current.Request.Url.ToString().Split('?');
            string pageName = pageNameArrary[0];

            Regex regex = new Regex("\\w*.aspx");
            if (regex.Matches(pageName).Count == 0)
                return null;
            string jsApplicationPath = pageName.Replace(HttpContext.Current.Request.CurrentExecutionFilePath, string.Empty) + HttpContext.Current.Request.ApplicationPath + "/";



            pageName = regex.Matches(pageName)[0].Value.Replace(".aspx", string.Empty);
            if (pageNameArrary.Length > 1)
            {
                pageName = pageNames;
            }
            string jsJQuery =  jsApplicationPath + "Scripts/jquery-1.7.2.js" + currentVersion;
            string jsKendoUI = jsApplicationPath + "Scripts/Kendo/kendoui.min.js" + currentVersion;
            string jsKendoWeb = jsApplicationPath + "Scripts/kendo/kendo.web.js" + currentVersion;
            string jsValidator = jsApplicationPath + "Scripts/validator.js" + currentVersion;
            string jsCommon = jsApplicationPath + "Scripts/common.js" + currentVersion;
            string jsMessage = jsApplicationPath + "Scripts/CfiMessage.js" + currentVersion;
            string jstoolbar = jsApplicationPath + "Scripts/jquery.toolbar.js";
            string jsBlockUI = jsApplicationPath + "Scripts/jquery.blockUI.js" + currentVersion;
            string jsUi = jsApplicationPath + "Scripts/jquery-ui-1.10.2.custom.min.js" + currentVersion;
            string jsAppend = jsApplicationPath + "Scripts/jquery.appendGrid-1.3.1.js" + currentVersion;
            
            var sbJavascript = new StringBuilder();

            // Commonly used script used all over the application...
            sbJavascript.Append(jsJQuery + "," + jsKendoUI + "," + jsKendoWeb + "," + jsValidator + "," + jsCommon + "," + jsMessage + "," + jsBlockUI + "," + jstoolbar + "," + jsUi + "," + jsAppend + ",");
            switch (pageName.ToUpper())
            {
                case "ULDBREAKDOWN":
                    sbJavascript.Append(jsApplicationPath + "JScript/Shipment/ULDBreakdown.js" + currentVersion + ",");
                    break;
                case "CITY":
                    sbJavascript.Append(jsApplicationPath + "JScript/Master/City.js" + currentVersion + ",");
                    sbJavascript.Append(jsApplicationPath + "Scripts/jquery.watermark.min.js" + currentVersion + ",");
                    break;
                case "REGISTRYCONTROL":
                    sbJavascript.Append(jsApplicationPath + "JScript/Shipment/RegistryControl.js" + currentVersion + ",");
                    break;
                case "TASKAREA":
                    sbJavascript.Append(jsApplicationPath + "JScript/Master/TaskArea.js" + currentVersion + ",");
                    break;
                case "FLIGHTTRANSFER":
                    sbJavascript.Append(jsApplicationPath + "JScript/Shipment/FlightTransfer.js" + currentVersion + ",");
                    break;
                case "AWBSWAPPING":
                    sbJavascript.Append(jsApplicationPath + "JScript/Shipment/AWBSwapping.js" + currentVersion + ",");
                    break;
                case "UNKBOOKING":
                    sbJavascript.Append(jsApplicationPath + "JScript/Shipment/UNKBooking.js" + currentVersion + ",");
                    break;
                case "BOOKING":
                    //sbJavascript.Append(jsApplicationPath + "Scripts/jquery-ui-1.7.2.custom.min.js" + currentVersion + ",");
                    sbJavascript.Append(jsApplicationPath + "JScript/Shipment/Booking.js" + currentVersion + ",");
                    sbJavascript.Append(jsApplicationPath + "Scripts/maketrans.js" + currentVersion + ",");
                    sbJavascript.Append(jsApplicationPath + "Scripts/jquery.tmpl.js" + currentVersion + ",");
                    break;

                case "AIRLINE":
                    sbJavascript.Append(jsApplicationPath + "JScript/Master/Airline.js" + currentVersion + ",");
                    break;
                case "COUNTRY":
                    sbJavascript.Append(jsApplicationPath + "JScript/Master/Country.js" + currentVersion + ",");
                    break;

                case "TIMEZONE":
                    sbJavascript.Append(jsApplicationPath + "JScript/Master/TimeZone.js" + currentVersion + ",");
                    break;
                case "ZONE":
                    sbJavascript.Append(jsApplicationPath + "Scripts/maketrans.js" + currentVersion + ",");
                    sbJavascript.Append(jsApplicationPath + "JScript/Master/Zone.js" + currentVersion + ",");

                    sbJavascript.Append(jsApplicationPath + "Scripts/common.js" + currentVersion + ",");

                    break;
                case "CUSTOMER":
                    sbJavascript.Append(jsApplicationPath + "JScript/Master/Customer.js" + currentVersion + ",");
                    break;

                case "DEPARTMENT":
                    sbJavascript.Append(jsApplicationPath + "JScript/Master/Department.js" + currentVersion + ",");
                    break;

                case "EXCHANGERATE":
                    sbJavascript.Append(jsApplicationPath + "JScript/Master/ExchangeRate.js" + currentVersion + ",");
                    break;

                case "PRODUCT":
                    sbJavascript.Append(jsApplicationPath + "JScript/Master/Product.js" + currentVersion + ",");
                    break;
                case "CURRENCY":
                    sbJavascript.Append(jsApplicationPath + "JScript/Master/Currency.js" + currentVersion + ",");
                    break;
                case "PAYMENT":
                    sbJavascript.Append(jsApplicationPath + "JScript/Payment/Payment.js" + currentVersion + ",");
                    break;
                case "PAYMENTTRANS":
                    sbJavascript.Append(jsApplicationPath + "JScript/Payment/PaymentTrans.js" + currentVersion + ",");
                    break;

                case "AIRLINEAUCTION":
                    sbJavascript.Append(jsApplicationPath + "JScript/Master/AirlineAuction.js" + currentVersion + ",");
                    break;
                case "AIRPORT":
                    sbJavascript.Append(jsApplicationPath + "JScript/Master/Airport.js" + currentVersion + ",");
                    sbJavascript.Append(jsApplicationPath + "Scripts/jquery.watermark.min.js" + currentVersion + ",");
                    break;
                case "COMMODITY":
                    sbJavascript.Append(jsApplicationPath + "JScript/Master/Commodity.js" + currentVersion + ",");
                    sbJavascript.Append(jsApplicationPath + "Scripts/jquery.watermark.min.js" + currentVersion + ",");
                    break;

                case "CUSTOMERBID":
                    sbJavascript.Append(jsApplicationPath + "JScript/Master/CustomerBid.js" + currentVersion + ",");
                    break;

                case "DUECARRIER":
                    sbJavascript.Append(jsApplicationPath + "JScript/Master/DueCarrier.js" + currentVersion + ",");
                    break;

                case "EMBARGO":
                    sbJavascript.Append(jsApplicationPath + "JScript/Master/Embargo.js" + currentVersion + ",");

                    break;

                case "HANDOVERCUTOFFTIME":
                    sbJavascript.Append(jsApplicationPath + "JScript/Master/HandOverCutOffTime.js" + currentVersion + ",");
                    sbJavascript.Append(jsApplicationPath + "Scripts/jquery.watermark.min.js" + currentVersion + ",");
                    break;

                case "PENALTYCHARGES":
                    sbJavascript.Append(jsApplicationPath + "JScript/Master/PenaltyCharges.js" + currentVersion + ",");
                    break;

                case "PENALTYTYPE":
                    sbJavascript.Append(jsApplicationPath + "JScript/Master/PenaltyType.js" + currentVersion + ",");
                    break;

                case "PRIORITY":
                    sbJavascript.Append(jsApplicationPath + "JScript/Master/Priority.js" + currentVersion + ",");
                    break;


                case "SPECIALHANDLINGCODE":
                    sbJavascript.Append(jsApplicationPath + "JScript/Master/SpecialHandlingCode.js" + currentVersion + ",");
                    break;


                case "BUCKETCLASS":
                    sbJavascript.Append(jsApplicationPath + "JScript/Bucket/BucketClass.js" + currentVersion + ",");
                    break;

                case "FLIGHTWISEBUCKETCLASS":
                    sbJavascript.Append(jsApplicationPath + "JScript/Bucket/FlightWiseBucketClass.js" + currentVersion + ",");
                    break;


                case "BUCKETDAYSDISCOUNTING":
                    sbJavascript.Append(jsApplicationPath + "JScript/Discounting/BucketDaysDiscounting.js" + currentVersion + ",");
                   // sbJavascript.Append(jsApplicationPath + "Scripts/maketrans.js" + currentVersion + ",");
                    sbJavascript.Append(jsApplicationPath + "Scripts/jquery.watermark.min.js" + currentVersion + ",");
                    sbJavascript.Append(jsApplicationPath + "Styles/Master/DaysDiscounting.css" + currentVersion + ",");
                    break;


                case "BUCKETRATEDISCOUNTING":
                    sbJavascript.Append(jsApplicationPath + "JScript/Master/BucketRateDiscounting.js" + currentVersion + ",");

                    break;
                case "DISCOUNTING":
                    sbJavascript.Append(jsApplicationPath + "JScript/Discounting/Discounting.js" + currentVersion + ",");
                    break;

                case "SPECIALDISCOUNTING":
                      sbJavascript.Append(jsApplicationPath + "JScript/Discounting/SpecialDiscounting.js" + currentVersion + ",");
                    break;

                case "SPACEALLOCATIONREPORT":
                    sbJavascript.Append(jsApplicationPath + "JScript/Reports/SpaceAllocationReport.js" + currentVersion + ",");
                    break;
                case "USERS":
                    sbJavascript.Append(jsApplicationPath + "Scripts/Manage/Security.js" + ",");
                    sbJavascript.Append(jsApplicationPath + "Scripts/Manage/manage-permission.js" + ",");
                    break;
                case "RATESIMULATOR":
                   // sbJavascript.Append(jsApplicationPath + "Scripts/Kendo/kendoui.min.js" + ",");
                    sbJavascript.Append(jsApplicationPath + "JScript/Master/RateSimulator.js" + ",");
                    break;
                case "ALLOCATIONSIMULATOR":
                    // sbJavascript.Append(jsApplicationPath + "Scripts/Kendo/kendoui.min.js" + ",");
                    sbJavascript.Append(jsApplicationPath + "JScript/Master/AllocationSimulator.js" + ",");
                    break;
                case "REVENUESIMULATOR":
                    // sbJavascript.Append(jsApplicationPath + "Scripts/Kendo/kendoui.min.js" + ",");
                    sbJavascript.Append(jsApplicationPath + "JScript/Master/RevenueSimulator.js" + ",");
                    break;
                case "GROUPS":
                    sbJavascript.Append(jsApplicationPath + "Scripts/Manage/Security.js" + ",");
                    sbJavascript.Append(jsApplicationPath + "Scripts/Manage/manage-permission.js" + ",");
                    break;

                case "BASISOFCHARGE":
                    sbJavascript.Append(jsApplicationPath + "Scripts/Tariff/BasisOFCharge.js" + ",");
             
                    break;
                case "PAGECREATION":
                    sbJavascript.Append(jsApplicationPath + "JScript/Master/PageCreation.js" + ",");

                    break;

                default: break;

               
            }

            return sbJavascript.ToString().Split(",".ToCharArray(), StringSplitOptions.RemoveEmptyEntries);
        }
        #endregion

        #region StyleSheetReference
        /// <summary>
        /// The get style sheet master page reference.
        /// </summary>
        /// <returns>
        /// An array of string that contains the locations of the css files that needs to be loaded.
        /// </returns>
        public string[] GetStyleSheetReference(string pageNames)
        {

            string[] pageNameArrary = HttpContext.Current.Request.Url.ToString().Split('?');
            string pageName = pageNameArrary[0];

            Regex regex = new Regex("\\w*.aspx");
            if (regex.Matches(pageName).Count == 0)
                return null;
            string cssApplicationPath = pageName.Replace(HttpContext.Current.Request.CurrentExecutionFilePath, string.Empty) + HttpContext.Current.Request.ApplicationPath + "/";



            pageName = regex.Matches(pageName)[0].Value.Replace(".aspx", string.Empty);
            if (pageNameArrary.Length > 1)
            {
                pageName = pageNames;
            }
            string cssApplication = cssApplicationPath + "Styles/Application.css" + currentVersion;
            string cssKendoCommon = cssApplicationPath + "Styles/Grid/kendo.common.min.css" + currentVersion;
            string cssKendoBlueopal = cssApplicationPath + "Styles/Grid/kendo.silver.min.css" + currentVersion;
            string cssSite = cssApplicationPath + "Styles/Site.css" + currentVersion;
            string cssValidate = cssApplicationPath + "Styles/validator.theme.red.css" + currentVersion;
            string cssMessage = cssApplicationPath + "Styles/CfiMessage.css" + currentVersion;
            string cssMessageResp = cssApplicationPath + "Styles/CfiMessageResponsive.css" + currentVersion;
            string cssUi = cssApplicationPath + "Styles/jquery-ui/jquery-ui-1.10.2.custom.css" + currentVersion;
            string cssAppend = cssApplicationPath + "Styles/jquery.appendGrid-1.3.1.css" + currentVersion;
            StringBuilder sbCss = new StringBuilder();
            sbCss.Append(cssApplication + "," + cssKendoCommon + "," + cssKendoBlueopal + "," + cssSite + "," + cssValidate + "," + cssMessage+","+cssMessageResp+",");

            switch (pageName)
            {
                case "Home":
                    //sbCss.Append(cssDashboardHome + ",");
                    break;
                case "BUCKETDAYSDISCOUNTING":
                    sbCss.Append(cssApplicationPath + "Styles/Master/DaysDiscounting.css");
                    break;
                case "BUCKETRATEDISCOUNTING":
                    sbCss.Append(cssApplicationPath + "Styles/RateDiscounting/RateDiscounting.css");
                    break;
                case "BUCKETCLASS":
                    sbCss.Append(cssApplicationPath + "Styles/Bucket/BucketClass.css");
                    break;
                case "BOOKING":
                    sbCss.Append(cssApplicationPath + "Styles/Shipment/Booking.css");
                    break;
                case "FLIGHTWISEBUCKETCLASS":
                    sbCss.Append(cssApplicationPath + "Styles/Bucket/FlightWiseBucketClass.css");
                    break;
                case "PENALTYCHARGES":
                    sbCss.Append(cssApplicationPath + "Styles/Penalty/PenaltyCharges.css");
                    break;
                case "SPACEALLOCATIONREPORT":
                    sbCss.Append(cssApplicationPath + "Styles/Shipment/Booking.css");
                    break;
                case "RATESIMULATOR":
                    sbCss.Append(cssApplicationPath + "styles/Master/RateSimulator.css" + ",");
                    break;
                case "ALLOCATIONSIMULATOR":
                    sbCss.Append(cssApplicationPath + "styles/Master/RateSimulator.css" + ",");
                    break;
                case "REVENUESIMULATOR":
                    sbCss.Append(cssApplicationPath + "styles/Master/RateSimulator.css" + ",");
                    break;
                default:
                    break;
            }

            return sbCss.ToString().Split(",".ToCharArray(), StringSplitOptions.RemoveEmptyEntries);

        }
        #endregion


        public void InsertExceptionIntoDatabase(bool sendMail, Exception innerException, Type type)
        {

            CargoFlash.Cargo.Business.Common.insertAppException(innerException);
            //List<ROMSException> listException = new List<ROMSException>();
            //Exception InnerException = innerException;

            //var romsException = new ROMSException
            //{
            //    //innerException = innerException,
            //    TypeName = type.FullName.ToString(),
            //    AssemblyVersion = Assembly.GetExecutingAssembly().ToString(),
            //    ApplicationDomainName = AppDomain.CurrentDomain.FriendlyName.ToString(),
            //    AssemblyName = System.Reflection.Assembly.GetExecutingAssembly().FullName,
            //    ClientDetails = HttpContext.Current.Request.ServerVariables["ALL_HTTP"].ToString(),
            //    DateTimeOfException =System.DateTime.Now,
            //    MachineName = Environment.MachineName.ToString(),
            //    Message = innerException.Message.ToString(),
            //    RequestedUrl = HttpContext.Current.Request.Url.ToString(),
            //    Source = innerException.Source.ToString(),
            //    StackTrace = innerException.StackTrace.ToString(),

            //    ThreadId = Thread.CurrentThread.ManagedThreadId.ToString(),
            //    ThreadUser = Thread.CurrentPrincipal.ToString(),

            //    UserId = "",

            //};
            //listException.Add(romsException);
            //object datalist = (object)listException;
            //this.MyAppID = "ROMSException";
            //this.MyModuleID = "ROMSException";

            //DataOperationService("FORMACTION.SAVE", datalist, MyModuleID, MyAppID);
         
        }


        public string ReadServerMessages(int msgKey, string ClassName)
        {
            string path = AppDomain.CurrentDomain.BaseDirectory + "Messages/" + ClassName + ".xml";
            XElement webformDocument = XElement.Load(path);
            IEnumerable<XElement> MessageXML = from messageXML in webformDocument.Elements("ServerMessage") where (int)messageXML.Element("Key") == msgKey select messageXML;
            if (MessageXML.Count() > 0)
                return MessageXML.First().Element("value").ToString();
            else
                return "Operation Executed Successfully.";
        }
    }
}
