using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.ServiceModel;
using System.ServiceModel.Activation;
using System.Configuration;
using System.Data;
using System.Data.SqlClient;
using CargoFlash.Cargo.Model.Report;
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

namespace CargoFlash.Cargo.DataService.Report
{
    [GlobalErrorHandlerBehaviour(typeof(GlobalErrorHandler))]   [ServiceBehavior(IncludeExceptionDetailInFaults = true)]
    [AspNetCompatibilityRequirements(RequirementsMode = AspNetCompatibilityRequirementsMode.Allowed)]
    public class ULDMonitoringService : BaseWebUISecureObject, IULDMonitoringService
    {
        public Stream GetWebForm(string processName, string moduleName, string appName, string formAction, string IsSubModule)
        {
            return BuildWebForm(processName, moduleName, appName, formAction, "", (IsSubModule == "1"));
        }



        public Stream GetULDArrivalShipmentGrid(string processName, string moduleName, string appName, string ULDNo)
        {
            return BuildWebForm(processName, moduleName, appName, "IndexView", ULDNo);
        }

        private Stream BuildWebForm(string processName, string moduleName, string appName, string formAction, string recordID = "", bool IsSubModule = true,
            string ULDNo = "")
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
                        case "ULDMonitoringArrival":
                            {
                                switch (appName)
                                {
                                    case "ULDMontoringShipment":
                                        CreateNestedULDGrid(myCurrentForm, ULDNo);
                                        break;
                                }
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
            byte[] resultMyForm = Encoding.UTF8.GetBytes(myCurrentForm.ToString());
            WebOperationContext.Current.OutgoingResponse.ContentType = "text/html";
            return new MemoryStream(resultMyForm);
        }

        private void CreateNestedULDGrid(StringBuilder Container, string ULDNo)
        {
            using (NestedGrid g = new NestedGrid())
            {
                g.Height = 100;
                g.PrimaryID = this.MyPrimaryID;
                g.ModuleName = this.MyModuleID;
                g.AppsName = this.MyAppID;
                g.DefaultPageSize = 1000;
                g.DataSoruceUrl = "Services/Report/ULDMonitoringService.svc/GetULDMonitoringULDGridData";
                g.PrimaryID = "TransGridSNo";
                g.NewURL = MyPageName + "?" + GetWebURLString("New", false);
                g.ModuleName = this.MyModuleID;
                g.FormCaptionText = "ULD Details";
                g.IsFormHeader = false;
                g.IsModule = true;
                g.IsAllowedSorting = false;
                g.IsAllowedScrolling = true;
                g.IsShowEdit = false;
                g.IsSaveChanges = false;
                g.IsColumnMenu = false;
                g.IsAllowedFiltering = false;
                g.Column = new List<GridColumn>();
                //g.Column.Add(new GridColumn { Field = "DailyFlightSNo", Title = "DailyFlightSNo", IsHidden = true, DataType = GridDataType.String.ToString() });
                //g.Column.Add(new GridColumn { Field = "FFMFlightMasterSNo", Title = "FFMFlightMasterSNo", IsHidden = true, DataType = GridDataType.String.ToString() });
                //g.Column.Add(new GridColumn { Field = "ArrivedShipmentSNo", Title = "ArrivedShipmentSNo", IsHidden = true, DataType = GridDataType.String.ToString() });
                //g.Column.Add(new GridColumn { Field = "FFMShipmentTransSNo", Title = "FFMShipmentTransSNo", IsHidden = true, DataType = GridDataType.String.ToString(), Width = 50 });
                //g.Column.Add(new GridColumn { Field = "TransGridSNo", Title = "TransGridSNo", IsHidden = true, DataType = GridDataType.String.ToString(), Width = 50 });
                //g.Column.Add(new GridColumn { Field = "IsULD", Title = "IsULD", IsHidden = true, DataType = GridDataType.String.ToString() });
                g.Column.Add(new GridColumn { Field = "ULDName", Title = "ULD Name", IsHidden = false, DataType = GridDataType.String.ToString(), Width = 42 });

                g.Column.Add(new GridColumn { Field = "FlightNo", Title = "Flight No.", DataType = GridDataType.String.ToString(), Width = 37 });
                g.Column.Add(new GridColumn { Field = "AwbCount", Title = "Awb Count", DataType = GridDataType.String.ToString(), Width = 40 });



                //g.Column.Add(new GridColumn { Field = "SNo", Title = "Location", DataType = GridDataType.String.ToString(), Width = 34, Template = "#if(IsULD==0){#<input type=\"button\"  style=\"display: none\" />#}else if(IsULDLocation==0){#<input type=\"button\" class=\"incompleteprocess\" style=\"cursor:pointer\" value=\"L\" onclick=\"GetFAULDLocation(#=FFMShipmentTransSNo#)\" />#}else{#<input type=\"button\" class=\"completeprocess\" style=\"cursor:pointer\" value=\"L\" onclick=\"GetFAULDLocation(#=FFMShipmentTransSNo#)\" />#}#" });

                //g.Column.Add(new GridColumn { Field = "SNo", Title = "X-ray", DataType = GridDataType.String.ToString(), Width = 26, Template = "#if(IsULD==0){#<input type=\"button\" style=\"display: none\"  />#}else if(IsULDDamage==0){#<input type=\"button\" class=\"incompleteprocess\" style=\"cursor:pointer\" value=\"X\" onclick=\"GetULDXray(#=FFMShipmentTransSNo#)\" />#}else{#<input type=\"button\" class=\"completeprocess\" style=\"cursor:pointer\" value=\"X\" onclick=\"GetULDXray(#=FFMShipmentTransSNo#)\" />#}#" });

                //g.Column.Add(new GridColumn { Field = "SNo", Title = "Re-build", DataType = GridDataType.String.ToString(), Width = 34, Template = "#if(IsULD==0){#<input type=\"button\" style=\"display: none\"  />#}else if(IsULDDamage==0){#<input type=\"button\" class=\"incompleteprocess\" style=\"cursor:pointer\" value=\"R\" onclick=\"GetReBuild(#=FFMShipmentTransSNo#)\" />#}else{#<input type=\"button\" class=\"completeprocess\" style=\"cursor:pointer\" value=\"R\" onclick=\"GetReBuild(#=FFMShipmentTransSNo#)\" />#}#" });

                //g.Column.Add(new GridColumn { Field = "IsULDLocation", Title = "IsULDLocation", IsHidden = true, DataType = GridDataType.String.ToString(), Width = 50 });
                //g.Column.Add(new GridColumn { Field = "IsULDDamage", Title = "IsULDDamage", IsHidden = true, DataType = GridDataType.String.ToString(), Width = 50 });
                //g.Column.Add(new GridColumn { Field = "IsULDConsumable", Title = "IsULDConsumable", IsHidden = true, DataType = GridDataType.String.ToString(), Width = 50 });

                g.ExtraParam = new List<GridExtraParams>();
                g.ExtraParam.Add(new GridExtraParams { Field = "ULDNo", Value = ULDNo });
                //g.ExtraParam.Add(new GridExtraParams { Field = "SearchBoardingPoint", Value = SearchBoardingPoint });
                //g.ExtraParam.Add(new GridExtraParams { Field = "SearchFlightNo", Value = SearchFlightNo });
                //g.ExtraParam.Add(new GridExtraParams { Field = "searchFromDate", Value = searchFromDate });
                //g.ExtraParam.Add(new GridExtraParams { Field = "searchToDate", Value = searchToDate });

                //  #region Nested Grid Section
                g.NestedPrimaryID = "AWBSNo";
                g.NestedModuleName = this.MyModuleID;
                g.NestedAppsName = this.MyAppID;
                g.NestedParentID = "TransGridSNo";
                g.NestedIsShowEdit = false;
                g.NestedDefaultPageSize = 1000;
                g.NestedIsPageable = false;
                g.IsNestedAllowedSorting = false;

                g.NestedDataSoruceUrl = "Services/Import/TransitMonitoringService.svc/GetTransitMonitoringShipmentGridData";
                g.NestedColumn = new List<GridColumn>();
                //g.NestedColumn.Add(new GridColumn { Field = "DailyFlightSNo", Title = "DailyFlightSNo", DataType = GridDataType.String.ToString(), IsHidden = true, Width = 90 });
                //g.Column.Add(new GridColumn { Field = "IsULD", Title = "IsULD", IsHidden = true, DataType = GridDataType.String.ToString() });
                //g.NestedColumn.Add(new GridColumn { Field = "FFMFlightMasterSNo", Title = "FFMFlightMasterSNo", DataType = GridDataType.String.ToString(), IsHidden = true });
                //g.NestedColumn.Add(new GridColumn { Field = "ULDNo", Title = "ULDNo", DataType = GridDataType.String.ToString(), IsHidden = true });
                //g.NestedColumn.Add(new GridColumn { Field = "FFMShipmentTransSNo", Title = "FFMShipmentTransSNo", DataType = GridDataType.String.ToString(), IsHidden = true });
                //g.NestedColumn.Add(new GridColumn { Field = "ArrivedShipmentSNo", Title = "ArrivedShipmentSNo", DataType = GridDataType.String.ToString(), IsHidden = true, Width = 90 });
                //g.NestedColumn.Add(new GridColumn { Field = "TransGridSNo", Title = "TransGridSNo", DataType = GridDataType.String.ToString(), IsHidden = true, Width = 90 });
                // g.NestedColumn.Add(new GridColumn { Field = "AWBSNo", Title = "AWBSNo", DataType = GridDataType.String.ToString(), IsHidden = true, Width = 90 });
                //  g.NestedColumn.Add(new GridColumn { Field = "TotalFFMPieces", Title = "TotalFFMPieces", DataType = GridDataType.String.ToString(), IsHidden = true });

                g.NestedColumn.Add(new GridColumn { Field = "ULDName", IsLocked = false, Title = "AWB No.", DataType = GridDataType.String.ToString(), Width = 25 });

                //g.NestedColumn.Add(new GridColumn { Field = "VolumeWeight", Title = "Volume Weight", DataType = GridDataType.Number.ToString(), Width = 25 });
                //g.NestedColumn.Add(new GridColumn { Field = "Build", Title = "Build", DataType = GridDataType.Number.ToString(), Width = 16 });
                //g.NestedColumn.Add(new GridColumn { Field = "ShipmentOriginAirportCode", IsLocked = false, Title = "AWB Origin", DataType = GridDataType.String.ToString(), Width = 18 });
                //g.NestedColumn.Add(new GridColumn { Field = "ShipmentDestinationAirportCode", IsLocked = false, Title = "AWB Dest", DataType = GridDataType.String.ToString(), Width = 18 });
                //g.NestedColumn.Add(new GridColumn { Field = "SNo", Title = "Location", DataType = GridDataType.String.ToString(), Width = 18, Template = "#if(IsULD==1){#<input type=\"button\"  style=\"display: none\"  />#}else if(IsBUP==1){#<input type=\"button\" style=\"display:none;\" />#}else if(LocationStatus==0){#<input type=\"button\" class=\"incompleteprocess\" style=\"cursor:pointer\" value=\"L\" onclick=\"GetAWBULDLocation(#=AWBSNo#,this)\" />#}else if(LocationStatus==1){#<input type=\"button\" class=\"partialprocess\" style=\"cursor:pointer\" value=\"L\" onclick=\"GetAWBULDLocation(#=AWBSNo#,this)\" />#}else if(LocationStatus==2){#<input type=\"button\" class=\"completeprocess\" style=\"cursor:pointer\" value=\"L\" onclick=\"GetAWBULDLocation(#=AWBSNo#,this)\" />#}else{#<input type=\"button\" class=\"incompleteprocess\" style=\"cursor:pointer\" value=\"L\" onclick=\"GetAWBULDLocation(#=AWBSNo#,this)\" />#}#" });

                //g.NestedColumn.Add(new GridColumn { Field = "SNo", Title = "X-ray", DataType = GridDataType.String.ToString(), Width = 15, Template = "#if(IsULD==1){#<input type=\"button\"  style=\"display: none\" />#}else if(IsBUP==1){#<input type=\"button\" style=\"display:none;\" />#}else{#<input type=\"button\" class=\"incompleteprocess\" style=\"cursor:pointer\" value=\"X\" onclick=\"GetAWBXray(#=AWBSNo#,this)\" />#}#" });
                //g.NestedColumn.Add(new GridColumn { Field = "SNo", Title = "Terminate", DataType = GridDataType.String.ToString(), Width = 18, Template = "#if(IsULD==1){#<input type=\"button\"  style=\"display: none\" />#}else if(IsBUP==1){#<input type=\"button\" style=\"display:none;\" />#}else{#<input type=\"button\" class=\"incompleteprocess\" style=\"cursor:pointer\" value=\"T\" onclick=\"GetTerminate(#=AWBSNo#,this)\" />#}#" });
                //g.NestedColumn.Add(new GridColumn { Field = "SNo", Title = "Planning", DataType = GridDataType.String.ToString(), Width = 18, Template = "#if(IsULD==1){#<input type=\"button\"  style=\"display: none\"  />#}else if(IsBUP==1){#<input type=\"button\" style=\"display:none;\" />#}else{#<input type=\"button\" class=\"incompleteprocess\" style=\"cursor:pointer\" value=\"P\" onclick=\"GetAWBDamage(#=AWBSNo#,this)\" />#}#" });

                //g.NestedColumn.Add(new GridColumn { Field = "IsBUP", Title = "IsBUP", DataType = GridDataType.String.ToString(), IsHidden = true, Width = 90 });
                //g.NestedColumn.Add(new GridColumn { Field = "IsDocument", Title = "IsDocument", DataType = GridDataType.String.ToString(), IsHidden = true, Width = 90 });
                //g.NestedColumn.Add(new GridColumn { Field = "LocationStatus", Title = "LocationStatus", DataType = GridDataType.String.ToString(), IsHidden = true, Width = 90 });
                g.InstantiateIn(Container);
            }
        }


        public DataSourceResult GetULDMonitoringULDGridData(string ULDNo, int skip, int take, int page, int pageSize, List<SoftwareFactory.Data.GridSort> sort, SoftwareFactory.Data.GridFilter filter)
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
            ProcName = "getuldhistory";
            string filters = GridFilter.ProcessFilters<ULDGridData>(filter);
            SqlParameter[] Parameters = {
                                          new SqlParameter("@ULDNo", ULDNo)   
                                        };

            ds = SqlHelper.ExecuteDataset(DMLConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, ProcName, Parameters);
            var wmsBookingList = ds.Tables[0].AsEnumerable().Select(e => new ULDGridData
            {
                ULDName = Convert.ToString(e["ULDName"].ToString()),
                FlightNo = Convert.ToString(e["FlightNo"].ToString()),
                AwbCount = Convert.ToString(e["AWB"].ToString()),
                OUTULD = Convert.ToString(e["OUTULD"].ToString())
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




    }
}