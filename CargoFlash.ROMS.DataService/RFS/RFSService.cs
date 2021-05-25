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
using CargoFlash.Cargo.Model.RFS;
using CargoFlash.SoftwareFactory.WebUI.Controls;
using CargoFlash.SoftwareFactory.WebUI;
using System.ServiceModel.Web;
using System.IO;
using CargoFlash.SoftwareFactory.WebUI.Adapters;
using System.Globalization;
using KLAS.Business.EDI;
using CargoFlash.Cargo.Business;
using Newtonsoft.Json;

namespace CargoFlash.Cargo.DataService.RFS
{
    [ServiceBehavior(IncludeExceptionDetailInFaults = true)]
    [AspNetCompatibilityRequirements(RequirementsMode = AspNetCompatibilityRequirementsMode.Allowed)]
    public class RFSService : BaseWebUISecureObject, IRFSService
    {
        public Stream GetWebForm(string processName, string moduleName, string appName, string formAction, string IsSubModule)
        {
            return BuildWebForm(processName, moduleName, appName, formAction, "", (IsSubModule == "1"));
        }

        public Stream GetGridData(string processName, string moduleName, string appName, string SearchFlightNo, string SearchFromFlightDate, string SearchToFlightDate, string SearchFlightStatus)
        {
            return BuildWebForm(processName, moduleName, appName, "IndexView", SearchFlightNo: SearchFlightNo, SearchFromFlightDate: SearchFromFlightDate, SearchToFlightDate: SearchToFlightDate, SearchFlightStatus: SearchFlightStatus);
        }

        private void CreateRFSGrid(StringBuilder Container, string SearchFlightNo = "", string SearchFromFlightDate = "", string SearchToFlightDate = "", string SearchFlightStatus = "")
        {
            using (Grid g = new Grid())
            {
                g.PageName = this.MyPageName;
                g.PrimaryID = this.MyPrimaryID;
                g.ModuleName = this.MyModuleID;
                g.AppsName = this.MyAppID;
                g.IsDisplayOnly = true;
                g.DefaultPageSize = 10;
                g.IsAllowCopy = false;
                g.DataSoruceUrl = "Services/RFS/RFSService.svc/GetRFSGridData";
                g.NewURL = MyPageName + "?" + GetWebURLString("New", false);
                g.ServiceModuleName = this.MyModuleID;
                g.UserID = this.MyUserID;
                g.FormCaptionText = "RFS";
                g.IsProcessPart = true;
                g.IsVirtualScroll = false;
                g.IsDisplayOnly = false;
                g.IsActionRequired = false;
                g.IsSortable = true;
                g.IsAllowedFiltering = true;
                g.ProcessName = "RFS";
                g.IsVirtualScroll = false;
                g.IsShowGridHeader = false;
                g.SuccessGrid = "SuccessRFSGrid";

                g.Column = new List<GridColumn>();
                g.Column.Add(new GridColumn { Field = "SNo", Title = "SNo", IsHidden = true, DataType = GridDataType.String.ToString() });
                g.Column.Add(new GridColumn { Field = "DailyFlightSNo", Title = "DailyFlightSNo", DataType = GridDataType.String.ToString(), IsHidden = true });
                g.Column.Add(new GridColumn { Field = "TruckNo", IsLocked = false, Title = "Truck No", Template = "<sapn title=\"#= TruckNo #\">#= TruckNo #</span>", DataType = GridDataType.String.ToString(), Width = 50 });
                g.Column.Add(new GridColumn { Field = "TruckDate", Title = "Truck Date", DataType = GridDataType.Date.ToString(), Template = "# if( TruckDate==null) {# # } else {# #= kendo.toString(new Date(data.TruckDate.getTime() + data.TruckDate.getTimezoneOffset()*60000),\"" + UIDateTimeFormat.UIDateFormatString + "\") # #}#", Width = 60 });
                g.Column.Add(new GridColumn { Field = "TruckSourceDetails", IsLocked = false, Title = "Truck Source", DataType = GridDataType.String.ToString(), Width = 60 });
                g.Column.Add(new GridColumn { Field = "AgendOrVendorName", IsLocked = false, Title = "Vendors Name", DataType = GridDataType.String.ToString(), Width = 100 });
                g.Column.Add(new GridColumn { Field = "SealNo", IsLocked = false, Title = "Seal No", Template = "<sapn title=\"#= SealNo #\">#= SealNo #</span>", DataType = GridDataType.String.ToString(), Width = 50 });
                g.Column.Add(new GridColumn { Field = "Origin", IsLocked = false, Title = "Origin", DataType = GridDataType.String.ToString(), Width = 60 });
                g.Column.Add(new GridColumn { Field = "Destination", IsLocked = false, Title = "Destination", DataType = GridDataType.String.ToString(), Width = 60 });
                g.Column.Add(new GridColumn { Field = "ETD", IsLocked = false, Title = "ETD", DataType = GridDataType.String.ToString(), Width = 40 });
                g.Column.Add(new GridColumn { Field = "ETA", Title = "ETA", DataType = GridDataType.String.ToString(), Width = 40 });
                g.Column.Add(new GridColumn { Field = "Status", IsLocked = false, Title = "Status", DataType = GridDataType.String.ToString(), Width = 100, Template = "# if( IsRFSCancelled==1) {#<span class=\"actionView\" style=\"cursor:pointer;color: INDIANRED;font-weight:bold;\" onclick=\"GetRFSCancelledRemarks(this);\">#=Status#</span># } else {#<span style=\"color: blue;font-weight:bold;\" >#=Status#</span>#}#" });
                g.Column.Add(new GridColumn { Field = "TruckSource", Title = "TruckSource", IsHidden = true, DataType = GridDataType.String.ToString() });
                g.Column.Add(new GridColumn { Field = "AccountSNo", Title = "AccountSNo", IsHidden = true, DataType = GridDataType.String.ToString() });
                g.Column.Add(new GridColumn { Field = "IsTruckAgentOrVendor", Title = "IsTruckAgentOrVendor", IsHidden = true, DataType = GridDataType.String.ToString() });
                g.Column.Add(new GridColumn { Field = "AgendOrVendorName", Title = "AgendOrVendorName", IsHidden = true, DataType = GridDataType.String.ToString() });
                g.Column.Add(new GridColumn { Field = "TruckSNo", Title = "TruckSNo", DataType = GridDataType.String.ToString(), IsHidden = true });
                g.Column.Add(new GridColumn { Field = "TruckType", Title = "TruckType", DataType = GridDataType.String.ToString(), IsHidden = true });
                g.Column.Add(new GridColumn { Field = "ProcessStatus", Title = "ProcessStatus", DataType = GridDataType.String.ToString(), IsHidden = true });
                g.Column.Add(new GridColumn { Field = "IsTruck", Title = "IsTruck", DataType = GridDataType.String.ToString(), IsHidden = true });
                g.Column.Add(new GridColumn { Field = "IsAssignFlight", Title = "IsAssignFlight", DataType = GridDataType.String.ToString(), IsHidden = true });
                g.Column.Add(new GridColumn { Field = "IsManifested", Title = "IsManifested", DataType = GridDataType.String.ToString(), IsHidden = true });
                g.Column.Add(new GridColumn { Field = "IsCharges", Title = "IsCharges", DataType = GridDataType.String.ToString(), IsHidden = true });
                g.Column.Add(new GridColumn { Field = "IsDeparted", Title = "IsDeparted", DataType = GridDataType.String.ToString(), IsHidden = true });
                g.Column.Add(new GridColumn { Field = "ChargesCalculatedManually", Title = "ChargesCalculatedManually", DataType = GridDataType.String.ToString(), IsHidden = true });
                g.Column.Add(new GridColumn { Field = "ChargesRemarks", Title = "ChargesRemarks", DataType = GridDataType.String.ToString(), IsHidden = true });
                g.Column.Add(new GridColumn { Field = "TruckLocation", Title = "TruckLocation", DataType = GridDataType.String.ToString(), IsHidden = true });
                g.Column.Add(new GridColumn { Field = "IsRFSCancelled", Title = "IsRFSCancelled", DataType = GridDataType.String.ToString(), IsHidden = true });

                g.ExtraParam = new List<GridExtraParam>();
                g.ExtraParam.Add(new GridExtraParam { Field = "TruckNo", Value = SearchFlightNo });
                g.ExtraParam.Add(new GridExtraParam { Field = "SearchFromFlightDate", Value = SearchFromFlightDate });
                g.ExtraParam.Add(new GridExtraParam { Field = "SearchToFlightDate", Value = SearchToFlightDate });
                g.ExtraParam.Add(new GridExtraParam { Field = "SearchFlightStatus", Value = SearchFlightStatus });
                g.InstantiateIn(Container);
            }
        }

        public DataSourceResult GetRFSGridData(String TruckNo, String SearchFromFlightDate, String SearchToFlightDate, String SearchFlightStatus, int skip, int take, int page, int pageSize, List<SoftwareFactory.Data.GridSort> sort, SoftwareFactory.Data.GridFilter filter)
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
            ProcName = "GetRFSGridData";
            string filters = GridFilter.ProcessFilters<RFSModel>(filter);
            SqlParameter[] Parameters = { new SqlParameter("@PageNo", page), new SqlParameter("@PageSize", pageSize), new SqlParameter("@WhereCondition", filters), new SqlParameter("@OrderBy", sorts), new SqlParameter("@FlightNo", TruckNo), new SqlParameter("@SearchFromFlightDate", SearchFromFlightDate), new SqlParameter("@SearchToFlightDate", SearchToFlightDate), new SqlParameter("@SearchFlightStatus", SearchFlightStatus), new SqlParameter("@LoggedInCity", ((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).CityCode.ToString()) };

            ds = SqlHelper.ExecuteDataset(DMLConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, ProcName, Parameters);

            var rfsList = ds.Tables[0].AsEnumerable().Select(e => new RFSModel
            {
                SNo = Convert.ToInt32(e["SNo"]),
                DailyFlightSNo = Convert.ToInt32(e["DailyFlightSNo"]),
                TruckNo = e["TruckNo"].ToString(),
                //TruckDate = e["TruckDate"].ToString() == "" ? "" : Convert.ToDateTime(e["TruckDate"].ToString()).ToString(DateFormat.DateFormatString),
                //TruckDate = DateTime.Parse(e["TruckDate"].ToString()),
                TruckDate = e["TruckDate"] == DBNull.Value ? (DateTime?)null : DateTime.SpecifyKind(Convert.ToDateTime(e["TruckDate"]), DateTimeKind.Utc),
                Origin = e["Origin"].ToString(),
                Destination = e["Destination"].ToString(),
                ETA = e["ETA"].ToString(),
                ETD = e["ETD"].ToString(),
                Status = e["Status"].ToString(),
                TruckSource = Convert.ToInt32(e["TruckSource"]),
                AccountSNo = Convert.ToInt32(e["AccountSNo"]),
                IsTruckAgentOrVendor = e["IsTruckAgentOrVendor"].ToString(),
                AgendOrVendorName = e["AgendOrVendorName"].ToString(),
                SealNo = e["SealNo"].ToString(),
                TruckSNo = e["TruckSNo"].ToString(),
                TruckType = e["TruckType"].ToString(),
                ProcessStatus = e["ProcessStatus"].ToString(),
                IsTruck = Convert.ToInt32(e["IsTruck"]),
                IsAssignFlight = Convert.ToInt32(e["IsAssignFlight"]),
                IsManifested = Convert.ToInt32(e["IsManifested"]),
                IsCharges = Convert.ToInt32(e["IsCharges"]),
                IsDeparted = Convert.ToInt32(e["IsDeparted"]),
                ChargesCalculatedManually = Convert.ToInt32(e["ChargesCalculatedManually"]),
                ChargesRemarks = e["ChargesRemarks"].ToString(),
                TruckLocation = e["TruckLocation"].ToString(),
                IsRFSCancelled = Convert.ToInt32(e["IsRFSCancelled"]),
                TruckSourceDetails = Convert.ToInt32(e["TruckSource"]) == 0 ? "SAS" : ((Convert.ToInt32(e["TruckSource"]) == 1 ? "SAS Vendor" : "Airline Vendor"))
            });

            ds.Dispose();
            return new DataSourceResult
            {
                Data = rfsList.AsQueryable().ToList(),
                Total = Convert.ToInt32(ds.Tables[1].Rows[0][0].ToString()),
                FilterCondition = filters,
                SortCondition = sorts,
                StoredProcedure = ProcName
            };
        }

        private Stream BuildWebForm(string processName, string moduleName, string appName, string formAction, string recordID = "", bool IsSubModule = true, string SearchFlightNo = "", string SearchFromFlightDate = "", string SearchToFlightDate = "", string SearchFlightStatus = "", string ProcessStatus = "", string FlightSNo = "", string RFSTruckDetailsSNo = "")
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
                        case "RFS":
                            if (appName.ToUpper().Trim() == "RFS")
                                CreateRFSGrid(myCurrentForm, SearchFlightNo, SearchFromFlightDate, SearchToFlightDate, SearchFlightStatus);
                            if (appName.ToUpper().Trim() == "MANIFESTULD")
                                CreateManifestULDGrid(myCurrentForm, ProcessStatus, FlightSNo);
                            break;
                        case "RFSCHARGE":
                            if (appName.ToUpper().Trim() == "RFSDOCKING")
                                CreateRFSDockingChargeGridData(myCurrentForm, RFSTruckDetailsSNo);
                            if (appName.ToUpper().Trim() == "RFS")
                                CreateRFSChargeGridData(myCurrentForm, RFSTruckDetailsSNo);
                            break;
                        case "RFSCUSTOMCHARGE":
                            if (appName.ToUpper().Trim() == "RFS")
                                CreateRFSCustomChargesGridData(myCurrentForm, RFSTruckDetailsSNo);
                            break;
                        case DisplayModeReadView:
                            using (HtmlFormGenerator htmlFormAdapter = new HtmlFormGenerator(processName))
                            {
                                htmlFormAdapter.DisplayMode = DisplayModeType.ReadOnly;
                                myCurrentForm.Append(htmlFormAdapter.InstantiateIn(moduleName, appName, formAction, IsSubModule: IsSubModule));
                            }
                            break;
                        default:
                            break;
                    }
                    break;

            }
            byte[] resultMyForm = Encoding.UTF8.GetBytes(myCurrentForm.ToString());
            WebOperationContext.Current.OutgoingResponse.ContentType = "text/html";
            return new MemoryStream(resultMyForm);
        }

        public Stream GetFlightTransGridData(string processName, string moduleName, string appName, string FlightSNo, string ProcessStatus = "")
        {
            return BuildWebForm(processName, moduleName, appName, "IndexView", FlightSNo: FlightSNo, ProcessStatus: ProcessStatus);
        }

        private void CreateManifestULDGrid(StringBuilder Container, string ProcessStatus, string FlightSNo = "")
        {
            using (NestedGrid g = new NestedGrid())
            {
                g.Height = 100;
                g.PrimaryID = this.MyPrimaryID;
                g.ModuleName = this.MyModuleID;
                g.AppsName = this.MyAppID;
                g.DefaultPageSize = 1000;
                g.DataSoruceUrl = "Services/RFS/RFSService.svc/GetRFSManifestFlightULDGridData";
                g.PrimaryID = "ULDStockSNo";
                g.NewURL = MyPageName + "?" + GetWebURLString("New", false);
                g.ModuleName = this.MyModuleID;
                g.FormCaptionText = "ULD Details";
                g.IsFormHeader = false;
                g.IsModule = true;
                g.IsAllowedSorting = false;
                g.IsAllowedScrolling = true;
                g.IsShowEdit = false;
                g.ParentSuccessGrid = "DisableFlight";
                g.IsSaveChanges = false;
                g.IsColumnMenu = false;
                g.IsAllowedFiltering = false;
                g.Column = new List<GridColumn>();
                //g.Column.Add(new GridColumn { Field = "isSelect", Title = "Select", Template = "# if(isSelect==0) {#<input type=\"checkbox\" id=\"chkbtnSelect\" value=\"#=isSelect#\"  onclick=\"checkOnHold(this);\"/><input type=\"hidden\" value=\"#=HoldShip#\" />#} else if(isSelect==2) {#<input type=\"checkbox\" id=\"chkbtnSelect\" value=\"#=isSelect#\" checked=\"1\"  onclick=\"checkOnHold(this);\"/><input type=\"hidden\" value=\"#=HoldShip#\" /># } else{##} #", DataType = GridDataType.String.ToString(), Width = 50 });
                g.Column.Add(new GridColumn { Field = "ULDStockSNo", Title = "ULD No", IsHidden = true, DataType = GridDataType.Number.ToString() });
                g.Column.Add(new GridColumn { Field = "ULDNo", Title = "ULD No", IsHidden = false, DataType = GridDataType.String.ToString() });
                g.Column.Add(new GridColumn { Field = "EmptyWeight", Title = "Tare Weight", IsHidden = false, DataType = GridDataType.String.ToString() });
                g.Column.Add(new GridColumn { Field = "GrossWeight", Title = "Max. Gross Weight", DataType = GridDataType.String.ToString() });
                g.Column.Add(new GridColumn { Field = "VolumeWeight", Title = "Max Volume Weight", DataType = GridDataType.String.ToString() });
                g.Column.Add(new GridColumn { Field = "MaxGrossWeight", Title = "Total Weight", DataType = GridDataType.Number.ToString() });
                g.Column.Add(new GridColumn { Field = "Shipments", Title = "Total Shipment", DataType = GridDataType.Number.ToString() });
                g.Column.Add(new GridColumn { Field = "IsDisabledULD", Title = "IsDisabledULD", IsHidden = true, DataType = GridDataType.Boolean.ToString() });
                g.Column.Add(new GridColumn { Field = "RFSRemarks", Title = "Remarks", DataType = GridDataType.String.ToString(), Width = 130, Template = "#if(ULDStockSNo>0){if(RFSRemarks!=\"\"){#<span title=\"#= RFSRemarks #\">#= RFSRemarks #</span>#}}else{##}#" });

                //Template = "<span title=\"#= RFSRemarks #\">#= RFSRemarks #</span>"
                g.ExtraParam = new List<GridExtraParams>();
                g.ExtraParam.Add(new GridExtraParams { Field = "FlightSNo", Value = FlightSNo });
                g.ExtraParam.Add(new GridExtraParams { Field = "ProcessStatus", Value = ProcessStatus });

                //#region Nested Grid Section
                g.NestedPrimaryID = "AWBSno";
                g.NestedModuleName = this.MyModuleID;
                g.NestedAppsName = this.MyAppID;
                g.NestedParentID = "ULDStockSNo";
                g.NestedIsShowEdit = false;
                g.NestedDefaultPageSize = 1000;
                g.NestedIsPageable = false;
                g.IsNestedAllowedSorting = false;
                g.SuccessGrid = "DisableFlight";

                g.NestedDataSoruceUrl = "Services/RFS/RFSService.svc/GetRFSManifestULDShipmentGridData";
                g.NestedColumn = new List<GridColumn>();

                //g.NestedColumn.Add(new GridColumn { Field = "Bulk", Title = "", Template = "#if(IsBulk==1){#<input type=\"checkbox\" id=\"chkBulk\"  onclick=\"MarkSelected(this);\"/><input type=\"hidden\" value=\"#=isHold#\" />#}else if(IsBulk==2){#<input type=\"checkbox\" checked=\"1\" id=\"chkBulk\" onclick=\"MarkSelected(this);\"/><input type=\"hidden\" value=\"#=isHold#\" />#} else{#<label></label>#}#", DataType = GridDataType.String.ToString(), Width = 50 });
                g.NestedColumn.Add(new GridColumn { Field = "AWBSNo", Title = "AWBSNo", DataType = GridDataType.String.ToString(), IsHidden = true });
                g.NestedColumn.Add(new GridColumn { Field = "AWBNo", Title = "AWB No", DataType = GridDataType.String.ToString(), Width = 70 });
                g.NestedColumn.Add(new GridColumn { Field = "AWBSector", Title = "AWB Sector", DataType = GridDataType.String.ToString(), Width = 70 });
                g.NestedColumn.Add(new GridColumn { Field = "TotalPieces", Title = "Total Pcs", DataType = GridDataType.String.ToString(), Width = 50 });
                g.NestedColumn.Add(new GridColumn { Field = "ActG_V_CBM", Title = "Actual G/V/CBM", DataType = GridDataType.String.ToString(), Width = 110 });
                g.NestedColumn.Add(new GridColumn { Field = "PlannedPieces", Title = "Planned Pieces", Template = "#if(IsBulk!=0){#<input type=\"text\" id=\"txt_PlannedPieces\" value=\"#=PlannedPieces#\" style=\"width:50%;\" readonly=\"true\" />#}else{##=PlannedPieces##}#", DataType = GridDataType.Number.ToString(), Width = 70 });
                g.NestedColumn.Add(new GridColumn { Field = "PlanG_V_CBM", Title = "Planned G/V/CBM", Template = "#if(IsBulk!=0){#<input type=\"text\" id=\"txtPG\" value=\"#=PG#\" style=\"width:30%;\"  readonly=\"true\" />/<input type=\"text\" id=\"txtPV\" value=\"#=PV#\" style=\"width:30%;\"  readonly=\"true\" />/<input type=\"text\" id=\"txtPCBM\" value=\"#=PCBM#\" style=\"width:30%;\" readonly=\"true\" />#}else{##=PlanG_V_CBM##}#", DataType = GridDataType.String.ToString(), Width = 150 });
                g.NestedColumn.Add(new GridColumn { Field = "Status", Title = "Status", DataType = GridDataType.String.ToString(), Width = 50 });
                g.NestedColumn.Add(new GridColumn { Field = "SHC", Title = "SHC", DataType = GridDataType.String.ToString(), Width = 70 });
                g.NestedColumn.Add(new GridColumn { Field = "Agent", Title = "Agent", DataType = GridDataType.String.ToString(), Width = 70 });
                g.NestedColumn.Add(new GridColumn { Field = "Priority", Title = "Priority", DataType = GridDataType.String.ToString(), Width = 70 });
                g.NestedColumn.Add(new GridColumn { Field = "TotalPPcs", Title = "TotalPPcs", DataType = GridDataType.String.ToString(), IsHidden = true });
                g.NestedColumn.Add(new GridColumn { Field = "IsPreManifested", Title = "IsPreManifested", DataType = GridDataType.Boolean.ToString(), IsHidden = true });
                g.NestedColumn.Add(new GridColumn { Field = "DailyFlightSNo", Title = "DailyFlightSNo", DataType = GridDataType.Number.ToString(), IsHidden = true });
                g.NestedColumn.Add(new GridColumn { Field = "RFSRemarks", Title = "Remarks", DataType = GridDataType.String.ToString(), Width = 130, Template = "#if(ULDStockSNo==0){ if(RFSRemarks!=\"\"){ #<span title=\"#= RFSRemarks #\">#= RFSRemarks #</span>#} }else{##}#" });

                g.NestedColumn.Add(new GridColumn { Field = "IsCTM", Title = "Charges", IsHidden = false, DataType = GridDataType.Boolean.ToString(), Template = "#if(IsCTM==true){#<input type=\"button\" value=\"C\" style=\"#=ChargeCSS#\" onclick=\"fn_GetCTMChargeDetails(#=AWBSNo#,#=CTMSNo#,this,1);\" title=\"#=ChargesRemarks#\">#}#", Width = 35, Filterable = "false" });

                g.NestedExtraParam = new List<NestedGridExtraParam>();
                g.NestedExtraParam.Add(new NestedGridExtraParam { Field = "FlightSNo", Value = FlightSNo });
                g.NestedExtraParam.Add(new NestedGridExtraParam { Field = "ProcessStatus", Value = ProcessStatus });
                g.InstantiateIn(Container);
            }
        }

        /// <summary>
        /// RFS Manifest ULD 
        /// </summary>
        public DataSourceResult GetRFSManifestFlightULDGridData(String FlightSNo, String ProcessStatus, int skip, int take, int page, int pageSize, List<SoftwareFactory.Data.GridSort> sort, SoftwareFactory.Data.GridFilter filter)
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
            ProcName = "GetRFSManifestFlightULDGridData";
            string filters = GridFilter.ProcessFilters<ManifestULD>(filter);

            SqlParameter[] Parameters = { new SqlParameter("@PageNo", page), new SqlParameter("@PageSize", pageSize), new SqlParameter("@WhereCondition", filters), new SqlParameter("@OrderBy", sorts), new SqlParameter("@DailyFlightSNo", FlightSNo), new SqlParameter("@ProcessStatus", ProcessStatus), new SqlParameter("@LoggedInCity", ((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).CityCode.ToString()) };

            ds = SqlHelper.ExecuteDataset(DMLConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, ProcName, Parameters);

            var rfsManifestULDList = ds.Tables[0].AsEnumerable().Select(e => new ManifestULD
            {
                ULDStockSNo = Convert.ToInt32(e["ULDStockSNo"]),
                Pieces = Convert.ToInt32(e["Pieces"]),
                MaxVolumeWeight = Convert.ToDecimal(e["MaxVolumeWeight"]),
                MaxGrossWeight = Convert.ToDecimal(e["MaxGrossWeight"]),
                EmptyWeight = Convert.ToString(e["EmptyWeight"]),
                ULDNo = e["ULDNo"].ToString(),
                GrossWeight = Convert.ToString(e["GrossWeight"]),
                VolumeWeight = Convert.ToString(e["VolumeWeight"]),
                FlightNo = e["FlightNo"].ToString(),
                FlightDate = e["FlightDate"].ToString(),
                OriginCity = e["OriginCity"].ToString(),
                Status = e["Status"].ToString(),
                Shipments = Convert.ToInt32(e["Shipments"]),
                isSelect = Convert.ToInt16(e["isSelect"]),
                HoldShip = e["HoldShip"].ToString(),
                IsDisabledULD = Convert.ToBoolean(e["IsDisabledULD"]),
                RFSRemarks = e["RFSRemarks"].ToString().ToUpper()
            });
            ds.Dispose();
            return new DataSourceResult
            {
                Data = rfsManifestULDList.AsQueryable().ToList(),
                Total = Convert.ToInt32(ds.Tables[1].Rows[0][0].ToString()),
                FilterCondition = filters,
                SortCondition = sorts,
                StoredProcedure = ProcName
            };
        }

        /// <summary>
        /// RFS Manifest child
        /// </summary>
        public DataSourceResult GetRFSManifestULDShipmentGridData(string FlightSNo, string ProcessStatus, int skip, int take, int page, int pageSize, List<SoftwareFactory.Data.GridSort> sort, SoftwareFactory.Data.GridFilter filter)
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
            ProcName = "GetRFSManifestULDShipmentGridData";
            string filters = GridFilter.ProcessFilters<ManifestShipment>(filter);
            SqlParameter[] Parameters = { new SqlParameter("@PageNo", page), new SqlParameter("@PageSize", pageSize), new SqlParameter("@WhereCondition", filters), new SqlParameter("@OrderBy", sorts), new SqlParameter("@DailyFlightSNo", FlightSNo), new SqlParameter("@ProcessStatus", ProcessStatus), new SqlParameter("@LoggedInCity", ((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).CityCode.ToString()) };
            ds = SqlHelper.ExecuteDataset(DMLConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, ProcName, Parameters);

            var rfsManifestShipList = ds.Tables[0].AsEnumerable().Select(e => new ManifestShipment
            {
                AWBSNo = Convert.ToInt64(e["AWBSNo"]),
                AWBNo = Convert.ToString(e["AWBNo"]),
                AWBSector = Convert.ToString(e["AWBSector"]),
                TotalPieces = Convert.ToDecimal(e["TotalPieces"]),
                PlannedPieces = Convert.ToInt64(e["PlannedPieces"]),
                ActG_V_CBM = e["ActG_V_CBM"].ToString(),
                PlanG_V_CBM = e["PlanG_V_CBM"].ToString(),
                Agent = e["Agent"].ToString(),
                Commodity = e["Commodity"].ToString(),
                SHC = e["SHC"].ToString(),
                Priority = e["Priority"].ToString(),
                Status = e["Status"].ToString(),
                DailyFlightSNo = Convert.ToInt64(e["DailyFlightSNo"]),
                PCBM = Convert.ToDecimal(e["PCBM"]),
                PG = Convert.ToDecimal(e["PG"]),
                PV = Convert.ToDecimal(e["PV"]),
                IsBulk = Convert.ToInt16(e["IsBulk"]),
                isHold = Convert.ToBoolean(e["IsHold"]),
                IsPreManifested = Convert.ToBoolean(e["IsPreManifested"]),
                TotalPPcs = Convert.ToInt64(e["PlannedPieces"]),
                RFSRemarks = e["RFSRemarks"].ToString().ToUpper(),
                ULDStockSNo = Convert.ToInt32(e["ULDStockSNo"]),
                ChargeCSS = e["ChargeCSS"].ToString(),
                IsCTM = Convert.ToBoolean(e["IsCTM"]),
                CTMSNo = Convert.ToInt32(e["CTMSNo"]),
                ChargesRemarks = e["ChargesRemarks"].ToString()

            });
            ds.Dispose();
            return new DataSourceResult
            {
                Data = rfsManifestShipList.AsQueryable().ToList(),
                Total = Convert.ToInt32(ds.Tables[1].Rows[0][0].ToString()),
                FilterCondition = filters,
                SortCondition = sorts,
                StoredProcedure = ProcName
            };
        }

        /// <summary>
        /// Save Truck Details
        /// </summary>
        /// <param name="TruckDetails"></param>
        /// <returns></returns>
        public string SaveTruckDetails(List<TruckDetails> TruckDetails, string AirportCode, string RFSTruckDetailsSNo)
        {
            DataTable dtTruckDetails = CollectionHelper.ConvertTo(TruckDetails, "");
            BaseBusiness baseBusiness = new BaseBusiness();
            SqlParameter paramSaveTruckDetails = new SqlParameter();
            paramSaveTruckDetails.ParameterName = "@TruckDetailsType";
            paramSaveTruckDetails.SqlDbType = System.Data.SqlDbType.Structured;
            paramSaveTruckDetails.Value = dtTruckDetails;
            DataSet ds = new DataSet();
            SqlParameter[] Parameters = { paramSaveTruckDetails, new SqlParameter("@CreatedBy", Convert.ToInt32(((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).UserSNo.ToString())), new SqlParameter("@AirportCode", AirportCode), new SqlParameter("@RFSTruckDetailsSNo", RFSTruckDetailsSNo) };
            try
            {
                ds = SqlHelper.ExecuteDataset(DMLConnectionString.WebConfigConnectionString, "SaveTruckDetails", Parameters);
                return ds.Tables[ds.Tables.Count - 1].Rows[0][0].ToString();
            }
            catch (Exception ex)
            {
                return ex.Message;
            }
        }

        /// <summary>
        /// Save Assign Flight Details
        /// </summary>
        /// <param name="AssignFlightDetails"></param>
        /// <param name="AirportCode"></param>
        /// <returns></returns>
        public string SaveAssignFlightDetails(List<AssignFlightDetails> AssignFlightDetails, string AirportCode, string RFSTruckDetailsSNo)
        {
            DataTable dtAssignFlightDetails = CollectionHelper.ConvertTo(AssignFlightDetails, "");
            BaseBusiness baseBusiness = new BaseBusiness();
            SqlParameter paramAssignFlightDetails = new SqlParameter();
            paramAssignFlightDetails.ParameterName = "@AssignFlightDetailsType";
            paramAssignFlightDetails.SqlDbType = System.Data.SqlDbType.Structured;
            paramAssignFlightDetails.Value = dtAssignFlightDetails;
            DataSet ds = new DataSet();
            SqlParameter[] Parameters = { paramAssignFlightDetails, new SqlParameter("@CreatedBy", Convert.ToInt32(((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).UserSNo.ToString())), new SqlParameter("@AirportCode", AirportCode), new SqlParameter("@RFSTruckDetailsSNo", RFSTruckDetailsSNo) };
            try
            {
                ds = SqlHelper.ExecuteDataset(DMLConnectionString.WebConfigConnectionString, "SaveAssignFlightDetails", Parameters);
                return ds.Tables[ds.Tables.Count - 1].Rows[0][0].ToString();
            }
            catch (Exception ex)
            {
                return ex.Message;
            }
        }

        /// <summary>
        /// Save Departure Details
        /// </summary>
        /// <param name="DepartureDetails"></param>
        /// <returns></returns>
        public string SaveDepartureDetails(List<DepartureDetails> DepartureDetails, string AirportCode)
        {
            DataTable dtDepartureDetails = CollectionHelper.ConvertTo(DepartureDetails, "");
            BaseBusiness baseBusiness = new BaseBusiness();
            SqlParameter paramDepartureDetails = new SqlParameter();
            paramDepartureDetails.ParameterName = "@DepartureDetailsType";
            paramDepartureDetails.SqlDbType = System.Data.SqlDbType.Structured;
            paramDepartureDetails.Value = dtDepartureDetails;
            DataSet ds = new DataSet();
            SqlParameter[] Parameters = { paramDepartureDetails, new SqlParameter("@UpdateddBy", Convert.ToInt32(((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).UserSNo.ToString())), new SqlParameter("@AirportCode", AirportCode) };
            try
            {
                ds = SqlHelper.ExecuteDataset(DMLConnectionString.WebConfigConnectionString, "SaveDepartureDetails", Parameters);
                return ds.Tables[ds.Tables.Count - 1].Rows[0][0].ToString();
            }
            catch (Exception ex)
            {
                return ex.Message;
            }
        }

        public string SaveOtherInfoDetails(String RFSTruckDetailsSNo, String InvoiceNo, double SealCharges)
        {
            SqlParameter[] Parameters = { new SqlParameter("@RFSTruckDetailsSNo", RFSTruckDetailsSNo), new SqlParameter("@InvoiceNo", InvoiceNo), new SqlParameter("@SealCharges", SealCharges) };
            DataSet ds = SqlHelper.ExecuteDataset(DMLConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, "SaveOtherInfoDetails", Parameters);
            ds.Dispose();
            return CargoFlash.Cargo.Business.Common.CompleteDStoJSON(ds);
        }


        /// <summary>
        /// Bind RFS Truck Information
        /// </summary>
        /// <param name="RFSTruckDetailsSNo"></param>
        /// <returns></returns>
        public string BindRFSTruckInformation(string RFSTruckDetailsSNo)
        {
            SqlParameter[] Parameters = { new SqlParameter("@RFSTruckDetailsSNo", RFSTruckDetailsSNo) };
            DataSet ds = SqlHelper.ExecuteDataset(DMLConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, "BindRFSTruckInformation", Parameters);
            ds.Dispose();
            return CargoFlash.Cargo.Business.Common.CompleteDStoJSON(ds);
        }

        /// <summary>
        /// Bind RFS History
        /// </summary>
        /// <param name="RFSTruckDetailsSNo"></param>
        /// <returns></returns>
        public string BindRFSHistory(string RFSTruckDetailsSNo)
        {
            SqlParameter[] Parameters = { new SqlParameter("@RFSTruckDetailsSNo", RFSTruckDetailsSNo) };
            DataSet ds = SqlHelper.ExecuteDataset(DMLConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, "BindRFSHistory", Parameters);
            ds.Dispose();
            return CargoFlash.Cargo.Business.Common.CompleteDStoJSON(ds);
        }

        /// <summary>
        /// Save RFS History
        /// </summary>
        /// <param name="TruckRFSHistoryDetails"></param>
        /// <param name="RFSTruckDetailsSNo"></param>
        /// <returns></returns>
        public string SaveRFSHistory(List<TruckRFSHistoryDetails> TruckRFSHistoryDetails, string RFSTruckDetailsSNo)
        {
            DataTable dtTruckRFSHistoryDetails = CollectionHelper.ConvertTo(TruckRFSHistoryDetails, "");
            BaseBusiness baseBusiness = new BaseBusiness();
            SqlParameter paramTruckRFSHistoryDetails = new SqlParameter();
            paramTruckRFSHistoryDetails.ParameterName = "@TruckRFSHistoryDetailsType";
            paramTruckRFSHistoryDetails.SqlDbType = System.Data.SqlDbType.Structured;
            paramTruckRFSHistoryDetails.Value = dtTruckRFSHistoryDetails;
            DataSet ds = new DataSet();
            SqlParameter[] Parameters = { paramTruckRFSHistoryDetails, new SqlParameter("@CreatedBy", Convert.ToInt32(((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).UserSNo.ToString())), new SqlParameter("@RFSTruckDetailsSNo", RFSTruckDetailsSNo) };
            try
            {
                ds = SqlHelper.ExecuteDataset(DMLConnectionString.WebConfigConnectionString, "SaveRFSHistory", Parameters);
                return ds.Tables[ds.Tables.Count - 1].Rows[0][0].ToString();
            }
            catch (Exception ex)
            {
                return ex.Message;
            }
        }

        /// <summary>
        /// Bind RFS Assign Flight Information
        /// </summary>
        /// <param name="RFSTruckDetailsSNo"></param>
        /// <returns></returns>
        public string BindRFSAssignFlightInformation(string RFSTruckDetailsSNo)
        {
            DataSet ds = new DataSet();
            try
            {
                SqlParameter[] Parameters = { new SqlParameter("@RFSTruckDetailsSNo", RFSTruckDetailsSNo) };
                ds = SqlHelper.ExecuteDataset(DMLConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, "BindRFSAssignFlightInformation", Parameters);
                ds.Dispose();
            }
            catch (Exception) { }
            return CargoFlash.Cargo.Business.Common.CompleteDStoJSON(ds);
        }

        /// <summary>
        /// Bind RFS Departure Information
        /// </summary>
        /// <param name="RFSTruckDetailsSNo"></param>
        /// <returns></returns>
        public string BindRFSDepartureInformation(string RFSTruckDetailsSNo)
        {
            DataSet ds = new DataSet();
            try
            {
                SqlParameter[] Parameters = { new SqlParameter("@RFSTruckDetailsSNo", RFSTruckDetailsSNo), new SqlParameter("@CreatedBy", Convert.ToInt32(((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).UserSNo.ToString())) };
                ds = SqlHelper.ExecuteDataset(DMLConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, "BindRFSDepartureInformation", Parameters);
                ds.Dispose();
            }
            catch (Exception) { }
            return CargoFlash.Cargo.Business.Common.CompleteDStoJSON(ds);
        }

        public string BindRFSOtherInfo(string RFSTruckDetailsSNo)
        {
            DataSet ds = new DataSet();
            try
            {
                SqlParameter[] Parameters = { new SqlParameter("@RFSTruckDetailsSNo", RFSTruckDetailsSNo) };
                ds = SqlHelper.ExecuteDataset(DMLConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, "BindRFSOtherInfo", Parameters);
                ds.Dispose();
            }
            catch (Exception) { }
            return CargoFlash.Cargo.Business.Common.CompleteDStoJSON(ds);
        }

        public string BindRFSAssignFlightInformationOnTab(string RFSTruckDetailsSNo)
        {
            DataSet ds = new DataSet();
            try
            {
                SqlParameter[] Parameters = { new SqlParameter("@RFSTruckDetailsSNo", RFSTruckDetailsSNo), new SqlParameter("@CreatedBy", Convert.ToInt32(((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).UserSNo.ToString())) };
                ds = SqlHelper.ExecuteDataset(DMLConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, "BindRFSAssignFlightInformationOnTab", Parameters);
                ds.Dispose();
            }
            catch (Exception) { }
            return CargoFlash.Cargo.Business.Common.CompleteDStoJSON(ds);
        }

        public Stream GetRFSChargesData(string processName, string moduleName, string appName, string RFSTruckDetailsSNo)
        {
            return BuildWebForm(processName, moduleName, appName, "IndexView", RFSTruckDetailsSNo: RFSTruckDetailsSNo);
        }

        public Stream GetRFSDockingChargeData(string processName, string moduleName, string appName, string RFSTruckDetailsSNo)
        {
            return BuildWebForm(processName, moduleName, appName, "IndexView", RFSTruckDetailsSNo: RFSTruckDetailsSNo);
        }

        private void CreateRFSChargeGridData(StringBuilder Container, string RFSTruckDetailsSNo = "")
        {
            using (Grid g = new Grid())
            {
                g.PageName = this.MyPageName;
                g.PrimaryID = this.MyPrimaryID;
                g.ModuleName = this.MyModuleID;
                g.AppsName = this.MyAppID;
                g.IsDisplayOnly = true;
                g.DefaultPageSize = 5;
                g.IsAllowCopy = false;
                g.DataSoruceUrl = "Services/RFS/RFSService.svc/GetRFSChargeGridData";
                g.NewURL = MyPageName + "?" + GetWebURLString("New", false);
                g.ServiceModuleName = this.MyModuleID;
                g.UserID = this.MyUserID;
                //g.FormCaptionText = "RFS Charges" + " <span id='spnRFSChargesBill' style='font-size:13px;float:right;color:#b66202; margin-right:10px;'><input type='checkbox' name='chkBillToAgent' id='chkBillToAgent' />Bill To Agent</span>";
                g.FormCaptionText = "RFS Freight Charges";
                g.IsProcessPart = true;
                g.IsRowDataBound = false;
                g.IsSortable = false;
                g.ProcessName = "RFSCHARGE";
                g.IsVirtualScroll = false;
                g.IsPageable = false;
                g.SuccessGrid = "SuccessRFSChargeGrid";
                g.Column = new List<GridColumn>();
                g.Column.Add(new GridColumn { Field = "RFSTruckDetailsSNo", Title = "RFSTruckDetailsSNo", DataType = GridDataType.String.ToString(), IsHidden = true });
                g.Column.Add(new GridColumn { Field = "AirlineSNo", Title = "AirlineSNo", DataType = GridDataType.String.ToString(), IsHidden = true });
                g.Column.Add(new GridColumn { Field = "RateAirlineMasterSNo", Title = "RateAirlineMasterSNo", DataType = GridDataType.String.ToString(), IsHidden = true });
                g.Column.Add(new GridColumn { Field = "Airline", IsLocked = false, Title = "AIRLINE NAME", Template = "<sapn title=\"#= Airline #\" style=\"font-weight:bold;\">#= Airline #</span>", DataType = GridDataType.String.ToString() });
                g.Column.Add(new GridColumn { Field = "NoOfUnits", IsLocked = false, Title = "NO OF UNITS", DataType = GridDataType.String.ToString() });
                g.Column.Add(new GridColumn { Field = "ChargeableUnit", IsLocked = false, Title = "CHARGEABLE UNIT", DataType = GridDataType.String.ToString(), Template = "<input type=\"text\" id=\"txtChargeableUnit\" value=\"#=ChargeableUnit#\" ondrop=\"return false;\" onpaste=\"return false;\" onkeypress=\"return ValidateFloatKeyPress(this,event)\" style=\"width:30%;\" maxlength=\"8\" onchange=\"GetRFSFreightChargesByPosition(this,1)\" />" });
                g.Column.Add(new GridColumn { Field = "Amount", IsLocked = false, Title = "AMOUNT", DataType = GridDataType.String.ToString(), Template = "<input type=\"text\" id=\"txtAmount\" value=\"#=Amount#\" ondrop=\"return false;\" onpaste=\"return false;\" onkeypress=\"return ValidateFloatKeyPress(this,event)\" style=\"width:30%;\" maxlength=\"8\" onchange=\"GetRFSFreightChargesByPosition(this,2)\" />" });

                g.Column.Add(new GridColumn { Field = "TaxType", IsLocked = false, Title = "TAX", Template = "<sapn title=\"#= TaxType #\" style=\"font-weight:bold;\">#= TaxType #</span>", DataType = GridDataType.String.ToString() });

                g.Column.Add(new GridColumn { Field = "TaxAmount", IsLocked = false, Title = "TAX AMOUNT", DataType = GridDataType.String.ToString(), Template = "<input type=\"text\" id=\"txtTaxAmount\" value=\"#=TaxAmount#\" ondrop=\"return false;\" onpaste=\"return false;\" disabled=\"disabled;\"  style=\"width:30%;\" maxlength=\"8\" />" });


                g.Column.Add(new GridColumn { Field = "TotalAmount", IsLocked = false, Title = "TOTAL AMOUNT", DataType = GridDataType.String.ToString(), Template = "<input type=\"text\" id=\"txtTotalAmount\" value=\"#=TotalAmount#\" ondrop=\"return false;\" onpaste=\"return false;\"  disabled=\"disabled;\"  style=\"width:30%;\" maxlength=\"8\" />" });

                g.Column.Add(new GridColumn { Field = "FreightRemarks", IsLocked = false, Title = "REMARKS", DataType = GridDataType.String.ToString(), Template = "<textarea type=\"text\" id=\"FreightRemarks\" value=\"#=FreightRemarks#\" ondrop=\"return false;\" onpaste=\"return false;\" style=\"width:95%;height:40px;text-transform:uppercase;\" maxlength=\"250\" />" });

                g.Column.Add(new GridColumn { Field = "HdnAmount", Title = "HdnAmount", DataType = GridDataType.String.ToString(), IsHidden = true });
                g.Column.Add(new GridColumn { Field = "HdnChargeableUnit", Title = "HdnChargeableUnit", DataType = GridDataType.String.ToString(), IsHidden = true });
                g.Column.Add(new GridColumn { Field = "HdnTotalAmount", Title = "HdnTotalAmount", DataType = GridDataType.String.ToString(), IsHidden = true });
                g.Column.Add(new GridColumn { Field = "HdnTaxAmount", Title = "HdnTaxAmount", DataType = GridDataType.String.ToString(), IsHidden = true });
                g.Column.Add(new GridColumn { Field = "TruckRatesTax", Title = "TruckRatesTax", DataType = GridDataType.String.ToString(), IsHidden = true });

                g.ExtraParam = new List<GridExtraParam>();
                g.ExtraParam.Add(new GridExtraParam { Field = "RFSTruckDetailsSNo", Value = RFSTruckDetailsSNo });
                g.InstantiateIn(Container);
            }
        }

        public DataSourceResult GetRFSChargeGridData(String RFSTruckDetailsSNo, int skip, int take, int page, int pageSize, List<SoftwareFactory.Data.GridSort> sort, SoftwareFactory.Data.GridFilter filter)
        {
            string sorts = GridSort.ProcessSorting(sort);
            string ProcName = "";
            //if (filter == null)
            //{
            //    filter = new GridFilter();
            //    filter.Logic = "AND";
            //    filter.Filters = new List<GridFilter>();
            //}
            DataSet ds = new DataSet();
            ProcName = "GetRFSChargeGridData";
            //string filters = GridFilter.ProcessFilters<RFSModel>(filter);
            SqlParameter[] Parameters = { new SqlParameter("@RFSTruckDetailsSNo", RFSTruckDetailsSNo), new SqlParameter("@LoggedInCity", ((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).CityCode.ToString()) };

            ds = SqlHelper.ExecuteDataset(DMLConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, ProcName, Parameters);

            var rfsList = ds.Tables[0].AsEnumerable().Select(e => new RFSChargesModel
            {
                Airline = e["AirlineName"].ToString(),
                NoOfUnits = Convert.ToDecimal(e["NoOfUnits"]),
                ChargeableUnit = Convert.ToDecimal(e["ChargeableUnit"]),
                HdnChargeableUnit = Convert.ToDecimal(e["ChargeableUnit"]),
                AirlineSNo = Convert.ToInt32(e["AirlineSNo"]),
                RFSTruckDetailsSNo = Convert.ToInt32(e["RFSTruckDetailsSNo"]),
                HdnAmount = Convert.ToDecimal(e["Amount"]),
                Amount = Convert.ToDecimal(e["Amount"]),
                FreightRemarks = e["FreightRemarks"].ToString().ToUpper(),
                RateAirlineMasterSNo = Convert.ToInt32(e["RateAirlineMasterSNo"]),
                HdnTotalAmount = Convert.ToDecimal(e["TotalAmount"]),
                TotalAmount = Convert.ToDecimal(e["TotalAmount"]),
                HdnTaxAmount = Convert.ToDecimal(e["TaxAmount"]),
                TaxAmount = Convert.ToDecimal(e["TaxAmount"]),
                TaxType = e["TaxType"].ToString().ToUpper(),
                TruckRatesTax = e["TruckRatesTax"].ToString()
            });

            ds.Dispose();
            return new DataSourceResult
            {
                Data = rfsList.AsQueryable().ToList(),
                Total = Convert.ToInt32(ds.Tables[1].Rows[0][0].ToString()),
                //FilterCondition = filters,
                //SortCondition = sorts,
                StoredProcedure = ProcName
            };
        }

        private void CreateRFSDockingChargeGridData(StringBuilder Container, string RFSTruckDetailsSNo = "")
        {
            using (Grid g = new Grid())
            {
                g.PageName = this.MyPageName;
                g.PrimaryID = this.MyPrimaryID;
                g.ModuleName = this.MyModuleID;
                g.AppsName = this.MyAppID;
                g.IsDisplayOnly = true;
                g.DefaultPageSize = 5;
                g.IsAllowCopy = false;
                g.DataSoruceUrl = "Services/RFS/RFSService.svc/GetRFSDockingChargeGridData";
                g.NewURL = MyPageName + "?" + GetWebURLString("New", false);
                g.ServiceModuleName = this.MyModuleID;
                g.UserID = this.MyUserID;
                g.FormCaptionText = "" + "<div id='divBillToDocking' style='margin-top:10px;margin-right:20px;float:right;' >" + "<div id='divBillToVendor' style='float:right;margin-right:25px;'></div><input type='radio' id='chkDockCash' name='DockCredit' value='0'  /><span id='spnChkDockCash'>Cash</span><input type='radio' id='chkDockCredit' name='DockCredit' value='1' checked='true'  /><span id='spnChkDockCredit'>Credit</span></div>";

                g.IsProcessPart = true;
                g.IsRowDataBound = false;
                g.IsSortable = false;
                g.ProcessName = "RFSCHARGE";
                g.IsVirtualScroll = false;
                g.IsPageable = false;

                g.SuccessGrid = "SuccessDockingGrid";
                g.Column = new List<GridColumn>();
                g.Column.Add(new GridColumn { Field = "TariffSNo", Title = "TariffSNo", DataType = GridDataType.String.ToString(), IsHidden = true });
                g.Column.Add(new GridColumn { Field = "TariffHeadName", IsLocked = false, Title = "CHARGE NAME", DataType = GridDataType.String.ToString(), Width = 150, Template = "<sapn title=\"#=TariffHeadName#\" style=\"font-weight:bold;\">#=TariffHeadName#</span>" });
                g.Column.Add(new GridColumn { Field = "TariffCode", IsLocked = false, Title = "TARIFF CODE", DataType = GridDataType.String.ToString() });
                g.Column.Add(new GridColumn { Field = "TotalAmount", IsLocked = false, Title = "TOTAL AMOUNT", DataType = GridDataType.String.ToString(), Width = 100 });
                g.Column.Add(new GridColumn { Field = "ChargeRemarks", IsLocked = false, Title = "REMARKS", DataType = GridDataType.String.ToString() });
                g.ExtraParam = new List<GridExtraParam>();
                g.ExtraParam.Add(new GridExtraParam { Field = "RFSTruckDetailsSNo", Value = RFSTruckDetailsSNo });
                g.InstantiateIn(Container);
            }
        }

        public DataSourceResult GetRFSDockingChargeGridData(String RFSTruckDetailsSNo, int skip, int take, int page, int pageSize, List<SoftwareFactory.Data.GridSort> sort, SoftwareFactory.Data.GridFilter filter)
        {
            string sorts = GridSort.ProcessSorting(sort);
            string ProcName = "";
            DataSet ds = new DataSet();
            ProcName = "GetRFSDockingChargeGridData";
            SqlParameter[] Parameters = { new SqlParameter("@RFSTruckDetailsSNo", RFSTruckDetailsSNo), new SqlParameter("@LoggedInCity", ((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).CityCode.ToString()) };

            ds = SqlHelper.ExecuteDataset(DMLConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, ProcName, Parameters);

            var rfsList = ds.Tables[0].AsEnumerable().Select(e => new RFSDockingChargesModel
            {
                TariffSNo = Convert.ToInt32(e["TariffSNo"]),
                TariffHeadName = e["TariffHeadName"].ToString().ToUpper(),
                TariffCode = e["TariffCode"].ToString().ToUpper(),
                pValue = Convert.ToDecimal(e["pValue"]),
                PrimaryBasis = e["PrimaryBasis"].ToString().ToUpper(),
                sValue = Convert.ToDecimal(e["sValue"]),
                SecondaryBasis = e["SecondaryBasis"].ToString().ToUpper(),
                ChargeAmount = Convert.ToDecimal(e["ChargeAmount"]),
                TotalTaxAmount = Convert.ToDecimal(e["TotalTaxAmount"]),
                TotalAmount = Convert.ToDecimal(e["TotalAmount"]),
                ChargeRemarks = e["ChargeRemarks"].ToString().ToUpper()
            });

            ds.Dispose();
            return new DataSourceResult
            {
                Data = rfsList.AsQueryable().ToList(),
                Total = Convert.ToInt32(ds.Tables[1].Rows[0][0].ToString()),
                StoredProcedure = ProcName
            };
        }

        public Stream GetRFSCustomChargesData(string processName, string moduleName, string appName, string RFSTruckDetailsSNo)
        {
            return BuildWebForm(processName, moduleName, appName, "IndexView", RFSTruckDetailsSNo: RFSTruckDetailsSNo);
        }

        private void CreateRFSCustomChargesGridData(StringBuilder Container, string RFSTruckDetailsSNo = "")
        {
            using (Grid g = new Grid())
            {
                g.PageName = this.MyPageName;
                g.PrimaryID = this.MyPrimaryID;
                g.ModuleName = this.MyModuleID;
                g.AppsName = this.MyAppID;
                g.IsDisplayOnly = true;
                g.DefaultPageSize = 5;
                g.IsAllowCopy = false;
                g.DataSoruceUrl = "Services/RFS/RFSService.svc/GetRFSCustomChargesGridData";
                g.NewURL = MyPageName + "?" + GetWebURLString("New", false);
                g.ServiceModuleName = this.MyModuleID;
                g.UserID = this.MyUserID;
                g.FormCaptionText = "RFS Custom Charges";
                g.IsProcessPart = true;
                g.IsRowDataBound = false;
                g.IsSortable = false;
                g.ProcessName = "RFSCUSTOMCHARGE";
                g.IsVirtualScroll = false;
                g.IsPageable = false;
                //g.SuccessGrid = "BindCustomCharge";
                g.SuccessGrid = "SuccessRFSCustomChargeGrid";
                g.Column = new List<GridColumn>();
                g.Column.Add(new GridColumn { Field = "RFSTruckDetailsSNo", Title = "RFSTruckDetailsSNo", DataType = GridDataType.String.ToString(), IsHidden = true });
                g.Column.Add(new GridColumn { Field = "AirlineSNo", Title = "AirlineSNo", DataType = GridDataType.String.ToString(), IsHidden = true });
                g.Column.Add(new GridColumn { Field = "AirlineName", IsLocked = false, Title = "AIRLINE NAME", Template = "<sapn title=\"#= AirlineName #\">#= AirlineName #</span>", DataType = GridDataType.String.ToString() });
                g.Column.Add(new GridColumn { Field = "RateAirlineCustomChargesSNo", Title = "RateAirlineCustomChargesSNo", DataType = GridDataType.String.ToString(), IsHidden = true });
                g.Column.Add(new GridColumn { Field = "ChargeName", IsLocked = false, Title = "CHARGE NAMES", DataType = GridDataType.String.ToString() });
                g.Column.Add(new GridColumn { Field = "Amount", IsLocked = false, Title = "AMOUNT", DataType = GridDataType.String.ToString(), Template = "<input type=\"text\" id=\"txtCustomAmount\" value=\"#=Amount#\" ondrop=\"return false;\" onpaste=\"return false;\" onkeypress=\"return ValidateFloatKeyPress(this,event)\" style=\"width:30%;\" maxlength=\"8\" onchange=\"GetRFSCustomChargesByAmount(this)\" />" });

                g.Column.Add(new GridColumn { Field = "TaxType", IsLocked = false, Title = "Tax", Template = "<sapn title=\"#= TaxType #\" style=\"font-weight:bold;\">#= TaxType #</span>", DataType = GridDataType.String.ToString() });

                g.Column.Add(new GridColumn { Field = "TaxAmount", IsLocked = false, Title = "TAX AMOUNT", DataType = GridDataType.String.ToString(), Template = "<input type=\"text\" id=\"txtCustomTaxAmount\" value=\"#=TaxAmount#\" ondrop=\"return false;\" onpaste=\"return false;\"  disabled=\"disabled;\" style=\"width:30%;\" maxlength=\"8\" />" });

                g.Column.Add(new GridColumn { Field = "TotalAmount", IsLocked = false, Title = "TOTAL AMOUNT", DataType = GridDataType.String.ToString(), Template = "<input type=\"text\" id=\"txtCustomTotalAmount\" value=\"#=TotalAmount#\" ondrop=\"return false;\" onpaste=\"return false;\"  disabled=\"disabled;\" style=\"width:30%;\" maxlength=\"8\" />" });

                g.Column.Add(new GridColumn { Field = "HdnTotalAmount", Title = "HdnTotalAmount", DataType = GridDataType.String.ToString(), IsHidden = true });
                g.Column.Add(new GridColumn { Field = "HdnTaxAmount", Title = "HdnTaxAmount", DataType = GridDataType.String.ToString(), IsHidden = true });
                g.Column.Add(new GridColumn { Field = "RateAirlineMasterSNo", Title = "RateAirlineMasterSNo", DataType = GridDataType.String.ToString(), IsHidden = true });
                g.Column.Add(new GridColumn { Field = "TruckRatesTax", Title = "TruckRatesTax", DataType = GridDataType.String.ToString(), IsHidden = true });
                g.ExtraParam = new List<GridExtraParam>();
                g.ExtraParam.Add(new GridExtraParam { Field = "RFSTruckDetailsSNo", Value = RFSTruckDetailsSNo });
                g.InstantiateIn(Container);
            }
        }

        public DataSourceResult GetRFSCustomChargesGridData(String RFSTruckDetailsSNo, int skip, int take, int page, int pageSize, List<SoftwareFactory.Data.GridSort> sort, SoftwareFactory.Data.GridFilter filter)
        {
            string sorts = GridSort.ProcessSorting(sort);
            string ProcName = "";
            DataSet ds = new DataSet();
            ProcName = "GetRFSCustomChargesGridData";
            SqlParameter[] Parameters = { new SqlParameter("@RFSTruckDetailsSNo", RFSTruckDetailsSNo), new SqlParameter("@LoggedInCity", ((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).CityCode.ToString()) };

            ds = SqlHelper.ExecuteDataset(DMLConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, ProcName, Parameters);
            var rfsList = ds.Tables[0].AsEnumerable().Select(e => new RFSCustomChargesModel
            {
                RFSTruckDetailsSNo = Convert.ToInt32(e["RFSTruckDetailsSNo"]),
                AirlineSNo = Convert.ToInt32(e["AirlineSNo"]),
                AirlineName = Convert.ToString(e["AirlineName"]),
                RateAirlineCustomChargesSNo = Convert.ToInt32(e["RateAirlineCustomChargesSNo"]),
                ChargeName = e["Charge_Name"].ToString(),
                Amount = Convert.ToDecimal(e["Amount"]),
                TotalAmount = Convert.ToDecimal(e["TotalAmount"]),
                HdnTotalAmount = Convert.ToDecimal(e["TotalAmount"]),
                HdnTaxAmount = Convert.ToDecimal(e["TaxAmount"]),
                TaxAmount = Convert.ToDecimal(e["TaxAmount"]),
                TaxType = e["TaxType"].ToString(),
                TruckRatesTax = e["TruckRatesTax"].ToString(),
                RateAirlineMasterSNo = Convert.ToInt32(e["RateAirlineMasterSNo"])
            });
            ds.Dispose();
            return new DataSourceResult
            {
                Data = rfsList.AsQueryable().ToList(),
                Total = Convert.ToInt32(ds.Tables[1].Rows[0][0].ToString()),
                StoredProcedure = ProcName
            };
        }

        public string GetTruckDetails(string DailyFlightSNo)
        {
            SqlParameter[] Parameters = { new SqlParameter("@DailyFlightSNo", DailyFlightSNo) };
            DataSet ds = SqlHelper.ExecuteDataset(DMLConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, "GetTruckDetails", Parameters);
            ds.Dispose();
            return CargoFlash.Cargo.Business.Common.CompleteDStoJSON(ds);
        }

        public string GetChargeValue(int TariffSNo, int AWBSNo, string CityCode, int PValue, int SValue, int HAWBSNo, int ProcessSNo, int SubProcessSNo, decimal GrWT, decimal ChWt, int Pieces, List<RFSShipmentInfo> lstShipmentInfo)
        {
            DataTable dtShipmentInfo = CollectionHelper.ConvertTo(lstShipmentInfo, "");
            BaseBusiness baseBusiness = new BaseBusiness();
            SqlParameter[] param = 
            {
                 new SqlParameter("@AwbSNo", AWBSNo),
                 new SqlParameter("@CityCode", CityCode),
                 new SqlParameter("@MovementType", "0"),
                 new SqlParameter("@ShipmentType", "0"),
                 new SqlParameter("@HAWBSNo", 0),
                 new SqlParameter("@PageSize", 99999),
                 new SqlParameter("@WhereCondition", ""),
                 new SqlParameter("@ProcessSNo", ProcessSNo),
                 new SqlParameter("@SubProcessSNo", SubProcessSNo),
                 new SqlParameter("@ArrivedShipmentSNo", 0),
                 new SqlParameter("@DOSNo", 0),
                 new SqlParameter("@PDSNo", 0),
                 new SqlParameter("@RateType", 0),
                 new SqlParameter("@ChargeType", 0),
                 new SqlParameter("@TerminalSNo", ((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).TerminalSNo),
                 new SqlParameter("@TariffSNo", TariffSNo),
                 new SqlParameter("@PrimaryValue", PValue),
                 new SqlParameter("@SecondaryValue", SValue),
                 new SqlParameter("@TaxReturn", 0),
                 new SqlParameter("@IsMandatory", 0),
                 new SqlParameter("@IsESS", 0),
                 new SqlParameter("@GrWT", GrWT),
                 new SqlParameter("@VolWt", 0),
                 new SqlParameter("@ChWt", ChWt),
                 new SqlParameter("@Pieces", Pieces),
                 new SqlParameter("@Remarks", ""),
                 new SqlParameter("@PartShipmentType",dtShipmentInfo)
            };
            try
            {
                DataSet ds = new DataSet();
                ds = SqlHelper.ExecuteDataset(ReadConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, "getHandlingChargesIEInbound", param);
                ds.Dispose();
                return CargoFlash.Cargo.Business.Common.CompleteDStoJSON(ds);
            }
            catch (Exception ex)
            {
                return ex.Message;
            }
        }


        /// <summary>
        /// Bind RFS Charges Information
        /// </summary>
        /// <param name="RFSTruckDetailsSNo"></param>
        /// <returns></returns>
        public string BindRFSChargesInformation(string RFSTruckDetailsSNo)
        {
            DataSet ds = new DataSet();
            try
            {
                SqlParameter[] Parameters = { new SqlParameter("@RFSTruckDetailsSNo", RFSTruckDetailsSNo) };
                ds = SqlHelper.ExecuteDataset(DMLConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, "BindRFSChargesInformation", Parameters);
                ds.Dispose();
            }
            catch (Exception) { }
            return CargoFlash.Cargo.Business.Common.CompleteDStoJSON(ds);
        }

        public string GetRFSFreightChargesByPosition(string RateAirlineMasterSNo, string ChargeableUnit, string ObjVal, string Amount)
        {
            DataSet ds = new DataSet();
            try
            {
                SqlParameter[] Parameters = { new SqlParameter("@RateAirlineMasterSNo", RateAirlineMasterSNo), new SqlParameter("@NoOfUnits", ChargeableUnit), new SqlParameter("@ObjVal", ObjVal), new SqlParameter("@Amount", Amount) };
                ds = SqlHelper.ExecuteDataset(DMLConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, "getRFSFreightCharge", Parameters);
                ds.Dispose();
            }
            catch (Exception) { }
            return CargoFlash.Cargo.Business.Common.CompleteDStoJSON(ds);
        }

        public string GetRFSCustomChargesByAmount(string RateAirlineMasterSNo, string RateAirlineCustomChargesSNo, string Amount)
        {
            DataSet ds = new DataSet();
            try
            {
                SqlParameter[] Parameters = { new SqlParameter("@RateAirlineMasterSNo", RateAirlineMasterSNo), new SqlParameter("@RateAirlineCustomChargesSNo", RateAirlineCustomChargesSNo), new SqlParameter("@Amount", Amount) };
                ds = SqlHelper.ExecuteDataset(DMLConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, "getRFSCustomCharge", Parameters);
                ds.Dispose();
            }
            catch (Exception) { }
            return CargoFlash.Cargo.Business.Common.CompleteDStoJSON(ds);
        }

        public string BindRFSChagesAmountInformation(string RFSTruckDetailsSNo)
        {
            DataSet ds = new DataSet();
            try
            {
                SqlParameter[] Parameters = { new SqlParameter("@RFSTruckDetailsSNo", RFSTruckDetailsSNo) };
                ds = SqlHelper.ExecuteDataset(DMLConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, "BindRFSChagesAmountInformation", Parameters);
                ds.Dispose();
            }
            catch (Exception) { }
            return CargoFlash.Cargo.Business.Common.CompleteDStoJSON(ds);
        }

        /// <summary>
        /// Save RFS Charges
        /// </summary>
        /// <param name="RFSChargesDetails"></param>
        /// <param name="RFSCustomChargesDetails"></param>
        /// <param name="RFSHandlingCharges"></param>
        /// <param name="BillTo"></param>
        /// <param name="BillToSno"></param>
        /// <param name="AirportCode"></param>
        /// <param name="PaymentMode"></param>
        /// <returns></returns>
        public string SaveRFSChargesDetails(List<RFSChargesDetails> RFSChargesDetails, List<RFSCustomChargesDetails> RFSCustomChargesDetails, List<RFSHandlingCharges> RFSHandlingCharges, string BillTo, string BillToSno, string AirportCode, string PaymentMode, string BillToDockingVendor)
        {
            DataTable dtRFSChargesDetails = CollectionHelper.ConvertTo(RFSChargesDetails, "");
            //BaseBusiness baseBusiness = new BaseBusiness();
            SqlParameter paramRFSChargesDetails = new SqlParameter();
            paramRFSChargesDetails.ParameterName = "@RFSChargesDetailsType";
            paramRFSChargesDetails.SqlDbType = System.Data.SqlDbType.Structured;
            paramRFSChargesDetails.Value = dtRFSChargesDetails;

            DataTable dtRFSCustomChargesDetails = CollectionHelper.ConvertTo(RFSCustomChargesDetails, "");
            SqlParameter paramRFSCustomChargesDetails = new SqlParameter();
            paramRFSCustomChargesDetails.ParameterName = "@RFSCustomChargesDetails";
            paramRFSCustomChargesDetails.SqlDbType = System.Data.SqlDbType.Structured;
            paramRFSCustomChargesDetails.Value = dtRFSCustomChargesDetails;

            DataTable dtRFSHandlingChargesDetails = CollectionHelper.ConvertTo(RFSHandlingCharges, "");
            SqlParameter paramRFSHandlingChargesDetails = new SqlParameter();
            paramRFSHandlingChargesDetails.ParameterName = "@RFSHandlingCharge";
            paramRFSHandlingChargesDetails.SqlDbType = System.Data.SqlDbType.Structured;
            paramRFSHandlingChargesDetails.Value = dtRFSHandlingChargesDetails;

            DataSet ds = new DataSet();
            SqlParameter[] Parameters = { paramRFSChargesDetails, paramRFSCustomChargesDetails, paramRFSHandlingChargesDetails, new SqlParameter("@BillTo", BillTo),
                                             new SqlParameter("@BillToSno", BillToSno),new SqlParameter("@AirportCode", AirportCode), new SqlParameter("@CityCode", ((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).CityCode.ToString()), new SqlParameter("@CreatedBy", Convert.ToInt32(((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).UserSNo.ToString())), new SqlParameter("@MovementType", 2), new SqlParameter("@PaymentMode", PaymentMode), new SqlParameter("@BillToDockingVendor", BillToDockingVendor) };
            try
            {
                ds = SqlHelper.ExecuteDataset(DMLConnectionString.WebConfigConnectionString, "SaveRFSChargesDetails", Parameters);
                return ds.Tables[ds.Tables.Count - 1].Rows[0][0].ToString();
            }
            catch (Exception ex)
            {
                return ex.Message;
            }
        }

        /// <summary>
        /// Get Agent Information
        /// </summary>
        /// <param name="RFSTruckDetailsSNo"></param>
        /// <returns></returns>
        public string GetAgentInformation(string RFSTruckDetailsSNo)
        {
            DataSet ds = new DataSet();
            try
            {
                SqlParameter[] Parameters = { new SqlParameter("@RFSTruckDetailsSNo", RFSTruckDetailsSNo) };
                ds = SqlHelper.ExecuteDataset(DMLConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, "GetAgentInformation", Parameters);
                ds.Dispose();
            }
            catch (Exception) { }
            return CargoFlash.Cargo.Business.Common.CompleteDStoJSON(ds);
        }

        /// <summary>
        /// Get RFS Handling Details
        /// </summary>
        /// <param name="RFSTruckDetailsSNo"></param>
        /// <param name="ChargeSNo"></param>
        /// <param name="InvoiceType"></param>
        /// <returns></returns>
        public string GetRFSHandlingDetails(string RFSTruckDetailsSNo, string SNo, string Type)
        {
            DataSet ds = new DataSet();
            try
            {
                SqlParameter[] Parameters = { new SqlParameter("@RFSTruckDetailsSNo", RFSTruckDetailsSNo), new SqlParameter("@SNo", SNo), new SqlParameter("@Type", Type) };
                ds = SqlHelper.ExecuteDataset(DMLConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, "GetRFSHandlingDetails", Parameters);
                ds.Dispose();
            }
            catch (Exception) { }
            return CargoFlash.Cargo.Business.Common.CompleteDStoJSON(ds);
        }

        /// <summary>
        /// Print Pre-Manifest
        /// </summary>
        /// <param name="DailyFlightSNo"></param>
        /// <param name="RFSTruckDetailsSNo"></param>
        /// <returns></returns>
        public Stream PrintPreManifest(string DailyFlightSNo, string RFSTruckDetailsSNo)
        {
            DataSet ds = new DataSet();
            SqlParameter[] Parameters = { new SqlParameter("@DailyFlightSNo", DailyFlightSNo), new SqlParameter("@RFSTruckDetailsSNo", RFSTruckDetailsSNo) };
            ds = SqlHelper.ExecuteDataset(DMLConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, "GetPrintPreManifestRecord", Parameters);
            ds.Dispose();

            StringBuilder tbl = new StringBuilder();
            if (ds != null && ds.Tables[0].Rows.Count > 0)
            {
                tbl.Append("<table id=\"tblReport\" align=\"center\" style=\"border: 1px solid black;'\" width=\"99%\" cellpadding=\"0\" cellspacing=\"0\">");
                tbl.Append("<tr align=\"right\"><td colspan=\"9\" ><span  style=\"font-size:15px;margin-right:10px;font-weight:bold;color:#6d6864;\">" + ds.Tables[3].Rows[0]["ManifestedTime"].ToString() + "</span></td></tr>");
                tbl.Append("<tr align=\"right\"><td colspan=\"9\" ><span  id=\"pageNo\" style=\"font-size:15px;margin-right:10px;font-weight:bold;color:#6d6864;\"></span></td></tr>");
                tbl.Append("<tr align=\"center\"><td colspan=\"9\" ><b style=\"font-size:20px;color:#6d6864;\">CARGO MANIFEST</b></td></tr>");
                tbl.Append("<tr align=\"center\"><td colspan=\"9\" style=\"font-size:12px;color:#6d6864;\">ICAO ANNEX 9 APPENDIX 3</td></tr>");
                tbl.Append("<tr align=\"center\"><td colspan=\"9\" >&nbsp;</td></tr>");
                tbl.Append("<tr align=\"center\"><td colspan=\"9\" ><hr/></td></tr>");
                tbl.Append("<tr align=\"center\"><td colspan=\"2\" align=\"left\" style=\"padding-left:10px;\">Airline :</td><td colspan=\"2\" align=\"left\" style=\"font-weight:bold;\" >" + ds.Tables[2].Rows[0]["AirlineName"].ToString() + "</td><td colspan=\"2\" align=\"left\" >Truck Date :</td><td colspan=\"2\" align=\"left\" style=\"font-weight:bold;\" >" + Convert.ToDateTime(ds.Tables[2].Rows[0]["TruckDate"]).ToString("dd-MMM-yy") + "</td><td colspan=\"3\" >&nbsp;</td></tr>");
                tbl.Append("<tr align=\"center\"><td colspan=\"2\" align=\"left\" style=\"padding-left:10px;\">Flight Number :</td><td align=\"left\" colspan=\"2\" style=\"font-weight:bold;\" >" + ds.Tables[0].Rows[0]["FlightNo"].ToString() + "</td><td align=\"left\" colspan=\"2\">Flight Date :</td><td align=\"left\" colspan=\"2\" style=\"font-weight:bold;\">" + Convert.ToDateTime(ds.Tables[0].Rows[0]["FlightDate"]).ToString("dd-MMM-yy") + "</td><td colspan=\"3\" >&nbsp;</td></tr>");
                tbl.Append("<tr align=\"center\"><td colspan=\"2\" align=\"left\" style=\"padding-left:10px;\">Point Of Loading :</td><td colspan=\"2\" align=\"left\" style=\"font-weight:bold;\">" + ds.Tables[0].Rows[0]["FlightOrigin"].ToString() + "</td><td colspan=\"2\" align=\"left\">Point Of Unloading :</td><td colspan=\"2\" align=\"left\" style=\"font-weight:bold;\">" + ds.Tables[0].Rows[0]["FlightDestination"].ToString() + "</td><td colspan=\"3\" >&nbsp;</td></tr>");

                tbl.Append("<tr align=\"center\"><td colspan=\"9\" ><hr/></td></tr>");

                tbl.Append("<tr align=\"center\"><td colspan=\"2\" align=\"left\" style=\"padding-left:10px;\">Truck Registration Nbr : </td><td colspan=\"2\" align=\"left\" style=\"font-weight:bold;\">" + ds.Tables[2].Rows[0]["TruckRegistrationNo"].ToString() + "</td><td align=\"left\" colspan=\"2\">Seal Nbr :</td><td align=\"left\" colspan=\"2\" style=\"font-weight:bold;\">" + ds.Tables[2].Rows[0]["SealNo"] + "</td><td colspan=\"3\" >&nbsp;</td></tr>");

                tbl.Append("<tr align=\"center\"><td colspan=\"2\" align=\"left\" style=\"padding-left:10px;\">Driver Name :</td><td colspan=\"2\" align=\"left\" style=\"font-weight:bold;\">" + ds.Tables[2].Rows[0]["DriverName"] + "</td><td colspan=\"2\" align=\"left\">Trucked By : </td><td colspan=\"2\" align=\"left\" style=\"font-weight:bold;\">" + ds.Tables[2].Rows[0]["TruckedBy"] + "</td><td colspan=\"3\" >&nbsp;</td></tr>");

                tbl.Append("<tr align=\"center\"><td colspan=\"9\" ><hr/></td></tr>");
                tbl.Append("<tr align=\"center\"><td colspan=\"9\" style=\"font-size:15px;color:#6d6864;\" >Surface Transportation as per IATA Resolution 507 B</td></tr>");

                tbl.Append("<tr align=\"center\"><td colspan=\"9\" >&nbsp;</td></tr>");

                tbl.Append("<tr align=\"center\" style=\"height:50px;border: 1px solid black;'\"><td colspan=\"4\" style=\"border: 1px solid black;'\" >Pallet/ULD No</br>Local Transit</td><td colspan=\"5\" style=\"border: 1px solid black;\">For use by owner/operator</td></tr>");

                tbl.Append("<tr align=\"center\"><td colspan=\"1\" class=\"grdTableHeader\">No</td><td colspan=\"1\" class=\"grdTableHeader\"> Air Waybill and part No</td><td colspan=\"1\" class=\"grdTableHeader\">No of Pieces</td><td colspan=\"1\" class=\"grdTableHeader\">Nature of Goods</td><td colspan=\"1\" class=\"grdTableHeader\">Gross Weight</td><td colspan=\"1\" class=\"grdTableHeader\">ORI/DES</td><td colspan=\"1\" class=\"grdTableHeader\">Priority</td><td colspan=\"1\" class=\"grdTableHeader\">Remarks</td><td colspan=\"1\" class=\"grdTableHeader\">Office Use</td></tr>");

                DataTable dtDistinctULD = null;
                dtDistinctULD = ds.Tables[0].DefaultView.ToTable(true, "ULDType");
                foreach (DataRow drDistinctULD in dtDistinctULD.Rows)
                {
                    int pieces = 0;
                    decimal Weight = 0.00M;

                    DataRow[] drRpt = ds.Tables[0].Select("ULDType='" + drDistinctULD["ULDType"] + "'");
                    DataRow[] drLocal = ds.Tables[0].Select("ULDType='" + drDistinctULD["ULDType"] + "' AND ULDSTATUS='LOCAL'");
                    DataRow[] drTrans = ds.Tables[0].Select("ULDType='" + drDistinctULD["ULDType"] + "' AND ULDSTATUS='TRANSIT'");

                    if (drRpt.Length > 0)
                    {
                        foreach (DataRow dr in drRpt)
                        {
                            pieces = (pieces == 0 ? Convert.ToInt32(dr["PlannedPieces"].ToString()) : pieces + Convert.ToInt32(dr["PlannedPieces"].ToString()));
                            Weight = (Weight == 0 ? Convert.ToDecimal(dr["PlannedGrossWeight"].ToString()) : Convert.ToDecimal(Weight) + Convert.ToDecimal(dr["PlannedGrossWeight"].ToString()));
                        }
                        tbl.Append("<tr align=\"left\" class=\"grdTableRow\"><td colspan=\"9\" >" + drDistinctULD["ULDType"] + "</td></tr>");
                        if (drLocal.Length > 0)
                        {
                            int j = 1;
                            foreach (DataRow dr in drLocal)
                            {
                                if (j == 1)
                                {
                                    tbl.Append("<tr align=\"left\"  class=\"grdTableRow\"><td colspan=\"9\" >COMMERCIAL CARGO/LOCAL CARGO</td></tr>");
                                }
                                tbl.Append("<tr align=\"center\"  class=\"grdTableRow\"><td colspan=\"1\" style=\"width:20px;\" >" + j.ToString() + "</td><td colspan=\"1\" >" + dr["AWBNo"] + "</td><td colspan=\"1\" >" + dr["RPTPIECES"] + "</td><td colspan=\"1\" >" + dr["NatureOfGoods"] + "</td><td colspan=\"1\">" + dr["PlannedGrossWeight"].ToString() + "</td><td colspan=\"1\" >" + dr["AWBSector"] + "</td><td colspan=\"1\" >" + dr["Priority"] + "</td><td colspan=\"1\" >" + dr["SPHC"] + "</td><td colspan=\"1\"></td></tr>");
                                j++;
                            }
                        }
                        if (drTrans.Length > 0)
                        {
                            int k = 1;
                            foreach (DataRow dr in drTrans)
                            {
                                if (k == 1)
                                {
                                    tbl.Append("<tr align=\"left\"  class=\"grdTableRow\"><td colspan=\"9\" >COMMERCIAL CARGO/TRANSIT</td></tr>");
                                }
                                tbl.Append("<tr align=\"center\"  class=\"grdTableRow\"><td colspan=\"1\" style=\"width:20px;\" >" + k.ToString() + "</td><td colspan=\"1\" >" + dr["AWBNo"] + "</td><td colspan=\"1\" >" + dr["RPTPIECES"] + "</td><td colspan=\"1\" >" + dr["NatureOfGoods"] + "</td><td colspan=\"1\">" + dr["PlannedGrossWeight"].ToString() + "</td><td colspan=\"1\" >" + dr["AWBSector"] + "</td><td colspan=\"1\" >" + dr["Priority"] + "</td><td colspan=\"1\" >" + dr["SPHC"] + "</td><td colspan=\"1\"></td></tr>");
                                k++;
                            }
                        }
                        tbl.Append("<tr align=\"center\"  class=\"grdTableRow\"><td colspan=\"1\" >&nbsp;</td><td colspan=\"1\" ><b>Total</b></td><td colspan=\"1\" ><b>" + pieces.ToString() + "</b></td><td colspan=\"1\" >&nbsp;</td><td colspan=\"1\"><b>" + Weight.ToString() + "</b></td><td colspan=\"1\" >&nbsp;</td><td colspan=\"1\" >&nbsp;</td><td colspan=\"1\">&nbsp;</td><td colspan=\"1\">&nbsp;</td></tr>");
                    }
                }
                tbl.Append("<tr align=\"left\" class=\"grdTableRow\"><td colspan=\"2\"><b>No of AWB : " + ds.Tables[1].Rows[0]["AWBCount"].ToString() + "</b></td><td colspan=\"2\"><b>Total Pieces : " + ds.Tables[1].Rows[0]["TotalPlannedPieces"].ToString() + "</b></td><td colspan=\"8\"><b>Total Gross Weight : " + ds.Tables[1].Rows[0]["TotalPlannedGrossWeight"].ToString() + "</b></td></tr>");
                tbl.Append("<tr align=\"center\" style=\"height:50px;border: 1px solid black;'\"><td colspan=\"9\" style=\"border: 1px solid black;height:100px;'\" >Customs Stamp</td></tr>");
                tbl.Append("<tr align=\"right\"  class=\"grdTableRow\"  id=\"PrintTr\"><td colspan=\"9\" ><input id=\"btnPrint\" type=\"button\" value=\"Print\" class=\"no-print\" style=\"border: 1px solid #5a7570;background:#2f6379;color:#fff;\" /></td></tr>");
                tbl.Append("<tr><td colspan=\"9\" >&nbsp;</td></tr>");
                tbl.Append("<tr><td colspan=\"9\" >&nbsp;</td></tr>");
                tbl.Append("</table>");
            }
            byte[] resultBytes = Encoding.UTF8.GetBytes(tbl.ToString());
            WebOperationContext.Current.OutgoingResponse.ContentType = "text/html";
            return new MemoryStream(resultBytes);
        }

        /// <summary>
        /// Get ULD Count
        /// </summary>
        /// <param name="DailyFlightSNo"></param>
        /// <returns></returns>
        public string GetULDCount(string DailyFlightSNo, string RFSTruckDetailsSNo)
        {
            DataSet ds = new DataSet();
            try
            {
                SqlParameter[] Parameters = { new SqlParameter("@DailyFlightSNo", DailyFlightSNo), new SqlParameter("@RFSTruckDetailsSNo", RFSTruckDetailsSNo), new SqlParameter("@ProcessFrom", "PAGE") };
                ds = SqlHelper.ExecuteDataset(DMLConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, "GetULDCount", Parameters);
                ds.Dispose();
            }
            catch (Exception) { }
            return CargoFlash.Cargo.Business.Common.CompleteDStoJSON(ds);
        }

        public string RFSSaveManifest(string RFSTruckDetailsSNo, string UWS)
        {
            DataSet ds = new DataSet();
            try
            {
                SqlParameter[] Parameters = { new SqlParameter("@RFSTruckDetailsSNo", RFSTruckDetailsSNo), new SqlParameter("@UWS", UWS), new SqlParameter("@UpdatedBy", ((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).UserSNo.ToString()), new SqlParameter("@LoginAirportSNo", ((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).AirportSNo.ToString()) };
                ds = SqlHelper.ExecuteDataset(DMLConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, "RFSSaveManifest", Parameters);
                ds.Dispose();
            }
            catch (Exception) { }
            return CargoFlash.Cargo.Business.Common.CompleteDStoJSON(ds);
        }

        public string GetRFSMendatoryCharges(int AWBSNo, string CityCode, int HAWBSNo, int ProcessSNo, int SubProcessSNo, decimal GrWT, decimal ChWt, int Pieces, List<RFSShipmentInfo> lstShipmentInfo)
        {
            DataTable dtShipmentInfo = CollectionHelper.ConvertTo(lstShipmentInfo, "");
            BaseBusiness baseBusiness = new BaseBusiness();
            SqlParameter[] param = 
            {
                 new SqlParameter("@AwbSNo", AWBSNo),
                 new SqlParameter("@CityCode", CityCode),
                 new SqlParameter("@MovementType", "0"),
                 new SqlParameter("@ShipmentType", "0"),
                 new SqlParameter("@HAWBSNo", 0),
                 new SqlParameter("@PageSize", 99999),
                 new SqlParameter("@WhereCondition", ""),
                 new SqlParameter("@ProcessSNo", ProcessSNo),
                 new SqlParameter("@SubProcessSNo", SubProcessSNo),
                 new SqlParameter("@ArrivedShipmentSNo", 0),
                 new SqlParameter("@DOSNo", 0),
                 new SqlParameter("@PDSNo", 0),
                 new SqlParameter("@RateType", 0),
                 new SqlParameter("@ChargeType", 0),
                 new SqlParameter("@TerminalSNo", ((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).TerminalSNo),
                 new SqlParameter("@TariffSNo", 0),
                 new SqlParameter("@PrimaryValue", 0),
                 new SqlParameter("@SecondaryValue", 0),
                 new SqlParameter("@TaxReturn", 0),
                 new SqlParameter("@IsMandatory", 0),
                 new SqlParameter("@IsESS", 0),
                 new SqlParameter("@GrWT", GrWT),
                 new SqlParameter("@VolWt", 0),
                 new SqlParameter("@ChWt", ChWt),
                 new SqlParameter("@Pieces", Pieces),
                 new SqlParameter("@Remarks", ""),
                 new SqlParameter("@PartShipmentType",dtShipmentInfo)
            };
            try
            {
                DataSet ds = new DataSet();
                ds = SqlHelper.ExecuteDataset(ReadConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, "getHandlingChargesIEInbound", param);
                ds.Dispose();
                return CargoFlash.Cargo.Business.Common.CompleteDStoJSON(ds);
            }
            catch (Exception ex)
            {
                return ex.Message;
            }
        }

        public string GetBillingInformation(string RFSTruckDetailsSNo)
        {
            DataSet ds = new DataSet();
            try
            {
                SqlParameter[] Parameters = { new SqlParameter("@RFSTruckDetailsSNo", RFSTruckDetailsSNo) };
                ds = SqlHelper.ExecuteDataset(DMLConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, "GetBillingInformation", Parameters);
                ds.Dispose();
            }
            catch (Exception) { }
            return CargoFlash.Cargo.Business.Common.CompleteDStoJSON(ds);
        }

        public string GetVendorApplicableForHiringCharges(int AccountSNo)
        {
            DataSet ds = new DataSet();
            try
            {
                SqlParameter[] Parameters = { new SqlParameter("@AccountSNo", AccountSNo) };
                ds = SqlHelper.ExecuteDataset(DMLConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, "RFS_GetVendorApplicableForHiringCharges", Parameters);
                ds.Dispose();
            }
            catch (Exception) { }
            return CargoFlash.Cargo.Business.Common.CompleteDStoJSON(ds);
        }

        public string GetVendorCreditLimitInformation(string AccountSNo)
        {
            DataSet ds = new DataSet();
            try
            {
                SqlParameter[] Parameters = { new SqlParameter("@AccountSNo", AccountSNo) };
                ds = SqlHelper.ExecuteDataset(DMLConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, "GetVendorCreditLimitInformation", Parameters);
                ds.Dispose();
            }
            catch (Exception) { }
            return CargoFlash.Cargo.Business.Common.CompleteDStoJSON(ds);
        }

        public string RemoveRFSAssignFlightDetails(string RFSTruckDetailsSNo)
        {
            SqlParameter[] Parameters = { new SqlParameter("@RFSTruckDetailsSNo", RFSTruckDetailsSNo) };
            DataSet ds = SqlHelper.ExecuteDataset(DMLConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, "RemoveRFSAssignFlightDetails", Parameters);
            ds.Dispose();
            return CargoFlash.Cargo.Business.Common.CompleteDStoJSON(ds);
        }

        public string RFSCheckCreditLimit(int AccountSNo, decimal TotalAmount)
        {
            DataSet ds = new DataSet();
            try
            {
                SqlParameter[] Parameters = { new SqlParameter("@AccountSNo", AccountSNo), new SqlParameter("@TotalAmount", TotalAmount) };
                ds = SqlHelper.ExecuteDataset(DMLConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, "RFSCheckCreditLimit", Parameters);
                ds.Dispose();
            }
            catch (Exception) { }
            return CargoFlash.Cargo.Business.Common.CompleteDStoJSON(ds);
        }

        public string GetPettyCashVoucherPrint(string StartDate, string EndDate)
        {
            DataSet ds = new DataSet();
            try
            {
                SqlParameter[] Parameters = { new SqlParameter("@StartDate", StartDate), new SqlParameter("@EndDate", EndDate) };
                ds = SqlHelper.ExecuteDataset(DMLConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, "GetPettyCashVoucherPrint", Parameters);
                ds.Dispose();
            }
            catch (Exception) { }
            return CargoFlash.Cargo.Business.Common.CompleteDStoJSON(ds);
        }

        public string SaveRFSChargeFinalized(string RFSTruckDetailsSNo, string Chargesfinalized, string ChargesRemarks)
        {
            DataSet ds = new DataSet();
            SqlParameter[] Parameters = { new SqlParameter("@RFSTruckDetailsSNo", RFSTruckDetailsSNo), new SqlParameter("@Chargesfinalized", Chargesfinalized), new SqlParameter("@ChargesRemarks", ChargesRemarks) };
            try
            {
                ds = SqlHelper.ExecuteDataset(DMLConnectionString.WebConfigConnectionString, "SaveRFSChargeFinalized", Parameters);
                return ds.Tables[ds.Tables.Count - 1].Rows[0][0].ToString();
            }
            catch (Exception ex)
            {
                return ex.Message;
            }
        }

        public string GetRFSBulkDockingChargesFlag(string RFSTruckDetailsSNo)
        {
            DataSet ds = new DataSet();
            SqlParameter[] Parameters = { new SqlParameter("@RFSTruckDetailsSNo", RFSTruckDetailsSNo) };
            try
            {
                ds = SqlHelper.ExecuteDataset(DMLConnectionString.WebConfigConnectionString, "GetRFSBulkDockingChargesFlag", Parameters);
                return ds.Tables[ds.Tables.Count - 1].Rows[0][0].ToString();
            }
            catch (Exception ex)
            {
                return ex.Message;
            }
        }

        public string BindByDefaultBillToAgent(string TruckCarrierCode)
        {
            DataSet ds = new DataSet();
            try
            {
                SqlParameter[] Parameters = { new SqlParameter("@TruckCarrierCode", TruckCarrierCode) };
                ds = SqlHelper.ExecuteDataset(DMLConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, "BindByDefaultBillToAgent", Parameters);
                ds.Dispose();
            }
            catch (Exception) { }
            return CargoFlash.Cargo.Business.Common.CompleteDStoJSON(ds);
        }

        public string GetRFSCancelledRemarks(string RFSTruckDetailsSNo)
        {
            DataSet ds = new DataSet();
            try
            {
                SqlParameter[] Parameters = { new SqlParameter("@RFSTruckDetailsSNo", RFSTruckDetailsSNo) };
                ds = SqlHelper.ExecuteDataset(DMLConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, "GetRFSCancelledRemarks", Parameters);
                ds.Dispose();
            }
            catch (Exception) { }
            return CargoFlash.Cargo.Business.Common.CompleteDStoJSON(ds);
        }

        public string GetDriverDetails(string DriverMasterSNo)
        {
            DataSet ds = new DataSet();
            try
            {
                SqlParameter[] Parameters = { new SqlParameter("@DriverMasterSNo", DriverMasterSNo) };
                ds = SqlHelper.ExecuteDataset(DMLConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, "GetDriverDetails", Parameters);
                ds.Dispose();
            }
            catch (Exception) { }
            return CargoFlash.Cargo.Business.Common.CompleteDStoJSON(ds);
        }
    }
}