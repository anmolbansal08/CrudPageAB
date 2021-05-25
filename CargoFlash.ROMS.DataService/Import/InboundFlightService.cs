using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.ServiceModel;
using System.ServiceModel.Activation;
using System.Configuration;
using System.Data;
using System.Data.SqlClient;
using CargoFlash.Cargo.Model.Import;
using CargoFlash.SoftwareFactory.Data;
using CargoFlash.Cargo.Business;
using Newtonsoft.Json;
using System.IO;
using System.ServiceModel.Web;
using CargoFlash.SoftwareFactory.WebUI.Adapters;
using System.Globalization;
using CargoFlash.SoftwareFactory.WebUI.Controls;
using CargoFlash.SoftwareFactory.WebUI;
using KLAS.Business.EDI;
using System.Collections;
using System.Net;

namespace CargoFlash.Cargo.DataService.Import
{
    [GlobalErrorHandlerBehaviour(typeof(GlobalErrorHandler))]
    [ServiceBehavior(IncludeExceptionDetailInFaults = true)]
    [AspNetCompatibilityRequirements(RequirementsMode = AspNetCompatibilityRequirementsMode.Allowed)]
    public class InboundFlightService : BaseWebUISecureObject, IInboundFlightService
    {
        public Stream GetWebForm(GetWebForm model)
        {
            return BuildWebForm(model.processName, model.moduleName, model.appName, model.Action, "", (model.IsSubModule == "1"));
        }

        public string GetFlightArrivalFlightInformation(Int32 DailyFlightSno)
        {
            try
            {
                SqlParameter[] Parameters = { new SqlParameter("@DailyFlightSNo", DailyFlightSno) };
                DataSet ds = SqlHelper.ExecuteDataset(DMLConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, "FA_GetFlightArrivalFlightInformation", Parameters);
                ds.Dispose();
                return CargoFlash.Cargo.Business.Common.CompleteDStoJSON(ds);
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }

        public string GetFCReport(string DailyFlightSNo, string ClosedOn)
        {
            try
            {
                SqlParameter[] Parameters = {
                        new SqlParameter("@DailyFlightSNo", DailyFlightSNo),
                        new SqlParameter("@ClosedOn", ClosedOn),
                };
                DataSet ds = SqlHelper.ExecuteDataset(DMLConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, "FA_GetFCReport", Parameters);

                ds.Dispose();
                return CargoFlash.Cargo.Business.Common.CompleteDStoJSON(ds);
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }

        public string GetFlightCloseDetalil(string DailyFlightSNo)
        {
            try
            {
                SqlParameter[] Parameters = { new SqlParameter("@DailyFlightSNo", DailyFlightSNo) };
                DataSet ds = SqlHelper.ExecuteDataset(DMLConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, "GetFlightCloseDetalil", Parameters);

                ds.Dispose();
                return CargoFlash.Cargo.Business.Common.CompleteDStoJSON(ds);
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }

        public string GetULDReport(string FFMFlightMasterSNo)
        {
            try
            {
                SqlParameter[] Parameters = { new SqlParameter("@FFMFlightMasterSNo", FFMFlightMasterSNo), new SqlParameter("@UpdatedBy", ((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).UserSNo.ToString()) };
                DataSet ds = SqlHelper.ExecuteDataset(DMLConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, "FA_GetULDReport", Parameters);
                ds.Dispose();
                return CargoFlash.Cargo.Business.Common.CompleteDStoJSON(ds);
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }

        public Stream GetGridData(GetGridData model)
        {
            return BuildWebForm(model.processName, model.moduleName, model.appName, "IndexView", SearchAirlineCarrierCode: model.SearchAirlineCarrierCode, SearchBoardingPoint: model.SearchBoardingPoint, searchFromDate: model.searchFromDate, searchToDate: model.searchToDate, StartTime: model.StartTime, EndTime: model.EndTime, SearchFFMRcvd: model.SearchFFMRcvd,
                SearchQRT: model.SearchQRT, SearchSHCDGR: model.SearchSHCDGR, SearchTransitFlight: model.SearchTransitFlight, SearchFlightNo: model.SearchFlightNo, SearchConnectingFlights: model.SearchConnectingFlights, SearchFilterULDCounts: model.SearchFilterULDCounts, SearchFilterMCT: model.SearchFilterMCT, SearchFStatus: model.SearchFStatus);
        }

        private void CreateGrid(StringBuilder Container, string ProcessName, string SearchAirlineCarrierCode, string SearchBoardingPoint, string searchFromDate, string searchToDate, string StartTime, string EndTime, string SearchFFMRcvd, string SearchQRT, string SearchSHCDGR, string SearchTransitFlight, string SearchFlightNo, string SearchConnectingFlights, string SearchFilterULDCounts, string SearchFilterMCT, string SearchFStatus, bool isV2 = false)
        {
            using (Grid g = new Grid())
            {
                g.Height = 100;
                g.PageName = this.MyPageName;
                g.PrimaryID = this.MyPrimaryID;
                g.ModuleName = this.MyModuleID;
                g.AppsName = this.MyAppID;
                g.DataSoruceUrl = "Services/Import/InboundFlightService.svc/GetInboundFlightGridData";
                g.NewURL = MyPageName + "?" + GetWebURLString("New", false);
                g.ServiceModuleName = this.MyModuleID;
                g.UserID = this.MyUserID;
                g.FormCaptionText = "Inbound Flight";
                g.DefaultPageSize = 5;
                g.IsDisplayOnly = false;
                g.IsProcessPart = true;
                g.IsAllowedFiltering = false;
                g.IsVirtualScroll = false;
                g.IsActionRequired = false;
                g.IsShowGridHeader = false;
                g.ProcessName = ProcessName;
                g.SuccessGrid = "checkProgress";
                g.Column = new List<GridColumn>();
                g.Column.Add(new GridColumn { Field = "SNo", Title = "SNo", DataType = GridDataType.String.ToString(), IsHidden = true });
                g.Column.Add(new GridColumn { Field = "DailyFlightSNo", Title = "DailyFlightSNo", DataType = GridDataType.String.ToString(), IsHidden = true });
                g.Column.Add(new GridColumn { Field = "GroupFlightSNo", Title = "GroupFlightSNo", DataType = GridDataType.String.ToString(), IsHidden = true });
                g.Column.Add(new GridColumn { Field = "IsFlightClosed", Title = "IsFlightClosed", DataType = GridDataType.String.ToString(), IsHidden = true, Width = 15, Template = "<span title=\"#= IsFlightClosed #\">#= IsFlightClosed #</span>" });
                g.Column.Add(new GridColumn { Field = "FFMFlightMasterSNo", Title = "FFMFlightMasterSNo", DataType = GridDataType.String.ToString(), IsHidden = true });
                g.Column.Add(new GridColumn { Field = "IsFFM", Title = "IsFFM", DataType = GridDataType.Boolean.ToString(), IsHidden = true });
                g.Column.Add(new GridColumn { Field = "BoardingPoint", Title = "Board", DataType = GridDataType.String.ToString(), Width = 18, Template = "<span title=\"#= BoardingPoint #\">#= BoardingPoint #</span>" });
                g.Column.Add(new GridColumn { Field = "OffPoint", Title = "Off", DataType = GridDataType.String.ToString(), Width = 15, Template = "<span title=\"#= OffPoint #\">#= OffPoint #</span>" });
                g.Column.Add(new GridColumn { Field = "EndPoint", Title = "End", DataType = GridDataType.String.ToString(), IsHidden = true });
                g.Column.Add(new GridColumn { Field = "Route", Title = "Route", DataType = GridDataType.String.ToString(), Width = 40, Template = "<span title=\"#= Route #\">#= Route #</span>" });
                g.Column.Add(new GridColumn { Field = "FlightNo", Title = "Flight No/TR", DataType = GridDataType.String.ToString(), Width = 40, Template = "<span class=\"actionView\" style=\"cursor:pointer;color:Blue;\" onclick=\"GetInboundFlightDetails(this,#=FFMFlightMasterSNo#);\">#=FlightNo#</span>" });
                g.Column.Add(new GridColumn { Field = "FlightDate", Title = "Flight Date", DataType = GridDataType.Date.ToString(), Width = 30 });
                g.Column.Add(new GridColumn { Field = "ETA1", Title = "STA", DataType = GridDataType.String.ToString(), Width = 60 });
                g.Column.Add(new GridColumn { Field = "ATA", Title = "ATA", DataType = GridDataType.String.ToString(), Width = 60 });
                g.Column.Add(new GridColumn { Field = "ATD", Title = "ATD", DataType = GridDataType.String.ToString(), Width = 60 });
                g.Column.Add(new GridColumn { Field = "Equipment", Title = "Pcs/Gwt", DataType = GridDataType.String.ToString(), Width = 15, Template = "<span title=\"#= Equipment #\">#= Equipment #</span>" });
                g.Column.Add(new GridColumn { Field = "PomEquipment", Title = "POM Pcs/Gwt", DataType = GridDataType.String.ToString(), Width = 16, Template = "<span title=\"#= PomEquipment #\">#= PomEquipment #</span>" });
                g.Column.Add(new GridColumn { Field = "AirCraftRegnNo", Title = "AC. Rgn", DataType = GridDataType.String.ToString(), Width = 28, Template = "<span title=\"#= AirCraftRegnNo #\">#= AirCraftRegnNo #</span>" });
                g.Column.Add(new GridColumn { Field = "MVT", Title = "MVT", DataType = GridDataType.String.ToString(), Width = 15, Template = "#if(MVT==\"1\"){#<span style=\"color: Green;font-weight:bold;\" >✔</span>#} else {#<span style=\"color: Red;font-weight:bold;\" >✖</span>#}#" });
                g.Column.Add(new GridColumn { Field = "FFM", Title = "FFM", DataType = GridDataType.String.ToString(), Width = 15, Template = "#if(FFM==\"1\"){#<span style=\"color: Green;font-weight:bold;\" >✔</span>#} else {#<span style=\"color: Red;font-weight:bold;\" >✖</span>#}#" });
                g.Column.Add(new GridColumn { Field = "CPM", Title = "CPM", DataType = GridDataType.String.ToString(), Width = 15, Template = "#if(CPM==\"1\"){#<span style=\"color: Green;font-weight:bold;\" >✔</span>#} else {#<span style=\"color: Red;font-weight:bold;\" >✖</span>#}#" });
                g.Column.Add(new GridColumn { Field = "FWB", Title = "FWB", DataType = GridDataType.String.ToString(), Width = 15 });
                g.Column.Add(new GridColumn { Field = "FHL", Title = "FHL", DataType = GridDataType.String.ToString(), Width = 15 });
                g.Column.Add(new GridColumn { Field = "TotalAWBCount", Title = "AWB", DataType = GridDataType.String.ToString(), Width = 18 });
                g.Column.Add(new GridColumn { Field = "TotalCourierCount", Title = "COU", DataType = GridDataType.String.ToString(), Width = 20 });
                g.Column.Add(new GridColumn { Field = "TotalPOMailCount", Title = "PO MAIL", DataType = GridDataType.String.ToString(), Width = 26 });
                g.Column.Add(new GridColumn { Field = "ULDCount", Title = "ULD", DataType = GridDataType.String.ToString(), Width = 20, Template = "<span class=\"actionView\" style=\"cursor:pointer;color:Blue;\" onclick=\"GetULDReport(this,#=FFMFlightMasterSNo#);\">#=ULDCount#</span>" });
                g.Column.Add(new GridColumn { Field = "POMULDCount", Title = "PO MAIL ULD", DataType = GridDataType.String.ToString(), Width = 40, Template = "#if(POMULDCount>0){#<span class=\"actionView\" style=\"cursor:pointer;color:Blue;\" onclick=\"GetPOMailULDReport(this,#=FFMFlightMasterSNo#,#=POMULDCount#);\">#=POMULDCount#</span>#} else  {#<span style=\"color:blue;\" >0</span>#}#" });
                g.Column.Add(new GridColumn { Field = "SHCDGR", Title = "SHC/DGR", DataType = GridDataType.String.ToString(), Width = 28 });
                g.Column.Add(new GridColumn { Field = "QRT", Title = "QRT", DataType = GridDataType.String.ToString(), Width = 15 });
                g.Column.Add(new GridColumn { Field = "PIL", Title = "PIL", DataType = GridDataType.String.ToString(), Width = 15 });
                g.Column.Add(new GridColumn { Field = "MCT", Title = "MCT", DataType = GridDataType.String.ToString(), Width = 15 });
                g.Column.Add(new GridColumn { Field = "ConnectingFlights", Title = "Con. Flt", DataType = GridDataType.String.ToString(), Width = 25 });
                g.Column.Add(new GridColumn { Field = "Status", Title = "Status", DataType = GridDataType.String.ToString(), Width = 38 });
                g.Column.Add(new GridColumn { Field = "FCReport", Title = "FC Report", IsHidden = false, DataType = GridDataType.String.ToString(), Width = 30, Template = "# if( Status==\"FC Pending\") {# # } else {#<a onclick=\"GetFCReport(this,#=DailyFlightSNo#);\" style=\"cursor:pointer;\" ><i class=\"fa fa-download fa-2x\"></i></a>#}#" });
                g.Column.Add(new GridColumn { Field = "IsArrivalStatus", Title = "IsArrivalStatus", DataType = GridDataType.String.ToString(), IsHidden = true, Template = "<span id=\"spnIsArrivalStatus\">#=IsArrivalStatus#</span>" });
                g.ExtraParam = new List<GridExtraParam>();
                g.ExtraParam.Add(new GridExtraParam { Field = "SearchAirlineCarrierCode", Value = SearchAirlineCarrierCode });
                g.ExtraParam.Add(new GridExtraParam { Field = "SearchBoardingPoint", Value = SearchBoardingPoint });
                g.ExtraParam.Add(new GridExtraParam { Field = "searchFromDate", Value = searchFromDate });
                g.ExtraParam.Add(new GridExtraParam { Field = "searchToDate", Value = searchToDate });
                g.ExtraParam.Add(new GridExtraParam { Field = "StartTime", Value = StartTime });
                g.ExtraParam.Add(new GridExtraParam { Field = "EndTime", Value = EndTime });
                g.ExtraParam.Add(new GridExtraParam { Field = "SearchFFMRcvd", Value = SearchFFMRcvd });
                g.ExtraParam.Add(new GridExtraParam { Field = "SearchQRT", Value = SearchQRT });
                g.ExtraParam.Add(new GridExtraParam { Field = "SearchSHCDGR", Value = SearchSHCDGR });
                g.ExtraParam.Add(new GridExtraParam { Field = "SearchTransitFlight", Value = SearchTransitFlight });
                g.ExtraParam.Add(new GridExtraParam { Field = "SearchFlightNo", Value = SearchFlightNo });
                g.ExtraParam.Add(new GridExtraParam { Field = "SearchConnectingFlights", Value = SearchConnectingFlights });
                g.ExtraParam.Add(new GridExtraParam { Field = "SearchFilterULDCounts", Value = SearchFilterULDCounts });
                g.ExtraParam.Add(new GridExtraParam { Field = "SearchFilterMCT", Value = SearchFilterMCT });
                g.ExtraParam.Add(new GridExtraParam { Field = "SearchFStatus", Value = SearchFStatus });
                g.InstantiateIn(Container, isV2);
            }
        }

        public Stream GetFlightArrivalShipmentGrid(GetFlightArrivalShipmentGrid model)
        {
            return BuildWebForm(model.processName, model.moduleName, model.appName, "IndexView", FFMFlightMasterSNo: model.FFMFlightMasterSNo);
        }

        private Stream BuildWebForm(string processName, string moduleName, string appName, string formAction, string recordID = "", bool IsSubModule = true, string SearchAirlineCarrierCode = "", string SearchBoardingPoint = "", string searchFromDate = "", string searchToDate = "", string StartTime = "", string EndTime = "", string DailyFlightSNo = "0", string FFMFlightMasterSNo = "0", string ULDNo = "0", string SearchFFMRcvd = "0", string SearchQRT = "0", string SearchSHCDGR = "0", string SearchTransitFlight = "0", string SearchFlightNo = "", string SearchConnectingFlights = "0", string SearchFilterULDCounts = "0", string SearchFilterMCT = "0", string SearchFStatus = "")
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
                        case "InboundFlight":
                            {
                                switch (appName)
                                {
                                    case "INBOUNDFLIGHT":
                                        CreateGrid(myCurrentForm, processName, SearchAirlineCarrierCode, SearchBoardingPoint, searchFromDate, searchToDate, StartTime, EndTime, SearchFFMRcvd, SearchQRT, SearchSHCDGR, SearchTransitFlight, SearchFlightNo, SearchConnectingFlights, SearchFilterULDCounts, SearchFilterMCT, SearchFStatus, isV2: true);
                                        break;
                                    default:
                                        break;
                                }
                                break;
                            }
                        case "FlightArrival":
                            {
                                switch (appName)
                                {
                                    case "FlightArrivalShipment":
                                        CreateNestedFligthArrivalalLDGrid(myCurrentForm, FFMFlightMasterSNo);
                                        break;
                                    case "FlightArrivalStopOverShipment":
                                        CreateNestedStopOverFligthArrivalalLDGrid(myCurrentForm, FFMFlightMasterSNo);
                                        break;
                                }
                                break;
                            }
                        case "InboundFlightInformation":
                            {
                                CreateInboundFlightInformationGrid(myCurrentForm, processName, FFMFlightMasterSNo, isV2: true);
                                break;
                            }
                        case "InboundFlightULDInformation":
                            {
                                CreateInboundFlightULDInformationGrid(myCurrentForm, processName, ULDNo, isV2: true);
                                break;
                            }
                        case "InboundFlightULDInfo":
                            {
                                CreateInboundFlightULDInfoGrid(myCurrentForm, processName, FFMFlightMasterSNo, isV2: true);
                                break;
                            }
                        default:
                            break;
                    }
                    break;
                case DisplayModeReadView:
                    break;
                default:
                    break;
            }
            // myCurrentForm.Append("<div id='divInboundEPouch_' style='width:100%'><div id='divInboundEPouch' style='width:100%'> <input id='hdnPageType' name='hdnFlightEPouchSNo' type='hidden'/><table id='tblInboundEPouch' validateonsubmit='true' class='WebFormTable' style='width:100%'></table></div></div>");
            byte[] resultMyForm = Encoding.UTF8.GetBytes(myCurrentForm.ToString());
            WebOperationContext.Current.OutgoingResponse.ContentType = "text/html";
            return new MemoryStream(resultMyForm);
        }

        private void CreateNestedStopOverFligthArrivalalLDGrid(StringBuilder Container, string FFMFlightMasterSNo = "")
        {
            using (NestedGrid g = new NestedGrid())
            {
                g.Height = 100;
                g.PageName = this.MyPageName;
                g.PrimaryID = this.MyPrimaryID;
                g.ModuleName = this.MyModuleID;
                g.AppsName = this.MyAppID;
                g.DataSoruceUrl = "Services/Import/InboundFlightService.svc/GetFlightArrivalStopULDGridData";
                g.NewURL = MyPageName + "?" + GetWebURLString("New", false);
                g.FormCaptionText = "Stop Over Details";
                g.DefaultPageSize = 5;
                g.IsDisplayOnly = true;
                g.PrimaryID = "ULDNo";
                g.IsAllowedFiltering = false;
                g.IsProcessPart = true;
                g.IsDisplayOnly = false;
                g.IsAllowedAction = false;
                g.IsFormHeader = false;
                g.IsModule = true;
                g.IsShowEdit = false;
                g.DefaultPageSize = 100;
                g.IsSaveChanges = false;
                g.ProcessName = "FAULDInfo";
                g.Column = new List<GridColumn>();
                g.Column.Add(new GridColumn { Field = "DailyFlightSNo", Title = "DailyFlightSNo", DataType = GridDataType.String.ToString(), IsHidden = true, Width = 90 });
                g.Column.Add(new GridColumn { Field = "FFMFlightMasterSNo", Title = "FFMFlightMasterSNo", DataType = GridDataType.String.ToString(), IsHidden = true });
                g.Column.Add(new GridColumn { Field = "ULDNo", Title = "ULDNo", DataType = GridDataType.String.ToString(), IsHidden = false, Width = 60 });
                g.Column.Add(new GridColumn { Field = "Route", IsLocked = false, Title = "Route", DataType = GridDataType.String.ToString(), Width = 29 });
                g.Column.Add(new GridColumn { Field = "AWBCount", Title = "AWB Count", DataType = GridDataType.Number.ToString(), Width = 30 });
                g.Column.Add(new GridColumn { Field = "OSI", IsLocked = false, Title = "OSI", DataType = GridDataType.String.ToString(), Width = 15, Template = "<span title=\"#= OSI #\">#= OSI #</span>" });
                g.Column.Add(new GridColumn { Field = "COR", IsLocked = false, Title = "COR", DataType = GridDataType.String.ToString(), Width = 15, Template = "<span title=\"#= COR #\">#= COR #</span>" });
                g.Column.Add(new GridColumn { Field = "FFMPieces", Title = "Offload Pieces", DataType = GridDataType.String.ToString(), Width = 30, Template = "<span title=\"#= FFMPieces #\">#= FFMPieces #</span>" });
                g.Column.Add(new GridColumn { Field = "IsDisplay", Title = "Offload", DataType = GridDataType.String.ToString(), Width = 40, Template = "#if (ULDNo ==\"BULK\"){# #}else if(MoveToSegregation==\"1\") {#<input type=\"button\" class=\"incompleteprocess\" value=\"Move To Segregation\" onclick=\"HighLightGridButton(this,event);OffloadedStopOverULDAndShipment(#=DailyFlightSNo#,#=FFMFlightMasterSNo#,#=FFMShipmentTransSNo#,#=ULDStockSNo#,#=Pieces#,#=MoveToSegregation#,this)\" /> # } else if(IsDisplay==\"0\"){#<input type=\"button\" class=\"completeprocess\" style=\"cursor: not-allowed\" value=\"Offloaded\" \" />#} else if(status==\"1\" ){#<input type=\"button\" class=\"completeprocess\" style=\"cursor: not-allowed\" value=\"Offloaded\" \" />#} else{#<input type=\"button\" class=\"incompleteprocess\" value=\"O\" onclick=\"HighLightGridButton(this,event);OffloadedStopOverULDAndShipment(#=DailyFlightSNo#,#=FFMFlightMasterSNo#,#=FFMShipmentTransSNo#,#=ULDStockSNo#,#=Pieces#,#=0#,this)\" />#}# " });
                g.ExtraParam = new List<GridExtraParams>();
                g.ExtraParam.Add(new GridExtraParams { Field = "FFMFlightMasterSNo", Value = FFMFlightMasterSNo });
                //#region Nested Grid Section
                g.NestedPrimaryID = "AWBNo";
                g.NestedModuleName = this.MyModuleID;
                g.NestedAppsName = this.MyAppID;
                g.NestedParentID = "ULDNo";
                g.NestedIsShowEdit = false;
                g.NestedDefaultPageSize = 1000;
                g.NestedHeight = 300;
                g.NestedIsPageable = false;
                g.IsNestedAllowedFiltering = false;
                g.IsNestedAllowedSorting = false;
                g.IsNestedChild = true;
                g.NestedProcessName = "FAShipmentInfo";
                g.NestedDataSoruceUrl = "Services/Import/InboundFlightService.svc/GetFlightArrivalStopShipmentGridData";
                g.NestedColumn = new List<GridColumn>();
                g.NestedColumn.Add(new GridColumn { Field = "DailyFlightSNo", Title = "DailyFlightSNo", DataType = GridDataType.String.ToString(), IsHidden = true, Width = 90 });
                g.NestedColumn.Add(new GridColumn { Field = "FFMFlightMasterSNo", Title = "FFMFlightMasterSNo", DataType = GridDataType.String.ToString(), IsHidden = true });
                g.NestedColumn.Add(new GridColumn { Field = "FFMShipmentTransSNo", Title = "FFMShipmentTransSNo", DataType = GridDataType.String.ToString(), IsHidden = true });
                g.NestedColumn.Add(new GridColumn { Field = "ArrivedShipmentSNo", Title = "ArrivedShipmentSNo", DataType = GridDataType.String.ToString(), IsHidden = true, Width = 90 });
                g.NestedColumn.Add(new GridColumn { Field = "AWBSNo", Title = "AWBSNo", DataType = GridDataType.String.ToString(), IsHidden = true, Width = 90 });
                g.NestedColumn.Add(new GridColumn { Field = "TotalFFMPieces", Title = "TotalFFMPieces", DataType = GridDataType.String.ToString(), IsHidden = true });
                g.NestedColumn.Add(new GridColumn { Field = "AWBNo", IsLocked = false, Title = "MAWB", DataType = GridDataType.String.ToString(), Width = 29 });
                g.NestedColumn.Add(new GridColumn { Field = "ShipmentOriginAirportCode", IsLocked = false, Title = "Origin", DataType = GridDataType.String.ToString(), Width = 18 });
                g.NestedColumn.Add(new GridColumn { Field = "ShipmentDestinationAirportCode", IsLocked = false, Title = "Dest", DataType = GridDataType.String.ToString(), Width = 18 });
                g.NestedColumn.Add(new GridColumn { Field = "NatureOfGoods", IsLocked = false, Title = "Nature Of Goods", DataType = GridDataType.String.ToString(), Width = 35, Template = "<span title=\"#= NatureOfGoods #\">#= NatureOfGoods #</span>" });
                g.NestedColumn.Add(new GridColumn { Field = "SPHC", Title = "SHC", IsHidden = false, DataType = GridDataType.String.ToString(), Width = 17, Template = "<span title=\"#= SPHC #\">#= SPHC #</span>" });
                g.NestedColumn.Add(new GridColumn { Field = "Priority", Title = "Priority", DataType = GridDataType.String.ToString(), Width = 20 });
                g.NestedColumn.Add(new GridColumn { Field = "TotalAWBPieces", Title = "AWB Pieces", DataType = GridDataType.Number.ToString(), Width = 30 });
                g.NestedColumn.Add(new GridColumn { Field = "LoadDetails", IsLocked = false, Title = "Build/Load Details", IsHidden = true, DataType = GridDataType.String.ToString(), Width = 38 });
                g.NestedColumn.Add(new GridColumn { Field = "OSI", IsLocked = false, Title = "OSI", DataType = GridDataType.String.ToString(), Width = 15, Template = "<span title=\"#= OSI #\">#= OSI #</span>" });
                g.NestedColumn.Add(new GridColumn { Field = "COR", IsLocked = false, Title = "COR", DataType = GridDataType.String.ToString(), Width = 15, Template = "<span title=\"#= COR #\">#= COR #</span>" });
                g.NestedColumn.Add(new GridColumn { Field = "TotalPieces", IsLocked = false, Title = "Total Pieces", DataType = GridDataType.String.ToString(), Width = 18 });
                g.NestedColumn.Add(new GridColumn { Field = "GrossWeight", IsLocked = false, Title = "Gross Weight", DataType = GridDataType.String.ToString(), Width = 18 });
                g.NestedColumn.Add(new GridColumn { Field = "VolumeWeight", IsLocked = false, Title = "Volume Weight", DataType = GridDataType.String.ToString(), Width = 18 });
                g.NestedColumn.Add(new GridColumn { Field = "CBMWeight", IsLocked = false, Title = "CBM", DataType = GridDataType.String.ToString(), Width = 18 });
                g.NestedColumn.Add(new GridColumn { Field = "FFMPieces", Title = "Available Pieces", DataType = GridDataType.String.ToString(), Width = 30, Template = "#if(Pieces==\"0\" && ULDNo ==\"BULK\" ){#<input title=\"Received Pieces\" id=\"txtBulkRecPieces\" type=\"text\" disabled=\"true\"  process=\"FA Shp RcdPcs\" size=\"5\" maxlength=\"5\" value=\"#=Pieces#\" >#} else if (ULDNo ==\"BULK\"){#<input title=\"Received Pieces\" id=\"txtBulkRecPieces\" type=\"text\" onkeypress=\"return IsValidateNumber(this,event)\" onblur=\"GetRecPieces(this)\"  process=\"FA Shp RcdPcs\" size=\"5\" maxlength=\"5\" value=\"#=Pieces#\" ><span id=\"ffmpiecesvalue\" hidden=\"hidden\" title=\"#= FFMPieces #\">#= Pieces #</span><input type=\"hidden\" value=\"#=Pieces#\" id=\"textrecpiecesvalue\"> #}else{#<span   title=\"#= FFMPieces #\">#= FFMPieces #</span>#}#" });

                g.NestedColumn.Add(new GridColumn { Field = "AviOFLDGrossWeight", IsLocked = false, Title = "Gross Weight", DataType = GridDataType.String.ToString(), Width = 18, Template = "#if(Pieces==\"0\" && ULDNo ==\"BULK\" ){#<input title=\"Avi Ofld Wt\" id=\"txtAviOFLDGrossWeight\" type=\"text\"   size=\"10\" maxlength=\"10\" value=\"#=AviOFLDGrossWeight#\"  disabled=\"true\" >#} else if (ULDNo !=\"BULK\"){#<input title=\"Avi Ofld Wt\" id=\"txtAviOFLDGrossWeight\" type=\"text\" onkeypress=\"return ValidateFloatKeyPress(this,event)\"  size=\"10\" maxlength=\"10\" value=\"#=AviOFLDGrossWeight#\" onblur=\"GetAviOFLDGrossWeight(this)\" disabled=\"true\" >#}else{#<input title=\"Avi Ofld Wt\" id=\"txtAviOFLDGrossWeight\" type=\"text\" onkeypress=\"return ValidateFloatKeyPress(this,event)\"  size=\"10\" maxlength=\"10\" value=\"#=AviOFLDGrossWeight#\" onblur=\"GetAviOFLDGrossWeight(this)\"  >#}#" });

                g.NestedColumn.Add(new GridColumn { Field = "AviOFLDVolumeWeight", IsLocked = false, Title = "Volume Weight", DataType = GridDataType.String.ToString(), Width = 18, Template = "#if (Pieces==\"0\" && ULDNo ==\"BULK\"){#<input title=\"Avi Ofld Vol Wt\" id=\"txtAviOFLDVolumeWeight\" type=\"text\"   size=\"10\" maxlength=\"10\" value=\"#=AviOFLDVolumeWeight#\" disabled=\"true\" >#} else if (ULDNo !=\"BULK\"){#<input title=\"Avi Ofld Vol Wt\" id=\"txtAviOFLDVolumeWeight\" type=\"text\" onkeypress=\"return ValidateFloatKeyPress(this,event)\"  size=\"10\" maxlength=\"10\" value=\"#=AviOFLDVolumeWeight#\" onblur=\"GetAviOFLDVolumeWeight(this)\" disabled=\"true\" >#}else{#<input title=\"Avi Ofld Vol Wt\" id=\"txtAviOFLDVolumeWeight\" type=\"text\" onkeypress=\"return ValidateFloatKeyPress(this,event)\"  size=\"10\" maxlength=\"10\" value=\"#=AviOFLDVolumeWeight#\" onblur=\"GetAviOFLDVolumeWeight(this)\"  >#}#" });

                g.NestedColumn.Add(new GridColumn { Field = "AviOFLDCBM", IsLocked = false, Title = "CBM", DataType = GridDataType.String.ToString(), Width = 18, Template = "#if (Pieces==\"0\" && ULDNo ==\"BULK\"){#<input title=\"Avi Ofld CBM\" id=\"txtAviOFLDCBM\" type=\"text\"   size=\"10\" maxlength=\"10\" value=\"#=AviOFLDCBM#\"  disabled=\"true\" >#} else if (ULDNo !=\"BULK\"){#<input title=\"Avi Ofld CBM\" id=\"txtAviOFLDCBM\" type=\"text\" onkeypress=\"return ValidateFloatKeyPress(this,event)\"  size=\"10\" maxlength=\"10\" value=\"#=AviOFLDCBM#\" onblur=\"GetAviOFLDCBM(this)\" disabled=\"true\" >#}else{#<input title=\"Avi Ofld CBM\" id=\"txtAviOFLDCBM\" type=\"text\" onkeypress=\"return ValidateFloatKeyPress(this,event)\"  size=\"10\" maxlength=\"10\" value=\"#=AviOFLDCBM#\" onblur=\"GetAviOFLDCBM(this)\"  >#}#" });

                g.NestedColumn.Add(new GridColumn { Field = "OFLDPieces", IsLocked = false, Title = "OFLD Pieces", IsHidden = true, DataType = GridDataType.String.ToString(), Width = 18 });
                g.NestedColumn.Add(new GridColumn { Field = "OFLDGrossWeight", IsLocked = false, Title = "OFLD Gross Weight", IsHidden = true, DataType = GridDataType.String.ToString(), Width = 18 });
                g.NestedColumn.Add(new GridColumn { Field = "OFLDVolumeWeight", IsLocked = false, Title = " OFLD Volume Weight", IsHidden = true, DataType = GridDataType.String.ToString(), Width = 18 });
                g.NestedColumn.Add(new GridColumn { Field = "OFLDCBM", IsLocked = false, Title = "OFLD CBM", IsHidden = true, DataType = GridDataType.String.ToString(), Width = 18 });

                //g.NestedColumn.Add(new GridColumn { Field = "IsDisplay", Title = "Offload", DataType = GridDataType.String.ToString(), Width = 40, Template = "#if(IsDisplay==\"0\" ){#<input type=\"button\" class=\"completeprocess\" style=\"cursor: not-allowed\" value=\"Offloaded\" \" />#} else if(status==1){#<input type=\"button\" class=\"completeprocess\" style=\"cursor: not-allowed\" value=\"Offloaded\" \" />#} else if(ULDNo==\"BULK\") {#<input type=\"button\" class=\"incompleteprocess\" value=\"O\" onclick=\"HighLightGridButton(this,event);OffloadedStopOverULDAndShipment(#=DailyFlightSNo#,#=FFMFlightMasterSNo#,#=FFMShipmentTransSNo#,#=ULDStockSNo#,#=Pieces#,#=0#,this)\" />#}#" });
                g.NestedColumn.Add(new GridColumn { Field = "IsDisplay", Title = "Offload", DataType = GridDataType.String.ToString(), Width = 40, Template = "#if(IsDisplay==\"0\" ){#<input type=\"button\" class=\"completeprocess\" style=\"cursor: not-allowed\" value=\"Offloaded\" \" />#} else if(status==1){#<input type=\"button\" class=\"completeprocess\" style=\"cursor: not-allowed\" value=\"Offloaded\" \" />#} else if(ULDNo==\"BULK\") {if(MoveToSegregation==\"1\") {#<input type=\"button\" class=\"incompleteprocess\" value=\"Move To Segregation\" onclick=\"HighLightGridButton(this,event);OffloadedStopOverULDAndShipment(#=DailyFlightSNo#,#=FFMFlightMasterSNo#,#=FFMShipmentTransSNo#,#=ULDStockSNo#,#=Pieces#,#=MoveToSegregation#,this)\" /> # } else {#<input type=\"button\" class=\"incompleteprocess\" value=\"O\" onclick=\"HighLightGridButton(this,event);OffloadedStopOverULDAndShipment(#=DailyFlightSNo#,#=FFMFlightMasterSNo#,#=FFMShipmentTransSNo#,#=ULDStockSNo#,#=Pieces#,#=0#,this)\" />#}}#" });

                g.NestedExtraParam = new List<NestedGridExtraParam>();
                g.NestedExtraParam.Add(new NestedGridExtraParam { Field = "FFMFlightMasterSNo", Value = FFMFlightMasterSNo });
                g.InstantiateIn(Container);
            }
        }

        /// <summary>
        /// Added Flight Arrival Grid
        /// </summary>
        /// <param name="Container"></param>
        /// <param name="FlightSNo"></param>
        private void CreateNestedFligthArrivalalLDGrid(StringBuilder Container, string FFMFlightMasterSNo = "")
        {
            using (NestedGrid g = new NestedGrid())
            {
                g.Height = 100;
                g.PageName = this.MyPageName;
                g.PrimaryID = this.MyPrimaryID;
                g.ModuleName = this.MyModuleID;
                g.AppsName = this.MyAppID;
                g.DataSoruceUrl = "Services/Import/InboundFlightService.svc/GetFlightArrivalULDGridData";
                g.NewURL = MyPageName + "?" + GetWebURLString("New", false);
                g.FormCaptionText = "Arrived Details  <input type='checkbox' id='chkAll' name='chkAll'/> <input type='button' class='btn btn-block btn-primary btn-sm' id='btnArrive' value='Save' onclick='ArriveAllShipment()'/>";
                g.DefaultPageSize = 5;
                g.IsDisplayOnly = true;
                g.PrimaryID = "ULDNo";
                g.IsAllowedFiltering = false;
                g.IsProcessPart = true;
                g.IsDisplayOnly = false;
                g.IsAllowedAction = false;
                g.IsFormHeader = false;
                g.IsModule = true;
                g.IsShowEdit = false;
                g.DefaultPageSize = 100;
                g.IsSaveChanges = false;
                g.ProcessName = "FAULDInfo";
                g.ParentSuccessGrid = "fn_SuccessArrivalGrid";
                g.Column = new List<GridColumn>();
                g.Column.Add(new GridColumn { Field = "DailyFlightSNo", Title = "DailyFlightSNo", IsHidden = true, DataType = GridDataType.String.ToString(), Width = 50 });
                g.Column.Add(new GridColumn { Field = "FFMFlightMasterSNo", Title = "FFMFlightMasterSNo", IsHidden = true, DataType = GridDataType.String.ToString(), Width = 50 });
                g.Column.Add(new GridColumn { Field = "FFMShipmentTransSNo", Title = "FFMShipmentTransSNo", IsHidden = true, DataType = GridDataType.String.ToString(), Width = 50 });
                g.Column.Add(new GridColumn { Field = "IsULD", Title = "IsULD", IsHidden = true, DataType = GridDataType.String.ToString(), Width = 50 });
                g.Column.Add(new GridColumn { Field = "ULDNo", Title = "ULD/BULK", IsHidden = false, DataType = GridDataType.String.ToString(), Width = 65 });
                g.Column.Add(new GridColumn { Field = "BUP", Title = "BUP", IsHidden = false, DataType = GridDataType.String.ToString(), Width = 40 });
                g.Column.Add(new GridColumn { Field = "TotalPieces", Title = "Total Pcs", DataType = GridDataType.String.ToString(), Width = 42 });
                g.Column.Add(new GridColumn { Field = "TotalGrossWeight", Title = "Gross Wt", DataType = GridDataType.String.ToString(), Width = 42 });
                g.Column.Add(new GridColumn { Field = "SPHC", Title = "SHC", DataType = GridDataType.String.ToString(), Width = 40 });
                g.Column.Add(new GridColumn { Field = "Position", Title = "Position", IsHidden = false, DataType = GridDataType.String.ToString(), Width = 40 });
                if ((((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).SysSetting["ClientEnvironment"].ToString().ToUpper().Trim() == "GA") || (((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).SysSetting["IsEnvironment"].ToString().ToUpper().Trim() == "TRUE"))
                {
                    g.Column.Add(new GridColumn
                    {
                        Field = "IsThroughULD",
                        Title = "Through ULD",
                        IsHidden = false,
                        DataType = GridDataType.String.ToString(),
                        Width = 25,
                        Template = "#if(IsULD==0){} else if(IsManualIntactULD==1){#<input type=\"checkbox\" id=\"chkThroughULD\" name=\"chkThroughULD\" checked=\"#=IsThroughULD#\"/>#} else if(IsThroughULD==1 && IsChangedTULD==1){#<input type=\"checkbox\" id=\"chkThroughULD\" name=\"chkThroughULD\" checked=\"#=IsThroughULD#\"/>#} else if(IsThroughULD==0 && IsChangedTULD==0){#<input type=\"checkbox\" id=\"chkThroughULD\" name=\"chkThroughULD\" />#} else if(IsThroughULD==0 && IsChangedTULD==1){#<input type=\"checkbox\" id=\"chkThroughULD\" name=\"chkThroughULD\"/>#} else{#<input type=\"checkbox\" id=\"chkThroughULD\" name=\"chkThroughULD\" disabled=\"#=disabled#\"/>#}#"
                    });
                }
                else
                {
                    g.Column.Add(new GridColumn
                    {
                        Field = "IsThroughULD",
                        Title = "Through ULD",
                        IsHidden = false,
                        DataType = GridDataType.String.ToString(),
                        Width = 25,
                        Template = "#if(IsULD==0){} else if(IsChangedTULD==1 && IsThroughULD==1 && IsManualIntactULD==1){#<input type=\"checkbox\" id=\"chkThroughULD\" name=\"chkThroughULD\" checked=\"#=IsThroughULD#\" />#} else if(IsChangedTULD==1 && IsThroughULD==1 && IsManualIntactULD==0){#<input type=\"checkbox\" id=\"chkThroughULD\" name=\"chkThroughULD\" checked=\"#=IsThroughULD#\" disabled=\"#=disabled#\"/>#}else if(IsChangedTULD==1 && IsThroughULD==0){#<input type=\"checkbox\" id=\"chkThroughULD\" name=\"chkThroughULD\"  />#}else{#<span>#=ThroughULD#</span>#}#"
                    });
                }
                g.Column.Add(new GridColumn
                {
                    Field = "BreakDownStart",
                    Title = "Breakdown Start Time",
                    DataType = GridDataType.String.ToString(),
                    Width = 70,
                    Template = "<span class=\"actionView\" style=\"cursor:pointer;color:blue;\" id=\"spnBreakDownStart\" onclick=\"GetBreakdownStartTime(this)\" >#=BreakDownStart#</span>"
                });
                g.Column.Add(new GridColumn
                {
                    Field = "BreakDownEnd",
                    Title = "Breakdown End Time",
                    DataType = GridDataType.String.ToString(),
                    Width = 70,
                    Template = "<span class=\"actionView\" style=\"cursor:pointer;color:blue;\" id=\"spnBreakDownEnd\" onclick=\"GetBreakdownEndTime(this)\" >#=BreakDownEnd#</span>"
                });
                g.Column.Add(new GridColumn { Field = "ULDCheckedIn", Title = "ULD/BULK Checked In", DataType = GridDataType.String.ToString(), Width = 42 });
                g.Column.Add(new GridColumn { Field = "LoadingIndicator", Title = "Loading Indicator", DataType = GridDataType.String.ToString(), Width = 50, Template = "<span title=\"#= LoadingIndicator #\">#= LoadingIndicator #</span>" });
                g.Column.Add(new GridColumn { Field = "ULDRemarks", Title = "Remarks", DataType = GridDataType.String.ToString(), Width = 50, Template = "<span class=\"actionView\" style=\"cursor:pointer;color:Blue;\" onclick=\"ViewRemarks(this);\">View</span>" });

                g.Column.Add(new GridColumn { Field = "SNo", Title = "Location", DataType = GridDataType.String.ToString(), Width = 40, Template = "#if(IsULD==0){} else if(ULDCheckedIn==\"N\") {#<input type=\"button\" class=\"incompleteprocess\" style=\"cursor: not-allowed\" value=\"L\" onclick=\"HighLightGridButton(this,event);GetFAULDLocation(#=FFMShipmentTransSNo#,#=IsThroughULD#,#=IsBUP#)\" disabled=\"true\"/>#} else if(IsULDLocation==0 ){#<input type=\"button\" class=\"incompleteprocess\" style=\"cursor:pointer\" value=\"L\" onclick=\"HighLightGridButton(this,event);GetFAULDLocation(#=FFMShipmentTransSNo#,#=IsThroughULD#,#=IsBUP#)\" />#}else{#<input type=\"button\" class=\"completeprocess\" style=\"cursor:pointer\" value=\"L\" onclick=\"HighLightGridButton(this,event);GetFAULDLocation(#=FFMShipmentTransSNo#,#=IsThroughULD#,#=IsBUP#)\" />#}#" });

                g.Column.Add(new GridColumn { Field = "SNo", Title = "Damage", DataType = GridDataType.String.ToString(), Width = 40, Template = "#if(IsULD==0){#<input type=\"button\" style=\"display:none;\" />#} else if (ULDCheckedIn==\"N\") {#<input type=\"button\" class=\"incompleteprocess\" style=\"cursor: not-allowed\" value=\"D\" onclick=\"HighLightGridButton(this,event);GetDamage(#=FFMShipmentTransSNo#)\" disabled=\"true\"/>#} else if(IsULDDamage==0){#<input type=\"button\" class=\"incompleteprocess\" style=\"cursor:pointer\" value=\"D\" onclick=\"HighLightGridButton(this,event);GetDamage(#=FFMShipmentTransSNo#)\" />#}else{#<input type=\"button\" class=\"completeprocess\" style=\"cursor:pointer\" value=\"D\" onclick=\"HighLightGridButton(this,event);GetDamage(#=FFMShipmentTransSNo#)\" />#}#" });

                Dictionary<string, bool> dictvalue = new Dictionary<string, bool>();
                dictvalue = (((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"]))).SpecialRights;
                foreach (KeyValuePair<string, bool> list in dictvalue)
                {
                    if (list.Key == "IMPORTSHIP")
                    {
                        if (list.Value == true)
                        {
                            g.Column.Add(new GridColumn { Field = "Isamended", Title = "Amended", Template = "#if(IsamendedvalueTop>0 && IsThroughULD==1){#<input id=\"ChkamendedTop\" type=\"checkbox\" />#} #", DataType = GridDataType.String.ToString(), Width = 30 });
                        }
                    }
                }
                g.Column.Add(
               new GridColumn
               {
                   Field = "IsRushHandling",
                   Title = "Rush Handling",
                   DataType = GridDataType.String.ToString(),
                   Width = 20,
                   Template = "#if(IsRushHandling==1 && IsThroughULD==1){#<input type=\"checkbox\" id=\"chkIsRushHandlingTop\" name=\"chkIsRushHandlingTop\" checked=\"#=IsRushHandling#\" />#}else if(IsThroughULD==1) {#<input type=\"checkbox\" id=\"chkIsRushHandlingTop\" name=\"chkIsRushHandlingTop\"  />#}#"
               });

                g.Column.Add(new GridColumn { Field = "Save", Title = "Save", DataType = GridDataType.String.ToString(), Width = 30, Template = "#if((IsThroughULD==0 && IsBUP==1)){}else if((IsThroughULD==1 || IsBUP==1)&&(ULDCheckedIn==\"Y\") ){#<input type=\"button\" class=\"btn btn-block btn-success btn-sm\" value=\"Arrived\" style=\"cursor: not-allowed;\" disabled=\"true\" />#}else if(IsThroughULD==1 || IsBUP==1){#<input type=\"button\" class=\"btn btn-block btn-primary btn-sm\" style=\"cursor:pointer\" value=\"Save\" onclick=\"SaveBUPULDDetails(this)\" />#}#" });
                g.Column.Add(new GridColumn { Field = "IsULDLocation", Title = "IsULDLocation", IsHidden = true, DataType = GridDataType.String.ToString() });
                g.Column.Add(new GridColumn { Field = "IsULDDamage", Title = "IsULDDamage", IsHidden = true, DataType = GridDataType.String.ToString() });
                g.Column.Add(new GridColumn { Field = "IsULDConsumable", Title = "IsULDConsumable", IsHidden = true, DataType = GridDataType.String.ToString() });
                g.Column.Add(new GridColumn { Field = "IsBUP", Title = "IsBUP", IsHidden = true, DataType = GridDataType.String.ToString() });
                g.Column.Add(new GridColumn { Field = "IsThroughULD", Title = "IsThroughULD", IsHidden = true, DataType = GridDataType.String.ToString() });
                g.Column.Add(new GridColumn { Field = "IsArrived", Title = "IsArrived", IsHidden = true, DataType = GridDataType.String.ToString() });
                g.Column.Add(new GridColumn { Field = "Remarks", Title = "Remarks", IsHidden = true, DataType = GridDataType.String.ToString(), Template = "<span style=\"display:none;\" id = \"spnULDRemarks\">#=Remarks#</span>" });
                g.Column.Add(new GridColumn { Field = "OSIRemarks", Title = "Remarks", IsHidden = true, DataType = GridDataType.String.ToString(), Template = "<span style=\"display:none;\" id = \"spnOSIRemarks\">#=OSIRemarks#</span>" });
                g.Column.Add(new GridColumn { Field = "IsamendedvalueTop", Title = "IsamendedvalueTop", DataType = GridDataType.String.ToString(), IsHidden = true, Width = 10 });
                g.Column.Add(new GridColumn { Field = "POMailSNo", Title = "POMailSNo", IsHidden = true, DataType = GridDataType.String.ToString(), Width = 50 });
                g.Column.Add(new GridColumn { Field = "POMailArrivedShipmentSNo", Title = "POMailArrivedShipmentSNo", IsHidden = true, DataType = GridDataType.String.ToString(), Width = 50 });
                g.ExtraParam = new List<GridExtraParams>();
                g.ExtraParam.Add(new GridExtraParams { Field = "FFMFlightMasterSNo", Value = FFMFlightMasterSNo });

                //#region Nested Grid Section
                g.NestedPrimaryID = "AWBNo";
                g.NestedModuleName = this.MyModuleID;
                g.NestedAppsName = this.MyAppID;
                g.NestedParentID = "ULDNo";
                g.NestedIsShowEdit = false;
                g.NestedDefaultPageSize = 1000;
                g.NestedHeight = 300;
                g.NestedIsPageable = false;
                g.IsNestedAllowedFiltering = false;
                g.IsNestedAllowedSorting = false;
                g.NestedProcessName = "FAShipmentInfo";
                g.SuccessGrid = "fn_SuccessShipmentGrid";
                g.NestedDataSoruceUrl = "Services/Import/InboundFlightService.svc/GetFlightArrivalShipmentGridData";
                g.NestedColumn = new List<GridColumn>();
                g.NestedColumn.Add(new GridColumn { Field = "IsManual", Title = "IsManual", DataType = GridDataType.String.ToString(), IsHidden = true, Width = 90 });
                g.NestedColumn.Add(new GridColumn { Field = "Isamendedvalue", Title = "Isamendedvalue", DataType = GridDataType.String.ToString(), IsHidden = true, Width = 10 });
                g.NestedColumn.Add(new GridColumn { Field = "DailyFlightSNo", Title = "DailyFlightSNo", DataType = GridDataType.String.ToString(), IsHidden = true, Width = 90 });
                g.NestedColumn.Add(new GridColumn { Field = "GroupFlightSNo", Title = "GroupFlightSNo", DataType = GridDataType.String.ToString(), IsHidden = true, Width = 90 });
                g.NestedColumn.Add(new GridColumn { Field = "FFMFlightMasterSNo", Title = "FFMFlightMasterSNo", DataType = GridDataType.String.ToString(), IsHidden = true });
                g.NestedColumn.Add(new GridColumn { Field = "ULDNo", Title = "ULDNo", DataType = GridDataType.String.ToString(), IsHidden = true });
                g.NestedColumn.Add(new GridColumn { Field = "FFMShipmentTransSNo", Title = "FFMShipmentTransSNo", DataType = GridDataType.String.ToString(), IsHidden = true });
                g.NestedColumn.Add(new GridColumn { Field = "ArrivedShipmentSNo", Title = "ArrivedShipmentSNo", DataType = GridDataType.String.ToString(), IsHidden = true, Width = 90 });
                g.NestedColumn.Add(new GridColumn { Field = "AWBSNo", Title = "AWBSNo", DataType = GridDataType.String.ToString(), IsHidden = true, Width = 90 });
                g.NestedColumn.Add(new GridColumn { Field = "TotalFFMPieces", Title = "TotalFFMPieces", DataType = GridDataType.String.ToString(), IsHidden = true });

                g.NestedColumn.Add(new GridColumn { Field = "AWBNo", IsLocked = false, Title = "MAWB/PO Mail", DataType = GridDataType.String.ToString(), Width = 29 });
                g.NestedColumn.Add(new GridColumn { Field = "ShipmentOriginAirportCode", IsLocked = false, Title = "Origin", DataType = GridDataType.String.ToString(), Width = 18 });
                g.NestedColumn.Add(new GridColumn { Field = "ShipmentDestinationAirportCode", IsLocked = false, Title = "Destination", DataType = GridDataType.String.ToString(), Width = 18 });
                g.NestedColumn.Add(new GridColumn { Field = "NatureOfGoods", IsLocked = false, Title = "Nature Of Goods", DataType = GridDataType.String.ToString(), Width = 35, Template = "<span title=\"#= NatureOfGoods #\">#= NatureOfGoods #</span>" });
                g.NestedColumn.Add(new GridColumn { Field = "ShipmentType", IsLocked = false, Title = "Cargo/PO Mail/Courier", DataType = GridDataType.String.ToString(), Width = 18 });
                g.NestedColumn.Add(new GridColumn { Field = "SPHC", Title = "SHC", IsHidden = false, DataType = GridDataType.String.ToString(), Width = 17, Template = "<span title=\"#= SPHC #\">#= SPHC #</span>" });
                g.NestedColumn.Add(new GridColumn { Field = "Priority", Title = "Priority", DataType = GridDataType.String.ToString(), Width = 20 });
                g.NestedColumn.Add(new GridColumn { Field = "Pieces", Title = "AWB/PO Mail", DataType = GridDataType.Number.ToString(), Width = 18 });
                g.NestedColumn.Add(new GridColumn { Field = "LoadDetails", IsLocked = false, Title = "Build/Load Details", DataType = GridDataType.String.ToString(), Width = 25 });

                g.NestedColumn.Add(new GridColumn { Field = "OSI", IsLocked = false, Title = "OSI", DataType = GridDataType.String.ToString(), Width = 15, Template = "<span title=\"#= OSI #\">#= OSI #</span>" });
                g.NestedColumn.Add(new GridColumn { Field = "COR", IsLocked = false, Title = "COR", DataType = GridDataType.String.ToString(), Width = 15, Template = "<span title=\"#= COR #\">#= COR #</span>" });

                g.NestedColumn.Add(new GridColumn { Field = "FFMPieces", Title = "FFM/PO Mail", DataType = GridDataType.String.ToString(), Width = 20, Template = "<span title=\"#= FFMPieces #\">#= FFMPieces #</span>" });

                g.NestedColumn.Add(new GridColumn { Field = "ReceivedPcs", Title = "Received Pieces", DataType = GridDataType.Number.ToString(), Width = 32, Template = "#if(POMailSNo!=0){#<input title =\"Received Pieces\" id=\"txtFAMAWBRcdPieces\" type=\"text\"  process=\"FA Shp RcdPcs\" size=\"5\" maxlength=\"5\" onblur=\"fn_GetPOMAilDNDetails(this,#=TotalFFMPieces#,#=POMailSNo#,#=ActualGrossWt#),GetFAReceivedPieces(this,#=TotalFFMPieces#)\" onkeypress=\"return IsValidateNumber(this,event)\" value=\"#=TotalFFMPieces#\"> #}else if (IsDeliveryOrder == 1){#<input title=\"Received Pieces\" id=\"txtFAMAWBRcdPieces\" type=\"text\"  process=\"FA Shp RcdPcs\" size=\"5\" maxlength=\"5\" value=\"#=ReceivedPcs#\" readonly=\"true\" >#}else if (IsThroughULD == 1 || IsBUP == 1){#<input title=\"Received Pieces\" id=\"txtFAMAWBRcdPieces\" type=\"text\"  process=\"FA Shp RcdPcs\" size=\"5\" maxlength=\"5\" value=\"#=TotalFFMPieces#\" readonly=\"true\" >#}else if (ArrivedShipmentSNo == 0){#<input title=\"Received Pieces\" id=\"txtFAMAWBRcdPieces\" type=\"text\"  process=\"FA Shp RcdPcs\" size=\"5\" maxlength=\"5\" onblur=\"GetFAReceivedPieces(this,#=TotalFFMPieces#)\" onkeypress=\"return IsValidateNumber(this,event)\" value=\"#=TotalFFMPieces#\" >#}else if (ArrivedShipmentSNo != 0){#<input title=\"Received Pieces\" id=\"txtFAMAWBRcdPieces\" type=\"text\"  process=\"FA Shp RcdPcs\" size=\"5\" maxlength=\"5\" onblur=\"GetFAReceivedPieces(this,#=TotalFFMPieces#)\" onkeypress=\"return IsValidateNumber(this,event)\" value=\"#=ReceivedPcs#\"  disabled=\"true\">#}else if (POMailSNo != 0){#<input title=\"Received Pieces\" id=\"txtFAMAWBRcdPieces\" type=\"text\"  process=\"FA Shp RcdPcs\" size=\"5\" maxlength=\"5\" onblur=\"fn_GetPOMAilDNDetails(this,#=TotalFFMPieces#,#=POMailSNo#)\" onkeypress=\"return IsValidateNumber(this,event)\" value=\"#=TotalFFMPieces#\" >#}else{#<input title=\"Received Pieces\" id=\"txtFAMAWBRcdPieces\" type=\"text\" onkeypress=\"return IsValidateNumber(this,event)\"  process=\"FA Shp RcdPcs\" size=\"5\" maxlength=\"5\" onblur=\"GetFAReceivedPieces(this,#=TotalFFMPieces#)\" value=\"#=ReceivedPcs#\" >#}#" });

                g.NestedColumn.Add(new GridColumn { Field = "ActualGrossWt", Title = "FFM/PO Mail Gr. Wt./ Rcvd Gross WT", DataType = GridDataType.String.ToString(), Width = 65, Template = "#if(IsBUP==1){#<input type=\"text\" value=\"#=GrossWeight#\" id=\"txtGrossWt\" style=\"width:65px\" disabled=\"true\" /> / <input type=\"text\" value=\"#=ActualGrossWt#\" id=\"txtActualGrossWt\"  ondrop=\"return false;\" onpaste=\"return false;\" style=\"width:65px\" onkeypress=\"return ValidateFloatKeyPress(this,event)\" maxlength=\"8\"  />#}else{#<input type=\"text\" value=\"#=GrossWeight#\" id=\"txtGrossWt\" style=\"width:65px\" disabled=\"true\" /> / <input type=\"text\" value=\"#=ActualGrossWt#\" id=\"txtActualGrossWt\" ondrop=\"return false;\" onpaste=\"return false;\" style=\"width:65px\" onkeypress=\"return ValidateFloatKeyPress(this,event)\" maxlength=\"8\"  />#}#" });

                g.NestedColumn.Add(new GridColumn { Field = "Volumeweight", Title = "Received Volume Weight", Template = "#{#<input type=\"text\" value=\"#=VolumeWeight#\" id=\"txtRecVolumeWeight\" ondrop=\"return false;\" onpaste=\"return false;\" style=\"width:65px\" onkeypress=\"return ValidateFloatKeyPress(this,event)\" maxlength=\"8\" disabled=\"true\"  />/<input type=\"text\" value=\"#=ActualVolumeWt#\" id=\"txtVolumeWeight\" ondrop=\"return false;\" onpaste=\"return false;\" style=\"width:65px\" onkeypress=\"return ValidateFloatKeyPress(this,event)\" maxlength=\"8\"   /><input type=\"hidden\" value=\"#=VolumeWeight#\" id=\"txtVolumeWeighthidden\"    />#}#", DataType = GridDataType.String.ToString(), Width = 65 });

                //Add Check for IsLocationMandatoryOnImport is false then L button disable
                g.NestedColumn.Add(new GridColumn { Field = "SNo", Title = "Location", DataType = GridDataType.String.ToString(), Width = 23, Template = "#if(POMailSNo!=0){if (LocationStatus == 0){#<input type=\"button\" class=\"incompleteprocess\" style=\"cursor:pointer\" value=\"L\"  onclick=\"GetAWBULDLocationPomail(#=POMailSNo#,this)\" />#}else if (IsThroughULD == 1 || IsBUP == 1){}else if (LocationStatus == 1) {#<input type=\"button\" class=\"partialprocess\" style=\"cursor:pointer\" value=\"L\" onclick=\"GetAWBULDLocationPomail(#=POMailSNo#,this)\" />#}else if (LocationStatus == 2){#<input type=\"button\" class=\"completeprocess\" style=\"cursor:pointer\" value=\"L\" onclick=\"GetAWBULDLocationPomail(#=POMailSNo#,this)\" />#}else{#<input type=\"button\" class=\"incompleteprocess\" style=\"cursor:pointer\" value=\"L\" onclick=\"GetAWBULDLocationPomail(#=POMailSNo#,this)\" />#}}else {if (IsThroughULD == 1 || IsBUP == 1) { }else if (LocationStatus == 0){#<input type=\"button\" class=\"incompleteprocess\" style=\"cursor:pointer\" value=\"L\" onclick=\"GetAWBULDLocation(#=AWBSNo#,this)\" />#}else if(LocationStatus==1){#<input type=\"button\" class=\"partialprocess\" style=\"cursor:pointer\" value=\"L\" onclick=\"GetAWBULDLocation(#=AWBSNo#,this)\" />#}else if(LocationStatus==2){#<input type=\"button\" class=\"completeprocess\" style=\"cursor:pointer\" value=\"L\" onclick=\"GetAWBULDLocation(#=AWBSNo#,this)\" />#}else{#<input type=\"button\" class=\"incompleteprocess\" style=\"cursor:pointer\" value=\"L\" onclick=\"GetAWBULDLocation(#=AWBSNo#,this)\" />#}}#" });
                //Add Check for IsLocationMandatoryOnImport is false then L button disable
                g.NestedColumn.Add(new GridColumn { Field = "SNo", Title = "Discrepancy", DataType = GridDataType.String.ToString(), Width = 30, Template = "#if(IsDeliveryOrder==1||IsBUP==1||IsThroughULD==1){} else if(IsDamaged==0){#<input type=\"button\" class=\"incompleteprocess\" style=\"cursor:pointer\" value=\"D\" onclick=\"GetAWBDamage(#=AWBSNo#,this)\" />#}else if(IsDamaged==1){#<input type=\"button\" class=\"completeprocess\" style=\"cursor:pointer\" value=\"D\" onclick=\"GetAWBDamage(#=AWBSNo#,this)\" />#} else {#<input type=\"button\" class=\"incompleteprocess\" style=\"cursor:pointer\" value=\"D\" onclick=\"GetAWBDamage(#=AWBSNo#,this)\" />#}#" });

                g.NestedColumn.Add(new GridColumn { Field = "Remarks", Title = "Remarks", Template = "#if(IsDeliveryOrder==1 || IsBUP==1||IsThroughULD==1){#<input title=\"Remarks\" id=\"txtFAMAWBRemarks\" type=\"text\"  process=\"FA Shp Remarks\" size=\"11\" value=\"#=Remarks#\" readonly=\"true\">#} else {#<input title=\"Remarks\" id=\"txtFAMAWBRemarks\" type=\"text\"  process=\"FA Shp Remarks\" size=\"11\" value=\"#=Remarks#\">#}#", DataType = GridDataType.String.ToString(), Width = 50 });

                g.NestedColumn.Add(new GridColumn { Field = "PosNo", Title = "PosNo", Template = "#if(ArrivalStatus==0 && IsInternational==\"INTERNATIONAL\" && DestinationAirportCode==\"CGK\"){#<input title=\"PosNo\" id=\"txtPosNo_#=AWBNo#\" type=\"text\" onkeypress=\"Numbercheckfun(this,event)\" onblur=\"WriteRemarks(#=AWBSNo#,this,#=data-uid#);\" process=\"FA Shp Remarks\" size=\"11\" maxlength=\"4\" value=\"#=PosNo#\" >#} else {#<input title=\"PosNo\" id=id=\"txtPosNo_#=AWBNo#\" type=\"text\"  process=\"FA Shp Remarks\" size=\"11\" value=\"#=PosNo#\" readonly=\"true\"  disabled=\"disabled\">#}#", DataType = GridDataType.String.ToString(), Width = 50 });

                Dictionary<string, bool> dict = new Dictionary<string, bool>();

                dict = (((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"]))).SpecialRights;
                foreach (KeyValuePair<string, bool> list in dict)
                {
                    if (list.Key == "IMPORTSHIP")
                    {
                        if (list.Value == true)
                        {
                            g.NestedColumn.Add(new GridColumn { Field = "Isamended", Title = "Amendment", Template = "#if(Isamendedvalue>0 && IsThroughULD==0 && IsDO==0){#<input id=\"Chkamended\" type=\"checkbox\" onclick=\"AmmendShipment(this,event);\"  />#} #", DataType = GridDataType.String.ToString(), Width = 30 });
                        }
                    }
                }

                g.NestedColumn.Add(
                    new GridColumn
                    {
                        Field = "IsRushHandling",
                        Title = "Rush Handling",
                        DataType = GridDataType.String.ToString(),
                        Width = 20,
                        Template = "#if(IsRushHandling==1 && IsThroughULD==0){#<input type=\"checkbox\" id=\"chkIsRushHandling\" name=\"chkIsRushHandling\" checked=\"#=IsRushHandling#\" disabled=\"disabled\" />#}else if(IsRushHandling==0 && IsThroughULD==0 && IsDisabled==1) {#<input type=\"checkbox\" id=\"chkIsRushHandling\" name=\"chkIsRushHandling\" disabled=\"disabled\" />#}else if(IsThroughULD==0) {#<input type=\"checkbox\" id=\"chkIsRushHandling\" name=\"chkIsRushHandling\"  />#}#"
                    });

                if ((((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).SysSetting["ICMSEnvironment"].ToString().ToUpper().Trim() == "JT"))
                {
                    g.NestedColumn.Add(new GridColumn { Field = "Save", Title = "Save", DataType = GridDataType.String.ToString(), Width = 30, Template = "#if(IsDisabled==1 && (IsBUP==1||IsThroughULD==1)){#<input type=\"button\" class=\"btn btn-block btn-success btn-sm\" value=\"#=DisabledText#\" style=\"cursor: not-allowed;display:none;\" disabled=\"true\" />#}  else if(IsNotBooked==1){#<input type=\"button\" class=\"btn btn-block btn-primary btn-sm\" style=\"cursor:pointer\" value=\"Save\" disabled=\"true\" title=\"Shipment not booked, please book shipment from backdate booking.\" />#} else if(IsDisabled==1){#<input type=\"button\" class=\"btn btn-block btn-success btn-sm\"  value=\"#=DisabledText#\"  style=\"cursor: not-allowed;\" disabled=\"true\" />#} else if(ArrivalStatus==3 ){#<input type=\"button\" class=\"btn btn-block btn-success btn-sm \"  value=\"Arr- FC\" style=\"cursor: not-allowed;\" disabled=\"true\"  style=\"cursor: not-allowed;\" disabled=\"true\"/>#} else if(ArrivedShipmentSNo==0){#<input type=\"button\" class=\"btn btn-block btn-primary btn-sm\" style=\"cursor:pointer\" value=\"Save\" onclick=\"SaveULDDetails(this)\" />#} else{#<input type=\"button\" class=\"btn btn-block btn-success btn-sm\" style=\"cursor:pointer\" value=\"Arrived\" disabled=\"true\" onclick=\"SaveULDDetails(this)\" />#}#" });
                }
                else
                {
                    g.NestedColumn.Add(new GridColumn { Field = "Save", Title = "Save", DataType = GridDataType.String.ToString(), Width = 30, Template = "#if(IsDisabled==1 && (IsBUP==1||IsThroughULD==1)){#<input type=\"button\" class=\"btn btn-block btn-success btn-sm\"  value=\"#=DisabledText#\"  style=\"cursor: not-allowed;display:none;\" disabled=\"true\" />#} else if(IsNoShow==1){#<input type=\"button\" class=\"btn btn-block btn-primary btn-sm\" style=\"cursor:pointer\" value=\"Save\" disabled=\"true\" />#} else if(IsNotBooked==1){#<input type=\"button\" class=\"btn btn-block btn-primary btn-sm\" style=\"cursor:pointer\" value=\"Save\" disabled=\"true\" />#} else if(IsDisabled==1){#<input type=\"button\" class=\"btn btn-block btn-success btn-sm\"  value=\"#=DisabledText#\"  style=\"cursor: not-allowed;\" disabled=\"true\" />#} else if(ArrivalStatus==3 ){#<input type=\"button\" class=\"btn btn-block btn-success btn-sm \"  value=\"Arr- FC\" style=\"cursor: not-allowed;\" disabled=\"true\"  style=\"cursor: not-allowed;\" disabled=\"true\"/>#} else if(ArrivedShipmentSNo==0){#<input type=\"button\" class=\"btn btn-block btn-primary btn-sm\" style=\"cursor:pointer\" value=\"Save\" onclick=\"SaveULDDetails(this)\" />#}else{#<input type=\"button\" class=\"btn btn-block btn-success btn-sm\" style=\"cursor:pointer\" value=\"Arrived\" disabled=\"true\" onclick=\"SaveULDDetails(this)\" />#}#" });
                }
                g.NestedColumn.Add(new GridColumn { Field = "IsBUP", Title = "IsBUP", DataType = GridDataType.String.ToString(), IsHidden = true, Width = 90 });
                g.Column.Add(new GridColumn { Field = "IsThroughULD", Title = "IsThroughULD", IsHidden = true, DataType = GridDataType.String.ToString() });
                g.NestedColumn.Add(new GridColumn { Field = "IsDocument", Title = "IsDocument", DataType = GridDataType.String.ToString(), IsHidden = true, Width = 90 });
                g.NestedColumn.Add(new GridColumn { Field = "LocationStatus", Title = "LocationStatus", DataType = GridDataType.String.ToString(), IsHidden = true, Width = 90 });
                g.NestedColumn.Add(new GridColumn { Field = "IsDeliveryOrder", Title = "IsDeliveryOrder", DataType = GridDataType.String.ToString(), IsHidden = true, Width = 90 });
                g.NestedColumn.Add(new GridColumn { Field = "ArrivalStatus", Title = "ArrivalStatus", DataType = GridDataType.String.ToString(), IsHidden = true, Width = 90 });
                g.NestedColumn.Add(new GridColumn { Field = "IsDamaged", Title = "IsDamaged", DataType = GridDataType.String.ToString(), IsHidden = true });
                g.NestedColumn.Add(new GridColumn { Field = "POMArrivedShipmentSNo", Title = "POMArrivedShipmentSNo", DataType = GridDataType.String.ToString(), IsHidden = true });//Added by Akaram Ali on 21 Aug 2017
                g.NestedColumn.Add(new GridColumn { Field = "POMailSNo", Title = "POMailSNo", DataType = GridDataType.String.ToString(), IsHidden = true, Width = 90 });
                g.NestedExtraParam = new List<NestedGridExtraParam>();
                g.NestedExtraParam.Add(new NestedGridExtraParam { Field = "FFMFlightMasterSNo", Value = FFMFlightMasterSNo });
                Container.Append("<div id='divdimension__' />");
                Container.Append("<div id='divFlightDetailSection'><table id='tblShipmentFlight'></table></div>");
                g.InstantiateIn(Container);
            }
        }

        public DataSourceResult GetFlightArrivalStopULDGridData(string FFMFlightMasterSNo, int skip, int take, int page, int pageSize, List<SoftwareFactory.Data.GridSort> sort, SoftwareFactory.Data.GridFilter filter)
        {
            try
            {
                string sorts = GridSort.ProcessSorting(sort);
                string ProcName = "";
                if (filter == null)
                {
                    filter = new GridFilter();
                    filter.Logic = "AND";
                    filter.Filters = new List<GridFilter>();
                }
                DataSet ds = new DataSet();
                ProcName = "FA_GetFlightArrivalStopShipmentGridData_new";
                string filters = GridFilter.ProcessFilters<WMSFlightArrivalULDGridData>(filter);
                SqlParameter[] Parameters = { new SqlParameter("@PageNo", page), new SqlParameter("@PageSize", pageSize), new SqlParameter("@WhereCondition", filters), new SqlParameter("@OrderBy", sorts), new SqlParameter("@FFMFlightMasterSNo", FFMFlightMasterSNo), new SqlParameter("@Route", ""), new SqlParameter("@Createdby", Convert.ToInt32(((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).UserSNo.ToString())) };
                ds = SqlHelper.ExecuteDataset(DMLConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, ProcName, Parameters);
                var wmsBookingList = ds.Tables[0].AsEnumerable().Select(e => new WMSFlightArrivalStopShipmentGridData
                {
                    DailyFlightSNo = Convert.ToInt32(e["DailyFlightSNo"]),
                    FFMShipmentTransSNo = Convert.ToInt32(e["FFMShipmentTransSNo"]),
                    FFMFlightMasterSNo = Convert.ToInt32(e["FFMFlightMasterSNo"]),
                    CheckIn = e["CheckIn"].ToString(),
                    ULDNo = e["ULDNo"].ToString(),
                    AWBNo = e["Route"].ToString(),
                    Pieces = Convert.ToInt32(e["Pieces"].ToString() == "" ? "0" : e["Pieces"].ToString()),
                    AWBCount = Convert.ToInt32(e["AWBCount"].ToString() == "" ? "0" : e["AWBCount"].ToString()),
                    UldArrived = e["UldArrived"].ToString(),
                    SPHC = e["SPHC"].ToString(),
                    SPHCPriority = e["SPHCPriority"].ToString(),
                    Status = e["Status"].ToString(),
                    OSI = e["OSI"].ToString(),
                    COR = e["COR"].ToString(),
                    ReceivedPcs = e["ReceivedPcs"].ToString(),
                    FFMPieces = e["Pieces"].ToString() + "/" + e["FFMPieces"].ToString(),
                    TotalFFMPieces = e["FFMPieces"].ToString(),
                    IsDocument = Convert.ToInt32(e["IsDocument"].ToString()),
                    Document = e["Document"].ToString(),
                    Remarks = e["Remarks"].ToString(),
                    IsBUP = Convert.ToInt32(e["IsBUP"].ToString()),
                    Priority = e["Priority"].ToString(),
                    Route = e["Route"].ToString(),
                    IsDisplay = Convert.ToInt32(e["IsDisplay"]),
                    ULDStockSNo = Convert.ToInt32(e["ULDStockSNo"]),
                    MoveToSegregation = Convert.ToInt32(e["MoveToSegregation"])
                });
                ds.Dispose();
                return new DataSourceResult
                {
                    Data = wmsBookingList.AsQueryable().ToList(),
                    Total = Convert.ToInt32(ds.Tables[1].Rows[0][0].ToString()),
                    FilterCondition = filters,
                    SortCondition = sorts,
                    StoredProcedure = ProcName
                };
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }

        public DataSourceResult GetFlightArrivalULDGridData(string FFMFlightMasterSNo, int skip, int take, int page, int pageSize, List<SoftwareFactory.Data.GridSort> sort, SoftwareFactory.Data.GridFilter filter)
        {
            try
            {
                string sorts = GridSort.ProcessSorting(sort);
                string ProcName = "";
                if (filter == null)
                {
                    filter = new GridFilter();
                    filter.Logic = "AND";
                    filter.Filters = new List<GridFilter>();
                }
                DataSet ds = new DataSet();
                ProcName = "FA_GetFlightArrivalULDGridData";
                string filters = GridFilter.ProcessFilters<WMSFlightArrivalULDGridData>(filter);
                SqlParameter[] Parameters = { new SqlParameter("@PageNo", page), new SqlParameter("@PageSize", pageSize), new SqlParameter("@WhereCondition", filters), new SqlParameter("@OrderBy", sorts), new SqlParameter("@FFMFlightMasterSNo", FFMFlightMasterSNo) };

                ds = SqlHelper.ExecuteDataset(DMLConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, ProcName, Parameters);
                var wmsBookingList = ds.Tables[0].AsEnumerable().Select(e => new WMSInboundFlightArrivalULDGridData
                {
                    DailyFlightSNo = Convert.ToInt32(e["DailyFlightSNo"]),
                    FFMFlightMasterSNo = Convert.ToInt32(e["FFMFlightMasterSNo"]),
                    FFMShipmentTransSNo = (e["FFMShipmentTransSNo"] == DBNull.Value) ? 0 : Convert.ToInt32(e["FFMShipmentTransSNo"]),
                    IsULD = Convert.ToInt32(e["IsULD"]),
                    ULDNo = e["ULDNo"].ToString().ToUpper(),
                    BUP = e["BUP"].ToString(),
                    TotalPieces = e["TotalPieces"].ToString(),
                    TotalGrossWeight = e["TotalGrossWeight"].ToString(),
                    Transit = e["Transit"].ToString(),
                    Position = e["Position"].ToString(),
                    ThroughULD = e["ThroughULD"].ToString(),
                    SPHC = e["SPHC"].ToString(),
                    BreakDownStart = (e["BreakDownStart"] == DBNull.Value) ? "+ Add Time" : e["BreakDownStart"].ToString(),
                    BreakDownEnd = (e["BreakDownEnd"] == DBNull.Value) ? "+ Add Time" : e["BreakDownEnd"].ToString(),
                    ULDCheckedIn = e["ULDCheckedIn"].ToString(),
                    LoadingIndicator = e["LoadingIndicator"].ToString(),
                    Remarks = e["Remarks"].ToString(),
                    OSIRemarks = e["OSIRemarks"].ToString(),
                    IsULDLocation = Convert.ToInt32(e["IsULDLocation"]),
                    IsULDDamage = Convert.ToInt32(e["IsULDDamage"]),
                    IsULDConsumable = Convert.ToInt32(e["IsULDConsumable"]),
                    IsThroughULD = (e["ThroughULD"].ToString().ToUpper() == "YES" ? "1" : "0"),
                    IsBUP = (e["BUP"].ToString().ToUpper() == "YES" ? "1" : "0"),
                    IsChangedTULD = Convert.ToInt32(e["IsChangedTULD"]),
                    IsamendedvalueTop = Convert.ToInt32(e["IsamendedvalueTop"]),
                    IsRushHandling = Convert.ToInt32(e["IsRushHandling"]),
                    IsManualIntactULD = Convert.ToInt32(e["IsManualIntactULD"]),
                    POMailSNo = Convert.ToInt32(e["POMailSNo"]),
                    POMailArrivedShipmentSNo = Convert.ToInt32(e["POMailArrivedShipmentSNo"]),
                    //Get IsLocationMandatoryOnImport value 
                    IsLocationMandatoryOnImport = Convert.ToInt32(e["IsLocationMandatoryOnImport"])
                    //Get IsLocationMandatoryOnImport value 
                });
                ds.Dispose();
                return new DataSourceResult
                {
                    Data = wmsBookingList.AsQueryable().ToList(),
                    Total = Convert.ToInt32(ds.Tables[1].Rows[0][0].ToString()),
                    FilterCondition = filters,
                    SortCondition = sorts,
                    StoredProcedure = ProcName
                };
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }

        public DataSourceResult GetFlightArrivalStopShipmentGridData(string FFMFlightMasterSNo, int skip, int take, int page, int pageSize, List<SoftwareFactory.Data.GridSort> sort, SoftwareFactory.Data.GridFilter filter)
        {
            try
            {
                string sorts = GridSort.ProcessSorting(sort);
                string ProcName = "";
                if (filter == null)
                {
                    filter = new GridFilter();
                    filter.Logic = "AND";
                    filter.Filters = new List<GridFilter>();
                }
                DataSet ds = new DataSet();
                ProcName = "FA_GetFlightArrivalStopShipmentGridData";
                string filters = GridFilter.ProcessFilters<WMSFlightArrivalStopShipmentGridData>(filter);
                SqlParameter[] Parameters = { new SqlParameter("@PageNo", page), new SqlParameter("@PageSize", pageSize), new SqlParameter("@WhereCondition", filters), new SqlParameter("@OrderBy", sorts), new SqlParameter("@FFMFlightMasterSNo", FFMFlightMasterSNo), new SqlParameter("@Route", ((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).AirportCode.ToString()), new SqlParameter("@ULD", filter.Value) };
                ds = SqlHelper.ExecuteDataset(DMLConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, ProcName, Parameters);
                var wmsBookingList = ds.Tables[0].AsEnumerable().Select(e => new WMSFlightArrivalStopShipmentGridData
                {
                    DailyFlightSNo = Convert.ToInt32(e["DailyFlightSNo"]),
                    FFMShipmentTransSNo = Convert.ToInt32(e["FFMShipmentTransSNo"]),
                    ArrivedShipmentSNo = Convert.ToInt32(e["ArrivedShipmentSNo"]),
                    AWBSNo = Convert.ToInt32(e["AWBSNo"]),
                    FFMFlightMasterSNo = Convert.ToInt32(e["FFMFlightMasterSNo"]),
                    CheckIn = e["CheckIn"].ToString(),
                    ULDNo = e["ULDNo"].ToString(),
                    AWBNo = e["AWBNo"].ToString(),
                    ShipmentOriginAirportCode = e["ShipmentOriginAirportCode"].ToString(),
                    ShipmentDestinationAirportCode = e["ShipmentDestinationAirportCode"].ToString(),
                    GrossWeight = e["GrossWeight"].ToString(),
                    VolumeWeight = Convert.ToDecimal(e["VolumeWeight"]),
                    CBMWeight = Convert.ToDecimal(e["CBMWeight"]),
                    TotalPieces = e["TotalPieces"].ToString() == "" ? "0" : e["TotalPieces"].ToString(),
                    Pieces = Convert.ToInt32(e["Pieces"].ToString() == "" ? "0" : e["Pieces"].ToString()),
                    TotalAWBPieces = Convert.ToInt32(e["TotalAWBPieces"].ToString() == "" ? "0" : e["TotalAWBPieces"].ToString()),
                    UldArrived = e["UldArrived"].ToString(),
                    NatureOfGoods = e["NatureOfGoods"].ToString().ToUpper(),
                    SPHC = e["SPHC"].ToString(),
                    SPHCPriority = e["SPHCPriority"].ToString(),
                    Status = e["Status"].ToString(),
                    OSI = e["OSI"].ToString(),
                    COR = e["COR"].ToString(),
                    ReceivedPcs = e["ReceivedPcs"].ToString(),
                    FFMPieces = e["Pieces"].ToString() + "/" + e["FFMPieces"].ToString(),
                    TotalFFMPieces = e["FFMPieces"].ToString(),
                    IsDocument = Convert.ToInt32(e["IsDocument"].ToString()),
                    Document = e["Document"].ToString(),
                    LoadDetails = e["LoadDetails"].ToString(),
                    Remarks = e["Remarks"].ToString(),
                    IsBUP = Convert.ToInt32(e["IsBUP"].ToString()),
                    LocationStatus = Convert.ToInt32(e["LocationStatus"]),
                    ActualGrossWt = Convert.ToDecimal(e["ActualGrossWt"]),
                    Priority = e["Priority"].ToString(),
                    Route = e["Route"].ToString(),
                    IsDisplay = Convert.ToInt32(e["IsDisplay"]),
                    OFLDPieces = Convert.ToInt32(e["OFLDPieces"]),
                    OFLDGrossWeight = Convert.ToDecimal(e["OFLDGrossWeight"]),
                    OFLDVolumeWeight = Convert.ToDecimal(e["OFLDVolumeWeight"]),
                    OFLDCBM = Convert.ToDecimal(e["OFLDCBM"]),
                    AviOFLDGrossWeight = Convert.ToDecimal(e["AviOFLDGrossWeight"]),
                    AviOFLDVolumeWeight = Convert.ToDecimal(e["AviOFLDVolumeWeight"]),
                    AviOFLDCBM = Convert.ToDecimal(e["AviOFLDCBM"]),
                    MoveToSegregation = Convert.ToInt32(e["MoveToSegregation"])
                });
                ds.Dispose();
                return new DataSourceResult
                {
                    Data = wmsBookingList.AsQueryable().ToList(),
                    Total = Convert.ToInt32(ds.Tables[1].Rows[0][0].ToString()),
                    SortCondition = sorts,
                    StoredProcedure = ProcName
                };
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }

        public DataSourceResult GetFlightArrivalShipmentGridData(string FFMFlightMasterSNo, int skip, int take, int page, int pageSize, List<SoftwareFactory.Data.GridSort> sort, SoftwareFactory.Data.GridFilter filter)
        {
            try
            {
                string sorts = GridSort.ProcessSorting(sort);
                string ProcName = "";
                if (filter == null)
                {
                    filter = new GridFilter();
                    filter.Logic = "AND";
                    filter.Filters = new List<GridFilter>();
                }
                DataSet ds = new DataSet();
                ProcName = "FA_GetFlightArrivalShipmentGridData";
                string filters = GridFilter.ProcessFilters<WMSFlightArrivalShipmentGridData>(filter);
                SqlParameter[] Parameters = { new SqlParameter("@PageNo", page), new SqlParameter("@PageSize", pageSize), new SqlParameter("@WhereCondition", filters), new SqlParameter("@OrderBy", sorts), new SqlParameter("@FFMFlightMasterSNo", FFMFlightMasterSNo) };
                ds = SqlHelper.ExecuteDataset(DMLConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, ProcName, Parameters);
                var wmsBookingList = ds.Tables[0].AsEnumerable().Select(e => new WMSFlightArrivalShipmentGridData
                {
                    IsManual = Convert.ToInt32(e["IsManual"]),
                    DailyFlightSNo = Convert.ToInt32(e["DailyFlightSNo"]),
                    GroupFlightSNo = e["GroupFlightSNo"].ToString(),
                    FFMShipmentTransSNo = Convert.ToInt32(e["FFMShipmentTransSNo"]),
                    ArrivedShipmentSNo = Convert.ToInt32(e["ArrivedShipmentSNo"]),
                    AWBSNo = Convert.ToInt32(e["AWBSNo"]),
                    FFMFlightMasterSNo = Convert.ToInt32(e["FFMFlightMasterSNo"]),
                    CheckIn = e["CheckIn"].ToString(),
                    ULDNo = e["ULDNo"].ToString(),
                    AWBNo = e["AWBNo"].ToString(),
                    ShipmentOriginAirportCode = e["ShipmentOriginAirportCode"].ToString(),
                    ShipmentDestinationAirportCode = e["ShipmentDestinationAirportCode"].ToString(),
                    GrossWeight = e["GrossWeight"].ToString(),
                    Pieces = Convert.ToInt32(e["Pieces"].ToString() == "" ? "0" : e["Pieces"].ToString()),
                    UldArrived = e["UldArrived"].ToString(),
                    NatureOfGoods = e["NatureOfGoods"].ToString().ToUpper(),
                    SPHC = e["SPHC"].ToString(),
                    SPHCPriority = e["SPHCPriority"].ToString(),
                    Status = e["Status"].ToString(),
                    OSI = e["OSI"].ToString(),
                    COR = e["COR"].ToString(),
                    ReceivedPcs = e["ReceivedPcs"].ToString(),
                    FFMPieces = e["FFMPieces"].ToString() + "/" + e["Pieces"].ToString(),
                    TotalFFMPieces = e["FFMPieces"].ToString(),
                    IsDocument = Convert.ToInt32(e["IsDocument"].ToString()),
                    Document = e["Document"].ToString(),
                    LoadDetails = e["LoadDetails"].ToString(),
                    Remarks = e["Remarks"].ToString(),
                    PosNo = e["PosNo"].ToString(),
                    IsBUP = Convert.ToInt32(e["IsBUP"].ToString()),
                    IsThroughULD = Convert.ToInt32(e["IsThroughULD"].ToString()),
                    LocationStatus = Convert.ToInt32(e["LocationStatus"]),
                    ActualGrossWt = Convert.ToDecimal(e["ActualGrossWt"]),
                    VolumeWeight = Convert.ToDecimal(e["VolumeWeight"]),
                    ActualVolumeWt = Convert.ToDecimal(e["ActualVolumeWt"]),
                    Priority = e["Priority"].ToString() == "0.00" ? "" : e["Priority"].ToString(),
                    IsDeliveryOrder = Convert.ToInt32(e["IsDeliveryOrder"].ToString()),
                    ArrivalStatus = Convert.ToInt32(e["ArrivalStatus"].ToString()),
                    IsDamaged = Convert.ToInt32(e["IsDamaged"]),
                    IsDisabled = Convert.ToBoolean(e["IsDisabled"]),
                    DisabledText = e["DisabledText"].ToString(),
                    Isamendedvalue = Convert.ToInt32(e["Isamendedvalue"]),
                    IsRushHandling = Convert.ToInt32(e["IsRushHandling"]),
                    POMailSNo = Convert.ToInt32(e["POMailSNo"]),
                    ShipmentType = e["ShipmentType"].ToString(),
                    POMArrivedShipmentSNo = Convert.ToInt32(e["POMArrivedShipmentSNo"]),
                    IsLocationMandatoryOnImport = Convert.ToInt32(e["IsLocationMandatoryOnImport"]),
                    IsInternational = e["IsInternational"].ToString(),
                    DestinationAirportCode = e["DestinationAirportCode"].ToString(),
                    IsDO = Convert.ToInt32(e["IsDO"]),
                    IsNoShow = Convert.ToInt32(e["IsNoShow"]),
                    IsNotBooked = Convert.ToInt32(e["IsNotBooked"])
                });
                ds.Dispose();
                return new DataSourceResult
                {
                    Data = wmsBookingList.AsQueryable().ToList(),
                    Total = Convert.ToInt32(ds.Tables[1].Rows[0][0].ToString()),
                    FilterCondition = filters,
                    SortCondition = sorts,
                    StoredProcedure = ProcName
                };
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }

        public DataSourceResult GetInboundFlightGridData(GetInboundFlightGridData model, int skip, int take, int page, int pageSize, List<SoftwareFactory.Data.GridSort> sort, SoftwareFactory.Data.GridFilter filter)
        {
            try
            {
                string sorts = GridSort.ProcessSorting(sort);
                string ProcName = "";
                if (filter == null)
                {
                    filter = new GridFilter();
                    filter.Logic = "AND";
                    filter.Filters = new List<GridFilter>();
                }
                DataSet ds = new DataSet();
                ProcName = "GetInboundFlightGridData";
                string filters = GridFilter.ProcessFilters<InboundFlight>(filter);

                SqlParameter[] Parameters = { new SqlParameter("@PageNo", page), new SqlParameter("@PageSize", pageSize), new SqlParameter("@WhereCondition", filters), new SqlParameter("@OrderBy", sorts), new SqlParameter("@SearchAirlineCarrierCode", model.SearchAirlineCarrierCode), new SqlParameter("@SearchBoardingPoint", model.SearchBoardingPoint), new SqlParameter("@SearchFromDate", model.searchFromDate), new SqlParameter("@SearchToDate", model.searchToDate), new SqlParameter("@StartTime", model.StartTime.Replace("-", ":")), new SqlParameter("@EndTime", model.EndTime.Replace("-", ":")), new SqlParameter("@SearchFFMRcvd", model.SearchFFMRcvd), new SqlParameter("@SearchQRT", model.SearchQRT), new SqlParameter("@SearchSHCDGR", model.SearchSHCDGR), new SqlParameter("@SearchTransitFlight", model.SearchTransitFlight), new SqlParameter("@SearchFlightNo", model.SearchFlightNo), new SqlParameter("@SearchConnectingFlights", model.SearchConnectingFlights), new SqlParameter("@SearchFilterULDCounts", model.SearchFilterULDCounts), new SqlParameter("@SearchFilterMCT", model.SearchFilterMCT), new SqlParameter("@SearchFStatus", model.SearchFStatus), new SqlParameter("@LoggedInAirportCode", ((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).AirportCode.ToString()), new SqlParameter("@UserSNo", Convert.ToInt32(((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).UserSNo.ToString())) };

                ds = SqlHelper.ExecuteDataset(DMLConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, ProcName, Parameters);

                var inboundFlightList = ds.Tables[0].AsEnumerable().Select(e => new InboundFlight
                {
                    DailyFlightSNo = Convert.ToInt32(e["DailyFlightSNo"]),
                    GroupFlightSNo = e["GroupFlightSNo"].ToString(),
                    FFMFlightMasterSNo = Convert.ToInt32(e["FFMFlightMasterSNo"]),
                    BoardingPoint = e["BoardingPoint"].ToString(),
                    OffPoint = e["OffPoint"].ToString(),
                    Route = e["Route"].ToString(),
                    EndPoint = e["EndPoint"].ToString(),
                    TransitFlight = e["TransitFlight"].ToString(),
                    FlightNo = e["FlightNo"].ToString(),
                    FlightDate = Convert.ToDateTime(e["FlightDate"].ToString()),
                    ATD = e["ATD"].ToString(),
                    ETD = e["ETD"].ToString(),
                    ATA = e["ATA"].ToString(),
                    ETA1 = e["ETA1"].ToString(),
                    FlightType = e["FlightType"].ToString(),
                    Equipment = e["Equipment"].ToString(),
                    AirCraftRegnNo = e["AirCraftRegnNo"].ToString(),
                    IsFFM = (e["FFM"].ToString() == "YES") ? true : false,
                    MVT = (e["MVT"].ToString() == "YES") ? "1" : "0",
                    FFM = (e["FFM"].ToString() == "YES") ? "1" : "0",
                    CPM = (e["CPM"].ToString() == "YES") ? "1" : "0",
                    FWB = e["FWB"].ToString(),
                    FHL = e["FHL"].ToString(),
                    TotalAWBCount = e["TotalAWBCount"].ToString(),
                    TotalCourierCount = e["TotalCourierCount"].ToString(),
                    TotalPOMailCount = e["TotalPOMailCount"].ToString(),
                    ULDCount = e["ULDCount"].ToString(),
                    SHCDGR = e["SHCDGR"].ToString(),
                    PIL = e["PIL"].ToString(),
                    QRT = e["QRT"].ToString(),
                    MCT = e["MCT"].ToString(),
                    ConnectingFlights = e["ConnectingFlights"].ToString(),
                    Status = e["Status"].ToString(),
                    IsArrivalStatus = Convert.ToInt32(e["IsArrivalStatus"]),
                    FCReport = 0,
                    IsFlightClosed = Convert.ToInt32(e["IsFlightClosed"]),
                    PomEquipment = e["PomEquipment"].ToString(),
                    POMULDCount = e["POMULDCount"].ToString()
                });

                ds.Dispose();
                return new DataSourceResult
                {
                    Data = inboundFlightList.AsQueryable().ToList(),
                    Total = Convert.ToInt32(ds.Tables[1].Rows[0][0].ToString()),
                    FilterCondition = filters,
                    SortCondition = sorts,
                    StoredProcedure = ProcName
                };
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }

        private void CreateInboundFlightInformationGrid(StringBuilder Container, string ProcessName, string FFMFlightMasterSNo, bool isV2 = false)
        {
            using (Grid g = new Grid())
            {
                g.Height = 100;
                g.PageName = this.MyPageName;
                g.PrimaryID = this.MyPrimaryID;
                g.ModuleName = this.MyModuleID;
                g.AppsName = this.MyAppID;
                g.DataSoruceUrl = "Services/Import/InboundFlightService.svc/GetInboundFlightInformationGridData";
                g.NewURL = MyPageName + "?" + GetWebURLString("New", false);
                g.ServiceModuleName = this.MyModuleID;
                g.UserID = this.MyUserID;
                g.FormCaptionText = "Flight Information  <input type='button' id='btnAWBInfo' value='AWB Info' onclick='OpenPopUp()'/><div id='divAWBInfo' style='display:none;text-align: center;'></div><div id='divExport'></div>";
                g.DefaultPageSize = 5;
                g.IsDisplayOnly = true;
                g.IsProcessPart = true;
                g.IsAllowedFiltering = false;
                g.IsVirtualScroll = false;
                g.IsActionRequired = false;
                g.ProcessName = ProcessName;
                g.Column = new List<GridColumn>();
                g.Column.Add(new GridColumn { Field = "DailyFlightSNo", Title = "DailyFlightSNo", DataType = GridDataType.String.ToString(), IsHidden = true });
                g.Column.Add(new GridColumn { Field = "FFMFlightMasterSNo", Title = "FFMFlightMasterSNo", DataType = GridDataType.String.ToString(), IsHidden = true });
                g.Column.Add(new GridColumn { Field = "ULDNo", Title = "ULDNo", DataType = GridDataType.String.ToString(), IsHidden = true });
                g.Column.Add(new GridColumn { Field = "AWBNo", Title = "AWB No", DataType = GridDataType.String.ToString(), Width = 50, Template = "<span title=\"#= AWBNo #\">#= AWBNo #</span>" });
                g.Column.Add(new GridColumn { Field = "AgentName", Title = "Agent Name", DataType = GridDataType.String.ToString(), Width = 51 });
                g.Column.Add(new GridColumn { Field = "FinalDestination", Title = "Destination", DataType = GridDataType.String.ToString(), Width = 33 });
                g.Column.Add(new GridColumn { Field = "Pieces", Title = "Pieces", DataType = GridDataType.String.ToString(), Width = 23 });
                g.Column.Add(new GridColumn { Field = "GrossWt", Title = "Gross Wt", DataType = GridDataType.String.ToString(), Width = 27 });
                g.Column.Add(new GridColumn { Field = "VolumeWt", Title = "Volume Wt", DataType = GridDataType.String.ToString(), Width = 33 });
                g.Column.Add(new GridColumn { Field = "BuildDetails", Title = "Build/Load Details", DataType = GridDataType.String.ToString(), Width = 51 });
                g.Column.Add(new GridColumn { Field = "ULDNo", Title = "ULD/Bulk", DataType = GridDataType.String.ToString(), Width = 35, Template = "<span class=\"actionView\" >#=ULDNo#</span>" });
                g.Column.Add(new GridColumn { Field = "SpaceAllocation", Title = "Space Allocation", DataType = GridDataType.String.ToString(), Width = 46 });
                g.Column.Add(new GridColumn { Field = "Position", Title = "Position", DataType = GridDataType.String.ToString(), Width = 28 });
                g.Column.Add(new GridColumn { Field = "QRT", Title = "QRT", DataType = GridDataType.String.ToString(), Width = 22 });
                g.Column.Add(new GridColumn { Field = "MCT", Title = "MCT", DataType = GridDataType.String.ToString(), Width = 23 });
                g.Column.Add(new GridColumn { Field = "Commodity", Title = "Nature of Goods", DataType = GridDataType.String.ToString(), Width = 48, Template = "<span title=\"#= Commodity #\">#= Commodity #</span>" });
                g.Column.Add(new GridColumn { Field = "SHCDGR", Title = "SHC/DGR", DataType = GridDataType.String.ToString(), Width = 31, Template = "<span title=\"#= SHCDGR #\">#= SHCDGR #</span>" });
                g.Column.Add(new GridColumn { Field = "ConnectingFlights", Title = "Flight No/TR", DataType = GridDataType.String.ToString(), Width = 34 });
                g.Column.Add(new GridColumn { Field = "ConnectingFlightDate", Title = "Connecting Flight Date", DataType = GridDataType.String.ToString(), Width = 40 });
                g.Column.Add(new GridColumn { Field = "ETD", Title = "ETD", DataType = GridDataType.String.ToString(), Width = 31, Template = "<span title=\"#= ETD #\">#= ETD #</span>" });
                g.Column.Add(new GridColumn { Field = "CNXNFlightType", Title = "CNXN Flight Type", DataType = GridDataType.String.ToString(), Width = 50 });
                g.Column.Add(new GridColumn { Field = "CNXNEquipment", Title = "CNXN Equipment", DataType = GridDataType.String.ToString(), Width = 50, Template = "<span title=\"#= CNXNEquipment #\">#= CNXNEquipment #</span>" });
                g.ExtraParam = new List<GridExtraParam>();
                g.ExtraParam.Add(new GridExtraParam { Field = "FFMFlightMasterSNo", Value = FFMFlightMasterSNo });
                g.InstantiateIn(Container, isV2);
            }
        }

        public Stream GetInboundFlightInformationGrid(GetFlightArrivalShipmentGrid model)
        {
            return BuildWebForm(model.processName, model.moduleName, model.appName, "IndexView", FFMFlightMasterSNo: model.FFMFlightMasterSNo);
        }

        public DataSourceResult GetInboundFlightInformationGridData(GetInboundFlightULDInfoGridData model, int skip, int take, int page, int pageSize, List<SoftwareFactory.Data.GridSort> sort, SoftwareFactory.Data.GridFilter filter)
        {
            try
            {
                if (string.IsNullOrEmpty(model.LoggedInCity))
                {
                    model.LoggedInCity = ((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).CitySNo.ToString();
                }
                string sorts = GridSort.ProcessSorting(sort);
                string ProcName = "";
                if (filter == null)
                {
                    filter = new GridFilter();
                    filter.Logic = "AND";
                    filter.Filters = new List<GridFilter>();
                }
                DataSet ds = new DataSet();
                ProcName = "GetInboundFlightInformationGridData";
                string filters = GridFilter.ProcessFilters<InboundFlight>(filter);

                SqlParameter[] Parameters = { new SqlParameter("@PageNo", page), new SqlParameter("@PageSize", pageSize), new SqlParameter("@WhereCondition", filters), new SqlParameter("@OrderBy", sorts), new SqlParameter("@FFMFlightMasterSNo", model.FFMFlightMasterSNo), new SqlParameter("@AirportCode", ((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).AirportCode.ToString()) };

                ds = SqlHelper.ExecuteDataset(DMLConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, ProcName, Parameters);

                var inboundFlightInformationList = ds.Tables[0].AsEnumerable().Select(e => new InboundFlightInformation
                {
                    FFMFlightMasterSNo = Convert.ToInt64(e["FFMFlightMasterSNo"]),
                    AWBNo = e["AWBNo"].ToString(),
                    Origin = e["Origin"].ToString(),
                    Destination = e["Destination"].ToString(),
                    FinalDestination = e["FinalDestination"].ToString(),
                    Pieces = Convert.ToInt32(e["Pieces"]),
                    GrossWt = Convert.ToDecimal(e["GrossWt"]),
                    VolumeWt = Convert.ToDecimal(e["VolumeWt"]),
                    BuildDetails = e["BuildDetails"].ToString(),
                    ULDNo = e["ULDNo"].ToString(),
                    SpaceAllocation = e["SpaceAllocation"].ToString(),
                    Position = e["Position"].ToString(),
                    QRT = e["QRT"].ToString(),
                    MCT = e["MCT"].ToString(),
                    Commodity = e["Commodity"].ToString(),
                    SHCDGR = e["SHCDGR"].ToString(),
                    ConnectingFlights = e["ConnectingFlights"].ToString(),
                    ConnectingFlightDate = e["ConnectingFlightDate"].ToString(),
                    ETD = e["ETD"].ToString(),
                    CNXNFlightType = e["CNXNFlightType"].ToString(),
                    CNXNEquipment = e["CNXNEquipment"].ToString(),
                    AgentName = e["AgentName"].ToString(),
                });

                ds.Dispose();
                return new DataSourceResult
                {
                    Data = inboundFlightInformationList.AsQueryable().ToList(),
                    Total = Convert.ToInt32(ds.Tables[1].Rows[0][0].ToString()),
                    FilterCondition = filters,
                    SortCondition = sorts,
                    StoredProcedure = ProcName
                };
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }

        private void CreateInboundFlightULDInformationGrid(StringBuilder Container, string ProcessName, string ULDNo, bool isV2 = false)
        {

            using (Grid g = new Grid())
            {
                g.Height = 100;
                g.PageName = this.MyPageName;
                g.PrimaryID = this.MyPrimaryID;
                g.ModuleName = this.MyModuleID;
                g.AppsName = this.MyAppID;
                g.DataSoruceUrl = "Services/Import/InboundFlightService.svc/GetInboundFlightULDInformationGridData";
                g.NewURL = MyPageName + "?" + GetWebURLString("New", false);
                g.ServiceModuleName = this.MyModuleID;
                g.UserID = this.MyUserID;
                g.FormCaptionText = "ULD Information";
                g.DefaultPageSize = 5;
                g.IsDisplayOnly = true;
                g.IsAllowedFiltering = false;
                g.IsProcessPart = true;
                g.IsVirtualScroll = false;
                g.IsActionRequired = false;
                g.ProcessName = ProcessName;

                g.Column = new List<GridColumn>();
                g.Column.Add(new GridColumn { Field = "FFMFlightMasterSNo", Title = "FFMFlightMasterSNo", DataType = GridDataType.String.ToString(), IsHidden = true });
                g.Column.Add(new GridColumn { Field = "ULDNo", Title = "ULD No", DataType = GridDataType.String.ToString(), Width = 40, Template = "<span class=\"actionView\" >#=ULDNo#</span>" });
                g.Column.Add(new GridColumn { Field = "Weight", Title = "Build Up Weight(Kgs)", DataType = GridDataType.String.ToString(), Width = 32 });
                g.Column.Add(new GridColumn { Field = "ClassType", Title = "Class Type", DataType = GridDataType.String.ToString(), Width = 35 });
                g.Column.Add(new GridColumn { Field = "ContourCode", Title = "Contour Code", DataType = GridDataType.String.ToString(), Width = 42 });
                g.Column.Add(new GridColumn { Field = "SHCDGR", Title = "Includes SHC/DGR", DataType = GridDataType.String.ToString(), Width = 33 });
                g.Column.Add(new GridColumn { Field = "Position", Title = "Position", DataType = GridDataType.String.ToString(), Width = 30 });
                g.Column.Add(new GridColumn { Field = "ULDLoadingCode", Title = "ULD Loading Code", DataType = GridDataType.String.ToString(), Width = 32 });
                g.ExtraParam = new List<GridExtraParam>();
                g.InstantiateIn(Container, isV2);
            }
        }

        public Stream GetInboundFlightULDInformationGrid(GetFlightArrivalShipmentGrid model)
        {
            return BuildWebForm(model.processName, model.moduleName, model.appName, "IndexView", ULDNo: model.FFMFlightMasterSNo);
        }

        public DataSourceResult GetInboundFlightULDInformationGridData(GetInboundFlightULDInformationGridData model, int skip, int take, int page, int pageSize, List<SoftwareFactory.Data.GridSort> sort, SoftwareFactory.Data.GridFilter filter)
        {
            try
            {
                string sorts = GridSort.ProcessSorting(sort);
                string ProcName = "";
                if (filter == null)
                {
                    filter = new GridFilter();
                    filter.Logic = "AND";
                    filter.Filters = new List<GridFilter>();
                }
                DataSet ds = new DataSet();
                ProcName = "GetInboundFlightULDInformationGridData";
                string filters = GridFilter.ProcessFilters<InboundFlight>(filter);
                SqlParameter[] Parameters = { new SqlParameter("@PageNo", page), new SqlParameter("@PageSize", pageSize), new SqlParameter("@WhereCondition", filters), new SqlParameter("@OrderBy", sorts), new SqlParameter("@ULDNo", model.ULDNo), new SqlParameter("@LoggedInCity", model.LoggedInCity) };
                ds = SqlHelper.ExecuteDataset(DMLConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, ProcName, Parameters);
                var inboundFlightULDInformationList = ds.Tables[0].AsEnumerable().Select(e => new InboundFlightULDInformation
                {
                    ULDNo = e["ULDNo"].ToString(),
                    Weight = Convert.ToDecimal(e["Weight"]),
                    ClassType = e["ClassType"].ToString(),
                    ContourCode = e["ContourCode"].ToString(),
                    SHCDGR = e["SHCDGR"].ToString(),
                    Position = e["Position"].ToString(),
                    ULDLoadingCode = e["ULDLoadingCode"].ToString(),
                });

                ds.Dispose();
                return new DataSourceResult
                {
                    Data = inboundFlightULDInformationList.AsQueryable().ToList(),
                    Total = Convert.ToInt32(ds.Tables[1].Rows[0][0].ToString()),
                    FilterCondition = filters,
                    SortCondition = sorts,
                    StoredProcedure = ProcName
                };
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }

        private void CreateInboundFlightULDInfoGrid(StringBuilder Container, string ProcessName, string FFMFlightMasterSNo, bool isV2 = false)
        {
            using (Grid g = new Grid())
            {
                g.Height = 100;
                g.PageName = this.MyPageName;
                g.PrimaryID = this.MyPrimaryID;
                g.ModuleName = this.MyModuleID;
                g.AppsName = this.MyAppID;
                g.DataSoruceUrl = "Services/Import/InboundFlightService.svc/GetInboundFlightULDInfoGridData";
                g.NewURL = MyPageName + "?" + GetWebURLString("New", false);
                g.ServiceModuleName = this.MyModuleID;
                g.UserID = this.MyUserID;
                g.FormCaptionText = "ULD Information";
                g.DefaultPageSize = 5;
                g.IsDisplayOnly = true;
                g.IsAllowedFiltering = false;
                g.IsProcessPart = true;
                g.IsVirtualScroll = false;
                g.IsActionRequired = false;
                g.ProcessName = ProcessName;
                g.Column = new List<GridColumn>();
                g.Column.Add(new GridColumn { Field = "FFMFlightMasterSNo", Title = "FFMFlightMasterSNo", DataType = GridDataType.String.ToString(), IsHidden = true });
                g.Column.Add(new GridColumn { Field = "ULDNo", Title = "ULD No", DataType = GridDataType.String.ToString(), Width = 40 });
                g.Column.Add(new GridColumn { Field = "BuildUpWeight", Title = "Build Up Weight", DataType = GridDataType.String.ToString(), Width = 40 });
                g.Column.Add(new GridColumn { Field = "AWBNo", Title = "AWB No", DataType = GridDataType.String.ToString(), Width = 40 });
                g.Column.Add(new GridColumn { Field = "Pcs", Title = "Pcs", DataType = GridDataType.String.ToString(), Width = 25 });
                g.Column.Add(new GridColumn { Field = "GrWt", Title = "Gross Wt(Kgs)", DataType = GridDataType.String.ToString(), Width = 32 });
                g.Column.Add(new GridColumn { Field = "PartLoaded", Title = "Part Loaded", DataType = GridDataType.String.ToString(), Width = 25 });
                g.Column.Add(new GridColumn { Field = "SHCDGR", Title = "SHC/DGR", DataType = GridDataType.String.ToString(), Width = 25 });
                g.ExtraParam = new List<GridExtraParam>();
                g.InstantiateIn(Container, isV2);
            }
        }

        public Stream GetInboundFlightULDInfoGrid(GetFlightArrivalShipmentGrid model)
        {
            return BuildWebForm(model.processName, model.moduleName, model.appName, "IndexView", FFMFlightMasterSNo: model.FFMFlightMasterSNo);
        }

        public DataSourceResult GetInboundFlightULDInfoGridData(GetInboundFlightULDInfoGridData model, int skip, int take, int page, int pageSize, List<SoftwareFactory.Data.GridSort> sort, SoftwareFactory.Data.GridFilter filter)
        {
            try
            {
                if (string.IsNullOrEmpty(model.LoggedInCity))
                {
                    model.LoggedInCity = ((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).CitySNo.ToString();
                }

                string sorts = GridSort.ProcessSorting(sort);
                string ProcName = "";
                if (filter == null)
                {
                    filter = new GridFilter();
                    filter.Logic = "AND";
                    filter.Filters = new List<GridFilter>();
                }
                DataSet ds = new DataSet();
                ProcName = "GetInboundFlightULDInfoGridData";
                string filters = GridFilter.ProcessFilters<InboundFlight>(filter);
                SqlParameter[] Parameters = { new SqlParameter("@PageNo", page), new SqlParameter("@PageSize", pageSize), new SqlParameter("@WhereCondition", filters), new SqlParameter("@OrderBy", sorts), new SqlParameter("@FFMFlightMasterSNo", model.FFMFlightMasterSNo), new SqlParameter("@LoggedInCity", model.LoggedInCity) };
                ds = SqlHelper.ExecuteDataset(DMLConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, ProcName, Parameters);
                var inboundFlightULDInfoList = ds.Tables[0].AsEnumerable().Select(e => new InboundFlightULDInfo
                {
                    FFMFlightMasterSNo = Convert.ToInt64(e["FFMFlightMasterSNo"]),
                    ULDNo = e["ULDNo"].ToString(),
                    BuildUpWeight = Convert.ToDecimal(e["BuildUpWeight"]),
                    AWBNo = e["AWBNo"].ToString(),
                    Pcs = Convert.ToInt32(e["Pcs"]),
                    GrWt = Convert.ToDecimal(e["GrWt"]),
                    PartLoaded = e["PartLoaded"].ToString(),
                    SHCDGR = e["SHCDGR"].ToString(),
                });

                ds.Dispose();
                return new DataSourceResult
                {
                    Data = inboundFlightULDInfoList.AsQueryable().ToList(),
                    Total = Convert.ToInt32(ds.Tables[1].Rows[0][0].ToString()),
                    FilterCondition = filters,
                    SortCondition = sorts,
                    StoredProcedure = ProcName
                };
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }

        public KeyValuePair<string, List<FAULDLocation>> GetFAULDLocationRecord(string recordID, int page, int pageSize, string whereCondition, string sort)
        {
            try
            {
                FAULDLocation FAULDLocation = new FAULDLocation();
                SqlParameter[] Parameters = { new SqlParameter("@FFMShipmentTransSNo", recordID), new SqlParameter("@PageNo", page), new SqlParameter("@PageSize", pageSize), new SqlParameter("@WhereCondition", whereCondition), new SqlParameter("@OrderBy", sort) };
                DataSet ds = SqlHelper.ExecuteDataset(DMLConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, "FA_GetRecordFAULDLocation", Parameters);
                var FAULDLocationList = ds.Tables[0].AsEnumerable().Select(e => new FAULDLocation
                {
                    SNo = Convert.ToInt32(e["SNo"]),
                    FFMFlightMasterSNo = Convert.ToInt32(e["FFMFlightMasterSNo"]),
                    FFMShipmentTransSNo = Convert.ToInt32(e["FFMShipmentTransSNo"]),
                    ULDNo = e["ULDNo"].ToString(),
                    BUP = e["BUP"].ToString(),
                    HdnMovableLocation = Convert.ToInt32(e["HdnMovableLocation"].ToString()),
                    MovableLocation = e["MovableLocation"].ToString(),
                    HdnLocation = Convert.ToInt32(e["HdnLocation"]),
                    Location = e["Location"].ToString(),
                });
                return new KeyValuePair<string, List<FAULDLocation>>(ds.Tables[1].Rows[0][0].ToString(), FAULDLocationList.AsQueryable().ToList());
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }

        public List<string> createUpdateFAULDLocation(List<FAULDLocation> data)
        {
            try
            {
                int ret = 0;
                DataTable dtFAULDLocation = CollectionHelper.ConvertTo(data, "");
                List<string> ErrorMessage = new List<string>();
                BaseBusiness baseBussiness = new BaseBusiness();
                SqlParameter param = new SqlParameter();
                param.ParameterName = "@AWBLocation";
                param.SqlDbType = System.Data.SqlDbType.Structured;

                if (dtFAULDLocation.Rows.Count > 0)
                {
                    param.Value = dtFAULDLocation;
                    SqlParameter[] Parameters = { param, new SqlParameter("@UpdatedBy", Convert.ToInt32(((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).UserSNo.ToString())) };
                    ret = (int)SqlHelper.ExecuteScalar(DMLConnectionString.WebConfigConnectionString, "FA_ImportSaveAtULDLocation", Parameters);
                }

                if (ret > 0)
                {
                    if (ret > 1000)
                    {
                        string serverErrorMessage = baseBussiness.ReadServerErrorMessages(ret, "FAULDLocation");
                        if (!string.IsNullOrEmpty(serverErrorMessage))
                            ErrorMessage.Add(serverErrorMessage);
                    }
                    else
                    {
                        string dataBaseExceptionMessage = baseBussiness.ReadServerErrorMessages(ret, baseBussiness.DatabaseExceptionFileName);
                        if (!string.IsNullOrEmpty(dataBaseExceptionMessage))
                            ErrorMessage.Add(dataBaseExceptionMessage);
                    }
                }
                return ErrorMessage;
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }

        public List<string> deleteFAULDLocation(string recordID)
        {

            int ret = 0;
            List<string> ErrorMessage = new List<string>();
            BaseBusiness baseBussiness = new BaseBusiness();
            SqlParameter[] Parameters = { new SqlParameter("@SNo", recordID) };
            ret = (int)SqlHelper.ExecuteScalar(DMLConnectionString.WebConfigConnectionString, "DeleteFAULDLocation", Parameters);
            if (ret > 0)
            {
                if (ret > 1000)
                {
                    string serverErrorMessage = baseBussiness.ReadServerErrorMessages(ret, "FAULDLocation");
                    if (!string.IsNullOrEmpty(serverErrorMessage))
                        ErrorMessage.Add(serverErrorMessage);
                }
                else
                {
                    string dataBaseExceptionMessage = baseBussiness.ReadServerErrorMessages(ret, baseBussiness.DatabaseExceptionFileName);
                    if (!string.IsNullOrEmpty(dataBaseExceptionMessage))
                        ErrorMessage.Add(dataBaseExceptionMessage);
                }
            }
            return ErrorMessage;
        }

        public KeyValuePair<string, List<FAULDDamage>> GetFAULDDamageRecord(string recordID, int page, int pageSize, string whereCondition, string sort)
        {
            try
            {
                FAULDDamage FAULDLocation = new FAULDDamage();
                SqlParameter[] Parameters = { new SqlParameter("@FFMShipmentTransSNo", recordID), new SqlParameter("@PageNo", page), new SqlParameter("@PageSize", pageSize), new SqlParameter("@WhereCondition", whereCondition), new SqlParameter("@OrderBy", sort) };
                DataSet ds = SqlHelper.ExecuteDataset(DMLConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, "FA_GetRecordFAULDDamage", Parameters);
                var FAULDDamageList = ds.Tables[0].AsEnumerable().Select(e => new FAULDDamage
                {
                    SNo = Convert.ToInt32(e["SNo"]),
                    FFMShipmentTransSNo = Convert.ToInt32(e["FFMShipmentTransSNo"]),
                    ULDNo = e["ULDNo"].ToString(),
                    Serviceable = Convert.ToInt32(e["Serviceable"].ToString()) == 0 ? 1 : 0,
                    Remarks = e["Remarks"].ToString()
                });
                return new KeyValuePair<string, List<FAULDDamage>>(ds.Tables[1].Rows[0][0].ToString(), FAULDDamageList.AsQueryable().ToList());
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }

        public List<string> createUpdateFAULDDamage(List<FAULDDamage> data)
        {

            int ret = 0;
            DataTable dtFAULDDamage = CollectionHelper.ConvertTo(data, "");
            List<string> ErrorMessage = new List<string>();
            BaseBusiness baseBussiness = new BaseBusiness();
            SqlParameter param = new SqlParameter();
            param.ParameterName = "@FAULDDamageType";
            param.SqlDbType = System.Data.SqlDbType.Structured;
            if (dtFAULDDamage.Rows.Count > 0)
            {
                param.Value = dtFAULDDamage;
                SqlParameter[] Parameters = { param, new SqlParameter("@UpdatedBy", Convert.ToInt32(((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).UserSNo.ToString())) };
                ret = (int)SqlHelper.ExecuteScalar(DMLConnectionString.WebConfigConnectionString, "FA_UpdateFAULDDamage", Parameters);
            }

            if (ret > 0)
            {
                if (ret > 1000)
                {
                    string serverErrorMessage = baseBussiness.ReadServerErrorMessages(ret, "FAULDDamage");
                    if (!string.IsNullOrEmpty(serverErrorMessage))
                        ErrorMessage.Add(serverErrorMessage);
                }
                else
                {
                    string dataBaseExceptionMessage = baseBussiness.ReadServerErrorMessages(ret, baseBussiness.DatabaseExceptionFileName);
                    if (!string.IsNullOrEmpty(dataBaseExceptionMessage))
                        ErrorMessage.Add(dataBaseExceptionMessage);
                }
            }
            return ErrorMessage;
        }

        public List<string> deleteFAULDDamage(string recordID)
        {
            int ret = 0;
            List<string> ErrorMessage = new List<string>();
            BaseBusiness baseBussiness = new BaseBusiness();
            SqlParameter[] Parameters = { new SqlParameter("@SNo", recordID) };
            ret = (int)SqlHelper.ExecuteScalar(DMLConnectionString.WebConfigConnectionString, "DeleteFAULDDamage", Parameters);
            if (ret > 0)
            {
                if (ret > 1000)
                {
                    string serverErrorMessage = baseBussiness.ReadServerErrorMessages(ret, "FAULDDamage");
                    if (!string.IsNullOrEmpty(serverErrorMessage))
                        ErrorMessage.Add(serverErrorMessage);
                }
                else
                {
                    string dataBaseExceptionMessage = baseBussiness.ReadServerErrorMessages(ret, baseBussiness.DatabaseExceptionFileName);
                    if (!string.IsNullOrEmpty(dataBaseExceptionMessage))
                        ErrorMessage.Add(dataBaseExceptionMessage);
                }
            }
            return ErrorMessage;
        }

        public KeyValuePair<string, List<FAConsumable>> GetFAConsumableRecord(string recordID, int page, int pageSize, string whereCondition, string sort)
        {
            try
            {
                FAConsumable FAULDLocation = new FAConsumable();
                SqlParameter[] Parameters = { new SqlParameter("@FFMShipmentTransSNo", recordID), new SqlParameter("@PageNo", page), new SqlParameter("@PageSize", pageSize), new SqlParameter("@WhereCondition", whereCondition), new SqlParameter("@OrderBy", sort) };
                DataSet ds = SqlHelper.ExecuteDataset(DMLConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, "FA_GetRecordFAConsumable", Parameters);
                var FAConsumableList = ds.Tables[0].AsEnumerable().Select(e => new FAConsumable
                {
                    SNo = Convert.ToInt32(e["SNo"]),
                    FFMShipmentTransSNo = Convert.ToInt32(e["FFMShipmentTransSNo"]),
                    HdnConsumablesList = Convert.ToInt32(e["ConsumablesSNo"].ToString()),
                    ConsumablesList = e["ConsumablesList"].ToString(),
                    Quantity = Convert.ToInt32(e["Quantity"].ToString())
                });
                return new KeyValuePair<string, List<FAConsumable>>(ds.Tables[1].Rows[0][0].ToString(), FAConsumableList.AsQueryable().ToList());
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }

        public List<string> createUpdateFAConsumable(List<FAConsumable> data)
        {
            try
            {
                int ret = 0;
                DataTable dtFAConsumable = CollectionHelper.ConvertTo(data, "");
                List<string> ErrorMessage = new List<string>();
                BaseBusiness baseBussiness = new BaseBusiness();
                SqlParameter param = new SqlParameter();
                param.ParameterName = "@FAULDConsumableType";
                param.SqlDbType = System.Data.SqlDbType.Structured;
                if (dtFAConsumable.Rows.Count > 0)
                {
                    param.Value = dtFAConsumable;
                    SqlParameter[] Parameters = { param, new SqlParameter("@UpdatedBy", Convert.ToInt32(((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).UserSNo.ToString())) };
                    ret = (int)SqlHelper.ExecuteScalar(DMLConnectionString.WebConfigConnectionString, "FA_ImportSaveAtConsumable", Parameters);
                }

                if (ret > 0)
                {
                    if (ret > 1000)
                    {
                        string serverErrorMessage = baseBussiness.ReadServerErrorMessages(ret, "FAConsumable");
                        if (!string.IsNullOrEmpty(serverErrorMessage))
                            ErrorMessage.Add(serverErrorMessage);
                    }
                    else
                    {
                        string dataBaseExceptionMessage = baseBussiness.ReadServerErrorMessages(ret, baseBussiness.DatabaseExceptionFileName);
                        if (!string.IsNullOrEmpty(dataBaseExceptionMessage))
                            ErrorMessage.Add(dataBaseExceptionMessage);
                    }
                }
                return ErrorMessage;
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }

        public KeyValuePair<string, List<AddShipment>> GetAddShipmentRecord(string recordID, int page, int pageSize, string whereCondition, string sort)
        {
            try
            {
                string[] getRecordID = recordID.Split('.');
                AddShipment AddShipment = new AddShipment();
                SqlParameter[] Parameters = { new SqlParameter("@DailyFlightSNo", getRecordID[0]), new SqlParameter("@FFMFlightMasterSNo", getRecordID[1]), new SqlParameter("@PageNo", page), new SqlParameter("@PageSize", pageSize), new SqlParameter("@WhereCondition", whereCondition), new SqlParameter("@OrderBy", sort) };
                DataSet ds = SqlHelper.ExecuteDataset(DMLConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, "FA_GetRecordAddShipment", Parameters);

                var AddShipmentList = ds.Tables[0].AsEnumerable().Select(e => new AddShipment
                {
                    SNo = Convert.ToInt32(e["SNo"]),
                    DailyFlightSNo = Convert.ToInt32(e["DailyFlightSNo"]),
                    FFMFlightMasterSNo = Convert.ToInt32(e["FFMFlightMasterSNo"]),
                    AWBNo = e["AWBNo"].ToString(),
                    FoundAWB = e["FoundAWB"].ToString(),
                    HdnAWBOrigin = e["AWBOrigin"].ToString(),
                    AWBOrigin = e["AWBOrigin"].ToString(),
                    HdnAWBDestination = e["AWBDestination"].ToString(),
                    AWBDestination = e["AWBDestination"].ToString(),
                    HdnULDType = Convert.ToInt32(e["HdnULDType"]),
                    ULDType = e["ULDType"].ToString(),
                    BULKOrULD = e["BULKOrULD"].ToString(),
                    TotalPieces = e["TotalPieces"].ToString(),
                    GrossWeight = e["GrossWeight"].ToString(),
                    CBM = e["CBM"].ToString(),
                    VolumeWeight = e["VolumeWeight"].ToString(),
                    HdnSPHC = Convert.ToInt32(e["HdnSPHC"]),
                    SPHC = e["SPHC"].ToString(),
                    NatureOfGoods = e["NatureOfGoods"].ToString(),
                    PartSplitTotal = e["PartSplitTotal"].ToString(),
                    ArrivedPcs = e["ArrivedPcs"].ToString(),
                    ArrivedGrossWt = e["ArrivedGrossWt"].ToString(),
                    ArrivedCBM = e["ArrivedCBM"].ToString(),
                    ArrivedVolume = e["ArrivedVolume"].ToString(),
                    ShipmentRemarks = e["ShipmentRemarks"].ToString(),
                    KeepSameULD = Convert.ToInt32(e["KeepSameULD"]),
                    RefNo = e["RefNo"].ToString().ToUpper(),
                    AwbType = 0
                });
                return new KeyValuePair<string, List<AddShipment>>(ds.Tables[1].Rows[0][0].ToString(), AddShipmentList.AsQueryable().ToList());
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }

        public string CheckRushHandling(int DailyFlightSNo)
        {
            try
            {
                BaseBusiness baseBusiness = new BaseBusiness();

                DataSet ds = new DataSet();
                SqlParameter[] Parameters = { new SqlParameter("@DailyFlightSNo", DailyFlightSNo) };
                ds = SqlHelper.ExecuteDataset(DMLConnectionString.WebConfigConnectionString, "CheckRushHandling", Parameters);
                return ds.Tables[ds.Tables.Count - 1].Rows[0][0].ToString();
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }

        public string getstaartandendtime(int FFMShipmentTransSNo, int DailyFlightSno, int POMailSNo, int POMailArrivedShipmentSNo)
        {
            BaseBusiness baseBusiness = new BaseBusiness();
            DataSet ds = new DataSet();
            SqlParameter[] Parameters = { new SqlParameter("@sno", FFMShipmentTransSNo), new SqlParameter("@DailyFlightSno", DailyFlightSno), new SqlParameter("@POMailSNo", POMailSNo), new SqlParameter("@POMailArrivedShipmentSNo", POMailArrivedShipmentSNo) };
            try
            {
                ds = SqlHelper.ExecuteDataset(DMLConnectionString.WebConfigConnectionString, "getstaartandendtime", Parameters);
            }
            catch (Exception ex)
            {
                throw ex;
            }
            return CargoFlash.Cargo.Business.Common.CompleteDStoJSON(ds);
        }

        public string createUpdateAddShipment(List<AddShipmentType> data)
        {
            try
            {
                DataTable dtAddShipment = CollectionHelper.ConvertTo(data, "");
                BaseBusiness baseBusiness = new BaseBusiness();
                SqlParameter paramSaveAddShipment = new SqlParameter();
                paramSaveAddShipment.ParameterName = "@AddShipmentType";
                paramSaveAddShipment.SqlDbType = System.Data.SqlDbType.Structured;
                paramSaveAddShipment.Value = dtAddShipment;
                DataSet ds = new DataSet();
                SqlParameter[] Parameters = { paramSaveAddShipment,
                                              new SqlParameter("@UpdatedBy", Convert.ToInt32(((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).UserSNo.ToString())),
                                              new SqlParameter("@LoginAirportSNo", Convert.ToInt32(((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).AirportSNo.ToString()))
                                            };
                ds = SqlHelper.ExecuteDataset(DMLConnectionString.WebConfigConnectionString, "FA_SaveAddShipmentRecord", Parameters);
                return ds.Tables[ds.Tables.Count - 1].Rows[0][0].ToString();
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }

        public List<string> deleteAddShipment(string recordID)
        {
            try
            {
                int ret = 0;
                List<string> ErrorMessage = new List<string>();
                BaseBusiness baseBussiness = new BaseBusiness();
                SqlParameter[] Parameters = { new SqlParameter("@SNo", recordID) };
                ret = (int)SqlHelper.ExecuteScalar(DMLConnectionString.WebConfigConnectionString, "DeleteAddShipment", Parameters);
                if (ret > 0)
                {
                    if (ret > 1000)
                    {
                        string serverErrorMessage = baseBussiness.ReadServerErrorMessages(ret, "AddShipment");
                        if (!string.IsNullOrEmpty(serverErrorMessage))
                            ErrorMessage.Add(serverErrorMessage);
                    }
                    else
                    {
                        //For DataBase Exceptions like 'Foreign Key refrence Errors' etc
                        string dataBaseExceptionMessage = baseBussiness.ReadServerErrorMessages(ret, baseBussiness.DatabaseExceptionFileName);
                        if (!string.IsNullOrEmpty(dataBaseExceptionMessage))
                            ErrorMessage.Add(dataBaseExceptionMessage);
                    }
                }
                return ErrorMessage;
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }

        public KeyValuePair<string, List<ShipmentFlightDetail>> GetShipmentFlightDetail(string recid, int pageNo, int pageSize, string sort)
        {
            try
            {
                ShipmentFlightDetail shipmentFlightDetail = new ShipmentFlightDetail();
                SqlParameter[] Parameters = {
                    new SqlParameter("@AWBSNo",recid)};
                DataSet ds = SqlHelper.ExecuteDataset(DMLConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, "GetShipmentFlightDetail", Parameters);
                var GetShipmentFlightDetailList = ds.Tables[0].AsEnumerable().Select(e => new ShipmentFlightDetail
                {
                    SNo = Convert.ToInt32(e["SNo"]),
                    AWBSNo = Convert.ToInt32(recid),
                    DailyFlightSNo = Convert.ToInt32(e["DailyFlightSNo"]),
                    FFMFlightMasterSNo = Convert.ToInt32(e["FFMFlightMasterSNo"]),
                    AirlineName = e["AirlineName"].ToString(),
                    FlightNo = e["FlightNo"].ToString(),
                    FlightDate = e["FlightDate"].ToString(),
                    Origin = e["OriginAirport"].ToString(),
                    Destination = e["DestinationAirport"].ToString(),
                    AirlineSNo = Convert.ToInt32(e["AirlineSNo"]),
                    OriginAirportSNo = Convert.ToInt32(e["OriginAirportSNo"]),
                    DestinationAirportSNo = Convert.ToInt32(e["DestinationAirportSNo"]),
                });
                return new KeyValuePair<string, List<ShipmentFlightDetail>>(ds.Tables[0].Rows[0][0].ToString(), GetShipmentFlightDetailList.AsQueryable().ToList());
            }
            catch (Exception ex)//
            {
                throw ex;
            }
        }

        public List<string> createUpdateShipmentFlightDetail(List<ShipmentDetail> FlightDetail)
        {
            List<string> ErrorMessage = new List<string>();
            BaseBusiness baseBussiness = new BaseBusiness();
            try
            {
                int ret = 0;
                DataTable dtShipmentDetail = CollectionHelper.ConvertTo(FlightDetail, "");
                SqlParameter param = new SqlParameter();
                param.ParameterName = "@ShipmentFlightDetail";
                param.SqlDbType = System.Data.SqlDbType.Structured;
                if (dtShipmentDetail.Rows.Count > 0)
                {
                    param.Value = dtShipmentDetail;
                    DataSet ds = new DataSet();
                    SqlParameter[] Parameters = { new SqlParameter("@ShipmentFlightDetail", dtShipmentDetail), new SqlParameter("@UpdatedBy", Convert.ToInt32(((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).UserSNo.ToString())) };

                    ret = (int)SqlHelper.ExecuteScalar(DMLConnectionString.WebConfigConnectionString, "FA_SaveShipmentFlightDetailRecord", Parameters);
                }

                if (ret > 0)
                {
                    if (ret == 2003)
                    {
                        string serverErrorMessage = baseBussiness.ReadServerErrorMessages(ret, "AddShipment");
                        if (!string.IsNullOrEmpty(serverErrorMessage))
                            ErrorMessage.Add(serverErrorMessage);
                    }
                    else
                    {
                        //For DataBase Exceptions like 'Foreign Key refrence Errors' etc
                        string dataBaseExceptionMessage = baseBussiness.ReadServerErrorMessages(ret, baseBussiness.DatabaseExceptionFileName);
                        if (!string.IsNullOrEmpty(dataBaseExceptionMessage))
                            ErrorMessage.Add(dataBaseExceptionMessage);
                    }
                    return ErrorMessage;
                }
                else
                {
                    ErrorMessage.Add("Save Data");
                    return ErrorMessage;
                }
            }
            catch (Exception ex)
            {
                //throw ex;
                return ErrorMessage;
            }
        }

        public List<string> DeleteShipmentFlightRecord(string recordID)
        {
            try
            {
                int ret = 0;
                List<string> ErrorMessage = new List<string>();
                BaseBusiness baseBussiness = new BaseBusiness();
                SqlParameter[] Parameters = { new SqlParameter("@SNo", recordID) };
                ret = (int)SqlHelper.ExecuteScalar(DMLConnectionString.WebConfigConnectionString, "DeleteShipmentFlightRecord", Parameters);
                if (ret > 0)
                {
                    if (ret == 2004)
                    {
                        string serverErrorMessage = baseBussiness.ReadServerErrorMessages(ret, "AddShipment");
                        if (!string.IsNullOrEmpty(serverErrorMessage))
                            ErrorMessage.Add(serverErrorMessage);
                    }
                    else
                    {
                        //For DataBase Exceptions like 'Foreign Key refrence Errors' etc
                        string dataBaseExceptionMessage = baseBussiness.ReadServerErrorMessages(ret, baseBussiness.DatabaseExceptionFileName);
                        if (!string.IsNullOrEmpty(dataBaseExceptionMessage))
                            ErrorMessage.Add(dataBaseExceptionMessage);
                    }
                }
                return ErrorMessage;
            }
            catch (Exception ex)//
            {
                throw ex;
            }
        }

        public KeyValuePair<string, List<AwbULDLocation>> GetAwbULDLocationRecord_Pomail(string recordID, int page, int pageSize, string whereCondition, string sort)
        {
            try
            {
                string[] getRecordID = recordID.Split('.');
                AwbULDLocation AwbULDLocation = new AwbULDLocation();
                SqlParameter[] Parameters = { new SqlParameter("@ArrivedShipmentSNo", getRecordID[0]), new SqlParameter("@AWBSNo", getRecordID[1]), new SqlParameter("@PageNo", page), new SqlParameter("@PageSize", pageSize), new SqlParameter("@WhereCondition", whereCondition), new SqlParameter("@OrderBy", sort) };
                DataSet ds = SqlHelper.ExecuteDataset(DMLConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, "GetRecordAwbULDLocation_Pomail", Parameters);
                var AwbULDLocationList = ds.Tables[0].AsEnumerable().Select(e => new AwbULDLocation
                {
                    SNo = Convert.ToInt32(e["SNo"]),
                    AWBSNo = Convert.ToInt32(e["AWBSNo"].ToString()),
                    ArrivedShipmentSNo = Convert.ToInt32(e["ArrivedShipmentSNo"].ToString()),
                    AWBNo = e["AWBNo"].ToString(),
                    HdnAWBNo = e["AWBNo"].ToString(),
                    HdnRcvdPieces = Convert.ToInt32(e["RcvdPieces"].ToString()),
                    HdnRcvdGrossWeight = Convert.ToDecimal(e["RcvdGrossWeight"].ToString()),
                    RcvdPieces = Convert.ToInt32(e["RcvdPieces"].ToString()),
                    RcvdGrossWeight = Convert.ToDecimal(e["RcvdGrossWeight"].ToString()),
                    HdnHAWB = e["HdnHAWB"].ToString(),
                    HAWB = e["HAWB"].ToString(),
                    EndPieces = Convert.ToInt32(e["EndPieces"].ToString()),
                    HdnAssignLocation = Convert.ToInt32(e["LocationSNo"]),
                    AssignLocation = e["AssignLocation"].ToString(),
                    TempControlled = Convert.ToInt32(e["TempControlled"]),
                    StartTemperature = e["StartTemperature"].ToString(),
                    EndTemperature = e["EndTemperature"].ToString(),
                    HdnSPHC = e["SPHC"].ToString(),
                    SPHC = e["SPHCCode"].ToString(),
                    HdnMovableLocation = Convert.ToInt32(e["HdnMovableLocation"].ToString()),
                    MovableLocation = e["MovableLocation"].ToString(),
                    HdnLocSNo = Convert.ToInt32(e["HdnLocSNo"]),
                    HdnEndPieces = Convert.ToInt32(e["HdnEndPieces"])
                });
                return new KeyValuePair<string, List<AwbULDLocation>>(ds.Tables[1].Rows[0][0].ToString(), AwbULDLocationList.AsQueryable().ToList());
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }

        public KeyValuePair<string, List<AwbULDLocation>> GetAwbULDLocationRecord(string recordID, int page, int pageSize, string whereCondition, string sort)
        {
            try
            {
                string[] getRecordID = recordID.Split('.');
                AwbULDLocation AwbULDLocation = new AwbULDLocation();
                SqlParameter[] Parameters = { new SqlParameter("@ArrivedShipmentSNo", getRecordID[0]), new SqlParameter("@AWBSNo", getRecordID[1]), new SqlParameter("@PageNo", page), new SqlParameter("@PageSize", pageSize), new SqlParameter("@WhereCondition", whereCondition), new SqlParameter("@OrderBy", sort) };
                DataSet ds = SqlHelper.ExecuteDataset(DMLConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, "GetRecordAwbULDLocation", Parameters);
                var AwbULDLocationList = ds.Tables[0].AsEnumerable().Select(e => new AwbULDLocation
                {
                    SNo = Convert.ToInt32(e["SNo"]),
                    AWBSNo = Convert.ToInt32(e["AWBSNo"].ToString()),
                    ArrivedShipmentSNo = Convert.ToInt32(e["ArrivedShipmentSNo"].ToString()),
                    AWBNo = e["AWBNo"].ToString(),
                    HdnAWBNo = e["AWBNo"].ToString(),
                    HdnRcvdPieces = Convert.ToInt32(e["RcvdPieces"].ToString()),
                    HdnRcvdGrossWeight = Convert.ToDecimal(e["RcvdGrossWeight"].ToString()),
                    RcvdPieces = Convert.ToInt32(e["RcvdPieces"].ToString()),
                    RcvdGrossWeight = Convert.ToDecimal(e["RcvdGrossWeight"].ToString()),
                    HdnHAWB = e["HdnHAWB"].ToString(),
                    HAWB = e["HAWB"].ToString(),
                    EndPieces = Convert.ToInt32(e["EndPieces"].ToString()),
                    HdnAssignLocation = Convert.ToInt32(e["LocationSNo"]),
                    AssignLocation = e["AssignLocation"].ToString(),
                    TempControlled = Convert.ToInt32(e["TempControlled"]),
                    StartTemperature = e["StartTemperature"].ToString(),
                    EndTemperature = e["EndTemperature"].ToString(),
                    HdnSPHC = e["SPHC"].ToString(),
                    SPHC = e["SPHCCode"].ToString(),
                    HdnMovableLocation = Convert.ToInt32(e["HdnMovableLocation"].ToString()),
                    MovableLocation = e["MovableLocation"].ToString(),
                    HdnLocSNo = Convert.ToInt32(e["HdnLocSNo"]),
                    HdnEndPieces = Convert.ToInt32(e["HdnEndPieces"])
                });
                return new KeyValuePair<string, List<AwbULDLocation>>(ds.Tables[1].Rows[0][0].ToString(), AwbULDLocationList.AsQueryable().ToList());
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }

        public List<string> createUpdateAwbULDLocation(List<AwbULDLocationType> data)
        {
            try
            {
                int ret = 0;
                DataTable dtAwbULDLocation = CollectionHelper.ConvertTo(data, "");
                List<string> ErrorMessage = new List<string>();
                BaseBusiness baseBussiness = new BaseBusiness();
                SqlParameter param = new SqlParameter();
                param.ParameterName = "@AWBLocation";
                param.SqlDbType = System.Data.SqlDbType.Structured;

                if (dtAwbULDLocation.Rows.Count > 0)
                {
                    param.Value = dtAwbULDLocation;
                    DataSet ds = new DataSet();
                    SqlParameter[] Parameters = { param, new SqlParameter("@UpdatedBy", Convert.ToInt32(((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).UserSNo.ToString())) };

                    ret = (int)SqlHelper.ExecuteScalar(DMLConnectionString.WebConfigConnectionString, "FA_ImportSaveAtLocation", Parameters);
                }

                if (ret > 0)
                {
                    if (ret > 1000)
                    {
                        string serverErrorMessage = baseBussiness.ReadServerErrorMessages(ret, "FA_AwbULDLocation");
                        if (!string.IsNullOrEmpty(serverErrorMessage))
                            ErrorMessage.Add(serverErrorMessage);
                    }
                    else
                    {
                        //For DataBase Exceptions like 'Foreign Key refrence Errors' etc
                        string dataBaseExceptionMessage = baseBussiness.ReadServerErrorMessages(ret, baseBussiness.DatabaseExceptionFileName);
                        if (!string.IsNullOrEmpty(dataBaseExceptionMessage))
                            ErrorMessage.Add(dataBaseExceptionMessage);
                    }
                }
                return ErrorMessage;
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }

        public List<string> deleteAwbULDLocation(string recordID)
        {
            try
            {
                int ret = 0;
                List<string> ErrorMessage = new List<string>();
                BaseBusiness baseBussiness = new BaseBusiness();
                SqlParameter[] Parameters = { new SqlParameter("@SNo", recordID) };
                ret = (int)SqlHelper.ExecuteScalar(DMLConnectionString.WebConfigConnectionString, "FA_DeleteAwbULDLocation", Parameters);
                if (ret > 0)
                {
                    if (ret > 1000)
                    {
                        string serverErrorMessage = baseBussiness.ReadServerErrorMessages(ret, "FA_AwbULDLocation");
                        if (!string.IsNullOrEmpty(serverErrorMessage))
                            ErrorMessage.Add(serverErrorMessage);
                    }
                    else
                    {
                        //For DataBase Exceptions like 'Foreign Key refrence Errors' etc
                        string dataBaseExceptionMessage = baseBussiness.ReadServerErrorMessages(ret, baseBussiness.DatabaseExceptionFileName);
                        if (!string.IsNullOrEmpty(dataBaseExceptionMessage))
                            ErrorMessage.Add(dataBaseExceptionMessage);
                    }
                }
                return ErrorMessage;
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }
        public List<string> createUpdateAwbULDLocation_pomail(List<AwbULDLocationType> data)
        {
            try
            {
                int ret = 0;
                DataTable dtAwbULDLocation = CollectionHelper.ConvertTo(data, "");
                List<string> ErrorMessage = new List<string>();
                BaseBusiness baseBussiness = new BaseBusiness();
                SqlParameter param = new SqlParameter();
                param.ParameterName = "@AWBLocation";
                param.SqlDbType = System.Data.SqlDbType.Structured;

                if (dtAwbULDLocation.Rows.Count > 0)
                {
                    param.Value = dtAwbULDLocation;
                    DataSet ds = new DataSet();
                    SqlParameter[] Parameters = { param, new SqlParameter("@UpdatedBy", Convert.ToInt32(((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).UserSNo.ToString())) };

                    ret = (int)SqlHelper.ExecuteScalar(DMLConnectionString.WebConfigConnectionString, "FA_ImportSaveAtLocation_pomail", Parameters);
                    //DataSet ds3 = SqlHelper.ExecuteDataset(DMLConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, "FA_ImportSaveAtLocation_pomail", Parameters);
                }

                if (ret > 0)
                {
                    if (ret > 1000)
                    {
                        string serverErrorMessage = baseBussiness.ReadServerErrorMessages(ret, "FA_AwbULDLocation");
                        if (!string.IsNullOrEmpty(serverErrorMessage))
                            ErrorMessage.Add(serverErrorMessage);
                    }
                    else
                    {
                        //For DataBase Exceptions like 'Foreign Key refrence Errors' etc
                        string dataBaseExceptionMessage = baseBussiness.ReadServerErrorMessages(ret, baseBussiness.DatabaseExceptionFileName);
                        if (!string.IsNullOrEmpty(dataBaseExceptionMessage))
                            ErrorMessage.Add(dataBaseExceptionMessage);
                    }
                }
                return ErrorMessage;
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }

        public List<string> deleteAwbULDLocation_pomail(string recordID)
        {
            try
            {
                int ret = 0;
                List<string> ErrorMessage = new List<string>();
                BaseBusiness baseBussiness = new BaseBusiness();
                SqlParameter[] Parameters = { new SqlParameter("@SNo", recordID) };
                ret = (int)SqlHelper.ExecuteScalar(DMLConnectionString.WebConfigConnectionString, "FA_DeleteAwbULDLocation", Parameters);
                if (ret > 0)
                {
                    if (ret > 1000)
                    {
                        string serverErrorMessage = baseBussiness.ReadServerErrorMessages(ret, "FA_AwbULDLocation");
                        if (!string.IsNullOrEmpty(serverErrorMessage))
                            ErrorMessage.Add(serverErrorMessage);
                    }
                    else
                    {
                        //For DataBase Exceptions like 'Foreign Key refrence Errors' etc
                        string dataBaseExceptionMessage = baseBussiness.ReadServerErrorMessages(ret, baseBussiness.DatabaseExceptionFileName);
                        if (!string.IsNullOrEmpty(dataBaseExceptionMessage))
                            ErrorMessage.Add(dataBaseExceptionMessage);
                    }
                }
                return ErrorMessage;
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }

        public KeyValuePair<string, List<AwbULDDamage>> GetAwbULDDamageRecord(string recordID, int page, int pageSize, string whereCondition, string sort)
        {
            try
            {
                string[] getRecordID = recordID.Split('.');
                AwbULDDamage AwbULDLocation = new AwbULDDamage();
                SqlParameter[] Parameters = { new SqlParameter("@ArrivedShipmentSNo", getRecordID[0]), new SqlParameter("@AWBSNo", getRecordID[1]), new SqlParameter("@PageNo", page), new SqlParameter("@PageSize", pageSize), new SqlParameter("@WhereCondition", whereCondition), new SqlParameter("@OrderBy", sort) };
                DataSet ds = SqlHelper.ExecuteDataset(DMLConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, "GetRecordAwbULDDamage", Parameters);
                var AwbULDDamageList = ds.Tables[0].AsEnumerable().Select(e => new AwbULDDamage
                {
                    SNo = Convert.ToInt32(e["SNo"]),
                    AWBSNo = Convert.ToInt32(e["AWBSNo"]),
                    Pieces = Convert.ToInt32(e["Pieces"]),
                    ArrivedShipmentSNo = Convert.ToInt32(e["ArrivedShipmentSNo"].ToString()),
                    HdnAWBNo = e["AWBNo"].ToString(),
                    AWBNo = e["AWBNo"].ToString(),
                    IrregularityDamage = e["IrregularityDamage"].ToString(),
                    HdnIrregularityDamage = Convert.ToInt32(e["DamageSNo"].ToString()),
                    TotalPieces = Convert.ToInt32(e["TotalPieces"])
                });
                return new KeyValuePair<string, List<AwbULDDamage>>(ds.Tables[1].Rows[0][0].ToString(), AwbULDDamageList.AsQueryable().ToList());
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }

        public List<string> createUpdateAwbULDDamage(List<AwbULDDamageType> data)
        {
            try
            {
                int ret = 0;
                DataTable dtAwbULDDamage = CollectionHelper.ConvertTo(data, "");
                List<string> ErrorMessage = new List<string>();
                BaseBusiness baseBussiness = new BaseBusiness();
                SqlParameter param = new SqlParameter();
                param.ParameterName = "@AWBDamage";
                param.SqlDbType = System.Data.SqlDbType.Structured;
                // for create new record
                if (dtAwbULDDamage.Rows.Count > 0)
                {
                    param.Value = dtAwbULDDamage;
                    SqlParameter[] Parameters = { param, new SqlParameter("@UpdatedBy", Convert.ToInt32(((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).UserSNo.ToString())) };
                    ret = (int)SqlHelper.ExecuteScalar(DMLConnectionString.WebConfigConnectionString, "FA_ImportSaveAtDamage", Parameters);
                }

                if (ret > 0)
                {
                    if (ret > 1000)
                    {
                        string serverErrorMessage = baseBussiness.ReadServerErrorMessages(ret, "FA_AwbULDDamage");
                        if (!string.IsNullOrEmpty(serverErrorMessage))
                            ErrorMessage.Add(serverErrorMessage);
                    }
                    else
                    {
                        //For DataBase Exceptions like 'Foreign Key refrence Errors' etc
                        string dataBaseExceptionMessage = baseBussiness.ReadServerErrorMessages(ret, baseBussiness.DatabaseExceptionFileName);
                        if (!string.IsNullOrEmpty(dataBaseExceptionMessage))
                            ErrorMessage.Add(dataBaseExceptionMessage);
                    }
                }
                return ErrorMessage;
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }

        public List<string> deleteAwbULDDamage(string recordID)
        {
            try
            {
                int ret = 0;
                List<string> ErrorMessage = new List<string>();
                BaseBusiness baseBussiness = new BaseBusiness();
                SqlParameter[] Parameters = { new SqlParameter("@SNo", recordID) };
                ret = (int)SqlHelper.ExecuteScalar(DMLConnectionString.WebConfigConnectionString, "FA_DeleteAwbULDDamage", Parameters);
                if (ret > 0)
                {
                    if (ret > 1000)
                    {
                        string serverErrorMessage = baseBussiness.ReadServerErrorMessages(ret, "FA_AwbULDDamage");
                        if (!string.IsNullOrEmpty(serverErrorMessage))
                            ErrorMessage.Add(serverErrorMessage);
                    }
                    else
                    {
                        //For DataBase Exceptions like 'Foreign Key refrence Errors' etc
                        string dataBaseExceptionMessage = baseBussiness.ReadServerErrorMessages(ret, baseBussiness.DatabaseExceptionFileName);
                        if (!string.IsNullOrEmpty(dataBaseExceptionMessage))
                            ErrorMessage.Add(dataBaseExceptionMessage);
                    }
                }
                return ErrorMessage;
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }

        public string GetCCADetails(string AwbNo, int DailyFlightSNo)
        {
            try
            {
                SqlParameter[] Parameters = { new SqlParameter("@AwbNo", AwbNo), new SqlParameter("@DailyFlightSNo", DailyFlightSNo) };
                DataSet ds = SqlHelper.ExecuteDataset(DMLConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, "GetCCADetails", Parameters);
                ds.Dispose();
                return CargoFlash.Cargo.Business.Common.CompleteDStoJSON(ds);
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }

        public string GetHousePieces(string AWBNo, string Hawbno, int ArrivedShipmentSno)
        {
            try
            {
                SqlParameter[] Parameters = { new SqlParameter("@AWBNo", AWBNo), new SqlParameter("@Hawbno", Hawbno), new SqlParameter("@ArrivedShipmentSno", ArrivedShipmentSno) };
                DataSet ds = SqlHelper.ExecuteDataset(DMLConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, "FA_GetHousePieces", Parameters);
                ds.Dispose();
                return CargoFlash.Cargo.Business.Common.CompleteDStoJSON(ds);
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }

        public string SaveULDDetails(List<ULDDetails> UldData, List<ImportPOMDNDetail> POMailDetailsArray, int ArrivedShipmentSNo, int POMailSNo, int POMArrivedShipmentSNo)
        {
            try
            {
                DataTable dtULDDetails = CollectionHelper.ConvertTo(UldData, "");
                DataTable dtDNDetails = CollectionHelper.ConvertTo(POMailDetailsArray, "");
                BaseBusiness baseBusiness = new BaseBusiness();
                SqlParameter paramULDDetails = new SqlParameter();
                paramULDDetails.ParameterName = "@ULDDataType";
                paramULDDetails.SqlDbType = System.Data.SqlDbType.Structured;
                paramULDDetails.Value = dtULDDetails;

                //Added by Akaram Ali
                SqlParameter paramDNDetail = new SqlParameter();
                paramDNDetail.ParameterName = "@ImportPOMDNDetail";
                paramDNDetail.SqlDbType = System.Data.SqlDbType.Structured;
                paramDNDetail.Value = dtDNDetails;
                // End

                DataSet ds = new DataSet();
                SqlParameter[] Parameters = { paramULDDetails, paramDNDetail, new SqlParameter("@CreatedBy", Convert.ToInt32(((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).UserSNo.ToString())), new SqlParameter("@ArrivedShipmentSNo", ArrivedShipmentSNo), new SqlParameter("@POMailId", POMailSNo), new SqlParameter("@POMArrivedShipmentSNo", POMArrivedShipmentSNo), new SqlParameter("@OfficeSNo", ((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).OfficeSNo.ToString()), new SqlParameter("@IsAutoCall", false) };
                ds = SqlHelper.ExecuteDataset(DMLConnectionString.WebConfigConnectionString, "FA_SaveArrivedShipmentDetails", Parameters);
                return ds.Tables[ds.Tables.Count - 1].Rows[0][0].ToString() + "," + ds.Tables[ds.Tables.Count - 1].Rows[0][1].ToString() + "," + ds.Tables[ds.Tables.Count - 1].Rows[0][2].ToString();
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }

        public string SaveBUPULDDetails(List<BUPULDDetails> UldData, bool IsRushHandling)
        {
            try
            {
                DataTable dtULDDetails = CollectionHelper.ConvertTo(UldData, "");
                BaseBusiness baseBusiness = new BaseBusiness();
                SqlParameter paramULDDetails = new SqlParameter();
                paramULDDetails.ParameterName = "@ULDDataType";
                paramULDDetails.SqlDbType = System.Data.SqlDbType.Structured;
                paramULDDetails.Value = dtULDDetails;
                DataSet ds = new DataSet();
                SqlParameter[] Parameters = { paramULDDetails, new SqlParameter("@CreatedBy", Convert.ToInt32(((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).UserSNo.ToString())), new SqlParameter("@IsRushHandling", IsRushHandling) };

                ds = SqlHelper.ExecuteDataset(DMLConnectionString.WebConfigConnectionString, "FA_SaveBUPArrivedShipmentDetails", Parameters);
                return ds.Tables[ds.Tables.Count - 1].Rows[0][0].ToString() + "," + ds.Tables[ds.Tables.Count - 1].Rows[0][1].ToString() + "," + ds.Tables[ds.Tables.Count - 1].Rows[0][2].ToString();
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }

        public string SaveFlightCheckInDetails(List<FlightCheckInDetails> FlightCheckInDetails, int DailyFlightSNo, string CustomRefNo, string loginAirportSno)
        {
            try
            {
                DataTable dtFlightCheckInDetails = CollectionHelper.ConvertTo(FlightCheckInDetails, "");
                BaseBusiness baseBusiness = new BaseBusiness();
                SqlParameter paramFlightCheckInDetails = new SqlParameter();
                paramFlightCheckInDetails.ParameterName = "@FlightCheckInType";
                paramFlightCheckInDetails.SqlDbType = System.Data.SqlDbType.Structured;
                paramFlightCheckInDetails.Value = dtFlightCheckInDetails;
                DataSet ds = new DataSet();
                SqlParameter[] Parameters = {
                    paramFlightCheckInDetails,
                    new SqlParameter("@DailyFlightSNo", DailyFlightSNo),
                    new SqlParameter("@UpdatedBy",Convert.ToInt32(((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).UserSNo.ToString())),
                    new SqlParameter("@CustomRefNo", CustomRefNo),
                    new SqlParameter("@LoginAirportSNo",loginAirportSno)
                                            };
                ds = SqlHelper.ExecuteDataset(DMLConnectionString.WebConfigConnectionString, "SaveFlightCheckInDetails", Parameters);
                return ds.Tables[ds.Tables.Count - 1].Rows[0][0].ToString();
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }

        public string SaveFlighClosed(int DailyFlightSNo)
        {
            try
            {
                BaseBusiness baseBusiness = new BaseBusiness();
                DataSet ds = new DataSet();
                SqlParameter[] Parameters = { new SqlParameter("@DailyFlightSNo", DailyFlightSNo), new SqlParameter("@CreatedBy", Convert.ToInt32(((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).UserSNo.ToString())) };

                ds = SqlHelper.ExecuteDataset(DMLConnectionString.WebConfigConnectionString, "SP_SaveClosedShipmentDetails", Parameters);
                return ds.Tables[ds.Tables.Count - 1].Rows[0][0].ToString();
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }

        public string SaveFlightDetails(string AirlineCarrierCode, string FlightNo, string FlightDate, string FlightOriginSNo, string FlightDestinationSNo, string ETATime)
        {
            try
            {
                DataSet ds = new DataSet();
                SqlParameter[] Parameters = { new SqlParameter("@AirlineCarrierCode", AirlineCarrierCode), new SqlParameter("@FlightNo", FlightNo.ToUpper()), new SqlParameter("@FlightDate", FlightDate), new SqlParameter("@FlightOriginSNo", Convert.ToInt32(FlightOriginSNo)), new SqlParameter("@FlightDestinationSNo", Convert.ToInt32(FlightDestinationSNo)), new SqlParameter("@ETATime", ETATime), new SqlParameter("@UpdatedBy", Convert.ToInt32(((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).UserSNo.ToString())) };

                ds = SqlHelper.ExecuteDataset(DMLConnectionString.WebConfigConnectionString, "FA_AddFlightDetails", Parameters);
                return ds.Tables[ds.Tables.Count - 1].Rows[0][0].ToString();
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }

        public string UpdateBreakDownTime(string BreakdownStartTime, string BreakdownEndTime, Int64 FFMFlightMasterSNo, string ULDNo, int POMailSNo, int DailyFlightSNo)
        {
            try
            {
                BaseBusiness baseBusiness = new BaseBusiness();
                DataSet ds = new DataSet();
                SqlParameter[] Parameters = { new SqlParameter("@BreakdownStartTime", BreakdownStartTime), new SqlParameter("@BreakdownEndTime", BreakdownEndTime),
                                           new SqlParameter("@FFMFlightMasterSNo", FFMFlightMasterSNo),new SqlParameter("@ULDNo", ULDNo),new SqlParameter("@POMailSNo", POMailSNo),new SqlParameter("@DailyFlightSNo", DailyFlightSNo) };
                ds = SqlHelper.ExecuteDataset(DMLConnectionString.WebConfigConnectionString, "FA_UpdateBreakDownTime", Parameters);
                return ds.Tables[ds.Tables.Count - 1].Rows[0][0].ToString() + "," + ds.Tables[ds.Tables.Count - 1].Rows[0][1].ToString();
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }

        public string AddShipmentCheckAWBNoTotal(string FFMFlightMasterSNo, string AWBNo, string DescriptionType)
        {
            DataSet ds = new DataSet();
            try
            {
                SqlParameter[] Parameters = { new SqlParameter("@FFMFlightMasterSNo", FFMFlightMasterSNo), new SqlParameter("@AWBNo", AWBNo), new SqlParameter("@DescriptionType", DescriptionType) };
                ds = SqlHelper.ExecuteDataset(DMLConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, "FA_AddShipmentCheckAWBNoTotal", Parameters);
                ds.Dispose();
            }
            catch (Exception ex)
            {
                throw ex;
            }
            return CargoFlash.Cargo.Business.Common.CompleteDStoJSON(ds);
        }

        //added by Arun
        public string CheckAirlineExistsByPrefix(string Prefix, int DailyFlighSNo)
        {
            DataSet ds = new DataSet();
            try
            {
                SqlParameter[] Parameters = { new SqlParameter("@Prefix", Prefix), new SqlParameter("@DailyFlightSNo", DailyFlighSNo) };
                ds = SqlHelper.ExecuteDataset(DMLConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, "CheckAirlineExistsByPrefix", Parameters);
                ds.Dispose();
            }
            catch (Exception ex)
            {
                throw ex;
            }
            return CargoFlash.Cargo.Business.Common.CompleteDStoJSON(ds);
        }

        public string CheckAwbExistinExport(string CheckCurrentAWBNo, int Pieces, int DailyFlightSNo, string ULDType)
        {
            DataSet ds = new DataSet();
            try
            {
                SqlParameter[] Parameters = { new SqlParameter("@CheckCurrentAWBNo", CheckCurrentAWBNo), new SqlParameter("@Pieces", Pieces), new SqlParameter("@DailyFlightSNo", DailyFlightSNo), new SqlParameter("@ULDType", ULDType), new SqlParameter("@LoginAirportSNo", ((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).AirportSNo.ToString()) };
                ds = SqlHelper.ExecuteDataset(DMLConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, "FA_GetAwbNotExistorNot", Parameters);
                ds.Dispose();
            }
            catch (Exception ex)
            {
                throw ex;
            }
            return CargoFlash.Cargo.Business.Common.CompleteDStoJSON(ds);
        }

        public string CheckHAwb(int AWBSNo)
        {
            DataSet ds = new DataSet();
            try
            {
                SqlParameter[] Parameters = { new SqlParameter("@AwbSno", AWBSNo) };
                ds = SqlHelper.ExecuteDataset(DMLConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, "FA_CheckHAwb", Parameters);
                ds.Dispose();
            }
            catch (Exception) { }
            return CargoFlash.Cargo.Business.Common.CompleteDStoJSON(ds);
        }
        //End

        public string ChkAwbDetailsExistence(string CurrentAWBNo, string ffmflightMasterSno, string PartSplitTotal, string ULDNo, string DailyFlightSNo, string FoundAWB)
        {
            DataSet ds = new DataSet();
            try
            {
                SqlParameter[] Parameters = { new SqlParameter("@AWBNo", CurrentAWBNo), new SqlParameter("@FFMFlightMasterSNo", ffmflightMasterSno), new SqlParameter("@PartSplitType", PartSplitTotal), new SqlParameter("@ULDNO", ULDNo), new SqlParameter("@DailyFlightSNo", DailyFlightSNo), new SqlParameter("@FoundAWB", FoundAWB) };
                ds = SqlHelper.ExecuteDataset(DMLConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, "FA_ChkAwbDetailsExistence", Parameters);
                ds.Dispose();
            }
            catch (Exception ex)
            {
                throw ex;
            }
            return ds.Tables[0].Rows[0][0].ToString();
        }

        public string CheckHAWBNo(string AWBSNo, string FFMFlightMasterSNo, string HAWBNo)
        {
            DataSet ds = new DataSet();
            try
            {
                SqlParameter[] Parameters = { new SqlParameter("@AWBSNo", AWBSNo), new SqlParameter("@FFMFlightMasterSNo", FFMFlightMasterSNo), new SqlParameter("@HAWBNo", HAWBNo) };
                ds = SqlHelper.ExecuteDataset(DMLConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, "FA_CheckHAWBNo", Parameters);
                ds.Dispose();
            }
            catch (Exception ex)
            {
                throw ex;
            }
            return CargoFlash.Cargo.Business.Common.CompleteDStoJSON(ds);
        }

        public string SaveHAWBNo(string AWBSNo, string FFMFlightMasterSNo, string HAWBNo)
        {
            DataSet ds = new DataSet();
            try
            {
                SqlParameter[] Parameters = { new SqlParameter("@AWBSNo", AWBSNo), new SqlParameter("@FFMFlightMasterSNo", FFMFlightMasterSNo), new SqlParameter("@HAWBNo", HAWBNo), new SqlParameter("@UpdatedBy", Convert.ToInt32(((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).UserSNo.ToString())), new SqlParameter("@CurrentCityCode", ((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).CityCode.ToString()) };
                ds = SqlHelper.ExecuteDataset(DMLConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, "FA_SaveHAWBNo", Parameters);
                ds.Dispose();
            }
            catch (Exception ex)
            {
                throw ex;
            }
            return CargoFlash.Cargo.Business.Common.CompleteDStoJSON(ds);
        }

        public string GetAircraftType(string AircraftTypeSNo)
        {
            DataSet ds = new DataSet();
            try
            {
                SqlParameter[] Parameters = { new SqlParameter("@AircraftTypeSNo", AircraftTypeSNo) };
                ds = SqlHelper.ExecuteDataset(DMLConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, "FA_GetAircraftType", Parameters);
                ds.Dispose();
            }
            catch (Exception ex)
            {
                throw ex;
            }
            return CargoFlash.Cargo.Business.Common.CompleteDStoJSON(ds);
        }

        public string GetCurrentATATime()
        {
            DataSet ds = new DataSet();
            try
            {
                SqlParameter[] Parameters = { new SqlParameter("@AirportCode", ((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).AirportCode.ToString()) };
                ds = SqlHelper.ExecuteDataset(DMLConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, "fa_GetCurrentATATime", Parameters);
                ds.Dispose();
            }
            catch (Exception ex)
            {
                throw ex;
            }
            return CargoFlash.Cargo.Business.Common.CompleteDStoJSON(ds);
        }

        public string GetAirportCurrentUTCTime(string Format, string AirportSNo)
        {
            try
            {
                SqlParameter[] param = {
                                        new SqlParameter("@Format",Format),
                                        new SqlParameter("@AirportSNo", AirportSNo)
                                       };

                DataSet ds = SqlHelper.ExecuteDataset(DMLConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, "GetAirportCurrentUTCTime", param);

                string LocatDate = "";
                if (ds != null && ds.Tables.Count > 0)
                {
                    LocatDate = Convert.ToString(ds.Tables[0].Rows[0][0]);
                }
                return LocatDate;
            }
            catch (Exception ex)//(Exception ex)
            {
                throw ex;
            }
        }

        public string OffloadedStopOverULDAndShipment(string DailyFlightSNo, string FFMFlightMasterSNo, string FFMShipmentTransSNo, string ULDStockSNo, int Pieces, decimal Grosswt, decimal Volwt, decimal CBM, int MoveToSegregation)
        {
            DataSet ds = new DataSet();
            try
            {
                SqlParameter[] Parameters = { new SqlParameter("@DailyFlightSNo", DailyFlightSNo), new SqlParameter("@FFMFlightMasterSNo", FFMFlightMasterSNo), new SqlParameter("@FFMShipmentTransSNo", FFMShipmentTransSNo), new SqlParameter("@CreatedBy", Convert.ToInt32(((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).UserSNo.ToString())), new SqlParameter("@ULDStockSNo", ULDStockSNo), new SqlParameter("@RecPcs", Pieces), new SqlParameter("@Grosswt", Grosswt), new SqlParameter("@Volwt", Volwt), new SqlParameter("@CBM", CBM), new SqlParameter("@MoveToSegregation", MoveToSegregation), new SqlParameter("@LoginAirportSNo", ((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).AirportSNo.ToString()) };
                ds = SqlHelper.ExecuteDataset(DMLConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, "FA_UpdateOffloadedStopOverULDAndShipment", Parameters);
                ds.Dispose();
            }
            catch (Exception ex)
            {
                throw ex;
            }
            return CargoFlash.Cargo.Business.Common.CompleteDStoJSON(ds);
        }

        public string UpdateThroughtULDStatus(string FFMShipmentTransSNo, string ThroughtULD, string ULDNo)
        {
            DataSet ds = new DataSet();
            try
            {
                SqlParameter[] Parameters = { new SqlParameter("@FFMShipmentTransSNo", FFMShipmentTransSNo), new SqlParameter("@ThroughtULD", ThroughtULD), new SqlParameter("@ULDNo", ULDNo) };
                ds = SqlHelper.ExecuteDataset(DMLConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, "FA_UpdateThroughtULDStatus", Parameters);
                ds.Dispose();
            }
            catch (Exception ex)
            {
                throw ex;
            }
            return CargoFlash.Cargo.Business.Common.CompleteDStoJSON(ds);
        }

        public string SaveExcludeRemarks(string FFMFlightMasterSNo, string FFMShipmentTransSNo, string ArrivedShipmentSNo, string awbSNo, string remark)
        {
            DataSet ds = new DataSet();
            try
            {
                SqlParameter[] Parameters = { new SqlParameter("@FFMFlightMasterSNo", FFMFlightMasterSNo), new SqlParameter("@FFMShipmentTransSNo", FFMShipmentTransSNo), new SqlParameter("@ArrivedShipmentSNo", ArrivedShipmentSNo), new SqlParameter("@awbSNo", awbSNo), new SqlParameter("@remark", remark), new SqlParameter("@CreatedBy", Convert.ToInt32(((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).UserSNo.ToString())) };
                ds = SqlHelper.ExecuteDataset(DMLConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, "FA_SaveExcludeRemark", Parameters);
                ds.Dispose();
            }
            catch (Exception ex)
            {
                throw ex;
            }
            return CargoFlash.Cargo.Business.Common.CompleteDStoJSON(ds);
        }

        //-----------------------------------------  SaveAndDownloadCustomFile -----Createdd By Akash
        public string SaveAndDownloadCustomFile(string FlightNo, string FlightDate, string FlightOriginSNo, string FlightDestinationSNo, string NoOfTransaction, string IsFlightStatus, string CreatedBy)
        {

            DataSet ds = new DataSet();
            SqlParameter[] Parameters = { new SqlParameter("@FlightNo", FlightNo),
                                          new SqlParameter("@FlightDate", FlightDate),
                                          new SqlParameter("@FlightOriginSNo", FlightOriginSNo),
                                          new SqlParameter("@FlightDestinationSNo", FlightDestinationSNo),
                                          new SqlParameter("@NoOfTransaction", NoOfTransaction),
                                          new SqlParameter("@IsFlightStatus", IsFlightStatus),
                                         new SqlParameter("@CreatedBy", CreatedBy)
                                        };
            try
            {
                ds = SqlHelper.ExecuteDataset(DMLConnectionString.WebConfigConnectionString, "spSave_COGACustomFlightDetails_ForImport", Parameters);
            }
            catch (Exception ex)
            {
                throw ex;
            }
            return CargoFlash.Cargo.Business.Common.CompleteDStoJSON(ds);
        }

        // ---------Created By Akash
        public string GetCOGACustomButton(string DailyFlightSNo, string FlightDestinationCode)
        {
            try
            {
                DataSet ds = new DataSet();
                SqlParameter[] Parameters = { new SqlParameter("@DailyFlightSNo", DailyFlightSNo),
                                            new SqlParameter("@FlightDestination", FlightDestinationCode)
                                        };

                ds = SqlHelper.ExecuteDataset(DMLConnectionString.WebConfigConnectionString, "spGetCustonButton_IsDeparted", Parameters);
                return CargoFlash.Cargo.Business.Common.CompleteDStoJSON(ds);
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }

        //Created By Akaram
        public string POMailDNInfo(int MCBookingSNo, string ULDNo)
        {
            try
            {
                SqlParameter[] Parameters = { new SqlParameter("@MCBookingSNo", MCBookingSNo), new SqlParameter("@LoginAirportSNo", ((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).AirportSNo.ToString()), new SqlParameter("@UpdatedBy", ((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).UserSNo.ToString()), new SqlParameter("@ULDNo", ULDNo) };
                DataSet ds = new DataSet();

                ds = SqlHelper.ExecuteDataset(DMLConnectionString.WebConfigConnectionString, "pom_GetIF_DNDetails", Parameters);
                return CargoFlash.Cargo.Business.Common.CompleteDStoJSON(ds);
            }
            catch (Exception ex)
            {
                throw ex;
            }

        }
        //End by Akaram

        //Added by Akaram Ali on 9 Dec 2017
        public string GetPOMailULDReport(string FFMFlightMasterSNo)
        {
            try
            {
                SqlParameter[] Parameters = { new SqlParameter("@FFMFlightMasterSNo", FFMFlightMasterSNo), new SqlParameter("@UpdatedBy", ((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).UserSNo.ToString()) };
                DataSet ds = SqlHelper.ExecuteDataset(DMLConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, "FA_GetPOMailULDReport", Parameters);
                ds.Dispose();
                return CargoFlash.Cargo.Business.Common.CompleteDStoJSON(ds);
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }
        //End by Akaram Ali on 9 Dec 2017

        public string GetRecordAtFlightEPouch(string GroupFlightSNo)
        {
            try
            {
                SqlParameter[] Parameters = { new SqlParameter("@GroupFlightSNo", GroupFlightSNo) };
                DataSet ds = SqlHelper.ExecuteDataset(DMLConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, "GetRecordAtFlightEPouch", Parameters);
                ds.Dispose();
                return CargoFlash.Cargo.Business.Common.CompleteDStoJSON(ds);
            }
            catch (Exception ex)//
            {
                throw ex;
            }
        }

        public string GetAWBInformation(string FFMFlightMasterSNo)
        {
            try
            {
                SqlParameter[] Parameters = {
                                                new SqlParameter("@FFMFlightMasterSNo",int.Parse(FFMFlightMasterSNo)),
                                                new SqlParameter("@LoginAirportSNo",((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).AirportSNo.ToString())
                                            };
                DataSet ds = SqlHelper.ExecuteDataset(ReadConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, "spGetAWBInformation", Parameters);
                return CargoFlash.Cargo.Business.Common.CompleteDStoJSON(ds);
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }

        public string SaveAllShipmentDetails(string FFMFlightMasterSNo)
        {
            DataSet ds = new DataSet();
            try
            {
                SqlParameter[] Parameters = {
                    new SqlParameter("@FFMFlightMasterSNo", FFMFlightMasterSNo),
                    new SqlParameter("@UpdatedBy", Convert.ToInt32(((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).UserSNo.ToString())),
                    new SqlParameter("@LoginAirportSNo", ((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).AirportSNo.ToString()) };
                ds = SqlHelper.ExecuteDataset(DMLConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, "sp_ArriveAllShipemnt", Parameters);
                return ds.Tables[ds.Tables.Count - 1].Rows[0][0].ToString() + "," + ds.Tables[ds.Tables.Count - 1].Rows[0][1].ToString() + "," + ds.Tables[ds.Tables.Count - 1].Rows[0][2].ToString();
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }

        public string GetPrintFFMDetails(string DailyFlightSNo)
        {
            try
            {
                SqlParameter[] Parameters = {
                                                new SqlParameter("@DailyFlightSNo",DailyFlightSNo)
                                            };
                DataSet ds = SqlHelper.ExecuteDataset(ReadConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, "GetPrintFFMDetails", Parameters);
                return CargoFlash.Cargo.Business.Common.CompleteDStoJSON(ds);
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }

        public string IsFFMOrNot(string flightNo, string flightDate)
        {
            try
            {
                SqlParameter[] Parameters = {
                                                new SqlParameter("@FlightNo",flightNo),
                                                new SqlParameter("@FlightDate",flightDate)
                                            };
                DataSet ds = SqlHelper.ExecuteDataset(ReadConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, "SP_IsFFMOrNot", Parameters);
                return CargoFlash.Cargo.Business.Common.CompleteDStoJSON(ds);
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }
        public string IsAllShipmentArrived(string FFMFlightMasterSNo)
        {
            try
            {
                SqlParameter[] Parameters = {
                                                new SqlParameter("@FFMFlightMasterSNo",FFMFlightMasterSNo)
                                            };
                DataSet ds = SqlHelper.ExecuteDataset(ReadConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, "SP_IsAllShipmentArrived", Parameters);
                return CargoFlash.Cargo.Business.Common.CompleteDStoJSON(ds);
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }
    }
}
