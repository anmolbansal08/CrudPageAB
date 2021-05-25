using CargoFlash.Cargo.Business;
using CargoFlash.Cargo.Model.Shipment;
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

using System.Net;

namespace CargoFlash.Cargo.DataService.Shipment
{
    [GlobalErrorHandlerBehaviour(typeof(GlobalErrorHandler))]   [ServiceBehavior(IncludeExceptionDetailInFaults = true)]
    [AspNetCompatibilityRequirements(RequirementsMode = AspNetCompatibilityRequirementsMode.Allowed)]
    public class SLICancellationService : BaseWebUISecureObject, ISLICancellationService
    {
        public Stream GetWebForm(string processName, string moduleName, string appName, string formAction, string IsSubModule)
        {
            return BuildWebForm(processName, moduleName, appName, formAction, "", (IsSubModule == "1"));
        }
        public Stream GetSLIGridData(string processName, string moduleName, string appName, string SLINo)
        {
            return BuildWebForm(processName, moduleName, appName, "IndexView", SLINo: SLINo);
        }
        private Stream BuildWebForm(string processName, string moduleName, string appName, string formAction, string recordID = "", bool IsSubModule = true, string SLINo = "", string AWBSNo = "")
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
                            case "SLICancellation":
                                this.MyAppID = appName;
                                if (appName.ToUpper().Trim() == "SLICANCELLATION")
                                    CreateSLIGrid(myCurrentForm, processName, SLINo);
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
            catch(Exception ex)//
            {
                throw ex;
            }
        }
        private void CreateSLIGrid(StringBuilder Container, string ProcessName, string SLINo = "")
        {
            try
            {
                using (Grid g = new Grid())
                {
                    this.MyModuleID = "SLI";

                    g.PageName = this.MyPageName;
                    g.PrimaryID = this.MyPrimaryID;
                    g.ModuleName = this.MyModuleID;
                    g.AppsName = this.MyAppID;
                    g.ActionTitle = "Action";
                    g.DataSoruceUrl = "Services/Shipment/SLICancellationService.svc/GetSLInfoGridData";
                    g.NewURL = MyPageName + "?" + GetWebURLString("New", false);
                    g.ServiceModuleName = this.MyModuleID;
                    g.UserID = this.MyUserID;
                    g.FormCaptionText = "SLI List";
                    g.DefaultPageSize = 5;
                    g.IsDisplayOnly = true;
                    g.IsProcessPart = true;
                    g.IsVirtualScroll = false;
                    g.IsDisplayOnly = false;
                    g.ProcessName = ProcessName;
                    g.SuccessGrid = "OnSuccessGrid";
                    g.Column = new List<GridColumn>();
                    g.Column.Add(new GridColumn { Field = "SNo", Title = "SNo", DataType = GridDataType.String.ToString(), IsHidden = true });
                    g.Column.Add(new GridColumn { Field = "SLINo", IsLocked = false, Title = "Lot No", DataType = GridDataType.String.ToString(), Width = 90 });
                    g.Column.Add(new GridColumn { Field = "AWBNo", IsLocked = false, Title = "AWB No", DataType = GridDataType.String.ToString(), Width = 90 });
                    g.Column.Add(new GridColumn { Field = "AirportCode", IsLocked = false, Title = "Destination Airport", DataType = GridDataType.String.ToString(), Width = 90 });
                    g.Column.Add(new GridColumn { Field = "Airline", IsLocked = false, Title = "Airline", DataType = GridDataType.String.ToString(), Width = 70, Template = "<span title=\"#= Airline #\">#= Airline #</span>" });
                    g.Column.Add(new GridColumn { Field = "RoutingCity", IsLocked = false, Title = "Routing City", DataType = GridDataType.String.ToString(), Width = 60 });
                    g.Column.Add(new GridColumn { Field = "BookingTypeValue", IsLocked = false, Title = "Booking Type", DataType = GridDataType.String.ToString(), Width = 90 });
                    g.Column.Add(new GridColumn { Field = "AgentName", IsLocked = false, Title = "Agent Name", DataType = GridDataType.String.ToString(), Width = 90, Template = "<span title=\"#= AgentName #\">#= AgentName #</span>" });
                    g.Column.Add(new GridColumn { Field = "SLIDate", Title = "SLI Date", IsHidden = false, DataType = GridDataType.DateTime.ToString(), Width = 70, Template = "# if( SLIDate==null) {# # } else {#<span  title= \"#= kendo.toString(new Date(data.SLIDate.getTime() + data.SLIDate.getTimezoneOffset()*60000),\"" + UIDateTimeFormat.UIDateFormatString + " " + UIDateTimeFormat.UITimeFormatString + "\") #\">#= kendo.toString(new Date(data.SLIDate.getTime() + data.SLIDate.getTimezoneOffset()*60000),\"" + UIDateTimeFormat.UIDateFormatString + " " + UIDateTimeFormat.UITimeFormatString + "\") #</span>#}#" });

                    g.Column.Add(new GridColumn { Field = "BuildUpType", IsLocked = false, Title = "Build Type(Lot No)", DataType = GridDataType.String.ToString(), Width = 100, Template = "<span title=\"#= BuildUpType #\">#= BuildUpType #</span>" });
                    g.Column.Add(new GridColumn { Field = "RefSLI", IsLocked = false, Title = "Ref Lot No", DataType = GridDataType.String.ToString(), Width = 100, Template = "<span title=\"#= RefSLI #\">#= RefSLI #</span>" });
                    g.Column.Add(new GridColumn { Field = "isBup", IsLocked = false, Title = "IsBUP", DataType = GridDataType.Boolean.ToString(), IsHidden = true });
                    g.Column.Add(new GridColumn { Field = "IsFinalSLI", IsLocked = false, Title = "IsFinalSLI", DataType = GridDataType.Boolean.ToString(), IsHidden = true });
                    g.Column.Add(new GridColumn { Field = "SLIFlag", IsLocked = false, Title = "SLIFlag", DataType = GridDataType.Boolean.ToString(), IsHidden = true });
                    g.Column.Add(new GridColumn { Field = "IsProcessed", IsLocked = false, Title = "IsProcessed", DataType = GridDataType.Boolean.ToString(), IsHidden = true });
                    g.Column.Add(new GridColumn { Field = "ProcessStatus", Title = "ProcessStatus", DataType = GridDataType.String.ToString(), IsHidden = true });


                    g.Action = new List<GridAction>();
                    g.Action.Add(new GridAction
                    {
                        ButtonCaption = "Cancel",
                        ClientAction = "GetSLICanAction",
                        ActionName = "Read",
                        AppsName = this.MyAppID,
                        CssClassName = "read",
                        ModuleName = this.MyModuleID
                    });
                    g.Action.Add(new GridAction
                    {
                        ButtonCaption = "Return",
                        ClientAction = "GetSLICanAction",
                        ActionName = "Read",
                        AppsName = this.MyAppID,
                        CssClassName = "read",
                        ModuleName = this.MyModuleID
                    });
                    g.ExtraParam = new List<GridExtraParam>();
                    g.ExtraParam.Add(new GridExtraParam { Field = "SLINo", Value = SLINo });
                    g.InstantiateIn(Container);
                }


            }

            catch(Exception ex)//
            {
                throw ex;
            }
        }

        public DataSourceResult GetSLInfoGridData(string SLINo, int skip, int take, int page, int pageSize, List<GridSort> sort, GridFilter filter)
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

                ProcName = "GetListSLIDetails";
                var LoggedInAirport = ((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).AirportSNo;

                string filters = GridFilter.ProcessFilters<SLIAWBInfo>(filter);
                if (filters == "")
                {
                    filters = "OriginAirportSNo=" + LoggedInAirport;
                }
                else
                {
                    filters = filters + " And OriginAirportSNo=" + LoggedInAirport;
                }

                SqlParameter[] Parameters = { new SqlParameter("@PageNo", page), new SqlParameter("@PageSize", pageSize), new SqlParameter("@WhereCondition", filters), new SqlParameter("@OrderBy", sorts), new SqlParameter("@DestinationAirportSNo", 0), new SqlParameter("@AirlineSNo", 0), new SqlParameter("@RoutingCitySNo", 0), new SqlParameter("@AWBPrefix", ""), new SqlParameter("@AWBNo", ""), new SqlParameter("@LoggedInCity", 1), new SqlParameter("@AccountSNo", 0), new SqlParameter("@SLINo", SLINo), new SqlParameter("@SLIDate", null), new SqlParameter("@UserSNo", ((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).UserSNo) };

                ds = SqlHelper.ExecuteDataset(DMLConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, ProcName, Parameters);

                var SLIList = ds.Tables[0].AsEnumerable().Select(e => new SLIAWBInfoforGrid
                {
                    SLIFlag = Convert.ToBoolean(e["SLIFlag"]),
                    SNo = Convert.ToInt32(e["SNo"]),
                    AWBNo = e["AWBNo"].ToString(),
                    DestinationCitySNo = Convert.ToInt32(e["DestinationCitySNo"]),
                    DestinationCity = e["DestinationCity"].ToString(),
                    AirlineSNo = Convert.ToInt32(e["AirlineSNo"]),
                    Airline = e["Airline"].ToString(),
                    BookingTypeValue = e["BookingTypeValue"].ToString(),
                    RoutingCitySNo = Convert.ToInt32(e["RoutingCitySNo"]),
                    RoutingCity = e["RoutingCity"].ToString(),
                    DeclaredCarriagevalue = e["DeclaredCarriagevalue"].ToString(),
                    DeclaredCustomValue = e["DeclaredCustomValue"].ToString(),
                    ChargeCode = e["ChargeCode"].ToString(),
                    BOENo = e["BOENo"].ToString(),
                    IDNumber = e["IDNumber"].ToString(),
                    AccountSNo = Convert.ToInt32(e["AccountSNo"]),
                    AgentName = e["AgentName"].ToString(),
                    ProcessStatus = e["ProcessStatus"].ToString(),
                    SLINo = e["SLINo"].ToString(),
                    isBup = Convert.ToBoolean(e["isBup"]),
                    IsFinalSLI = Convert.ToBoolean(e["IsFinalSLI"]),
                    IsProcessed = Convert.ToBoolean(e["IsProcessed"]),
                    AirportCode = Convert.ToString(e["AirportCode"]),
                    SLIDate = DateTime.SpecifyKind(Convert.ToDateTime(e["SLIDate"]), DateTimeKind.Utc),
                    BuildUpType = e["BuildUpType"].ToString(),
                    RefSLI = e["RefSLI"].ToString()
                });
                ds.Dispose();
                return new DataSourceResult
                {
                    Data = SLIList.AsQueryable().ToList(),
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

    }
}