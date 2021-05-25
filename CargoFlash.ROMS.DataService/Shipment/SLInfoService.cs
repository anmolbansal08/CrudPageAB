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
    public class SLInfoService : BaseWebUISecureObject, ISLInfoService
    {
        public Stream GetWebForm(string processName, string moduleName, string appName, string formAction, string IsSubModule)
        {
            return BuildWebForm(processName, moduleName, appName, formAction, "", (IsSubModule == "1"));
        }
        public Stream GetSLIGridData(string processName, string moduleName, string appName, string DestinationCitySNo, string AirlineSNo, string RoutingCitySNo, string AWBPrefix, string AWBNo, string LoggedInCity, string AccountSNo, string SLINo, string SLIDate)
        {
            return BuildWebForm(processName, moduleName, appName, "IndexView", DestinationCitySNo: DestinationCitySNo, AirlineSNo: AirlineSNo, RoutingCitySNo: RoutingCitySNo, AWBPrefix: AWBPrefix, AWBNo: AWBNo, LoggedInCity: LoggedInCity, AccountSNo: AccountSNo, SLINo: SLINo, SLIDate: SLIDate);
        }
        public Stream GetTransGridData(string processName, string moduleName, string appName, string AWBSNo)
        {
            return BuildWebForm(processName, moduleName, appName, "IndexView", AWBSNo: AWBSNo);
        }

        private Stream BuildWebForm(string processName, string moduleName, string appName, string formAction, string recordID = "", bool IsSubModule = true, string DestinationCitySNo = "0", string AirlineSNo = "0", string RoutingCitySNo = "0", string AWBPrefix = "", string AWBNo = "", string LoggedInCity = "", string AccountSNo = "0", string SLINo = "", string AWBSNo = "", string SLIDate = "")
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
                            case "SLIBOOKING":
                                this.MyAppID = appName;
                                if (appName.ToUpper().Trim() == "SLINFO")
                                    CreateSLIGrid(myCurrentForm, processName, DestinationCitySNo, AirlineSNo, RoutingCitySNo, AWBPrefix, AWBNo, LoggedInCity, AccountSNo, SLINo, SLIDate);
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
                
      catch(Exception ex)//(Exception ex)
            {
                throw ex;
            }
        }
        private void CreateSLIGrid(StringBuilder Container, string ProcessName, string DestinationAirportSNo = "0", string AirlineSNo = "0", string RoutingCitySNo = "0", string AWBPrefix = "", string AWBNo = "", string LoggedInCity = "", string AccountSNo = "0", string SLINo = "", string SLIDate = "")
        {
            try
            {
                string SLICaption = ((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).SysSetting["SLICaption"].ToString();
                using (Grid g = new Grid())
                {

                    g.PageName = this.MyPageName;
                    g.PrimaryID = this.MyPrimaryID;
                    g.ModuleName = this.MyModuleID;
                    g.AppsName = this.MyAppID;

                    g.ActionTitle = "Action";
                    g.DataSoruceUrl = "Services/Shipment/SLInfoService.svc/GetSLInfoGridData";
                    g.NewURL = MyPageName + "?" + GetWebURLString("New", false);
                    g.ServiceModuleName = this.MyModuleID;
                    g.UserID = this.MyUserID;
                    g.FormCaptionText = "" + SLICaption + " List";
                    g.DefaultPageSize = 5;
                    g.IsDisplayOnly = true;
                    g.IsProcessPart = true;
                    g.IsVirtualScroll = false;
                    g.IsDisplayOnly = false;
                    g.ProcessName = ProcessName;
                    g.IsShowGridHeader = false;
                    g.SuccessGrid = "OnSuccessGrid";
                    // g.IsRowDataBound = true;

                    ////
                    g.Column = new List<GridColumn>();
                    g.Column.Add(new GridColumn { Field = "SNo", Title = "SNo", DataType = GridDataType.String.ToString(), IsHidden = true });
                    g.Column.Add(new GridColumn { Field = "SLINo", IsLocked = false, Title = "" + SLICaption + " No", DataType = GridDataType.String.ToString(), Width = 90 });
                    g.Column.Add(new GridColumn { Field = "AWBNo", IsLocked = false, Title = "AWB No", DataType = GridDataType.String.ToString(), Width = 90 });
                    g.Column.Add(new GridColumn { Field = "AirportCode", IsLocked = false, Title = "Destination Airport", DataType = GridDataType.String.ToString(), Width = 90 });
                    g.Column.Add(new GridColumn { Field = "Airline", IsLocked = false, Title = "Airline", DataType = GridDataType.String.ToString(), Width = 70, Template = "<span title=\"#= Airline #\">#= Airline #</span>" });
                    g.Column.Add(new GridColumn { Field = "RoutingCity", IsLocked = false, Title = "Routing City", DataType = GridDataType.String.ToString(), Width = 60 });
                    // g.Column.Add(new GridColumn { Field = "IDNumber", IsLocked = false, Title = "ID Number", DataType = GridDataType.String.ToString(), Width = 40 });
                    //g.Column.Add(new GridColumn { Field = "SPHCCode", IsLocked = false, Title = "SPHC Code", DataType = GridDataType.String.ToString(), Width = 40 });
                    g.Column.Add(new GridColumn { Field = "BookingTypeValue", IsLocked = false, Title = "Booking Type", DataType = GridDataType.String.ToString(), Width = 90 });
                    g.Column.Add(new GridColumn { Field = "AgentName", IsLocked = false, Title = "Forwarder (Agent)", DataType = GridDataType.String.ToString(), Width = 100, Template = "<span title=\"#= AgentName #\">#= AgentName #</span>" });

                    //g.Column.Add(new GridColumn { Field = "SLIDate", Title = "SLI Date", IsHidden = false, DataType = GridDataType.DateTime.ToString(), Width = 80, Template = "# if( SLIDate==null) {# # } else {# #= kendo.toString(new Date(data.SLIDate.getTime() + data.SLIDate.getTimezoneOffset()*60000),\"" + UIDateTimeFormat.UIDateFormatString + " " + UIDateTimeFormat.UITimeFormatString + "\") # #}#" });

                    g.Column.Add(new GridColumn { Field = "SLIDate", Title = "" + SLICaption + " Date", IsHidden = false, DataType = GridDataType.DateTime.ToString(), Width = 70, Template = "# if( SLIDate==null) {# # } else {#<span  title= \"#= kendo.toString(new Date(data.SLIDate.getTime() + data.SLIDate.getTimezoneOffset()*60000),\"" + UIDateTimeFormat.UIDateFormatString + " " + UIDateTimeFormat.UITimeFormatString + "\") #\">#= kendo.toString(new Date(data.SLIDate.getTime() + data.SLIDate.getTimezoneOffset()*60000),\"" + UIDateTimeFormat.UIDateFormatString + " " + UIDateTimeFormat.UITimeFormatString + "\") #</span>#}#" });

                    g.Column.Add(new GridColumn { Field = "BuildUpType", IsLocked = false, Title = "Build Type(Lot No)", DataType = GridDataType.String.ToString(), Width = 100, Template = "<span title=\"#= BuildUpType #\">#= BuildUpType #</span>" });
                    g.Column.Add(new GridColumn { Field = "RefSLI", IsLocked = false, Title = "Ref " + SLICaption + " No", DataType = GridDataType.String.ToString(), Width = 100, Template = "<span title=\"#= RefSLI #\">#= RefSLI #</span>" });
                    //g.Column.Add(new GridColumn { Field = "SLIDate", IsLocked = false, Title = "SLI Date", DataType = GridDataType.String.ToString(), Width = 90 });
                    g.Column.Add(new GridColumn { Field = "isBup", IsLocked = false, Title = "IsBUP", DataType = GridDataType.Boolean.ToString(), IsHidden = true });
                    g.Column.Add(new GridColumn { Field = "IsFinalSLI", IsLocked = false, Title = "IsFinalSLI", DataType = GridDataType.Boolean.ToString(), IsHidden = true });
                    g.Column.Add(new GridColumn { Field = "SLIFlag", IsLocked = false, Title = "SLIFlag", DataType = GridDataType.Boolean.ToString(), IsHidden = true });
                    g.Column.Add(new GridColumn { Field = "IsProcessed", IsLocked = false, Title = "IsProcessed", DataType = GridDataType.Boolean.ToString(), IsHidden = true });
                    g.Column.Add(new GridColumn { Field = "ProcessStatus", Title = "ProcessStatus", DataType = GridDataType.String.ToString(), IsHidden = true });
                    // g.IsActionRequired = false;
                    g.Action = new List<GridAction>();
                    g.Action.Add(new GridAction
                    {
                        ButtonCaption = "Read",
                        ClientAction = "GetSLIAction",
                        ActionName = "READ",
                        AppsName = this.MyAppID,
                        CssClassName = "read",
                        ModuleName = this.MyModuleID
                    });
                    g.Action.Add(new GridAction
                    {
                        ButtonCaption = "Part",
                        ClientAction = "GetSLIAction",
                        ActionName = "EDIT",
                        AppsName = this.MyAppID,
                        CssClassName = "read",
                        ModuleName = this.MyModuleID
                    });
                    g.Action.Add(new GridAction
                    {
                        ButtonCaption = "Final",
                        ClientAction = "GetSLIAction",
                        ActionName = "EDIT",
                        AppsName = this.MyAppID,
                        CssClassName = "read",
                        ModuleName = this.MyModuleID
                    });
                    g.ExtraParam = new List<GridExtraParam>();
                    g.ExtraParam.Add(new GridExtraParam { Field = "DestinationAirportSNo", Value = DestinationAirportSNo });
                    g.ExtraParam.Add(new GridExtraParam { Field = "AirlineSNo", Value = AirlineSNo });
                    g.ExtraParam.Add(new GridExtraParam { Field = "RoutingCitySNo", Value = RoutingCitySNo });
                    g.ExtraParam.Add(new GridExtraParam { Field = "AccountSNo", Value = AccountSNo });
                    g.ExtraParam.Add(new GridExtraParam { Field = "SLINo", Value = SLINo });
                    g.ExtraParam.Add(new GridExtraParam { Field = "AWBPrefix", Value = AWBPrefix });
                    g.ExtraParam.Add(new GridExtraParam { Field = "AWBNo", Value = AWBNo });
                    g.ExtraParam.Add(new GridExtraParam { Field = "LoggedInCity", Value = LoggedInCity });
                    g.ExtraParam.Add(new GridExtraParam { Field = "SLIDate", Value = SLIDate });

                    g.InstantiateIn(Container);

                }
            }
               
      catch(Exception ex)//(Exception ex)
            {
                throw ex;
            }
        }

        public DataSourceResult GetSLInfoGridData(string DestinationAirportSNo, string AirlineSNo, string RoutingCitySNo, string AWBPrefix, string AWBNo, string LoggedInCity, string AccountSNo, string SLINo, string SLIDate, int skip, int take, int page, int pageSize, List<SoftwareFactory.Data.GridSort> sort, SoftwareFactory.Data.GridFilter filter)
        {
            try
            {
                // FlightDate = Convert.ToDateTime(FlightDate, CultureInfo.CurrentCulture).ToString("yyyy/MM/dd");

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
                var GroupName = ((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).GroupName.ToString();
                string filters = GridFilter.ProcessFilters<SLIAWBInfoforGrid>(filter);
                if (filters == "")
                {
                    filters = "OriginAirportSNo=" + LoggedInAirport;
                }
                else
                {
                    filters = filters + " And OriginAirportSNo=" + LoggedInAirport;
                }
                if (GroupName == "AGENT")
                {
                    filters = filters + " And   ISNULL(ShipmentStatusCode,'BKD') != 'RCS' And AccountSNo=" + ((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).AgentSNo;
                }
                if (SLIDate == "SLI Date")
                {
                    SLIDate = "null";
                }
                SqlParameter[] Parameters = { new SqlParameter("@PageNo", page), new SqlParameter("@PageSize", pageSize), new SqlParameter("@WhereCondition", filters), new SqlParameter("@OrderBy", sorts), new SqlParameter("@DestinationAirportSNo", DestinationAirportSNo), new SqlParameter("@AirlineSNo", AirlineSNo), new SqlParameter("@RoutingCitySNo", RoutingCitySNo), new SqlParameter("@AWBPrefix", AWBPrefix), new SqlParameter("@AWBNo", AWBNo), new SqlParameter("@LoggedInCity", LoggedInCity), new SqlParameter("@AccountSNo", AccountSNo), new SqlParameter("@SLINo", SLINo), new SqlParameter("@SLIDate", SLIDate), new SqlParameter("@UserSNo", ((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).UserSNo) };

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
                    // SPHCCodeSNo = e["SPHCCodeSNo"].ToString(),
                    // SPHCCode = e["SPHCCode"].ToString(),
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
                    //.ToString() + ' ' + e["SLIDate"].ToString(),
                });
                //DateTime.ParseExact(e["BookingDate"].ToString(), "yyyy-MM-dd",                                       System.Globalization.CultureInfo.InvariantCulture)
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
                
      catch(Exception ex)//(Exception ex)
            {
                throw ex;
            }
        }
        public string GetShipperConsigneeDetails(string UserType, string FieldType, Int32 SNO)
        {

            try
            {
                SqlParameter[] Parameters = { new SqlParameter("@UserType", UserType), new SqlParameter("@FieldType", FieldType), new SqlParameter("@SNO", SNO) };
                DataSet ds = SqlHelper.ExecuteDataset(DMLConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, "GetSLIShipperConsigneeDetails", Parameters);
                ds.Dispose();
                return CargoFlash.Cargo.Business.Common.CompleteDStoJSON(ds);
            }
                
      catch(Exception ex)//(Exception ex)
            {
                throw ex;
            }
        }


        public string GetProcessSequence(string ProcessName)
        {
            try
            {
                int usersno = ((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).UserSNo;
                SqlParameter[] Parameters = { new SqlParameter("@ProcessName", ProcessName), new SqlParameter("@UserSNo", usersno) };
                DataSet ds = SqlHelper.ExecuteDataset(DMLConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, "GetProcessSequence_SLI", Parameters);
                ds.Dispose();
                return CargoFlash.Cargo.Business.Common.CompleteDStoJSON(ds);
            }
            catch(Exception ex)//(Exception ex)
            {
                throw ex;
            }
        }
        public string GetSLIChargeHeader()
        {
            try
            {
                DataSet ds = SqlHelper.ExecuteDataset(DMLConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, "GetSLIChargeHeader");
                ds.Dispose();
                return CargoFlash.Cargo.Business.Common.CompleteDStoJSON(ds);
            }
            catch(Exception ex)//(Exception ex)
            {
                throw ex;
            }
        }
        public string UpdateShipperAndConsigneeInformation(Int32 SLISNo, SLIShipperInformation ShipperInformation, SLIConsigneeInformation ConsigneeInformation, Int32 ShipperSno, Int32 ConsigneeSno)
        {
             
            List<SLIShipperInformation> lstShipperInformation = new List<SLIShipperInformation>();
            lstShipperInformation.Add(ShipperInformation);
            DataTable dtShipperInformation = CollectionHelper.ConvertTo(lstShipperInformation, "");
            BaseBusiness baseBusiness = new BaseBusiness();


            List<SLIConsigneeInformation> lstConsigneeInformation = new List<SLIConsigneeInformation>();
            lstConsigneeInformation.Add(ConsigneeInformation);
            DataTable dtConsigneeInformation = CollectionHelper.ConvertTo(lstConsigneeInformation, "");


            SqlParameter paramShipperInformation = new SqlParameter();
            paramShipperInformation.ParameterName = "@ShipperInformation";
            paramShipperInformation.SqlDbType = System.Data.SqlDbType.Structured;
            paramShipperInformation.Value = dtShipperInformation;


            SqlParameter paramConsigneeInformation = new SqlParameter();
            paramConsigneeInformation.ParameterName = "@ConsigneeInformation";
            paramConsigneeInformation.SqlDbType = System.Data.SqlDbType.Structured;
            paramConsigneeInformation.Value = dtConsigneeInformation;



            DataSet ds = new DataSet();
            SqlParameter[] Parameters = { new SqlParameter("@SLISNo", SLISNo), paramShipperInformation, paramConsigneeInformation, new SqlParameter("@ShipperSno", ShipperSno), new SqlParameter("@ConsigneeSno", ConsigneeSno), new SqlParameter("@LoginCitySNo", ((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).CitySNo.ToString()), new SqlParameter("@LoginAirPortSNo", ((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).AirportSNo.ToString()), new SqlParameter("@UpdatedBy", ((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).UserSNo.ToString()) };//Add LoginCitySNo Here,and LoginAirport 
            DataSet ds1 = new DataSet();
            try
            {
                ds = SqlHelper.ExecuteDataset(DMLConnectionString.WebConfigConnectionString, "UpdateSLIShipperAndConsigneeInformation", Parameters);
                return ds.Tables[ds.Tables.Count - 1].Rows[0][0].ToString();
            }
            catch(Exception ex)//(Exception ex)
            {
                throw ex;
            }
        }

        public string SaveSLInfo(string AWBNo, Int32 SLISNo, string SLINo, int SLIType, SLIAWBInfo ShipmentInformation)
        {

            List<SLIAWBInfo> lstShipmentInformation = new List<SLIAWBInfo>();
            lstShipmentInformation.Add(ShipmentInformation);
            DataTable dtShipmentInformation = CollectionHelper.ConvertTo(lstShipmentInformation, "");
            BaseBusiness baseBusiness = new BaseBusiness();
            SqlParameter paramShipmentInformation = new SqlParameter();
            paramShipmentInformation.ParameterName = "@ShipmentInformation";
            paramShipmentInformation.SqlDbType = System.Data.SqlDbType.Structured;
            paramShipmentInformation.Value = dtShipmentInformation;

            DataSet ds = new DataSet();
            SqlParameter[] Parameters = { new SqlParameter("@AWBNo", AWBNo), new SqlParameter("@SLISNo", SLISNo), new SqlParameter("@SLINo", SLINo), new SqlParameter("@SLIType", SLIType), paramShipmentInformation, new SqlParameter("@LoginCitySNo", ((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).CitySNo.ToString()), new SqlParameter("@LoginAirPortSNo", ((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).AirportSNo.ToString()), new SqlParameter("@UpdatedBy", ((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).UserSNo.ToString()) };//Add LoginCitySNo Here,and LoginAirport 
            DataSet ds1 = new DataSet();
            try
            {
                ds = SqlHelper.ExecuteDataset(DMLConnectionString.WebConfigConnectionString, "saveSLIAWBInfo", Parameters);
                return ds.Tables[ds.Tables.Count - 1].Rows[0][0].ToString();
            }
            catch(Exception ex)//(Exception ex)
            {
                throw ex;
            }
        }
        public string GetSLIAWBInformation(Int32 SLISNO)
        {

            try
            {
                SqlParameter[] Parameters = { new SqlParameter("@SLISNO", SLISNO), new SqlParameter("@UserSNo", ((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).UserSNo.ToString()) };
                DataSet ds = SqlHelper.ExecuteDataset(DMLConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, "GetSLIAWBInformation", Parameters);
                ds.Dispose();

                return CargoFlash.Cargo.Business.Common.CompleteDStoJSON(ds);
            }
            catch(Exception ex)//(Exception ex)
            {
                throw ex;
            }
        }
        public string GetSLIAWBDetails(Int32 SLISNo)
        {
            try
            {
                SqlParameter[] Parameters = { new SqlParameter("@SLISNo", SLISNo) };
                DataSet ds = SqlHelper.ExecuteDataset(DMLConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, "GetSLInfoDetails", Parameters);
                ds.Dispose();

                return CargoFlash.Cargo.Business.Common.CompleteDStoJSON(ds);
            }
            catch(Exception ex)//(Exception ex)
            {
                throw ex;
            }
        }
        public string GetRecordAtLocation(Int32 SLISNo)
        {
            try
            {
                SqlParameter[] Parameters = { new SqlParameter("@SLISNo", SLISNo) };
                DataSet ds = SqlHelper.ExecuteDataset(DMLConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, "GetRecordAtSLILocation", Parameters);
                ds.Dispose();
                return CargoFlash.Cargo.Business.Common.CompleteDStoJSON(ds);
            }
            catch(Exception ex)//(Exception ex)
            {
                throw ex;
            }
        }
        public string ValidateULD(string ULDType, string ULDNo, string OwnerCode, string SLISNo, string ULDSHCCode, string CitySNo)
        {
            try
            {
                SqlParameter[] Parameters = { new SqlParameter("@ULDType", ULDType), new SqlParameter("@ULDNo", ULDNo), new SqlParameter("@OwnerCode", OwnerCode), new SqlParameter("@SLISNo", SLISNo), new SqlParameter("@ULDSHCCode", ULDSHCCode), new SqlParameter("@CitySNo", CitySNo) };
                DataSet ds = SqlHelper.ExecuteDataset(DMLConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, "ValidateULD", Parameters);
                ds.Dispose();
                return CargoFlash.Cargo.Business.Common.CompleteDStoJSON(ds);
            }
            catch(Exception ex)//(Exception ex)
            {
                throw ex;
            }
        }

        public string GetSLIUnloadingDetails(Int32 SLISNO)
        {
            try
            {
                SqlParameter[] Parameters = { new SqlParameter("@SLISNO", SLISNO) };
                DataSet ds = SqlHelper.ExecuteDataset(DMLConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, "GetSLIUnloadingDetails", Parameters);
                ds.Dispose();
                return CargoFlash.Cargo.Business.Common.CompleteDStoJSON(ds);
            }
            catch(Exception ex)//(Exception ex)
            {
                throw ex;
            }
        }
        public string GetShipperAndConsigneeInformation(Int32 SLISNO)
        {
            try
            {
                SqlParameter[] Parameters = { new SqlParameter("@SLISNO", SLISNO) };
                DataSet ds = SqlHelper.ExecuteDataset(DMLConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, "GetSLIShipperAndConsigneeInformation", Parameters);
                ds.Dispose();
                return CargoFlash.Cargo.Business.Common.CompleteDStoJSON(ds);
            }
            catch(Exception ex)//(Exception ex)
            {
                throw ex;
            }
        }
        public string GetSLIDimemsionsAndULD(Int32 SLISNO)
        {
            try
            {
                SqlParameter[] Parameters = { new SqlParameter("@SLISNO", SLISNO) };
                DataSet ds = SqlHelper.ExecuteDataset(DMLConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, "GetSLIDimemsionsAndULD", Parameters);
                ds.Dispose();
                return CargoFlash.Cargo.Business.Common.CompleteDStoJSON(ds);
            }
            catch(Exception ex)//(Exception ex)
            {
                throw ex;
            }
        }

        public string GetSLICode()
        {

            try
            {
                DataSet ds = SqlHelper.ExecuteDataset(DMLConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, "GetSLICode");
                ds.Dispose();
                return CargoFlash.Cargo.Business.Common.CompleteDStoJSON(ds);
            }
            catch(Exception ex)//(Exception ex)
            {
                throw ex;
            }
        }

        public string GetSLIAWBExist(string AWBNo, string SLINo, string AccountSNo, string AirlineSNo)
        {
            try
            {
                SqlParameter[] Parameters = { new SqlParameter("@AWBNo", AWBNo), new SqlParameter("@SLINo", SLINo), new SqlParameter("@AccountSNo", AccountSNo), new SqlParameter("@AirlineSNo", AirlineSNo) };
                DataSet ds = SqlHelper.ExecuteDataset(DMLConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, "CheckALIAWBExist", Parameters);
                ds.Dispose();
                return Convert.ToString(ds.Tables[0].Rows[0][0]);
            }
            catch(Exception ex)//(Exception ex)
            {
                throw ex;
            }
        }
        public string CheckFWBSHipmentonSLI(string SLINo, string SLISNo, string AWBNo)
        {
            try
            {
                SqlParameter[] Parameters = { new SqlParameter("@SLINo", SLINo), new SqlParameter("@SLISNo", SLISNo), new SqlParameter("@AWBNo", AWBNo) };
                DataSet ds = SqlHelper.ExecuteDataset(DMLConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, "CheckFWBSHipmentonSLI", Parameters);
                ds.Dispose();
                return Convert.ToString(ds.Tables[0].Rows[0][0]);
            }
            catch(Exception ex)//(Exception ex)
            {
                throw ex;
            }
        }

        public string GetSLIAirlineCode(Int32 AirlineSNo)
        {
            try
            {
                SqlParameter[] Parameters = { new SqlParameter("@AirlineSNo", AirlineSNo) };
                DataSet ds = SqlHelper.ExecuteDataset(DMLConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, "GetSLIAirlineCode", Parameters);
                ds.Dispose();
                return CargoFlash.Cargo.Business.Common.CompleteDStoJSON(ds);
            }
            catch(Exception ex)//(Exception ex)
            {
                throw ex;
            }
        }

        public string GetSLIChargesHeader(Int32 SLISNO)
        {
            try
            {
                SqlParameter[] Parameters = { new SqlParameter("@SLISNO", SLISNO) };
                DataSet ds = SqlHelper.ExecuteDataset(DMLConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, "GetSLIChargeHeader", Parameters);
                ds.Dispose();
                return CargoFlash.Cargo.Business.Common.CompleteDStoJSON(ds);
            }
            catch(Exception ex)//(Exception ex)
            {
                throw ex;
            }
        }



        public string UpdateSLIUnloading(Int32 SLISNo, List<SLIUnloading> UnloadingArray, int IsFinalize)
        {
            DataTable dtUnloadingArray = CollectionHelper.ConvertTo(UnloadingArray, "");
            BaseBusiness baseBusiness = new BaseBusiness();
            SqlParameter paramSLIUnloadingArray = new SqlParameter();
            paramSLIUnloadingArray.ParameterName = "@SLIUnloadingType";
            paramSLIUnloadingArray.SqlDbType = System.Data.SqlDbType.Structured;
            paramSLIUnloadingArray.Value = dtUnloadingArray;

            DataSet ds = new DataSet();
            SqlParameter[] Parameters = { new SqlParameter("@SLISNo", SLISNo), paramSLIUnloadingArray, new SqlParameter("@LoginCitySNo", ((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).CitySNo.ToString()), new SqlParameter("@LoginAirPortSNo", ((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).AirportSNo.ToString()), new SqlParameter("@UpdatedBy", ((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).UserSNo.ToString()), new SqlParameter("@IsFinalize", IsFinalize) };//Add LoginCitySNo Here,and LoginAirport 
            DataSet ds1 = new DataSet();
            try
            {
                ds = SqlHelper.ExecuteDataset(DMLConnectionString.WebConfigConnectionString, "UpdateSLIUnloading", Parameters);
                return ds.Tables[ds.Tables.Count - 1].Rows[0][0].ToString();
            }
            catch(Exception ex)//(Exception ex)
            {
                throw ex;
            }
        }

        public string UpdateSLIDimemsionsAndULD(Int32 SLISNo, List<SLIDimensions> Dimensions, List<SLIULDDimensions> ULDDimensions)
        {
            DataTable dtDimensions = CollectionHelper.ConvertTo(Dimensions, "");
            DataTable dtULDDimensions = CollectionHelper.ConvertTo(ULDDimensions, "");
            BaseBusiness baseBusiness = new BaseBusiness();
            SqlParameter paramDimensions = new SqlParameter();
            paramDimensions.ParameterName = "@DimensionsType";
            paramDimensions.SqlDbType = System.Data.SqlDbType.Structured;
            paramDimensions.Value = dtDimensions;

            SqlParameter paramULDDimensions = new SqlParameter();
            paramULDDimensions.ParameterName = "@ULDDimensionsType";
            paramULDDimensions.SqlDbType = System.Data.SqlDbType.Structured;
            paramULDDimensions.Value = dtULDDimensions;
            DataSet ds = new DataSet();
            SqlParameter[] Parameters = { new SqlParameter("@SLISNo", SLISNo), paramDimensions, paramULDDimensions, new SqlParameter("@LoginCitySNo", ((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).CitySNo.ToString()), new SqlParameter("@LoginAirPortSNo", ((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).AirportSNo.ToString()), new SqlParameter("@UpdatedBy", ((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).UserSNo.ToString()) };//Add LoginCitySNo Here,and LoginAirport 
            DataSet ds1 = new DataSet();
            try
            {
                ds = SqlHelper.ExecuteDataset(DMLConnectionString.WebConfigConnectionString, "UpdateSLIDimemsionsAndULD", Parameters);
                return ds.Tables[ds.Tables.Count - 1].Rows[0][0].ToString();
            }
            catch(Exception ex)//(Exception ex)
            {
                throw ex;
            }
        }
        public string UpdateSLIChargesHeader(Int32 SLISNo, List<SLIChargesHeader> ChargesHeader)
        {
            DataTable dtChargeHeader = CollectionHelper.ConvertTo(ChargesHeader, "");
            BaseBusiness baseBusiness = new BaseBusiness();
            SqlParameter paramSLIChargeHeader = new SqlParameter();
            paramSLIChargeHeader.ParameterName = "@SLIChargeHeaderType";
            paramSLIChargeHeader.SqlDbType = System.Data.SqlDbType.Structured;
            paramSLIChargeHeader.Value = dtChargeHeader;

            DataSet ds = new DataSet();
            SqlParameter[] Parameters = { new SqlParameter("@SLISNo", SLISNo), paramSLIChargeHeader, new SqlParameter("@LoginCitySNo", ((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).CitySNo.ToString()), new SqlParameter("@LoginAirPortSNo", ((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).AirportSNo.ToString()), new SqlParameter("@UpdatedBy", ((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).UserSNo.ToString()) };//Add LoginCitySNo Here,and LoginAirport 
            DataSet ds1 = new DataSet();
            try
            {
                ds = SqlHelper.ExecuteDataset(DMLConnectionString.WebConfigConnectionString, "UpdateSLIChargesHeader", Parameters);
                return ds.Tables[ds.Tables.Count - 1].Rows[0][0].ToString();
            }
            catch(Exception ex)//(Exception ex)
            {
                throw ex;
            }
        }
        public string GetSliRecord(Int32 SLISNo)
        {
            try
            {
                SqlParameter[] Parameters = { new SqlParameter("@SNo", SLISNo) };
                DataSet ds = SqlHelper.ExecuteDataset(ReadConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, "GetSliRecord", Parameters);
                return CargoFlash.Cargo.Business.Common.CompleteDStoJSON(ds);
            }
            catch(Exception ex)//(Exception ex)
            {
                throw ex;
            }
        }

        public string GetSLITemperature(string sphcCodeSNo)
        {
            try
            {
                SqlParameter[] Parameters = { new SqlParameter("@SPHCCodeSNo", sphcCodeSNo.TrimEnd(',')) };
                DataSet ds = SqlHelper.ExecuteDataset(DMLConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, "GetSLITemperature", Parameters);
                ds.Dispose();
                return CargoFlash.Cargo.Business.Common.CompleteDStoJSON(ds);
            }
            catch(Exception ex)//(Exception ex)
            {
                throw ex;
            }
        }
        public string CheckSLIPriorApprovalForSHC(string SHCSNo, string SLISNo, string DestinationAirportSNo)
        {
            try
            {
                SqlParameter[] Parameters = { new SqlParameter("@SHCSNo", SHCSNo), new SqlParameter("@SLISNo", Convert.ToInt32(SLISNo)), new SqlParameter("@DestinationAirportSNo", Convert.ToInt32(DestinationAirportSNo)) };
                DataSet ds = SqlHelper.ExecuteDataset(DMLConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, "CheckSLIPriorApprovalForSHC", Parameters);
                ds.Dispose();
                return CargoFlash.Cargo.Business.Common.CompleteDStoJSON(ds);
            }
            catch(Exception ex)//(Exception ex)
            {
                throw ex;
            }
        }

        public string SaveAtLocation(Int32 AWBSNo, List<SLIAWBLocation> lsAWBLocation, List<SLIULDLocation> lsULDLocation, bool ScanType, int UpdatedBy, int SLISNo)
        {
            string Message = "";
            DataTable dtAWBGroup = CollectionHelper.ConvertTo(lsAWBLocation, "");
            DataTable dtUldLocation = CollectionHelper.ConvertTo(lsULDLocation, "");

            SqlParameter paramLocationXRay = new SqlParameter();
            paramLocationXRay.ParameterName = "@AWBLocation";
            paramLocationXRay.SqlDbType = System.Data.SqlDbType.Structured;
            paramLocationXRay.Value = dtAWBGroup;

            SqlParameter paramUldLocation = new SqlParameter();
            paramUldLocation.ParameterName = "@SLACUldLocation";
            paramUldLocation.SqlDbType = System.Data.SqlDbType.Structured;
            paramUldLocation.Value = dtUldLocation;

            SqlParameter[] Parameters = { new SqlParameter("@AWBSNo", AWBSNo), paramLocationXRay, paramUldLocation, new SqlParameter("@ScanType", ScanType), new SqlParameter("@UpdatedBy", ((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).UserSNo.ToString()), new SqlParameter("@SLISNo", SLISNo) };
            DataSet ds = new DataSet();
            try
            {
                ds = SqlHelper.ExecuteDataset(DMLConnectionString.WebConfigConnectionString, "SaveAtSLILocation", Parameters);
                return ds.Tables[ds.Tables.Count - 1].Rows[0][0].ToString();
            }
            catch(Exception ex)//(Exception ex)
            {
                throw ex;
            }
        }


        public string checkCCAirline(string AirlineSNo, string DestinationAirportSNo, string ChargeCode)
        {
            try
            {
                SqlParameter[] Parameters = { new SqlParameter("@AirlineSNo", Convert.ToInt32(AirlineSNo)), new SqlParameter("@DestinationAirportSNo", Convert.ToInt32(DestinationAirportSNo)), new SqlParameter("@ChargeCode", ChargeCode) };
                DataSet ds = SqlHelper.ExecuteDataset(DMLConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, "CheckSLICCAirline", Parameters);
                ds.Dispose();
                return CargoFlash.Cargo.Business.Common.CompleteDStoJSON(ds);
            }
            catch(Exception ex)//(Exception ex)
            {
                throw ex;
            }
        }


        public string GetSLIULDDetails(string ULDNo)
        {
            try
            {
                SqlParameter[] Parameters = { new SqlParameter("@ULDNo", ULDNo) };
                DataSet ds = SqlHelper.ExecuteDataset(DMLConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, "GetSLIULDDetails", Parameters);
                ds.Dispose();
                return CargoFlash.Cargo.Business.Common.CompleteDStoJSON(ds);
            }
            catch(Exception ex)//(Exception ex)
            {
                throw ex;
            }
        }


        public string saveULDInfo(string ULDNo, int SLISNo, ULDDetails ULDINFO, List<SLIOverhangTrans> SLIOverhangTrans, SLIOverhangPallet SLIOverhangPallet)
        {
            List<ULDDetails> lstULDDetails = new List<ULDDetails>();
            lstULDDetails.Add(ULDINFO);

            DataTable dtULDDetails = CollectionHelper.ConvertTo(lstULDDetails, "");

            List<SLIOverhangPallet> lstULDBuildUpOverhangPallet = new List<SLIOverhangPallet>();
            lstULDBuildUpOverhangPallet.Add(SLIOverhangPallet);

            DataTable dtOverhangMaster = CollectionHelper.ConvertTo(lstULDBuildUpOverhangPallet, "");
            DataTable dtOverhangTrans = CollectionHelper.ConvertTo(SLIOverhangTrans, "");

            BaseBusiness baseBusiness = new BaseBusiness();

            SqlParameter paramULDDetails = new SqlParameter();
            paramULDDetails.ParameterName = "@ULDDetails";
            paramULDDetails.SqlDbType = System.Data.SqlDbType.Structured;
            paramULDDetails.Value = dtULDDetails;


            SqlParameter paramOverhangMaster = new SqlParameter();
            paramOverhangMaster.ParameterName = "@OverhangMaster";
            paramOverhangMaster.SqlDbType = System.Data.SqlDbType.Structured;
            paramOverhangMaster.Value = dtOverhangMaster;

            SqlParameter paramOverhangTrans = new SqlParameter();
            paramOverhangTrans.ParameterName = "@OverhangTrans";
            paramOverhangTrans.SqlDbType = System.Data.SqlDbType.Structured;
            paramOverhangTrans.Value = dtOverhangTrans;

            DataSet ds = new DataSet();
            SqlParameter[] Parameters = { 
                                            paramULDDetails,                                    
                                            paramOverhangMaster,
                                            paramOverhangTrans,                                            
                                            new SqlParameter("@SLISNo", SLISNo), 
                                            new SqlParameter("@ULDNo",ULDNo),
                                            new SqlParameter("@UpdatedBy", ((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).UserSNo.ToString()),
                                        };
            DataSet ds1 = new DataSet();
            try
            {
                ds = SqlHelper.ExecuteDataset(DMLConnectionString.WebConfigConnectionString, "saveSLIULDInfo", Parameters);
                return ds.Tables[ds.Tables.Count - 1].Rows[0][0].ToString();
            }
            catch(Exception ex)//(Exception ex)
            {
                throw ex;
            }

        }


        public string CheckULDLWH(string ULDTypeSNo)
        {
            SqlParameter[] Parameters = { new SqlParameter("@ULDTypeSNo", ULDTypeSNo) };
            DataSet ds = SqlHelper.ExecuteDataset(DMLConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, "spCheckULDLWH", Parameters);
            ds.Dispose();
            return CargoFlash.Cargo.Business.Common.CompleteDStoJSON(ds);
        }

        public string GetWeighingScaleWeight(int UserSNo, int SLIAWBSNo, int Pieces, int SubProcessSNo, string UldNo)
        {
            string scaleWeight = string.Empty;
            SqlParameter[] Param = { new SqlParameter("@UserSNo", UserSNo) };
            DataSet ds = SqlHelper.ExecuteDataset(DMLConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, "spUsers_WeighingScale", Param);
            if (ds != null && ds.Tables.Count > 0)
            {
                if (ds.Tables[0].Rows.Count > 0)
                {
                    try
                    {
                        DataRow dr = ds.Tables[0].Rows[0];
                        FTPFile f = new FTPFile(dr["FTPHostName"].ToString(),
                                            dr["FTPUserId"].ToString(),
                                            dr["FTPPassword"].ToString());

                        scaleWeight = f.ReadFileText(dr["FtpFolderPath"].ToString());
                        f.delete(dr["FtpFolderPath"].ToString());

                        SqlParameter[] Parameter = { new SqlParameter("@SLIAWBSNo",SLIAWBSNo),
                                                    new SqlParameter("@UserSNo",UserSNo),
                                                    new SqlParameter("@Pieces",Pieces),
                                                    new SqlParameter("@SubProcessSNo",SubProcessSNo),
                                                    new SqlParameter("@ULDNo",UldNo),
                                                    new SqlParameter("@ScaleWeight",scaleWeight)};
                        SqlHelper.ExecuteScalar(DMLConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, "spSLInfo_ScaleWeightLog", Parameter);
                    }
                    catch(Exception ex)//(Exception ex)
                    {
                        throw ex;
                    }
                }

            }
            return scaleWeight;
        }




        public string saveULDRemarks(int SLISNo, string ULDNo, string Remark)
        {

            DataSet ds = new DataSet();
            SqlParameter[] Parameters = {                                                                                       
                                            new SqlParameter("@SLISNo", SLISNo), 
                                            new SqlParameter("@ULDNo",ULDNo),
                                            new SqlParameter("@Remark",Remark),
                                            new SqlParameter("@UpdatedBy", ((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).UserSNo.ToString()),
                                        };
            DataSet ds1 = new DataSet();
            try
            {
                ds = SqlHelper.ExecuteDataset(DMLConnectionString.WebConfigConnectionString, "saveULDRemarks", Parameters);
                return ds.Tables[ds.Tables.Count - 1].Rows[0][0].ToString();
            }
            catch(Exception ex)//(Exception ex)
            {
                throw ex;
            }

        }


        public string GetSLISHCTempDetails(string SLISNo, string SLINo)
        {
            SqlParameter[] Parameters = { new SqlParameter("@SLISNo", SLISNo), new SqlParameter("@SLINo", SLINo) };
            DataSet ds = SqlHelper.ExecuteDataset(DMLConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, "GetSLISHCTempDetails", Parameters);
            ds.Dispose();
            return CargoFlash.Cargo.Business.Common.CompleteDStoJSON(ds);
        }

        public string saveSLITempDetails(List<SLISHCTemp> SHCTempDetails)
        {
            DataTable dtTempDetails = CollectionHelper.ConvertTo(SHCTempDetails, "");
            BaseBusiness baseBusiness = new BaseBusiness();
            SqlParameter paramTempDetails = new SqlParameter();
            paramTempDetails.ParameterName = "@TempTable";
            paramTempDetails.SqlDbType = System.Data.SqlDbType.Structured;
            paramTempDetails.Value = dtTempDetails;
            DataSet ds = new DataSet();
            SqlParameter[] Parameters = { 
                                          paramTempDetails
                                        };
            DataSet ds1 = new DataSet();
            try
            {
                ds = SqlHelper.ExecuteDataset(DMLConnectionString.WebConfigConnectionString, "saveSLITempDetails", Parameters);
                return ds.Tables[ds.Tables.Count - 1].Rows[0][0].ToString();
            }
            catch(Exception ex)//(Exception ex)
            {
                throw ex;
            }

        }


        public string CheckBOENoExist(string BOENo, string SLISNo, string SLINo)
        {
            try
            {
                SqlParameter[] Parameters = { new SqlParameter("@BOENo", BOENo) ,
            new SqlParameter("@SLISNo", SLISNo), new SqlParameter("@SLINo", SLINo) };
                DataSet ds = SqlHelper.ExecuteDataset(DMLConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, "CheckBOENoExist", Parameters);
                ds.Dispose();
                return CargoFlash.Cargo.Business.Common.CompleteDStoJSON(ds);
            }
            catch(Exception ex)//(Exception ex)
            {
                throw ex;
            }
        }


        public string UpdatePrintCount(int SLISNo)
        {

            BaseBusiness baseBusiness = new BaseBusiness();
            SqlParameter[] Parameters = { new SqlParameter("@SLISNo", SLISNo), new SqlParameter("@UpdatedBy", ((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).UserSNo) };
            DataSet ds = new DataSet();
            try
            {
                ds = SqlHelper.ExecuteDataset(DMLConnectionString.WebConfigConnectionString, "UpdatePrintCount", Parameters);
                return ds.Tables[ds.Tables.Count - 1].Rows[0][0].ToString();
            }
            catch(Exception ex)//(Exception ex)
            {
                throw ex;
            }
        }


        public string saveSLIFWBDetails(string SLINo, string SLISNo, string AWBNo)
        {
            BaseBusiness baseBusiness = new BaseBusiness();
            SqlParameter[] Parameters = { new SqlParameter("@SLINo", SLINo), new SqlParameter("@SLISNo", SLISNo), new SqlParameter("@AWBNo", AWBNo), new SqlParameter("@UpdatedBy", ((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).UserSNo), new SqlParameter("@LoginCitySNo", ((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).CitySNo), new SqlParameter("@LoginAirPortSNo", ((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).AirportSNo) };
            DataSet ds = new DataSet();
            try
            {
                ds = SqlHelper.ExecuteDataset(DMLConnectionString.WebConfigConnectionString, "saveSLIFWBDetails", Parameters);
                return ds.Tables[ds.Tables.Count - 1].Rows[0][0].ToString();
            }
            catch(Exception ex)//(Exception ex)
            {
                throw ex;
            }
        }

        public string saveSLIFWBDetailsWithAgent(string SLINo, string SLISNo, string AWBNo, int AgentSNo)
        {
            BaseBusiness baseBusiness = new BaseBusiness();
            SqlParameter[] Parameters = { new SqlParameter("@SLINo", SLINo), new SqlParameter("@SLISNo", SLISNo), new SqlParameter("@AWBNo", AWBNo), new SqlParameter("@AgentSNo", AgentSNo), new SqlParameter("@UpdatedBy", ((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).UserSNo), new SqlParameter("@LoginCitySNo", ((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).CitySNo), new SqlParameter("@LoginAirPortSNo", ((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).AirportSNo) };
            DataSet ds = new DataSet();
            try
            {
                ds = SqlHelper.ExecuteDataset(DMLConnectionString.WebConfigConnectionString, "saveSLIFWBDetailsWithAgent", Parameters);
                return ds.Tables[ds.Tables.Count - 1].Rows[0][0].ToString();
            }
            catch(Exception ex)//(Exception ex)
            {
                throw ex;
            }
        }



        public string GetequipmentDetails(string SLISNo, string SLINo, string ULDNo, string LooseSNo)
        {
            try
            {
                SqlParameter[] Parameters = { new SqlParameter("@SLISNo", SLISNo), new SqlParameter("@SLINo", SLINo), new SqlParameter("@ULDNo", ULDNo), new SqlParameter("@LooseSNo", LooseSNo) };
                DataSet ds = SqlHelper.ExecuteDataset(DMLConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, "GetSLIEquipement", Parameters);
                ds.Dispose();
                return CargoFlash.Cargo.Business.Common.CompleteDStoJSON(ds);
            }
            catch(Exception ex)//(Exception ex)
            {
                throw ex;
            }
        }


        public string GetSLIEquipmentTareWt(string ConsumableName)
        {
            try
            {
                SqlParameter[] Parameters = { new SqlParameter("@ConsumableName", ConsumableName) };
                DataSet ds = SqlHelper.ExecuteDataset(DMLConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, "GetSLIEquipmentTareWt", Parameters);
                ds.Dispose();
                return CargoFlash.Cargo.Business.Common.CompleteDStoJSON(ds);
            }
            catch(Exception ex)//(Exception ex)
            {
                throw ex;
            }
        }
        public string GetSLICosumableTareWeight(string EqType, string Eq, string Count)
        {
            try
            {
                SqlParameter[] Parameters = { new SqlParameter("@ItemName", Eq), new SqlParameter("@EqType", EqType), new SqlParameter("@Count", Count) };
                DataSet ds = SqlHelper.ExecuteDataset(DMLConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, "GetSLICosumableTareWeight", Parameters);
                ds.Dispose();
                return CargoFlash.Cargo.Business.Common.CompleteDStoJSON(ds);
            }
            catch(Exception ex)//(Exception ex)
            {
                throw ex;
            }
        }
        public string saveSLIEquipment(List<SLIEquipment> SLIEqDetailsTrans)
        {
            DataTable dtSLIEqDetailsTrans = CollectionHelper.ConvertTo(SLIEqDetailsTrans, "");
            BaseBusiness baseBusiness = new BaseBusiness();
            SqlParameter paramTempDetails = new SqlParameter();
            paramTempDetails.ParameterName = "@equipment";
            paramTempDetails.SqlDbType = System.Data.SqlDbType.Structured;
            paramTempDetails.Value = dtSLIEqDetailsTrans;
            DataSet ds = new DataSet();
            SqlParameter[] Parameters = { 
                                          paramTempDetails
                                        };
            DataSet ds1 = new DataSet();
            try
            {
                ds = SqlHelper.ExecuteDataset(DMLConnectionString.WebConfigConnectionString, "saveSLIEquipment", Parameters);
                return CargoFlash.Cargo.Business.Common.CompleteDStoJSON(ds);
            }
            catch(Exception ex)//(Exception ex)
            {
                throw ex;
            }
        }
        public string GetBupDetails(string SLISNo)
        {
            try
            {
                SqlParameter[] Parameters = { new SqlParameter("@SLISNo", Convert.ToInt32(SLISNo)) };
                DataSet ds = SqlHelper.ExecuteDataset(DMLConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, "GetSLIBupDetails", Parameters);
                ds.Dispose();
                return CargoFlash.Cargo.Business.Common.CompleteDStoJSON(ds);
            }
            catch(Exception ex)//(Exception ex)
            {
                throw ex;
            }
        }

        public string Reserved(string AWBNo)
        {
            try
            {
                SqlParameter[] Parameters = { new SqlParameter("@AWBNo", AWBNo) };
                DataSet ds = SqlHelper.ExecuteDataset(DMLConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, "GetReservedRec", Parameters);
                ds.Dispose();
                return CargoFlash.Cargo.Business.Common.CompleteDStoJSON(ds);
            }
            catch(Exception ex)//(Exception ex)
            {
                throw ex;
            }
        }


        public string GETHAWBInfo(string SLINo)
        {
            SqlParameter[] Parameters = { new SqlParameter("@SLINo", SLINo) };
            DataSet ds = new DataSet();
            try
            {
                ds = SqlHelper.ExecuteDataset(DMLConnectionString.WebConfigConnectionString, "GetSLIHAWBInfo", Parameters);
                return CargoFlash.Cargo.Business.Common.CompleteDStoJSON(ds);
            }
            catch(Exception ex)//(Exception ex)
            {
                throw ex;
            }
        }

        /***********************************SLI Cancellation Start*************************************************/
        public string GetRecordAtSubprocessSLIPayment(string CityCode, Int32 AWBSNO, Int32 SLISNo, Int32 SubprocessSNo)
        {
            try
            {
                SqlParameter[] Parameters = { new SqlParameter("@CityCode", CityCode), new SqlParameter("@AWBSNO", AWBSNO), new SqlParameter("@SLISNo", SLISNo), new SqlParameter("@SubprocessSNo", SubprocessSNo) };
                DataSet ds = SqlHelper.ExecuteDataset(DMLConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, "GetRecordAtSubprocessSLIPayment", Parameters);
                ds.Dispose();
                return CargoFlash.Cargo.Business.Common.CompleteDStoJSON(ds);
            }
            catch(Exception ex)//(Exception ex)
            {
                throw ex;
            }
        }
        public string GetSLICancellation(string SLISNo)
        {
            try
            {
                SqlParameter[] Parameters = { new SqlParameter("@SLISNo", Convert.ToInt32(SLISNo)) };
                DataSet ds = SqlHelper.ExecuteDataset(DMLConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, "GetSLICancellation", Parameters);
                ds.Dispose();
                return CargoFlash.Cargo.Business.Common.CompleteDStoJSON(ds);
            }
            catch(Exception ex)//(Exception ex)
            {
                throw ex;
            }
        }

        public string saveSLICANCELLATION(int SLISNo, List<CancellationArray> CancellationArray)
        {
            DataTable dtCancellationArray = CollectionHelper.ConvertTo(CancellationArray, "");
            BaseBusiness baseBusiness = new BaseBusiness();
            SqlParameter paramSLICancellationArray = new SqlParameter();
            paramSLICancellationArray.ParameterName = "@Tbl";
            paramSLICancellationArray.SqlDbType = System.Data.SqlDbType.Structured;
            paramSLICancellationArray.Value = dtCancellationArray;

            DataSet ds = new DataSet();
            SqlParameter[] Parameters = { new SqlParameter("@SLISNo", SLISNo), paramSLICancellationArray };
            DataSet ds1 = new DataSet();
            try
            {
                ds = SqlHelper.ExecuteDataset(DMLConnectionString.WebConfigConnectionString, "saveSLICANCELLATION", Parameters);
                return ds.Tables[ds.Tables.Count - 1].Rows[0][0].ToString();
            }
            catch(Exception ex)//(Exception ex)
            {
                throw ex;
            }

        }

        /***********************************SLI Cancellation End*************************************************/
    }
}
