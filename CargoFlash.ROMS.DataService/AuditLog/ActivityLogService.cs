using System;
using System.Collections.Generic;
using System.Linq;
using System.ServiceModel;
using System.ServiceModel.Activation;
using System.Text;
using CargoFlash.SoftwareFactory.Data;
using System.Data;
using System.Data.SqlClient;
using System.Configuration;
using CargoFlash.Cargo.Model.Shipment;
using CargoFlash.SoftwareFactory.WebUI.Controls;
using CargoFlash.SoftwareFactory.WebUI;
using System.ServiceModel.Web;
using System.IO;
using CargoFlash.SoftwareFactory.WebUI.Adapters;
using System.Globalization;
using KLAS.Business.EDI;
using CargoFlash.Cargo.Business;
using Newtonsoft.Json;
using System.Net;

namespace CargoFlash.Cargo.DataService.AuditLog
{

    [GlobalErrorHandlerBehaviour(typeof(GlobalErrorHandler))]   [ServiceBehavior(IncludeExceptionDetailInFaults = true)]
    [AspNetCompatibilityRequirements(RequirementsMode = AspNetCompatibilityRequirementsMode.Allowed)]
    public class ActivityLogService : BaseWebUISecureObject, IActivityLogService
    {


        public Stream GetWebForm(string processName, string moduleName, string appName, string formAction, string IsSubModule)
        {
            return BuildWebForm(processName, moduleName, appName, formAction, "", (IsSubModule == "1"));
        }

        private Stream BuildWebForm(string processName, string moduleName, string appName, string formAction, string recordID = "", bool IsSubModule = true, string PageName = "", string AWBSNo = "", string CheckListTypeSNo = "", string userid = "", string module = "", string pageName = "", string actionName = "", string fromDate = "", string toDate = "")
        {
            try
            { 
            this.DisplayMode = "FORMACTION." + formAction.ToUpper().Trim();
            StringBuilder myCurrentForm = new StringBuilder();
            switch (this.DisplayMode)
            {
                case DisplayModeNew:
                    using (HtmlFormGenerator htmlFormAdapter = new HtmlFormGenerator(processName))
                    {
                        htmlFormAdapter.DisplayMode = DisplayModeType.New;
                        myCurrentForm.Append(htmlFormAdapter.InstantiateIn(moduleName, appName, formAction, IsSubModule: IsSubModule));
                    }
                    break;
                case DisplayModeSearch:
                    using (HtmlFormGenerator htmlFormAdapter = new HtmlFormGenerator(processName))
                    {
                        htmlFormAdapter.DisplayMode = DisplayModeType.Search;
                        myCurrentForm.Append(htmlFormAdapter.InstantiateIn(moduleName, appName, formAction, IsSubModule: IsSubModule));
                    }
                    break;
                case DisplayModeDuplicate:

                    break;
                case DisplayModeEdit:

                    break;
                case DisplayModeDelete:

                    break;
                case DisplayModeIndexView:
                    switch (processName)
                    {
                        //case "FWB":
                        //    if (appName.ToUpper().Trim() == "BOOKING")
                        //        CreateGrid(myCurrentForm, processName, OriginCity, DestinationCity, FlightNo, FlightDate, AWBPrefix, AWBNo, LoggedInCity);
                        //    else if (appName.ToUpper().Trim() == "HOUSEWAYBILL")
                        //        CreateHAWBGrid(myCurrentForm, AWBSNo);
                        //    else if (appName.ToUpper().Trim() == "SHIPPINGBILL")
                        //        CreateShippingBillGrid(myCurrentForm, AWBSNo: AWBSNo);
                        //    else if (appName.ToUpper().Trim() == "CHECKLIST")
                        //        CreateCheckListDetailGrid(myCurrentForm, AWBSNo: AWBSNo, CheckListTypeSNo: "5");
                        //    //-- RH 030815 starts
                        //    else if (appName.ToUpper().Trim() == "CHECKLIST_SPHC")
                        //        CreateCheckListDetailGrid(myCurrentForm, AWBSNo: AWBSNo, CheckListTypeSNo: "-1");
                        //    else if (appName.ToUpper().Trim() == "EDIDETAILS")
                        //        CreateEDIGrid(myCurrentForm, AWBNo, FlightDate, FlightNo);
                        //    //-- RH 030815 ends
                        //    break;
                        //case "TRANSITFWB":
                        //    if (appName.ToUpper().Trim() == "BOOKING")
                        //        CreateTransitGrid(myCurrentForm, processName, OriginCity, DestinationCity, FlightNo, FlightDate, AWBPrefix, AWBNo, LoggedInCity);
                        //    break;
                        //default:
                        //    break;
                    }
                    //if (processName == "HOUSE" && appName.ToUpper().Trim() == "BOOKING")
                    //{

                    //}


                    //else if (appName.ToUpper().Trim() == "FLIGHTCONTROL")
                    //    CreateFlightControlGrid(myCurrentForm, OriginCity, DestinationCity, FlightNo, FlightDate,FlightStatus, LoggedInCity);
                    //else if (appName.ToUpper().Trim() == "FLIGHTAWB")
                    //    CreateFlightAWBGrid(myCurrentForm,FlightSNo);
                    break;
                case DisplayModeReadView:

                    break;
                default:
                    break;
            }
            byte[] resultMyForm = Encoding.UTF8.GetBytes(myCurrentForm.ToString());
            WebOperationContext.Current.OutgoingResponse.ContentType = "text/html";
            return new MemoryStream(resultMyForm);
            }
            catch(Exception ex)//
            {
                throw ex;
            }
        }

    }
}
