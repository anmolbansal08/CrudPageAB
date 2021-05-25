using CargoFlash.Cargo.Business;
using CargoFlash.Cargo.Model.Mail;
using CargoFlash.SoftwareFactory.Data;
using CargoFlash.SoftwareFactory.WebUI;
using CargoFlash.SoftwareFactory.WebUI.Adapters;
using CargoFlash.SoftwareFactory.WebUI.Controls;
using System;
using System.Collections.Generic;
using System.Configuration;
using System.Data;
using System.Data.SqlClient;
using System.IO;
using System.Linq;
using System.ServiceModel;
using System.ServiceModel.Activation;
using System.ServiceModel.Web;
using System.Text;
using System.Globalization;
using System.Net;

namespace CargoFlash.Cargo.DataService.Mail
{
    [GlobalErrorHandlerBehaviour(typeof(GlobalErrorHandler))]   [ServiceBehavior(IncludeExceptionDetailInFaults = true)]
    [AspNetCompatibilityRequirements(RequirementsMode = AspNetCompatibilityRequirementsMode.Allowed)]
    public class AirMailManifestService : BaseWebUISecureObject, IAirMailManifestService
    {
        public Stream GetWebForm(string processName, string moduleName, string appName, string formAction, string IsSubModule)
        {
            return BuildWebForm(processName, moduleName, appName, formAction, "", (IsSubModule == "1"));
        }

        public Stream GetAirMailGridData(string processName, string moduleName, string appName, string FlightNo, string FlightDate, string Origin, string Destination, string OffPoint, string FlightStatus, string GroupFlightSNo)
        {
            return BuildWebForm(processName, moduleName, appName, "IndexView", FlightNo: FlightNo, FlightDate: FlightDate, Origin: Origin, Destination: Destination, OffPoint: OffPoint, FlightStatus: FlightStatus, GroupFlightSNo: GroupFlightSNo);
        }

        private Stream BuildWebForm(string processName, string moduleName, string appName, string formAction, string recordID = "", bool IsSubModule = true, string FlightNo = "0", string FlightDate = "", string Origin = "0", string Destination = "0", string OffPoint = "0", string FlightStatus = "0", string GroupFlightSNo = "")
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
                        case "AIRMAILMANIFEST":
                            if (appName.ToUpper().Trim() == "SEARCHMAIL")
                                CreateAirMailGrid(myCurrentForm, processName, FlightNo, FlightDate, Origin, Destination, OffPoint, FlightStatus);
                            else if (appName.ToUpper().Trim() == "SEARCHRECORD")
                                CreateAirMailRecordGrid(myCurrentForm, processName, GroupFlightSNo);
                            else if (appName.ToUpper().Trim() == "SEARCHLYINGLIST")
                                CreateAirMailLyingListGrid(myCurrentForm, processName, GroupFlightSNo);
                            break;
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

        private void CreateAirMailGrid(StringBuilder Container, string ProcessName, string FlightNo = "0", string FlightDate = "", string Origin = "0", string Destination = "0", string OffPoint = "0", string FlightStatus = "0")
        {
            try
            {
                using (Grid g = new Grid())
                {
                    g.Height = 100;
                    g.PageName = this.MyPageName;
                    g.PrimaryID = this.MyPrimaryID;
                    g.ModuleName = this.MyModuleID;
                    g.AppsName = this.MyAppID;
                    g.IsDisplayOnly = true;
                    g.DefaultPageSize = 5;
                    g.IsAllowCopy = false;
                    g.DataSoruceUrl = "Services/Mail/AirMailManifestService.svc/GetAirMailDetailsGridData";
                    g.NewURL = MyPageName + "?" + GetWebURLString("New", false);
                    g.ServiceModuleName = this.MyModuleID;
                    g.UserID = this.MyUserID;
                    g.FormCaptionText = "Flight Details";
                    g.IsPageable = true;
                    g.IsAllowedPaging = true;
                    g.IsProcessPart = true;
                    g.IsRowChange = false;
                    g.IsRowDataBound = false;
                    g.IsPageSizeChange = true;
                    g.IsPager = true;
                    g.IsOnlyTotalDisplay = true;
                    g.ProcessName = ProcessName;
                    g.IsVirtualScroll = false;
                    g.IsDisplayOnly = false;
                    g.IsActionRequired = false;
                    g.IsSortable = true;
                    g.IsAllowedFiltering = true;
                    g.IsVirtualScroll = false;
                    g.IsShowGridHeader = false;
                    g.Column = new List<GridColumn>();
                    g.Column.Add(new GridColumn { Field = "GroupFlightSNo", Title = "GroupFlightSNo", DataType = GridDataType.String.ToString(), IsHidden = true, Width = 40 });
                    g.Column.Add(new GridColumn { Field = "FlightNo", IsLocked = false, Title = "Flight No", DataType = GridDataType.String.ToString(), Width = 35 });
                    g.Column.Add(new GridColumn { Field = "FlightDate", Title = "Flight Date", IsHidden = false, DataType = GridDataType.Date.ToString(), Template = "# if( FlightDate==null) {# # } else {# #= kendo.toString(new Date(data.FlightDate.getTime() + data.FlightDate.getTimezoneOffset()*60000),\"" + UIDateTimeFormat.UIDateFormatString + "\") # #}#", Width = 80 });
                    g.Column.Add(new GridColumn { Field = "Origin", IsLocked = false, Title = "Origin City", DataType = GridDataType.String.ToString(), Width = 40 });
                    g.Column.Add(new GridColumn { Field = "Destination", IsLocked = false, Title = "Destination City", DataType = GridDataType.String.ToString(), Width = 40 });
                    g.Column.Add(new GridColumn { Field = "OffPoint", IsLocked = false, Title = "Off Point", DataType = GridDataType.String.ToString(), Width = 40 });
                    g.Column.Add(new GridColumn { Field = "FlightStatus", IsLocked = false, Title = "Flight Status", DataType = GridDataType.String.ToString(), Width = 40 });

                    g.ExtraParam = new List<GridExtraParam>();
                    g.ExtraParam.Add(new GridExtraParam { Field = "FlightNo", Value = FlightNo });
                    g.ExtraParam.Add(new GridExtraParam { Field = "FlightDate", Value = FlightDate });
                    g.ExtraParam.Add(new GridExtraParam { Field = "Origin", Value = Origin });
                    g.ExtraParam.Add(new GridExtraParam { Field = "Destination", Value = Destination });
                    g.ExtraParam.Add(new GridExtraParam { Field = "OffPoint", Value = OffPoint });
                    g.ExtraParam.Add(new GridExtraParam { Field = "FlightStatus", Value = FlightStatus });
                    g.InstantiateIn(Container);
                }
            }
            catch(Exception ex)//
            {
                throw ex;
            }
        }

        public DataSourceResult GetAirMailDetailsGridData(string FlightNo, string FlightDate, string Origin, string Destination, string OffPoint, string FlightStatus, int skip, int take, int page, int pageSize, List<SoftwareFactory.Data.GridSort> sort, SoftwareFactory.Data.GridFilter filter)
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

                ProcName = "POMailPreManifestGetList";

                string filters = GridFilter.ProcessFilters<AirMail>(filter);

                SqlParameter[] Parameters = { 
                                            new SqlParameter("@PageNo", page), 
                                            new SqlParameter("@PageSize", pageSize), 
                                            new SqlParameter("@WhereCondition", filters), 
                                            new SqlParameter("@OrderBy", sorts), 
                                            new SqlParameter("@FlightNo", FlightNo), 
                                            new SqlParameter("@FlightDate", FlightDate), 
                                            new SqlParameter("@Origin", Origin), 
                                            new SqlParameter("@Destination", Destination), 
                                            new SqlParameter("@OffPoint", OffPoint), 
                                            new SqlParameter("@FlightStatus", FlightStatus),
                                            new SqlParameter("@UserSNo", Convert.ToString(((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).UserSNo)),
                                        };

                ds = SqlHelper.ExecuteDataset((DMLConnectionString.WebConfigConnectionString), CommandType.StoredProcedure, ProcName, Parameters);

                var AirMailList = ds.Tables[0].AsEnumerable().Select(e => new AirMailPreManifestGrid
                {
                    GroupFlightSNo = e["GroupFlightSNo"].ToString(),
                    FlightNo = e["FlightNo"].ToString(),
                    FlightDate = e["FlightDate"] == DBNull.Value ? (DateTime?)null : DateTime.SpecifyKind(Convert.ToDateTime(e["FlightDate"]), DateTimeKind.Utc),
                    Origin = e["Origin"].ToString(),
                    Destination = e["Destination"].ToString(),
                    OffPoint = e["OffPoint"].ToString(),
                    FlightStatus = e["FlightStatus"].ToString(),
                });
                ds.Dispose();
                return new DataSourceResult
                {
                    Data = AirMailList.AsQueryable().ToList(),
                    Total = Convert.ToInt32(ds.Tables[1].Rows[0][0].ToString()),
                    FilterCondition = filters,
                    SortCondition = sorts,
                    StoredProcedure = ProcName
                };
            }
            catch(Exception ex)//
            {
                throw ex;
            }
        }

        private void CreateAirMailRecordGrid(StringBuilder Container, string ProcessName, string GroupFlightSNo)
        {
            try
            {
                using (NestedGrid g = new NestedGrid())
                {
                    g.Height = 300;
                    g.PageName = this.MyPageName;
                    g.PrimaryID = this.MyPrimaryID;
                    g.ModuleName = this.MyModuleID;
                    g.AppsName = this.MyAppID;
                    g.IsDisplayOnly = true;
                    g.DefaultPageSize = 100;
                    g.IsAutoHeight = true;
                    g.DataSoruceUrl = "Services/Mail/AirMailManifestService.svc/GetAirMailDetailsRecord";
                    g.PrimaryID = "SNo";
                    g.NewURL = MyPageName + "?" + GetWebURLString("New", false);
                    g.ModuleName = this.MyModuleID;
                    //g.FormCaptionText = "Air Mail Details";
                    g.ParentSuccessGrid = "ParentSuccessGrid";
                    g.IsFormHeader = false;
                    g.IsModule = true;
                    g.IsShowEdit = false;
                    g.IsSaveChanges = false;
                    g.IsAccordion = true;
                    g.IsToggleColumns = false;
                    g.IsColumnMenu = false;
                    //g.DetailCollapse = "detailCollapse";
                    //g.DetailExpand = "detailExpand";

                    g.Column = new List<GridColumn>();
                    g.Column.Add(new GridColumn { Field = "SNo", Title = "SNo", DataType = GridDataType.String.ToString(), IsHidden = true, Width = 40 });
                    g.Column.Add(new GridColumn { Field = "IsManifested", Title = "Select", DataType = GridDataType.String.ToString(), Width = 20, Template = "# if( IsManifested==\"1\"){#<input type=\"checkbox\" onclick=\"CheckParent(this);\" id=\"chkParent_#=SNo#\" checked=\"checked\" />#} else {#<input type=\"checkbox\" onclick=\"CheckParent(this);\" id=\"chkParent_#=SNo#\"/># }#" });
                    g.Column.Add(new GridColumn { Field = "CN38No", IsLocked = false, Title = "CN38 No", DataType = GridDataType.String.ToString(), Width = 35 });
                    g.Column.Add(new GridColumn { Field = "FlightNo", IsLocked = false, Title = "Flight No", DataType = GridDataType.String.ToString(), Width = 35 });
                    g.Column.Add(new GridColumn { Field = "FlightDate", IsLocked = false, Title = "Flight Date", DataType = GridDataType.String.ToString(), Width = 35 });
                    g.Column.Add(new GridColumn { Field = "Origin", IsLocked = false, Title = "Origin City", DataType = GridDataType.String.ToString(), Width = 40 });
                    g.Column.Add(new GridColumn { Field = "Destination", IsLocked = false, Title = "Destination City", DataType = GridDataType.String.ToString(), Width = 40 });
                    g.Column.Add(new GridColumn { Field = "MailCategoryName", IsLocked = false, Title = "Mail Category", DataType = GridDataType.String.ToString(), Width = 55 });
                    g.Column.Add(new GridColumn { Field = "MHCName", IsLocked = false, Title = "Mail Handling Class Code", DataType = GridDataType.String.ToString(), Width = 55 });
                    g.Column.Add(new GridColumn { Field = "TotalPieces", IsLocked = false, Title = "Total Pieces", DataType = GridDataType.String.ToString(), Width = 35 });
                    g.Column.Add(new GridColumn { Field = "GrossWeight", IsLocked = false, Title = "GrossWeight", DataType = GridDataType.String.ToString(), Width = 35 });
                    g.Column.Add(new GridColumn { Field = "TotalDN", IsLocked = false, Title = "Avail DN", DataType = GridDataType.Number.ToString(), Width = 35 });
                    g.Column.Add(new GridColumn { Field = "ULDNo", Title = "ULD No", FixTooltip = "ULD No", Template = "<input type=\"hidden\" name=\"ULDNo_#=SNo#\" id=\"ULDNo_#=SNo#\" value=\"#=ULDNo#\" /><input type=\"text\" class=\"\" name=\"Text_ULDNo_#=SNo#\"  id=\"Text_ULDNo_#=SNo#\"  tabindex=1002  controltype=\"autocomplete\"   maxlength=\"10\" data-width=\"50px\" value=\"#=CN_ULDNo#\" placeholder=\"ULD No\" />", DataType = GridDataType.String.ToString(), Width = 150 });

                    g.ExtraParam = new List<GridExtraParams>();
                    g.ExtraParam.Add(new GridExtraParams { Field = "GroupFlightSNo", Value = GroupFlightSNo });

                    //#region Nested Grid Section
                    g.NestedPrimaryID = "TransSNo";
                    g.NestedModuleName = this.MyModuleID;
                    g.NestedAppsName = this.MyAppID;
                    g.NestedParentID = "SNo";
                    g.SuccessGrid = "ChildSuccessGrid";
                    g.NestedIsShowEdit = false;
                    g.NestedDefaultPageSize = 1000;
                    g.NestedIsPageable = false;
                    g.IsNestedAllowedSorting = false;
                    g.NestedDataSoruceUrl = "Services/Mail/AirMailManifestService.svc/GetAirMailChildRecord";
                    g.NestedColumn = new List<GridColumn>();
                    g.NestedColumn.Add(new GridColumn { Field = "SNo", Title = "SNo", DataType = GridDataType.Number.ToString(), IsHidden = true, Width = 40 });
                    g.NestedColumn.Add(new GridColumn { Field = "TransSNo", Title = "TransSNo", DataType = GridDataType.Number.ToString(), IsHidden = true, Width = 40 });
                    g.NestedColumn.Add(new GridColumn { Field = "IsManifested", Title = "Select", DataType = GridDataType.String.ToString(), Width = 20, Template = "# if( IsManifested==\"1\"){#<input type=\"checkbox\" id=\"chkChild_#=SNo#_#=TransSNo#\" checked=\"checked\" />#} else {#<input type=\"checkbox\" id=\"chkChild_#=SNo#_#=TransSNo#\" /># }#" });
                    g.NestedColumn.Add(new GridColumn { Field = "DNNo", Title = "DN No", DataType = GridDataType.String.ToString(), Width = 40 });
                    g.NestedColumn.Add(new GridColumn { Field = "OriCityCode", Title = "Origin City", DataType = GridDataType.String.ToString(), Width = 90 });
                    g.NestedColumn.Add(new GridColumn { Field = "DestCityCode", Title = "Destination City", DataType = GridDataType.String.ToString(), Width = 40 });
                    g.NestedColumn.Add(new GridColumn { Field = "ReceptacleNumber", Title = "Receptacle Number", DataType = GridDataType.String.ToString(), Width = 70 });
                    g.NestedColumn.Add(new GridColumn { Field = "HNRIndicator", Title = "HNR Indicator", DataType = GridDataType.String.ToString(), Width = 40 });
                    g.NestedColumn.Add(new GridColumn { Field = "RIICode", Title = "RII Code", DataType = GridDataType.String.ToString(), Width = 90 });
                    g.NestedColumn.Add(new GridColumn { Field = "ReceptacleWeight", Title = "Receptacle Weight", DataType = GridDataType.String.ToString(), Width = 90 });
                    g.NestedColumn.Add(new GridColumn { Field = "DNULDNo", Title = "DN ULD No", FixTooltip = "ULD No", Template = "<input type=\"hidden\" name=\"DNULDNo_#=TransSNo#\" id=\"DNULDNo_#=TransSNo#\" value=\"#=DNULDNo#\" /><input type=\"text\" class=\"\" name=\"Text_DNULDNo_#=TransSNo#\"  id=\"Text_DNULDNo_#=TransSNo#\"  tabindex=1002  controltype=\"autocomplete\"   maxlength=\"10\" data-width=\"50px\" value=\"#=DN_ULDNo#\" placeholder=\"DN ULD No\" />", DataType = GridDataType.String.ToString(), Width = 100 });
                    g.InstantiateIn(Container);
                }
            }
            catch(Exception ex)//
            {
                throw ex;
            }
        }

        public DataSourceResult GetAirMailDetailsRecord(string GroupFlightSNo, int skip, int take, int page, int pageSize, List<SoftwareFactory.Data.GridSort> sort, SoftwareFactory.Data.GridFilter filter)
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

                ProcName = "POMailPreManifestRecord";

                string filters = GridFilter.ProcessFilters<AirMail>(filter);

                SqlParameter[] Parameters = { 
                                            new SqlParameter("@PageNo", page), 
                                            new SqlParameter("@PageSize", pageSize), 
                                            new SqlParameter("@WhereCondition", filters), 
                                            new SqlParameter("@OrderBy", sorts),                                             
                                            new SqlParameter("@GroupFlightSNo", GroupFlightSNo) 
                                        };

                ds = SqlHelper.ExecuteDataset((DMLConnectionString.WebConfigConnectionString), CommandType.StoredProcedure, ProcName, Parameters);

                var AirMailList = ds.Tables[0].AsEnumerable().Select(e => new AirMailPreManifestRecord
                {
                    SNo = Convert.ToInt32(e["SNo"]),
                    CN38No = e["CN38No"].ToString(),
                    FlightNo = e["FlightNo"].ToString(),
                    FlightDate = Convert.ToDateTime(e["FlightDate"]).ToString("dd-MMM-yyyy"),
                    Origin = e["Origin"].ToString(),
                    Destination = e["Destination"].ToString(),
                    OffPoint = e["OffPoint"].ToString(),
                    SPHC = e["SPHC"].ToString(),
                    TotalPieces = Convert.ToInt32(e["TotalPieces"]),
                    GrossWeight = Convert.ToDecimal(e["GrossWeight"]),
                    VolumeWeight = Convert.ToDecimal(e["VolumeWeight"]),
                    ChargeableWeight = Convert.ToDecimal(e["ChargeableWeight"]),
                    MailCategoryName = e["MailCategoryName"].ToString(),
                    MHCName = e["MHCName"].ToString(),
                    ULDNo = e["ULDStockSNo"].ToString(),
                    TotalDN = Convert.ToInt32(e["TotalDN"]),
                    IsManifested = e["IsManifested"].ToString(),
                    CN_ULDNo = e["CN_ULDNo"].ToString(),
                });
                ds.Dispose();
                return new DataSourceResult
                {
                    Data = AirMailList.AsQueryable().ToList(),
                    Total = Convert.ToInt32(ds.Tables[1].Rows[0][0].ToString()),
                    FilterCondition = filters,
                    SortCondition = sorts,
                    StoredProcedure = ProcName
                };
            }
            catch(Exception ex)//
            {
                throw ex;
            }
        }

        public DataSourceResult GetAirMailChildRecord(int skip, int take, int page, int pageSize, List<SoftwareFactory.Data.GridSort> sort, SoftwareFactory.Data.GridFilter filter)
        {
            try
            {
                string sorts = GridSort.ProcessSorting(sort);
                string ProcName = "";
                GridFilter filters = new GridFilter();
                filters.Logic = "AND";
                filters.Filters = new List<GridFilter>();
                filters.Filters.Add(filter);

                DataSet ds = new DataSet();

                ProcName = "POMailCNGetList";

                string filterValue = GridFilter.ProcessFilters<PreManifestChildRecord>(filters);

                SqlParameter[] Parameters = 
            {
                new SqlParameter("@PageNo", page), 
                new SqlParameter("@PageSize", pageSize), 
                new SqlParameter("@WhereCondition", filterValue), 
                new SqlParameter("@OrderBy", sorts), 
            };

                ds = SqlHelper.ExecuteDataset(DMLConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, ProcName, Parameters);

                var lst = ds.Tables[0].AsEnumerable().Select(e => new PreManifestChildRecord
                {
                    SNo = Convert.ToInt32(e["POMailSNo"]),
                    TransSNo = Convert.ToInt32(e["TransSNo"]),
                    DNNo = e["DNNo"].ToString(),
                    OriCityCode = e["OriCityCode"].ToString(),
                    DestCityCode = e["DestCityCode"].ToString(),
                    ReceptacleNumber = e["ReceptacleNumber"].ToString(),
                    HNRIndicator = e["HNRIndicator"].ToString(),
                    RIICode = e["RIICode"].ToString(),
                    ReceptacleWeight = e["ReceptacleWeight"].ToString(),
                    DNULDNo = e["DNULDStockSNo"].ToString(),
                    IsManifested = e["IsManifested"].ToString(),
                    DN_ULDNo = e["DN_ULDNo"].ToString(),
                });
                ds.Dispose();
                return new DataSourceResult
                {
                    Data = lst.AsQueryable().ToList(),
                    Total = Convert.ToInt32(ds.Tables[1].Rows[0][0].ToString()),
                    FilterCondition = filterValue,
                    SortCondition = sorts,
                    StoredProcedure = ProcName
                };
            }
            catch(Exception ex)//
            {
                throw ex;
            }
        }

        public string SavePreManifest(List<PoMailPreManifest> PoMailPreManifest, List<PoMailPreManifestTrans> PoMailPreManifestTrans, string DutyOfficer, string PlannedBy, int UpdatedBy, string GroupFlightSNo)
        {
            string Result = string.Empty;
            try
            {
                DataTable dtPoMailPreManifest = CollectionHelper.ConvertTo(PoMailPreManifest, "");
                DataTable dtPoMailPreManifestTrans = CollectionHelper.ConvertTo(PoMailPreManifestTrans, "");

                SqlParameter paramPoMailPreManifest = new SqlParameter();
                paramPoMailPreManifest.ParameterName = "@Manifest";
                paramPoMailPreManifest.SqlDbType = System.Data.SqlDbType.Structured;
                paramPoMailPreManifest.Value = dtPoMailPreManifest;

                SqlParameter paramPoMailPreManifestTrans = new SqlParameter();
                paramPoMailPreManifestTrans.ParameterName = "@ManifestTrans";
                paramPoMailPreManifestTrans.SqlDbType = System.Data.SqlDbType.Structured;
                paramPoMailPreManifestTrans.Value = dtPoMailPreManifestTrans;

                DataSet ds = new DataSet();
                SqlParameter[] Parameters = { 
                                            paramPoMailPreManifest, 
                                            paramPoMailPreManifestTrans,                                             
                                            new SqlParameter("@DutyOfficer",DutyOfficer),
                                            new SqlParameter("@PlannedBy",PlannedBy),
                                            new SqlParameter("@UpdatedBy",UpdatedBy),
                                            new SqlParameter("@GroupFlightSNo",GroupFlightSNo)
                                        };

                ds = SqlHelper.ExecuteDataset(DMLConnectionString.WebConfigConnectionString, "SavePoMailManifest_Test", Parameters);
                if (ds != null && ds.Tables.Count > 0)
                    Result = ds.Tables[0].Rows[0]["Result"].ToString();
            }
            catch(Exception ex)//
            {
                throw ex;
            }
            return Result;
        }

        public string GetManifestDetails(string GroupFlightSNo)
        {
            try
            {
                SqlParameter[] Parameters = { 
                                            new SqlParameter("@GroupFlightSNo", GroupFlightSNo),
                                        };
                DataSet ds = SqlHelper.ExecuteDataset(DMLConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, "GetPoMailFlightManifest", Parameters);
                ds.Dispose();
                return CargoFlash.Cargo.Business.Common.CompleteDStoJSON(ds);
            }
            catch(Exception ex)//
            {
                throw ex;
            }
        }

        /***********************Lying List************************************************/
        private void CreateAirMailLyingListGrid(StringBuilder Container, string ProcessName, string GroupFlightSNo)
        {
            try
            {
                using (NestedGrid g = new NestedGrid())
                {
                    g.Height = 300;
                    g.PageName = this.MyPageName;
                    g.PrimaryID = this.MyPrimaryID;
                    g.ModuleName = this.MyModuleID;
                    g.AppsName = this.MyAppID;
                    g.IsDisplayOnly = true;
                    g.DefaultPageSize = 100;
                    g.IsAutoHeight = true;
                    g.DataSoruceUrl = "Services/Mail/AirMailManifestService.svc/GetAirMailDetailsLyingListRecord";
                    g.PrimaryID = "SNo";
                    g.NewURL = MyPageName + "?" + GetWebURLString("New", false);
                    g.ModuleName = this.MyModuleID;
                    g.ParentSuccessGrid = "ParentSuccessGridLyingList";
                    g.IsFormHeader = false;
                    g.IsModule = true;
                    g.IsShowEdit = false;
                    g.IsSaveChanges = false;
                    g.IsAccordion = true;
                    g.IsToggleColumns = false;
                    g.IsColumnMenu = false;
                    g.IsAllowedSorting = false;

                    g.Column = new List<GridColumn>();
                    g.Column.Add(new GridColumn { Field = "SNo", Title = "SNo", DataType = GridDataType.String.ToString(), IsHidden = true, Width = 40 });
                    g.Column.Add(new GridColumn { Field = "IsManifested", Title = "Select", DataType = GridDataType.String.ToString(), Width = 20, Template = "# if( IsManifested==\"1\"){#<input type=\"checkbox\" onclick=\"CheckParentLyingList(this);\" id=\"chkParent_#=SNo#\" checked=\"checked\" />#} else {#<input type=\"checkbox\" onclick=\"CheckParentLyingList(this);\" id=\"chkParent_#=SNo#\"/># }#" });
                    g.Column.Add(new GridColumn { Field = "CN38No", IsLocked = false, Title = "CN38 No", DataType = GridDataType.String.ToString(), Width = 35 });
                    g.Column.Add(new GridColumn { Field = "FlightNo", IsLocked = false, Title = "Flight No", DataType = GridDataType.String.ToString(), Width = 35 });
                    g.Column.Add(new GridColumn { Field = "FlightDate", IsLocked = false, Title = "Flight Date", DataType = GridDataType.String.ToString(), Width = 35 });
                    g.Column.Add(new GridColumn { Field = "Origin", IsLocked = false, Title = "Origin City", DataType = GridDataType.String.ToString(), Width = 40 });
                    g.Column.Add(new GridColumn { Field = "Destination", IsLocked = false, Title = "Destination City", DataType = GridDataType.String.ToString(), Width = 40 });
                    g.Column.Add(new GridColumn { Field = "MailCategoryName", IsLocked = false, Title = "Mail Category", DataType = GridDataType.String.ToString(), Width = 55 });
                    g.Column.Add(new GridColumn { Field = "MHCName", IsLocked = false, Title = "Mail Handling Class Code", DataType = GridDataType.String.ToString(), Width = 55 });
                    g.Column.Add(new GridColumn { Field = "TotalPieces", IsLocked = false, Title = "Total Pieces", DataType = GridDataType.String.ToString(), Width = 35 });
                    g.Column.Add(new GridColumn { Field = "GrossWeight", IsLocked = false, Title = "GrossWeight", DataType = GridDataType.String.ToString(), Width = 35 });
                    g.Column.Add(new GridColumn { Field = "TotalDN", IsLocked = false, Title = "Offloaded DN", DataType = GridDataType.Number.ToString(), Width = 35 });
                    g.Column.Add(new GridColumn { Field = "ULDNo", Title = "ULD No", FixTooltip = "ULD No", Template = "<input type=\"hidden\" name=\"ULDNo_#=SNo#\" id=\"ULDNo_#=SNo#\" value=\"#=ULDNo#\" /><input type=\"text\" class=\"\" name=\"Text_ULDNo_#=SNo#\"  id=\"Text_ULDNo_#=SNo#\"  tabindex=1002  controltype=\"autocomplete\"   maxlength=\"10\" data-width=\"50px\" value=\"#=CN_ULDNo#\" placeholder=\"ULD No\" />", DataType = GridDataType.String.ToString(), Width = 150 });

                    g.ExtraParam = new List<GridExtraParams>();
                    g.ExtraParam.Add(new GridExtraParams { Field = "GroupFlightSNo", Value = GroupFlightSNo });

                    //#region Nested Grid Section
                    g.NestedPrimaryID = "TransSNo";
                    g.NestedModuleName = this.MyModuleID;
                    g.NestedAppsName = this.MyAppID;
                    g.NestedParentID = "SNo";
                    g.SuccessGrid = "ChildSuccessGridLyingList";
                    g.NestedIsShowEdit = false;
                    g.NestedDefaultPageSize = 1000;
                    g.NestedIsPageable = false;
                    g.IsNestedAllowedSorting = false;
                    g.NestedDataSoruceUrl = "Services/Mail/AirMailManifestService.svc/GetAirMailChildLyingListRecord";
                    g.NestedColumn = new List<GridColumn>();
                    g.NestedColumn.Add(new GridColumn { Field = "SNo", Title = "SNo", DataType = GridDataType.Number.ToString(), IsHidden = true, Width = 40 });
                    g.NestedColumn.Add(new GridColumn { Field = "TransSNo", Title = "TransSNo", DataType = GridDataType.Number.ToString(), IsHidden = true, Width = 40 });
                    g.NestedColumn.Add(new GridColumn { Field = "IsManifested", Title = "Select", DataType = GridDataType.String.ToString(), Width = 20, Template = "# if( IsManifested==\"1\"){#<input type=\"checkbox\" id=\"chkChildLyingList_#=SNo#_#=TransSNo#\" checked=\"checked\" />#} else {#<input type=\"checkbox\" id=\"chkChildLyingList_#=SNo#_#=TransSNo#\" /># }#" });
                    g.NestedColumn.Add(new GridColumn { Field = "DNNo", Title = "DN No", DataType = GridDataType.String.ToString(), Width = 40 });
                    g.NestedColumn.Add(new GridColumn { Field = "OriCityCode", Title = "Origin City", DataType = GridDataType.String.ToString(), Width = 90 });
                    g.NestedColumn.Add(new GridColumn { Field = "DestCityCode", Title = "Destination City", DataType = GridDataType.String.ToString(), Width = 40 });
                    g.NestedColumn.Add(new GridColumn { Field = "ReceptacleNumber", Title = "Receptacle Number", DataType = GridDataType.String.ToString(), Width = 70 });
                    g.NestedColumn.Add(new GridColumn { Field = "HNRIndicator", Title = "HNR Indicator", DataType = GridDataType.String.ToString(), Width = 40 });
                    g.NestedColumn.Add(new GridColumn { Field = "RIICode", Title = "RII Code", DataType = GridDataType.String.ToString(), Width = 90 });
                    g.NestedColumn.Add(new GridColumn { Field = "ReceptacleWeight", Title = "Receptacle Weight", DataType = GridDataType.String.ToString(), Width = 90 });
                    g.NestedColumn.Add(new GridColumn { Field = "DNULDNo", Title = "DN ULD No", FixTooltip = "ULD No", Template = "<input type=\"hidden\" name=\"DNULDNo_#=TransSNo#\" id=\"DNULDNo_#=TransSNo#\" value=\"#=DNULDNo#\" /><input type=\"text\" class=\"\" name=\"Text_DNULDNo_#=TransSNo#\"  id=\"Text_DNULDNo_#=TransSNo#\"  tabindex=1002  controltype=\"autocomplete\"   maxlength=\"10\" data-width=\"50px\" value=\"#=DN_ULDNo#\" placeholder=\"DN ULD No\" />", DataType = GridDataType.String.ToString(), Width = 100 });


                    g.InstantiateIn(Container);
                }
            }
            catch(Exception ex)//
            {
                throw ex;
            }
        }

        public DataSourceResult GetAirMailDetailsLyingListRecord(string GroupFlightSNo, int skip, int take, int page, int pageSize, List<SoftwareFactory.Data.GridSort> sort, SoftwareFactory.Data.GridFilter filter)
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

                ProcName = "POMailPreManifestLyingListRecord";

                string filters = GridFilter.ProcessFilters<AirMail>(filter);

                SqlParameter[] Parameters = { 
                                            new SqlParameter("@PageNo", page), 
                                            new SqlParameter("@PageSize", pageSize), 
                                            new SqlParameter("@WhereCondition", filters), 
                                            new SqlParameter("@OrderBy", sorts),                                             
                                            new SqlParameter("@GroupFlightSNo", GroupFlightSNo) 
                                        };

                ds = SqlHelper.ExecuteDataset((DMLConnectionString.WebConfigConnectionString), CommandType.StoredProcedure, ProcName, Parameters);

                var AirMailList = ds.Tables[0].AsEnumerable().Select(e => new AirMailPreManifestRecord
                {
                    SNo = Convert.ToInt32(e["SNo"]),
                    CN38No = e["CN38No"].ToString(),
                    FlightNo = e["FlightNo"].ToString(),
                    FlightDate = Convert.ToDateTime(e["FlightDate"]).ToString("dd-MMM-yyyy"),
                    Origin = e["Origin"].ToString(),
                    Destination = e["Destination"].ToString(),
                    OffPoint = e["OffPoint"].ToString(),
                    SPHC = e["SPHC"].ToString(),
                    TotalPieces = Convert.ToInt32(e["TotalPieces"]),
                    GrossWeight = Convert.ToDecimal(e["GrossWeight"]),
                    VolumeWeight = Convert.ToDecimal(e["VolumeWeight"]),
                    ChargeableWeight = Convert.ToDecimal(e["ChargeableWeight"]),
                    MailCategoryName = e["MailCategoryName"].ToString(),
                    MHCName = e["MHCName"].ToString(),
                    ULDNo = e["ULDStockSNo"].ToString(),
                    TotalDN = Convert.ToInt32(e["TotalDN"]),
                    IsManifested = e["IsManifested"].ToString(),
                    CN_ULDNo = e["CN_ULDNo"].ToString(),
                });
                ds.Dispose();
                return new DataSourceResult
                {
                    Data = AirMailList.AsQueryable().ToList(),
                    Total = Convert.ToInt32(ds.Tables[1].Rows[0][0].ToString()),
                    FilterCondition = filters,
                    SortCondition = sorts,
                    StoredProcedure = ProcName
                };
            }
            catch(Exception ex)//
            {
                throw ex;
            }
        }

        public DataSourceResult GetAirMailChildLyingListRecord(int skip, int take, int page, int pageSize, List<SoftwareFactory.Data.GridSort> sort, SoftwareFactory.Data.GridFilter filter)
        {
            try
            {
                string sorts = GridSort.ProcessSorting(sort);
                string ProcName = "";
                GridFilter filters = new GridFilter();
                filters.Logic = "AND";
                filters.Filters = new List<GridFilter>();
                filters.Filters.Add(filter);

                DataSet ds = new DataSet();

                ProcName = "POMailLyingListGetList";

                string filterValue = GridFilter.ProcessFilters<PreManifestChildRecord>(filters);

                SqlParameter[] Parameters = 
            {
                new SqlParameter("@PageNo", page), 
                new SqlParameter("@PageSize", pageSize), 
                new SqlParameter("@WhereCondition", filterValue), 
                new SqlParameter("@OrderBy", sorts), 
            };

                ds = SqlHelper.ExecuteDataset(DMLConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, ProcName, Parameters);

                var lst = ds.Tables[0].AsEnumerable().Select(e => new PreManifestChildRecord
                {
                    SNo = Convert.ToInt32(e["POMailSNo"]),
                    TransSNo = Convert.ToInt32(e["TransSNo"]),
                    DNNo = e["DNNo"].ToString(),
                    OriCityCode = e["OriCityCode"].ToString(),
                    DestCityCode = e["DestCityCode"].ToString(),
                    ReceptacleNumber = e["ReceptacleNumber"].ToString(),
                    HNRIndicator = e["HNRIndicator"].ToString(),
                    RIICode = e["RIICode"].ToString(),
                    ReceptacleWeight = e["ReceptacleWeight"].ToString(),
                    DNULDNo = e["DNULDStockSNo"].ToString(),
                    IsManifested = e["IsManifested"].ToString(),
                    DN_ULDNo = e["DN_ULDNo"].ToString(),
                });
                ds.Dispose();
                return new DataSourceResult
                {
                    Data = lst.AsQueryable().ToList(),
                    Total = Convert.ToInt32(ds.Tables[1].Rows[0][0].ToString()),
                    FilterCondition = filterValue,
                    SortCondition = sorts,
                    StoredProcedure = ProcName
                };
            }
            catch(Exception ex)//
            {
                throw ex;
            }
        }
        /***********************End Lying List************************************************/
    }
}
