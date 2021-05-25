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
using CargoFlash.Cargo.Model.Rate;
using System.Net;
using System.Web.UI;

namespace CargoFlash.Cargo.DataService.Shipment
{
    #region Reservation Service Description
    /*
	*****************************************************************************
	Service Name:	ReservationService      
	Purpose:		This Service used to get details of Reservation save update Search and delete
	Company:		CargoFlash Infotech Pvt Ltd.
	Author:			Tarun Kumar
	Created On:		03 Jan 2017
    Updated By:    
	Updated On:	
	Approved By:    
	Approved On:	
	*****************************************************************************
	*/
    #endregion

    [GlobalErrorHandlerBehaviour(typeof(GlobalErrorHandler))]
    [ServiceBehavior(IncludeExceptionDetailInFaults = true)]
    [AspNetCompatibilityRequirements(RequirementsMode = AspNetCompatibilityRequirementsMode.Allowed)]
    public class ReservationBookingService : BaseWebUISecureObject, IReservationBookingService
    {
        public Stream GetWebForm(ReservationGetWebForm model)
        {
            return BuildWebForm(model.processName, model.moduleName, model.appName, model.Action, "", (model.IsSubModule == "1"));
        }

        public Stream GetGridData(ReservationGetGridData model)
        {
            return BuildWebForm(model.processName, model.moduleName, model.appName, model.Action, OriginCity: model.OriginCity, DestinationCity: model.DestinationCity, FlightNo: model.FlightNo, FlightDate: model.FlightDate, AWBPrefix: model.AWBPrefix, AWBNo: model.AWBNo, LoggedInCity: model.LoggedInCity, ReferenceNo: model.ReferenceNo, OriginAirport:model.OriginAirport, DestinationAirport:model.DestinationAirport, AWBStatus:model.AWBStatus);
        }

        private Stream BuildWebForm(string processName, string moduleName, string appName, string formAction, string recordID = "", bool IsSubModule = true, string AWBSNo = "", string CheckListTypeSNo = "", string OriginCity = "", string DestinationCity = "", string FlightNo = "", string FlightDate = "", string AWBPrefix = "", string AWBNo = "", string HAWBNo = "", string LoggedInCity = "", string FlightStatus = "", string FlightSNo = "", string SPHCSNo = "", string ChecklistTypeName = "", string Column1Name = "", string Column2Name = "", string Column3Name = "", string ReferenceNo = "", string OriginAirport = "", string DestinationAirport = "", string AWBStatus = "")
        {
            LoggedInCity = (((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"]))).CityCode;
            this.DisplayMode = "FORMACTION." + formAction.ToUpper().Trim();
            StringBuilder myCurrentForm = new StringBuilder();
            switch (this.DisplayMode)
            {
                case DisplayModeNew:
                    switch (processName)
                    {
                        case "RESERVATIONBOOKING":
                            if (appName.ToUpper().Trim() == "DIMENSION")
                            {
                                using (HtmlFormGenerator htmlFormAdapter = new HtmlFormGenerator(processName))
                                {
                                    htmlFormAdapter.DisplayMode = DisplayModeType.New;
                                    myCurrentForm.Append(htmlFormAdapter.TransInstantiateWithHeader(moduleName, "Dimensions", ValidateOnSubmit: true));
                                    myCurrentForm.Append(htmlFormAdapter.TransInstantiateWithHeader(moduleName, "ULDDimensions", ValidateOnSubmit: true));
                                }
                            }
                            else
                                using (HtmlFormGenerator htmlFormAdapter = new HtmlFormGenerator(processName))
                                {
                                    htmlFormAdapter.DisplayMode = DisplayModeType.New;
                                    myCurrentForm.Append(htmlFormAdapter.InstantiateIn(moduleName, appName, formAction, IsSubModule: IsSubModule));
                                }
                            break;

                            //using (HtmlFormGenerator htmlFormAdapter = new HtmlFormGenerator(processName))
                            //{
                            //    htmlFormAdapter.DisplayMode = DisplayModeType.New;
                            //    myCurrentForm.Append(htmlFormAdapter.InstantiateIn(moduleName, appName, formAction, IsSubModule: IsSubModule));
                            //}
                            //break;
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
                        case "RESERVATIONBOOKING":
                            if (appName.ToUpper().Trim() == "BOOKING")
                                CreateGrid(myCurrentForm, processName, OriginCity, DestinationCity, FlightNo, FlightDate, AWBPrefix, AWBNo, LoggedInCity, ReferenceNo,OriginAirport,DestinationAirport,AWBStatus, isV2: true);
                            break;
                        default:
                            break;
                    }
                    if (processName == "HOUSE" && appName.ToUpper().Trim() == "BOOKING")
                    {

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

        private void CreateGrid(StringBuilder Container, string ProcessName, string OriginCity = "", string DestinationCity = "", string FlightNo = "", string FlightDate = "", string AWBPrefix = "", string AWBNo = "", string LoggedInCity = "", string ReferenceNo = "", string OriginAirport = "", string DestinationAirport = "", string AWBStatus = "", bool isV2 = false)
        {
            using (Grid g = new Grid())
            {

                g.PageName = this.MyPageName;
                g.PrimaryID = this.MyPrimaryID;
                g.ModuleName = this.MyModuleID;
                g.AppsName = this.MyAppID;
                g.IsActionRequired = false;

                g.DataSoruceUrl = "Services/Shipment/ReservationBookingService.svc/GetReservationGridData";
                g.NewURL = MyPageName + "?" + GetWebURLString("New", false);
                g.ServiceModuleName = this.MyModuleID;
                g.UserID = this.MyUserID;
                g.FormCaptionText = "Reservation Booking";
                g.DefaultPageSize = 5;
                g.IsDisplayOnly = false;
                g.IsProcessPart = true;
                g.IsVirtualScroll = false;
                g.IsAllowedFiltering = true;
                g.ProcessName = ProcessName;
                g.IsFormHeader = true;
                g.IsShowGridHeader = true;
                g.IsSortable = false;

                //g.IsRefresh = false;
                //g.IsPager = false;
                //g.IsPageable = false;
                //g.IsPageSizeChange = false;
                g.SuccessGrid = "BindSubProcess";

                string SLICaption = (((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"]))).SysSetting["SLICaption"].ToString();
                string SLiNo, SLIStatus,ICMSEnvironment;
                SLiNo = SLICaption + " No";
                SLIStatus = SLICaption + " Status";
                ICMSEnvironment = (((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"]))).SysSetting["ICMSEnvironment"].ToString().ToUpper();
                g.Column = new List<GridColumn>();
                g.Column.Add(new GridColumn { Field = "AWBSNo", Title = "AWBSNo", DataType = GridDataType.String.ToString(), IsHidden = true });
                g.Column.Add(new GridColumn { Field = "AWBReferenceBookingSNo", Title = "AWBReferenceBookingSNo", DataType = GridDataType.String.ToString(), IsHidden = true });
                if ((((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"]))).SysSetting["ICMSEnvironment"].ToString().ToUpper() == "JT")
                {
                    g.Column.Add(new GridColumn { Field = "BookingRefNo", IsLocked = false, Title = "Booking Ref No", DataType = GridDataType.String.ToString(), IsHidden = true });
                }
                else
                {
                    g.Column.Add(new GridColumn { Field = "BookingRefNo", IsLocked = false, Title = "Booking Ref No", DataType = GridDataType.String.ToString(), Width = 120 });
                }
                g.Column.Add(new GridColumn { Field = "AWBPrefix", IsLocked = false, Title = "Prefix", DataType = GridDataType.String.ToString(), Width = 50 });
                g.Column.Add(new GridColumn { Field = "AWBNo", /*IsLocked = false, Title = "AWB No",*/DataType = GridDataType.String.ToString(),
                    Width = 65,Template= "<span AWBNo=\"#=AWBPrefix#-#=AWBNo#\">#=AWBNo#</span>",
                    Title= "AWBNo"
                    


                    //< div id = 'header-user-options' style = 'top:32px; right: auto; z-index: 120; opacity: 1; float: right; display: none;' class='header-tool-container gradient tool-top tool-rounded'><div class='tool-items'><a class='tool-item gradient' href="Default.cshtml?Module=Security&Apps=Groups&FormAction=Read&UserID=0&RecID=" " style="width:70px""><i class="icon-Read"><span class="actionSpan">Read</span></i></a></div></div><tr><td colspan = '2' >< div id="1dad4738-aa5e-417a-8e11-a443428f1f39"></div>

                    /*<input type=\"hidden\" name=\"hdncheckSNo\" id=\"hdncheckSNo\" value=\"#= AWBNo #\"/>"*/
                    //Template = "# if( BookingDate==null) {# # } else {# #= kendo.toString(new Date(data.BookingDate.getTime() + data.BookingDate.getTimezoneOffset()*60000),\"" + UIDateTimeFormat.UIDateFormatString + "\") # #}#"
                    /*Template = "<a href='/AWBTracking/AWB/AWBNo =#=AWBNo#'>#=AWBNo#</a>"*/
                });
                if ((((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"]))).SysSetting["ICMSEnvironment"].ToString().ToUpper() == "JT")
                {
                    g.Column.Add(new GridColumn { Field = "BookingType", IsLocked = false, Title = "Booking Type", DataType = GridDataType.String.ToString(), IsHidden = true });
                    g.Column.Add(new GridColumn { Field = "Origin", IsLocked = false, Title = "Org", DataType = GridDataType.String.ToString(), Width = 50, IsHidden = true });
                    g.Column.Add(new GridColumn { Field = "Destination", IsLocked = false, Title = "Dest", DataType = GridDataType.String.ToString(), Width = 50, IsHidden = true });
                }
                else
                {
                    g.Column.Add(new GridColumn { Field = "BookingType", IsLocked = false, Title = "Booking Type", DataType = GridDataType.String.ToString() });
                    g.Column.Add(new GridColumn { Field = "Origin", IsLocked = false, Title = "Org", DataType = GridDataType.String.ToString(), Width = 50 });
                    g.Column.Add(new GridColumn { Field = "Destination", IsLocked = false, Title = "Dest", DataType = GridDataType.String.ToString(), Width = 50 });
                }
                   
               
                if ((((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"]))).SysSetting["ICMSEnvironment"].ToString().ToUpper() == "JT")
                {
                    g.Column.Add(new GridColumn { Field = "OrgAirportCode", IsLocked = false, Title = "Org Airport", DataType = GridDataType.String.ToString(), Width = 50 });
                    g.Column.Add(new GridColumn { Field = "DesAirportCode", IsLocked = false, Title = "Dest Airport", DataType = GridDataType.String.ToString(), Width = 50 });
                    g.Column.Add(new GridColumn { Field = "BookingDate", IsLocked = false, Title = "Booking Date", DataType = GridDataType.Date.ToString(), Width = 90,IsHidden=true });
                }
                else
                    g.Column.Add(new GridColumn { Field = "BookingDate", IsLocked = false, Title = "Booking Date", DataType = GridDataType.Date.ToString(), Width = 90, IsHidden = false });

                //g.Column.Add(new GridColumn { Field = "BookingDate", IsLocked = false, Title = "Booking Date", IsHidden = false, DataType = GridDataType.Date.ToString(), Width = 90, Template = "# if( BookingDate==null) {# # } else {# #= kendo.toString(new Date(data.BookingDate.getTime() + data.BookingDate.getTimezoneOffset()*60000),\"" + UIDateTimeFormat.UIDateFormatString + "\") # #}#" });
                //g.Column.Add(new GridColumn { Field = "OfficeName", IsLocked = false, Title = "Office Name", DataType = GridDataType.String.ToString() });
                g.Column.Add(new GridColumn { Field = "AgentName", IsLocked = false, Title = "Agent Name", DataType = GridDataType.String.ToString(), Width = 140 });
                g.Column.Add(new GridColumn { Field = "AWBPieces", IsLocked = false, Title = "Pcs", DataType = GridDataType.String.ToString(), Width = 40 });
                g.Column.Add(new GridColumn { Field = "GrossWeight", IsLocked = false, Title = "Gr. Wt.", DataType = GridDataType.String.ToString(), Width = 60 });
                g.Column.Add(new GridColumn { Field = "Volume", IsLocked = false, Title = "Volume", DataType = GridDataType.String.ToString(), Width = 60, IsHidden = true });
                g.Column.Add(new GridColumn { Field = "AWBStatus", IsLocked = false, Title = "AWB Status", DataType = GridDataType.String.ToString() });
                g.Column.Add(new GridColumn { Field = "InternationalORDomestic", IsLocked = false, Title = "Type", DataType = GridDataType.String.ToString(), Width = 50,IsHidden = ICMSEnvironment=="JT"?true:false });
                g.Column.Add(new GridColumn { Field = "IsCCA", IsLocked = false, Title = "CCA", DataType = GridDataType.String.ToString(), Width = 45 });
                g.Column.Add(new GridColumn { Field = "FlightNo", Title = "Flight No", IsHidden = false, DataType = GridDataType.String.ToString() });
                g.Column.Add(new GridColumn { Field = "FlightDate", Title = "Flight Date", IsHidden = false, DataType = GridDataType.Date.ToString(), Width = 80 });
                if ((((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"]))).SysSetting["ICMSEnvironment"].ToString().ToUpper() == "JT")
                {
                    g.Column.Add(new GridColumn { Field = "ETDETA", Title = "ETD/ETA", DataType = GridDataType.String.ToString(), IsHidden = false });
                }
                //g.Column.Add(new GridColumn { Field = "FlightDate", Title = "Flight Date", IsHidden = false, DataType = GridDataType.Date.ToString(), Width = 90, Template = "# if( FlightDate==null) {# # } else {# #= kendo.toString(new Date(data.FlightDate.getTime() + data.FlightDate.getTimezoneOffset()*60000),\"" + UIDateTimeFormat.UIDateFormatString + "\") # #}#" });
                g.Column.Add(new GridColumn { Field = "SplitLoaded", Title = "Split Plan", IsHidden = ICMSEnvironment == "JT" ? true : false, DataType = GridDataType.String.ToString()});
                if ((((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"]))).SysSetting["ICMSEnvironment"].ToString().ToUpper() == "JT")
                {
                    g.Column.Add(new GridColumn { Field = "ShipmentStatus", Title = "Shpt Status", IsHidden = false, DataType = GridDataType.String.ToString() });
                }
                else
                { 
                    g.Column.Add(new GridColumn { Field = "ShipmentStatus", Title = "Shipment Status", IsHidden = false, DataType = GridDataType.String.ToString() });
                }
                if ((((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"]))).SysSetting["ICMSEnvironment"].ToString().ToUpper() == "GA")
                {
                    g.Column.Add(new GridColumn { Field = "BookingReleaseTime", Title = "ITL Time", IsHidden = false, DataType = GridDataType.String.ToString() });
                    g.Column.Add(new GridColumn { Field = "AcceptanceCutOffTime", Title = "Acceptance Cut OffTime", IsHidden = true, DataType = GridDataType.String.ToString() });
                }
                if ((((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"]))).SysSetting["ICMSEnvironment"].ToString().ToUpper() == "JT")
                {
                    g.Column.Add(new GridColumn { Field = "BookingReleaseTime", Title = "ITL Time", IsHidden = true, DataType = GridDataType.String.ToString() });
                    g.Column.Add(new GridColumn { Field = "AcceptanceCutOffTime", Title = "ACT", IsHidden = false, DataType = GridDataType.String.ToString() });
                    g.Column.Add(new GridColumn { Field = "CreatedByUser", Title = "Created By", IsHidden = false, DataType = GridDataType.String.ToString() });
                }
                else
                    g.Column.Add(new GridColumn { Field = "CreatedByUser", Title = "Created By", IsHidden = true, DataType = GridDataType.String.ToString() });

                g.Column.Add(new GridColumn { Field = "ProcessStatus", Title = "ProcessStatus", DataType = GridDataType.String.ToString(), IsHidden = true });
                g.Column.Add(new GridColumn { Field = "AWBStatusNo", Title = "AWBStatusNo", DataType = GridDataType.String.ToString(), IsHidden = true });
                g.Column.Add(new GridColumn { Field = "ReplanComplete", Title = "ReplanComplete", DataType = GridDataType.String.ToString(), IsHidden = true });
                g.Column.Add(new GridColumn { Field = "IsGoShowAccountType", Title = "AccountType", DataType = GridDataType.String.ToString(), IsHidden = true });
                g.Column.Add(new GridColumn { Field = "IsGoShowProduct", Title = "ProductName", DataType = GridDataType.String.ToString(), IsHidden = true });
                g.Column.Add(new GridColumn { Field = "IsEDoxUploaded", Title = "EDox Status", DataType = GridDataType.String.ToString(), IsHidden = true });
                g.Column.Add(new GridColumn { Field = "ApproveCancelShipment", Title = "ApproveCancelShipment", DataType = GridDataType.String.ToString(), IsHidden = true });
                g.Column.Add(new GridColumn { Field = "AcceptanceCutOffTime", Title = "AcceptanceCutOffTime", DataType = GridDataType.String.ToString(), IsHidden = true });
                g.Column.Add(new GridColumn { Field = "BookingStatus", Title = "BookingStatus", DataType = GridDataType.String.ToString(), IsHidden = true });
                g.Column.Add(new GridColumn { Field = "NoofReplan", Title = "NoofReplan", DataType = GridDataType.String.ToString(), IsHidden = true });
                g.Column.Add(new GridColumn { Field = "NoOfREExecuted", Title = "NoOfREExecuted", DataType = GridDataType.String.ToString(), IsHidden = true });
                g.Column.Add(new GridColumn { Field = "AccountNoofReplan", Title = "AccountNoofReplan", DataType = GridDataType.String.ToString(), IsHidden = true });
                g.Column.Add(new GridColumn { Field = "AWBStockType", Title = "AWBStockType", DataType = GridDataType.String.ToString(), IsHidden = true });

                g.ExtraParam = new List<GridExtraParam>();
                g.ExtraParam.Add(new GridExtraParam { Field = "OriginCity", Value = OriginCity });
                g.ExtraParam.Add(new GridExtraParam { Field = "DestinationCity", Value = DestinationCity });
                g.ExtraParam.Add(new GridExtraParam { Field = "FlightNo", Value = FlightNo });
                g.ExtraParam.Add(new GridExtraParam { Field = "FlightDate", Value = FlightDate });
                g.ExtraParam.Add(new GridExtraParam { Field = "AWBPrefix", Value = AWBPrefix });
                g.ExtraParam.Add(new GridExtraParam { Field = "AWBNo", Value = AWBNo });
                g.ExtraParam.Add(new GridExtraParam { Field = "LoggedInCity", Value = LoggedInCity });
                g.ExtraParam.Add(new GridExtraParam { Field = "ReferenceNo", Value = ReferenceNo });
                g.ExtraParam.Add(new GridExtraParam { Field = "OriginAirport", Value = OriginAirport });
                g.ExtraParam.Add(new GridExtraParam { Field = "DestinationAirport", Value = DestinationAirport });
                g.ExtraParam.Add(new GridExtraParam { Field = "AWBStatus", Value = AWBStatus });
                g.InstantiateIn(Container, isV2);

            }
        }

        public DataSourceResult GetReservationGridData(GetReservationGridData model, int skip, int take, int page, int pageSize, List<SoftwareFactory.Data.GridSort> sort, SoftwareFactory.Data.GridFilter filter)
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
                ProcName = "spReservation_GetList_AWB";
                string filters = GridFilter.ProcessFilters<ReservationGridData>(filter);
                SqlParameter[] Parameters = {
                                            new SqlParameter("@PageNo", page),
                                            new SqlParameter("@PageSize", pageSize),
                                            //new SqlParameter("@WhereCondition",filters==""?"": filters.Replace("FlightDate", "FlightDateSearch").Replace("BookingDate", "BookingDateSearch")), 
                                            new SqlParameter("@WhereCondition", filters),
                                            new SqlParameter("@OrderBy", sorts),
                                            new SqlParameter("@UserSno", ((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).UserSNo.ToString()),
                                            new SqlParameter("@OriginCity", model.OriginCity=="0"?"":model.OriginCity),
                                            new SqlParameter("@DestinationCity", model.DestinationCity=="0"?"":model.DestinationCity),
                                            new SqlParameter("@FlightNo", model.FlightNo=="0"?"":model.FlightNo),
                                            new SqlParameter("@FlightDate", model.FlightDate=="0"?"":model.FlightDate),
                                            new SqlParameter("@AWBPrefix", model.AWBPrefix=="0"?"":model.AWBPrefix),
                                            new SqlParameter("@AWBNo", model.AWBNo=="0"?"":model.AWBNo),
                                            new SqlParameter("@LoggedInCity", model.LoggedInCity),
                                            new SqlParameter("@ReferenceNo", model.ReferenceNo=="0"?"":model.ReferenceNo),
                                             new SqlParameter("@OriginAirport", model.OriginAirport=="0"?"":model.OriginAirport),
                                            new SqlParameter("@DestinationAirport", model.DestinationAirport=="0"?"":model.DestinationAirport),
                                            new SqlParameter("@AWBStatus", model.AWBStatus=="0"?"":model.AWBStatus)
                                        };
                ds = SqlHelper.ExecuteDataset(ReadConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, ProcName, Parameters);
                var ReservationGridDataList = ds.Tables[0].AsEnumerable().Select(e => new ReservationGridData
                {
                    AWBSNo = Convert.ToString(e["AWBSNo"]),
                    AWBPrefix = Convert.ToString(e["AWBPrefix"]),
                    AWBNo = Convert.ToString(e["AWBNo"]),
                    AWBReferenceBookingSNo = Convert.ToString(e["AWBReferenceBookingSNo"]),
                    BookingRefNo = Convert.ToString(e["BookingRefNo"]),
                    BookingType = Convert.ToString(e["BookingType"]),
                    Origin = e["Origin"].ToString(),
                    Destination = e["Destination"].ToString(),
                    BookingDate = e["BookingDate"] == DBNull.Value ? (DateTime?)null : DateTime.SpecifyKind(Convert.ToDateTime(e["BookingDate"]), DateTimeKind.Utc),
                    OfficeName = e["OfficeName"].ToString(),
                    AgentName = e["AgentName"].ToString(),
                    AWBPieces = e["AWBPieces"].ToString(),
                    GrossWeight = e["GrossWeight"].ToString(),
                    Volume = e["Volume"].ToString(),
                    AWBStatus = e["AWBStatus"].ToString(),
                    InternationalORDomestic = e["InternationalORDomestic"].ToString(),
                    FlightNo = e["FlightNo"].ToString(),
                    FlightDate = e["FlightDate"] == DBNull.Value ? (DateTime?)null : DateTime.SpecifyKind(Convert.ToDateTime(e["FlightDate"]), DateTimeKind.Utc),
                    BookingReleaseTime = e["BookingReleaseTime"].ToString(),
                    ShipmentStatus = e["ShipmentStatus"].ToString(),
                    SplitLoaded = e["SplitLoaded"].ToString(),
                    AWBStatusNo = e["AWBStatusNo"].ToString(),
                    IsCCA = e["IsCCA"].ToString(),
                    ReplanComplete = e["ReplanComplete"].ToString(),
                    IsGoShowAccountType = e["IsGoShowAccountType"].ToString(),
                    IsGoShowProduct = e["IsGoShowProduct"].ToString(),
                    ProcessStatus = e["ProcessStatus"].ToString(),
                    IsEDoxUploaded = e["IsEDoxUploaded"].ToString(),
                    ApproveCancelShipment = e["ApproveCancelShipment"].ToString(),
                    AcceptanceCutOffTime = e["AcceptanceCutOffTime"].ToString(),
                    OrgAirportCode = e["OrgAirportCode"].ToString(),
                    DesAirportCode = e["DesAirportCode"].ToString(),
                    BookingStatus = e["BookingStatus"].ToString(),
                    NoofReplan = e["NoofReplan"].ToString(),
                    NoOfREExecuted = e["NoOfREExecuted"].ToString(),
                    AccountNoofReplan = e["AccountNoofReplan"].ToString(),
                    AWBStockType = e["AWBStockType"].ToString(),
                    ETDETA = e["ETDETA"].ToString(),
                    CreatedByUser = e["CreatedByUser"].ToString()
                });

                ds.Dispose();

                return new DataSourceResult
                {
                    Data = ReservationGridDataList.AsQueryable().ToList(),
                    Total = Convert.ToInt32(ds.Tables[1].Rows[0][0].ToString()),
                    FilterCondition = filters,
                    SortCondition = sorts,
                    StoredProcedure = ProcName
                };
            }
            catch (Exception ex)//(Exception ex)
            {
                throw ex;
            }
        }

        public string GetCompleteReservationData(Int64 AWBReferenceBookingSNo, string BookingRefNo, Int64 AWBSNo)
        {
            try
            {
                SqlParameter[] Parameters = {
                                            new SqlParameter("@AWBReferenceBookingSNo", AWBReferenceBookingSNo),
                                            new SqlParameter("@BookingRefNo", BookingRefNo),
                                            new SqlParameter("@AWBSNo", AWBSNo),
                                            new SqlParameter("@UserID", ((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).UserSNo)
                                        };
                DataSet ds = new DataSet();
                ds = SqlHelper.ExecuteDataset(DMLConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, "Reservation_GetCompleteReservationData_AWB", Parameters);
                ds.Dispose();
                return CargoFlash.Cargo.Business.Common.CompleteDStoJSON(ds);
            }
            catch (Exception ex)//(Exception ex)
            {
                throw ex;
            }
        }

        public string ViewRoute(Int32 ItineraryOrigin, Int32 ItineraryDestination, string AWBPrefix)
        {
            try
            {
                SqlParameter[] Parameters = {
                                            new SqlParameter("@ItineraryOrigin", ItineraryOrigin),
                                            new SqlParameter("@ItineraryDestination", ItineraryDestination),
                                            new SqlParameter("@AWBPrefix", AWBPrefix)
                                        };
                DataSet ds = SqlHelper.ExecuteDataset(DMLConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, "Reservation_ViewRouteSearch", Parameters);
                ds.Dispose();
                return CargoFlash.Cargo.Business.Common.CompleteDStoJSON(ds);
            }
            catch (Exception ex)//(Exception ex)
            {
                throw ex;
            }
        }

        public string SearchFlightResult(string Origin, String Destination, string ItineraryDate, string ItineraryCarrierCode, string ItineraryFlightNo, string ItineraryTransit, decimal ItineraryGrossWeight, decimal ItineraryVolumeWeight, Int32 Product, string Commodity, string SHCSNo, Int32 AgentSNo, int OverrideBCT, int OverrideMCT, int IsMCT, string ETD, string SearchFrom, string BookingNo,string XCTFlightDate)
        {
            try
            {
                SqlParameter[] Parameters = { new SqlParameter("@LoginSNo", ((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).UserSNo),
                                            new SqlParameter("@FlightNo", ItineraryFlightNo),
                                            new SqlParameter("@FlightDate", ItineraryDate),
                                            new SqlParameter("@Origin", Origin),
                                            new SqlParameter("@Destination", Destination),
                                            new SqlParameter("@Volume", ItineraryVolumeWeight),
                                            new SqlParameter("@GrWeight", ItineraryGrossWeight),
                                            new SqlParameter("@ProductSNo", Product),
                                            new SqlParameter("@CommoditySNo", Commodity),
                                            new SqlParameter("@SHCSNo", SHCSNo),
                                            new SqlParameter("@AgentSNo", AgentSNo),
                                            new SqlParameter("@ShipperSNo", 0),
                                            new SqlParameter("@IsCAO", false),
                                            new SqlParameter("@IsUld", false),
                                            new SqlParameter("@OverrideBCT",OverrideBCT),
                                            new SqlParameter("@OverrideMCT",OverrideMCT),
                                            new SqlParameter("@IsMCT",IsMCT),
                                            new SqlParameter("@ETD",ETD),
                                            new SqlParameter("@SearchCarrierCode",ItineraryCarrierCode),
                                            new SqlParameter("@SearchFrom",SearchFrom),
                                            new SqlParameter("@BookingNo",BookingNo),
                                            new SqlParameter("@XCTFlightDate",XCTFlightDate),
                                            new SqlParameter("@ErrorMessage",DbType.String){Direction=ParameterDirection.Output,Size=250}
                                        };
                DataSet ds = new DataSet();
                ds = SqlHelper.ExecuteDataset(DMLConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, "spReservation_FlightSearch", Parameters);
                ds.Dispose();
                return CargoFlash.Cargo.Business.Common.CompleteDStoJSON(ds);
            }
            catch (Exception ex)//(Exception ex)
            {
                throw ex;
            }
        }

        public string GetItineraryCarrierCode(string AWBCode)
        {
            try
            {
                SqlParameter[] Parameters = { new SqlParameter("@AWBCode", AWBCode) };
                DataSet ds = new DataSet();
                ds = SqlHelper.ExecuteDataset(DMLConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, "Reservation_GetItineraryCarrierCode", Parameters);
                ds.Dispose();
                return CargoFlash.Cargo.Business.Common.CompleteDStoJSON(ds);
            }
            catch (Exception ex)//(Exception ex)
            {
                throw ex;
            }
        }

        public string IsPerPiecesCheckAllow(Int64 CommoditySNo, string SPHC)
        {
            try
            {
                SqlParameter[] Parameters = { new SqlParameter("@CommoditySNo", CommoditySNo),
                                         new SqlParameter("@SPHC", SPHC)};
                DataSet ds = new DataSet();
                ds = SqlHelper.ExecuteDataset(DMLConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, "Reservation_IsPerPiecesCheckAllow", Parameters);
                ds.Dispose();
                return CargoFlash.Cargo.Business.Common.CompleteDStoJSON(ds);
            }
            catch (Exception ex)//(Exception ex)
            {
                throw ex;
            }
        }

        public string GetAirportofSelectedAWBOriginDestination(Int32 CitySNo)
        {
            try
            {
                SqlParameter[] Parameters = { new SqlParameter("@CitySNo", CitySNo) };
                DataSet ds = new DataSet();
                ds = SqlHelper.ExecuteDataset(DMLConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, "Reservation_GetAirportofSelectedAWBOriginDestination", Parameters);
                ds.Dispose();
                return CargoFlash.Cargo.Business.Common.CompleteDStoJSON(ds);
            }
            catch (Exception ex)//(Exception ex)
            {
                throw ex;
            }
        }

        public string FillProductForAgent(Int32 AccountSNo)
        {
            try
            {
                SqlParameter[] Parameters = { new SqlParameter("@AccountSNo", AccountSNo) };
                DataSet ds = new DataSet();
                ds = SqlHelper.ExecuteDataset(DMLConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, "Reservation_FillProductForAgent", Parameters);
                ds.Dispose();
                return CargoFlash.Cargo.Business.Common.CompleteDStoJSON(ds);
            }
            catch (Exception ex)//(Exception ex)
            {
                throw ex;
            }
        }

        public string FillCommoditySHC(Int32 CommoditySNo)
        {
            try
            {
                SqlParameter[] Parameters = { new SqlParameter("@CommoditySNo", CommoditySNo) };
                DataSet ds = new DataSet();
                ds = SqlHelper.ExecuteDataset(DMLConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, "Reservation_FillCommoditySHC", Parameters);
                ds.Dispose();
                return CargoFlash.Cargo.Business.Common.CompleteDStoJSON(ds);
            }
            catch (Exception ex)//(Exception ex)
            {
                throw ex;
            }
        }

        public string CheckITL(Int32 BookingSNo)
        {
            try
            {
                SqlParameter[] Parameters = { new SqlParameter("@BookingSNo", BookingSNo),
                                        new SqlParameter("@UserSNo", ((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).UserSNo)};
                DataSet ds = new DataSet();
                ds = SqlHelper.ExecuteDataset(DMLConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, "Reservation_CheckITL", Parameters);
                ds.Dispose();
                return CargoFlash.Cargo.Business.Common.CompleteDStoJSON(ds);
            }
            catch (Exception ex)//(Exception ex)
            {
                throw ex;
            }
        }

        public string CheckAWBRouteStatus(Int32 BookingSNo)
        {
            try
            {
                SqlParameter[] Parameters = { new SqlParameter("@BookingSNo", BookingSNo) };
                DataSet ds = new DataSet();
                ds = SqlHelper.ExecuteDataset(DMLConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, "Reservation_CheckAWBRouteStatus", Parameters);
                ds.Dispose();
                return CargoFlash.Cargo.Business.Common.CompleteDStoJSON(ds);
            }
            catch (Exception ex)//(Exception ex)
            {
                throw ex;
            }
        }

        public string GetAirlineParameterValue(string Airlinesno, string Airlineparameter)
        {
            try
            {
                SqlParameter[] Parameters = { new SqlParameter("@AirlineSNo", Airlinesno), new SqlParameter("@AirlineParameter", Airlineparameter) };
                DataSet ds = new DataSet();
                ds = SqlHelper.ExecuteDataset(DMLConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, "Reservation_GetAirlineParameterValue", Parameters);
                ds.Dispose();
                return CargoFlash.Cargo.Business.Common.CompleteDStoJSON(ds);
            }
            catch (Exception ex)//(Exception ex)
            {
                throw ex;
            }
        }

        public string GetSHCForPerPiecesGrossWt(string SPHC, string HEASPHC)
        {
            try
            {
                SqlParameter[] Parameters = { new SqlParameter("@SPHC", SPHC),
                                             new SqlParameter("@HEASPHC", HEASPHC)};
                DataSet ds = new DataSet();
                ds = SqlHelper.ExecuteDataset(DMLConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, "Reservation_GetSHCForPerPiecesGrossWt", Parameters);
                ds.Dispose();
                return CargoFlash.Cargo.Business.Common.CompleteDStoJSON(ds);
            }
            catch (Exception ex)//(Exception ex)
            {
                throw ex;
            }
        }

        public string CheckValidAWBNumber(int BookingType, string AWBPrefix, string AWBNumber, Int64 OriginCitySNo, Int64 AccountSNo)
        {
            try
            {
                SqlParameter[] Parameters = { new SqlParameter("@BookingType", BookingType),
                                            new SqlParameter("@AWBPrefix", AWBPrefix),
                                            new SqlParameter("@AWBNumber", AWBNumber),
                                            new SqlParameter("@OriginCitySNo", OriginCitySNo),
                                            new SqlParameter("@AccountSNo", AccountSNo),
                                            new SqlParameter("@UserSNo", ((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).UserSNo.ToString())
                                        };
                DataSet ds = new DataSet();
                ds = SqlHelper.ExecuteDataset(DMLConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, "Reservation_CheckValidAWBNumber", Parameters);
                ds.Dispose();
                return CargoFlash.Cargo.Business.Common.CompleteDStoJSON(ds);
            }
            catch (Exception ex)//(Exception ex)
            {
                throw ex;
            }
        }

        public string AutoStockAgentOrNot(int BookingType, Int64 AccountSNo)
        {
            try
            {
                SqlParameter[] Parameters = { new SqlParameter("@BookingType", BookingType),
                                             new SqlParameter("@AccountSNo", AccountSNo)
                                        };
                DataSet ds = new DataSet();
                ds = SqlHelper.ExecuteDataset(DMLConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, "Reservation_AutoStockAgentOrNot", Parameters);
                ds.Dispose();
                return CargoFlash.Cargo.Business.Common.CompleteDStoJSON(ds);
            }
            catch (Exception ex)//(Exception ex)
            {
                throw ex;
            }
        }

        public string ManualStockAgentOrNot(int BookingType, Int64 AccountSNo, string AWBPrefix)
        {
            try
            {
                SqlParameter[] Parameters = { new SqlParameter("@BookingType", BookingType),
                                             new SqlParameter("@AccountSNo", AccountSNo),
                                              new SqlParameter("@AWBPrefix", AWBPrefix)
                                        };
                DataSet ds = new DataSet();
                ds = SqlHelper.ExecuteDataset(DMLConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, "Reservation_ManualStockAgentOrNot", Parameters);
                ds.Dispose();
                return CargoFlash.Cargo.Business.Common.CompleteDStoJSON(ds);
            }
            catch (Exception ex)//(Exception ex)
            {
                throw ex;
            }
        }

        public string SelectdRoute(string DailFlightSNo)
        {
            try
            {
                SqlParameter[] Parameters = { new SqlParameter("@DailFlightSNo", DailFlightSNo),
                                            new SqlParameter("@ErrorMessage",DbType.String){Direction=ParameterDirection.Output,Size=250}
                                        };
                DataSet ds = new DataSet();
                ds = SqlHelper.ExecuteDataset(DMLConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, "spReservation_FlightSearch_selected", Parameters);
                ds.Dispose();
                return CargoFlash.Cargo.Business.Common.CompleteDStoJSON(ds);
            }
            catch (Exception ex)//(Exception ex)
            {
                throw ex;
            }
        }

        public string GETCitySNofromItinerary(int ItineraryOriginSNo, int ItineraryDestinationSNo)
        {
            try
            {
                SqlParameter[] Parameters = { new SqlParameter("@ItineraryOriginSNo", ItineraryOriginSNo),
                                            new SqlParameter("@ItineraryDestinationSNo",ItineraryDestinationSNo)
                                        };
                DataSet ds = new DataSet();
                ds = SqlHelper.ExecuteDataset(DMLConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, "Reservation_GETCitySNofromItinerary", Parameters);
                ds.Dispose();
                return CargoFlash.Cargo.Business.Common.CompleteDStoJSON(ds);
            }
            catch (Exception ex)//(Exception ex)
            {
                throw ex;
            }
        }

        public string CheckEmbargoParam(int DailFlightSNo, int AgentSNo, int ProductSNo, int CommoditySNo, int ItineraryPieces, string ItineraryGrossWeight, string ItineraryVolumeWeight, int PaymentType, string SPHC)
        {
            try
            {
                SqlParameter[] Parameters = { new SqlParameter("@DailFlightSNo", DailFlightSNo),
                                            new SqlParameter("@AgentSNo", AgentSNo),
                                            new SqlParameter("@ProductSNo", ProductSNo),
                                            new SqlParameter("@CommoditySNo", CommoditySNo),
                                             new SqlParameter("@ItineraryPieces", ItineraryPieces),
                                             new SqlParameter("@ItineraryGrossWeight", ItineraryGrossWeight),
                                             new SqlParameter("@ItineraryVolumeWeight", ItineraryVolumeWeight),
                                             new SqlParameter("@PaymentType", PaymentType),
                                             new SqlParameter("@SPHC", SPHC)
                                        };
                DataSet ds = new DataSet();
                ds = SqlHelper.ExecuteDataset(DMLConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, "Reservation_CheckEmbargoParam", Parameters);
                ds.Dispose();
                return CargoFlash.Cargo.Business.Common.CompleteDStoJSON(ds);
            }
            catch (Exception ex)//(Exception ex)
            {
                throw ex;
            }
        }

        public string CheckEmbargoParamOnOD(int DailFlightSNo, int AgentSNo, int ProductSNo, int CommoditySNo, int ItineraryPieces, string ItineraryGrossWeight, string ItineraryVolumeWeight, int PaymentType, string SPHC, int IsAWBWise, int OriginAirportSNo, int DestinationAirportSNo, string AWBGrossWeight, int AWBPieces, string AWBPrefix)
        {
            try
            {
                SqlParameter[] Parameters = { new SqlParameter("@DailFlightSNo", DailFlightSNo),
                                            new SqlParameter("@AgentSNo", AgentSNo),
                                            new SqlParameter("@ProductSNo", ProductSNo),
                                            new SqlParameter("@CommoditySNo", CommoditySNo),
                                             new SqlParameter("@ItineraryPieces", ItineraryPieces),
                                             new SqlParameter("@ItineraryGrossWeight", ItineraryGrossWeight),
                                             new SqlParameter("@ItineraryVolumeWeight", ItineraryVolumeWeight),
                                             new SqlParameter("@PaymentType", PaymentType),
                                             new SqlParameter("@SPHC", SPHC),
                                             new SqlParameter("@IsAWBWise", IsAWBWise),
                                             new SqlParameter("@OriginAirportSNo", OriginAirportSNo),
                                             new SqlParameter("@DestinationAirportSNo", DestinationAirportSNo),
                                             new SqlParameter("@AWBGrossWeight", AWBGrossWeight),
                                             new SqlParameter("@AWBPieces", AWBPieces),
                                             new SqlParameter("@AWBPrefix", AWBPrefix)
                                        };
                DataSet ds = new DataSet();
                ds = SqlHelper.ExecuteDataset(DMLConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, "Reservation_CheckEmbargoParamOnOD", Parameters);
                ds.Dispose();
                return CargoFlash.Cargo.Business.Common.CompleteDStoJSON(ds);
            }
            catch (Exception ex)//(Exception ex)
            {
                throw ex;
            }
        }

        public string CheckEmbargoAll(Int64 POMailSNo, Int64 AWBSNo, Int64 BookingSNo, Int64 BookingRefNo, ReservationInformation ReservationInformation, List<ReservationItineraryInformation> ReservationItineraryInformation)
        {
            try
            {

                BaseBusiness baseBusiness = new BaseBusiness();

                List<ReservationInformation> lstReservationInformation = new List<ReservationInformation>();
                lstReservationInformation.Add(ReservationInformation);
                DataTable dtReservationInformation = CollectionHelper.ConvertTo(lstReservationInformation, "");


                DataTable dtReservationItineraryInformation = CollectionHelper.ConvertTo(ReservationItineraryInformation, "");

                SqlParameter paramReservationInformation = new SqlParameter();
                paramReservationInformation.ParameterName = "@ReservationInformation";
                paramReservationInformation.SqlDbType = System.Data.SqlDbType.Structured;
                paramReservationInformation.Value = dtReservationInformation;

                SqlParameter paramReservationItineraryInformation = new SqlParameter();
                paramReservationItineraryInformation.ParameterName = "@ReservationItineraryInformation";
                paramReservationItineraryInformation.SqlDbType = System.Data.SqlDbType.Structured;
                paramReservationItineraryInformation.Value = dtReservationItineraryInformation;

                SqlParameter[] Parameters = { paramReservationInformation,
                                            paramReservationItineraryInformation,
                                            new SqlParameter("@POMailSNo", POMailSNo),
                                            new SqlParameter("@AWBSNo", AWBSNo),
                                            new SqlParameter("@BookingSNo", BookingSNo),
                                            new SqlParameter("@BookingRefNo", BookingRefNo),
                                            new SqlParameter("@UpdatedBy", ((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).UserSNo.ToString())
                                        };
                DataSet ds = new DataSet();
                ds = SqlHelper.ExecuteDataset(DMLConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, "Reservation_CheckEmbargoAll", Parameters);
                ds.Dispose();
                return CargoFlash.Cargo.Business.Common.CompleteDStoJSON(ds);
            }
            catch (Exception ex)//(Exception ex)
            {
                throw ex;
            }
        }

        public string ULDCheck(int DailFlightSNo, Int64 BookingRefNo)
        {
            try
            {
                SqlParameter[] Parameters = { new SqlParameter("@DailyFlightSNo", DailFlightSNo),
                                            new SqlParameter("@BookingRefNo", BookingRefNo)
                                        };
                DataSet ds = new DataSet();
                ds = SqlHelper.ExecuteDataset(DMLConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, "Reservation_ULDCheck", Parameters);
                ds.Dispose();
                return CargoFlash.Cargo.Business.Common.CompleteDStoJSON(ds);
            }
            catch (Exception ex)//(Exception ex)
            {
                throw ex;
            }
        }

        public string IsItineraryCarrierCodeInterline(string ItineraryCarrierCode)
        {
            try
            {
                SqlParameter[] Parameters = { new SqlParameter("@ItineraryCarrierCode", ItineraryCarrierCode),
                                        };
                DataSet ds = new DataSet();
                ds = SqlHelper.ExecuteDataset(DMLConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, "Reservation_IsItineraryCarrierCodeInterline", Parameters);
                ds.Dispose();
                return CargoFlash.Cargo.Business.Common.CompleteDStoJSON(ds);
            }
            catch (Exception ex)//(Exception ex)
            {
                throw ex;
            }
        }

        public string IsInternationalBookingAgent(int OriginCitySNo, int DestinationCitySNo, int AccountSNo, int ItineraryOrigin, int ItineraryDestination)
        {
            try
            {
                SqlParameter[] Parameters = { new SqlParameter("@OriginCitySNo", OriginCitySNo),
                                            new SqlParameter("@DestinationCitySNo", DestinationCitySNo),
                                            new SqlParameter("@AccountSNo", AccountSNo),
                                            new SqlParameter("@ItineraryOrigin", ItineraryOrigin),
                                            new SqlParameter("@ItineraryDestination", ItineraryDestination),
                                        };
                DataSet ds = new DataSet();
                ds = SqlHelper.ExecuteDataset(DMLConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, "Reservation_IsInternationalBookingAgent", Parameters);
                ds.Dispose();
                return CargoFlash.Cargo.Business.Common.CompleteDStoJSON(ds);
            }
            catch (Exception ex)//(Exception ex)
            {
                throw ex;
            }
        }

        public string RateAvailableOrNot(int BookingType, int AWBStock, string AWBPrefix, int PaymentType, int IsBUP, int BupPieces, int ProductSNo, string OriginCity, string DestinationCity, int AccountSNo, int AWBPieces, decimal GrossWeight, decimal VolumeWeight, decimal ChargeableWeight, decimal Volume, string UM, int CommoditySNo, string NOG, string SPHC)
        {
            try
            {
                SqlParameter[] Parameters = { new SqlParameter("@LoginSNo", ((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).UserSNo),
                                            new SqlParameter("@BookingType", BookingType),
                                            new SqlParameter("@AWBStock", AWBStock),
                                            new SqlParameter("@AWBPrefix", AWBPrefix),
                                            new SqlParameter("@PaymentType", PaymentType),
                                            new SqlParameter("@IsBUP", IsBUP),
                                            new SqlParameter("@BupPieces", BupPieces),
                                            new SqlParameter("@ProductSNo", ProductSNo),
                                            new SqlParameter("@OriginCity", OriginCity),
                                            new SqlParameter("@DestinationCity", DestinationCity),
                                            new SqlParameter("@AccountSNo", AccountSNo),
                                            new SqlParameter("@AWBPieces", AWBPieces),
                                            new SqlParameter("@GrossWeight", GrossWeight),
                                            new SqlParameter("@VolumeWeight", VolumeWeight),
                                            new SqlParameter("@ChargeableWeight",ChargeableWeight),
                                            new SqlParameter("@Volume",Volume),
                                            new SqlParameter("@UM", UM),
                                            new SqlParameter("@CommoditySNo", CommoditySNo),
                                            new SqlParameter("@NOG",NOG),
                                            new SqlParameter("@SPHC",SPHC)
                                        };
                DataSet ds = new DataSet();
                ds = SqlHelper.ExecuteDataset(DMLConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, "Reservation_RateAvailableOrNot", Parameters);
                ds.Dispose();
                return CargoFlash.Cargo.Business.Common.CompleteDStoJSON(ds);
            }
            catch (Exception ex)//(Exception ex)
            {
                throw ex;
            }
        }

        public string RateAvailableOrNotNEW(int BookingType, int AWBStock, string AWBPrefix, int PaymentType, int IsBUP, int BupPieces, int ProductSNo, string OriginCity, string DestinationCity, int AccountSNo, int AWBPieces, decimal GrossWeight, decimal VolumeWeight, decimal ChargeableWeight, decimal Volume, string UM, int CommoditySNo, string NOG, string SPHC, string FlightDate, string FlightNo, string BookingReferenceNo, string AllotmentCode)
        {
            try
            {
                SqlParameter[] Parameters = { new SqlParameter("@LoginSNo", ((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).UserSNo),
                                            new SqlParameter("@BookingType", BookingType),
                                            new SqlParameter("@AWBStock", AWBStock),
                                            new SqlParameter("@AWBPrefix", AWBPrefix),
                                            new SqlParameter("@PaymentType", PaymentType),
                                            new SqlParameter("@IsBUP", IsBUP),
                                            new SqlParameter("@BupPieces", BupPieces),
                                            new SqlParameter("@ProductSNo", ProductSNo),
                                            new SqlParameter("@OriginCity", OriginCity),
                                            new SqlParameter("@DestinationCity", DestinationCity),
                                            new SqlParameter("@AccountSNo", AccountSNo),
                                            new SqlParameter("@AWBPieces", AWBPieces),
                                            new SqlParameter("@GrossWeight", GrossWeight),
                                            new SqlParameter("@VolumeWeight", VolumeWeight),
                                            new SqlParameter("@ChargeableWeight",ChargeableWeight),
                                            new SqlParameter("@Volume",Volume),
                                            new SqlParameter("@UM", UM),
                                            new SqlParameter("@CommoditySNo", CommoditySNo),
                                            new SqlParameter("@NOG",NOG),
                                            new SqlParameter("@SPHC",SPHC),
                                            new SqlParameter("@FlightDate",FlightDate),
                                            new SqlParameter("@FlightNo",FlightNo),
                                            new SqlParameter("@BookingReferenceNo",BookingReferenceNo),
                                            new SqlParameter("@AllotmentCode",AllotmentCode)
                                        };
                DataSet ds = new DataSet();
                ds = SqlHelper.ExecuteDataset(DMLConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, "Reservation_RateAvailableOrNotNEW", Parameters);
                ds.Dispose();
                return CargoFlash.Cargo.Business.Common.CompleteDStoJSON(ds);
            }
            catch (Exception ex)//(Exception ex)
            {
                throw ex;
            }
        }

        public string GenerateAndGetReferenceNumber(string BookingRefNo)
        {
            try
            {
                SqlParameter[] Parameters = { new SqlParameter("@BookingRefNo", BookingRefNo) };
                DataSet ds = new DataSet();
                ds = SqlHelper.ExecuteDataset(DMLConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, "Reservation_GenerateAndGetReferenceNumber", Parameters);
                ds.Dispose();
                return CargoFlash.Cargo.Business.Common.CompleteDStoJSON(ds);
            }
            catch (Exception ex)//(Exception ex)
            {
                throw ex;
            }
        }

        public string CheckAndValidateCopyFlightData(string DailyFlightSNo)
        {
            try
            {
                SqlParameter[] Parameters = { new SqlParameter("@DailyFlightSNo", DailyFlightSNo) ,
                                            new SqlParameter("@UserSNo", ((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).UserSNo.ToString()) };
                DataSet ds = new DataSet();
                ds = SqlHelper.ExecuteDataset(DMLConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, "Reservation_CheckAndValidateCopyFlightData", Parameters);
                ds.Dispose();
                return CargoFlash.Cargo.Business.Common.CompleteDStoJSON(ds);
            }
            catch (Exception ex)//(Exception ex)
            {
                throw ex;
            }
        }

        public string GetProductAsPerAgent(Int64 AgentSNo)
        {
            try
            {
                SqlParameter[] Parameters = { new SqlParameter("@AgentSNo", AgentSNo) ,
                                            new SqlParameter("@UserSNo", ((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).UserSNo.ToString())
                                            };
                DataSet ds = new DataSet();
                ds = SqlHelper.ExecuteDataset(DMLConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, "Reservation_GetProductAsPerAgent", Parameters);
                ds.Dispose();
                return CargoFlash.Cargo.Business.Common.CompleteDStoJSON(ds);
            }
            catch (Exception ex)//(Exception ex)
            {
                throw ex;
            }
        }

        public string GetAgentMultiOriginPermission(Int64 AgentSNo)
        {
            try
            {
                SqlParameter[] Parameters = { new SqlParameter("@AgentSNo", AgentSNo),
                                            new SqlParameter("@UserSNo", ((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).UserSNo.ToString())
                                        };
                DataSet ds = new DataSet();
                ds = SqlHelper.ExecuteDataset(DMLConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, "Reservation_GetAgentMultiOriginPermission", Parameters);
                ds.Dispose();
                return CargoFlash.Cargo.Business.Common.CompleteDStoJSON(ds);
            }
            catch (Exception ex)//(Exception ex)
            {
                throw ex;
            }
        }

        public string GetAccountAirlineTransDetails(string AWBPrefix)
        {
            try
            {
                SqlParameter[] Parameters = { new SqlParameter("@AWBPrefix", AWBPrefix),
                                            new SqlParameter("@UserSNo", ((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).UserSNo.ToString())
                                        };
                DataSet ds = new DataSet();
                ds = SqlHelper.ExecuteDataset(DMLConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, "Reservation_GetAccountAirlineTransDetails", Parameters);
                ds.Dispose();
                return CargoFlash.Cargo.Business.Common.CompleteDStoJSON(ds);
            }
            catch (Exception ex)//(Exception ex)
            {
                throw ex;
            }
        }

        public string InsertdataCopyBooking(string BookingMasterRefNo, Int64 PreviousBookingSNo, string PreviousBookingMasterRefNo, int AWBSNo)
        {
            try
            {
                SqlParameter[] Parameters = { new SqlParameter("@AWBSNo", AWBSNo),
                                            new SqlParameter("@BookingMasterRefNo", BookingMasterRefNo),
                                            new SqlParameter("@PreviousBookingSNo", PreviousBookingSNo),
                                            new SqlParameter("@PreviousBookingMasterRefNo", PreviousBookingMasterRefNo),
                                            new SqlParameter("@UpdatedBy", ((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).UserSNo.ToString())
                                        };
                DataSet ds = new DataSet();
                ds = SqlHelper.ExecuteDataset(DMLConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, "Reservation_InsertdataCopyBooking", Parameters);
                ds.Dispose();
                return CargoFlash.Cargo.Business.Common.CompleteDStoJSON(ds);
            }
            catch (Exception ex)//(Exception ex)
            {
                throw ex;
            }
        }

        public string GETProductASPerBookingType(string BookingType, string LoginType)
        {
            try
            {
                SqlParameter[] Parameters = { new SqlParameter("@BookingType", BookingType),
                                          new SqlParameter("@LoginType", LoginType)
                                        };
                DataSet ds = new DataSet();
                ds = SqlHelper.ExecuteDataset(DMLConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, "Reservation_GETProductASPerBookingType", Parameters);
                ds.Dispose();
                return CargoFlash.Cargo.Business.Common.CompleteDStoJSON(ds);
            }
            catch (Exception ex)//(Exception ex)
            {
                throw ex;
            }
        }

        public string CheckDimensionOnExecution(string ReservationBookingRefNo)
        {
            try
            {
                SqlParameter[] Parameters = { new SqlParameter("@ReservationBookingRefNo", ReservationBookingRefNo)
                                        };
                DataSet ds = new DataSet();
                ds = SqlHelper.ExecuteDataset(DMLConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, "Reservation_CheckDimensionOnExecution", Parameters);
                ds.Dispose();
                return CargoFlash.Cargo.Business.Common.CompleteDStoJSON(ds);
            }
            catch (Exception ex)//(Exception ex)
            {
                throw ex;
            }
        }

        public string CheckULDDimensionOnExecution(string ReservationBookingRefNo)
        {
            try
            {
                SqlParameter[] Parameters = { new SqlParameter("@ReservationBookingRefNo", ReservationBookingRefNo)
                                        };
                DataSet ds = new DataSet();
                ds = SqlHelper.ExecuteDataset(DMLConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, "Reservation_CheckULDDimensionOnExecution", Parameters);
                ds.Dispose();
                return CargoFlash.Cargo.Business.Common.CompleteDStoJSON(ds);
            }
            catch (Exception ex)//(Exception ex)
            {
                throw ex;
            }
        }

        public string ISSecondLegORNot(string ItineraryOrigin, string ItineraryDestination)
        {
            try
            {
                SqlParameter[] Parameters = { new SqlParameter("@ItineraryOrigin", ItineraryOrigin),
                                          new SqlParameter("@ItineraryDestination", ItineraryDestination)
                                        };
                DataSet ds = new DataSet();
                ds = SqlHelper.ExecuteDataset(DMLConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, "Reservation_ISSecondLegORNot", Parameters);
                ds.Dispose();
                return CargoFlash.Cargo.Business.Common.CompleteDStoJSON(ds);
            }
            catch (Exception ex)//(Exception ex)
            {
                throw ex;
            }
        }

        public string BindAllotmentArray(int DailyFlightSNo, int AccountSNo, int ShipperSNo, decimal GrossWt, decimal Volume, string ProductSNo, string CommoditySNo, string SHC)
        {
            try
            {
                SqlParameter[] Parameters = { new SqlParameter("@DailyFlightSNo", DailyFlightSNo),
                                            new SqlParameter("@AccountSNo", AccountSNo),
                                            new SqlParameter("@ShipperSNo", ShipperSNo),
                                            new SqlParameter("@GrossWt", GrossWt),
                                            new SqlParameter("@Volume", Volume),
                                            new SqlParameter("@ProductSNo", ProductSNo),
                                            new SqlParameter("@CommoditySNo", CommoditySNo),
                                            new SqlParameter("@SHC", SHC),
                                            new SqlParameter("@LoginSNo", ((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).UserSNo.ToString())
                                        };
                DataSet ds = new DataSet();
                ds = SqlHelper.ExecuteDataset(DMLConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, "Reservation_DailyFlightAllotment", Parameters);
                ds.Dispose();
                return CargoFlash.Cargo.Business.Common.CompleteDStoJSON(ds);
            }
            catch (Exception ex)//(Exception ex)
            {
                throw ex;
            }
        }

        public string GetShipperConsigneeDetails(string UserType, string FieldType, Int32 SNO)
        {
            try
            {
                SqlParameter[] Parameters = { new SqlParameter("@UserType", UserType), new SqlParameter("@FieldType", FieldType), new SqlParameter("@SNO", SNO) };
                DataSet ds = SqlHelper.ExecuteDataset(DMLConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, "Reservation_GetShipperConsigneeDetails", Parameters);
                ds.Dispose();
                return CargoFlash.Cargo.Business.Common.CompleteDStoJSON(ds);
            }
            catch (Exception ex)//(Exception ex)
            {
                throw ex;
            }
        }
        public string GetShipperConsigneeDetails_TaxID(string UserType,  string Taxid)
        {
            try
            {
                SqlParameter[] Parameters = { new SqlParameter("@UserType", UserType), new SqlParameter("@Taxid", Taxid) };
                DataSet ds = SqlHelper.ExecuteDataset(DMLConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, "Reservation_GetShipperConsigneeDetails_BasedOnTaxid", Parameters);
                ds.Dispose();
                return CargoFlash.Cargo.Business.Common.CompleteDStoJSON(ds);
            }
            catch (Exception ex)//(Exception ex)
            {
                throw ex;
            }
        }
        public string AddBookingShipperandConsigneeInformation(Int64 BookingRefNo, ReservationInformation ReservationInformation, List<ReservationItineraryInformation> ReservationItineraryInformation, ReservationShipperInformation ReservationShipperInformation, ReservationConsigneeInformation ReservationConsigneeInformation, Int32 ShipperSno, Int32 ConsigneeSno, string CreateShipperParticipants, string CreateConsigneerParticipants, string CallerCode, string HSCode, string CreateShipperTaxParticipants, string CreateConsigneerTaxParticipants, string CreateShipperTaxId, string CreateConsigneerTaxId,string EWBEmail,string CallerType ,Int64 ChkWb)
        {
            try
            {
                BaseBusiness baseBusiness = new BaseBusiness();

                List<ReservationInformation> lstReservationInformation = new List<ReservationInformation>();
                lstReservationInformation.Add(ReservationInformation);
                DataTable dtReservationInformation = CollectionHelper.ConvertTo(lstReservationInformation, "");


                DataTable dtReservationItineraryInformation = CollectionHelper.ConvertTo(ReservationItineraryInformation, "");


                List<ReservationShipperInformation> lstShipperInformation = new List<ReservationShipperInformation>();
                lstShipperInformation.Add(ReservationShipperInformation);
                DataTable dtShipperInformation = CollectionHelper.ConvertTo(lstShipperInformation, "");


                List<ReservationConsigneeInformation> lstConsigneeInformation = new List<ReservationConsigneeInformation>();
                lstConsigneeInformation.Add(ReservationConsigneeInformation);
                DataTable dtConsigneeInformation = CollectionHelper.ConvertTo(lstConsigneeInformation, "");

                SqlParameter paramReservationInformation = new SqlParameter();
                paramReservationInformation.ParameterName = "@ReservationInformation";
                paramReservationInformation.SqlDbType = System.Data.SqlDbType.Structured;
                paramReservationInformation.Value = dtReservationInformation;

                SqlParameter paramReservationItineraryInformation = new SqlParameter();
                paramReservationItineraryInformation.ParameterName = "@ReservationItineraryInformation";
                paramReservationItineraryInformation.SqlDbType = System.Data.SqlDbType.Structured;
                paramReservationItineraryInformation.Value = dtReservationItineraryInformation;

                SqlParameter paramShipperInformation = new SqlParameter();
                paramShipperInformation.ParameterName = "@ShipperInformation";
                paramShipperInformation.SqlDbType = System.Data.SqlDbType.Structured;
                paramShipperInformation.Value = dtShipperInformation;

                SqlParameter paramConsigneeInformation = new SqlParameter();
                paramConsigneeInformation.ParameterName = "@ConsigneeInformation";
                paramConsigneeInformation.SqlDbType = System.Data.SqlDbType.Structured;
                paramConsigneeInformation.Value = dtConsigneeInformation;

                DataSet ds = new DataSet();
                SqlParameter[] Parameters = {
                                            new SqlParameter("@BookingRefNo", BookingRefNo),
                                            paramReservationInformation,
                                            paramReservationItineraryInformation,
                                            paramShipperInformation,
                                            paramConsigneeInformation,
                                            new SqlParameter("@BookingStationCitySNo", ((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).CitySNo.ToString()),
                                            new SqlParameter("@UpdatedBy", ((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).UserSNo.ToString()),
                                            new SqlParameter("@ShipperSno", ShipperSno),
                                            new SqlParameter("@ConsigneeSno", ConsigneeSno),
                                            new SqlParameter("@CreateShipperParticipants",CreateShipperParticipants),
                                            new SqlParameter("@CreateConsigneerParticipants",CreateConsigneerParticipants),
                                              new SqlParameter("@CreateShipperTaxParticipants",CreateShipperTaxParticipants),
                                            new SqlParameter("@CreateConsigneerTaxParticipants",CreateConsigneerTaxParticipants),
                                             new SqlParameter("@CreateShipperTaxId",CreateShipperTaxId),
                                            new SqlParameter("@CreateConsigneerTaxId",CreateConsigneerTaxId),
                                            new SqlParameter("@CallerCode",CallerCode),
											new SqlParameter("@HSCodeSNo",HSCode),
                                            new SqlParameter("@EWBEmail",EWBEmail),
                                             new SqlParameter("@CallerType",CallerType),
                                              new SqlParameter("@ChkWb",ChkWb)

                                        };
                DataSet ds1 = new DataSet();

                ds = SqlHelper.ExecuteDataset(DMLConnectionString.WebConfigConnectionString, "Reservation_AddBookingShipperandConsigneeInformation", Parameters);
                return ds.Tables[ds.Tables.Count - 1].Rows[0][0].ToString();
            }
            catch (Exception ex)//(Exception ex)
            {
                throw ex;
            }
        }

        public string UpdateBookingShipperandConsigneeInformation(Int64 AWBSNo, Int64 BookingSNo, Int64 BookingRefNo, ReservationInformation ReservationInformation, List<ReservationItineraryInformation> ReservationItineraryInformation, ReservationShipperInformation ReservationShipperInformation, ReservationConsigneeInformation ReservationConsigneeInformation, Int32 ShipperSno, Int32 ConsigneeSno, string CreateShipperParticipants, string CreateConsigneerParticipants, int RateShowOnAWBPrint, string CallerCode, string HSCode, string CreateShipperTaxParticipants, string CreateConsigneerTaxParticipants, string CreateShipperTaxId, string CreateConsigneerTaxId, string EWBEmail, string CallerType, int ChkWb)
        {
            try
            {
                BaseBusiness baseBusiness = new BaseBusiness();

                List<ReservationInformation> lstReservationInformation = new List<ReservationInformation>();
                lstReservationInformation.Add(ReservationInformation);
                DataTable dtReservationInformation = CollectionHelper.ConvertTo(lstReservationInformation, "");


                DataTable dtReservationItineraryInformation = CollectionHelper.ConvertTo(ReservationItineraryInformation, "");


                List<ReservationShipperInformation> lstShipperInformation = new List<ReservationShipperInformation>();
                lstShipperInformation.Add(ReservationShipperInformation);
                DataTable dtShipperInformation = CollectionHelper.ConvertTo(lstShipperInformation, "");


                List<ReservationConsigneeInformation> lstConsigneeInformation = new List<ReservationConsigneeInformation>();
                lstConsigneeInformation.Add(ReservationConsigneeInformation);
                DataTable dtConsigneeInformation = CollectionHelper.ConvertTo(lstConsigneeInformation, "");

                SqlParameter paramReservationInformation = new SqlParameter();
                paramReservationInformation.ParameterName = "@ReservationInformation";
                paramReservationInformation.SqlDbType = System.Data.SqlDbType.Structured;
                paramReservationInformation.Value = dtReservationInformation;

                SqlParameter paramReservationItineraryInformation = new SqlParameter();
                paramReservationItineraryInformation.ParameterName = "@ReservationItineraryInformation";
                paramReservationItineraryInformation.SqlDbType = System.Data.SqlDbType.Structured;
                paramReservationItineraryInformation.Value = dtReservationItineraryInformation;

                SqlParameter paramShipperInformation = new SqlParameter();
                paramShipperInformation.ParameterName = "@ShipperInformation";
                paramShipperInformation.SqlDbType = System.Data.SqlDbType.Structured;
                paramShipperInformation.Value = dtShipperInformation;

                SqlParameter paramConsigneeInformation = new SqlParameter();
                paramConsigneeInformation.ParameterName = "@ConsigneeInformation";
                paramConsigneeInformation.SqlDbType = System.Data.SqlDbType.Structured;
                paramConsigneeInformation.Value = dtConsigneeInformation;

                DataSet ds = new DataSet();
                SqlParameter[] Parameters = {
                                            new SqlParameter("@AWBSNo", AWBSNo),
                                            new SqlParameter("@BookingSNo", BookingSNo),
                                            new SqlParameter("@BookingRefNo", BookingRefNo),
                                            paramReservationInformation,
                                            paramReservationItineraryInformation,
                                            paramShipperInformation,
                                            paramConsigneeInformation,
                                            new SqlParameter("@BookingStationCitySNo", ((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).CitySNo.ToString()),
                                            new SqlParameter("@UpdatedBy", ((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).UserSNo.ToString()),
                                            new SqlParameter("@ShipperSno", ShipperSno),
                                            new SqlParameter("@ConsigneeSno", ConsigneeSno),
                                            new SqlParameter("@CreateShipperParticipants",CreateShipperParticipants),
                                            new SqlParameter("@CreateConsigneerParticipants",CreateConsigneerParticipants),
                                              new SqlParameter("@CreateShipperTaxParticipants",CreateShipperTaxParticipants),
                                            new SqlParameter("@CreateConsigneerTaxParticipants",CreateConsigneerTaxParticipants),
                                             new SqlParameter("@CreateShipperTaxId",CreateShipperTaxId),
                                            new SqlParameter("@CreateConsigneerTaxId",CreateConsigneerTaxId),
                                            new SqlParameter("@RateShowOnAWBPrint",RateShowOnAWBPrint),
                                            new SqlParameter("@CallerCode",CallerCode),
											new SqlParameter("@HSCodeSNo",HSCode),
                                            new SqlParameter("@EWBEmail",EWBEmail),
                                            new SqlParameter("@CallerType",CallerType),
                                             new SqlParameter("@ChkWb",ChkWb)
                                        };
                DataSet ds1 = new DataSet();

                ds = SqlHelper.ExecuteDataset(DMLConnectionString.WebConfigConnectionString, "Reservation_UpdateBookingShipperandConsigneeInformation", Parameters);
                return ds.Tables[ds.Tables.Count - 1].Rows[0][0].ToString();
            }
            catch (Exception ex)//(Exception ex)
            {
                throw ex;
            }
        }

        //public string ExecuteBookingShipperandConsigneeInformation(Int64 AWBSNo, Int64 BookingSNo, Int64 BookingRefNo, ReservationInformation ReservationInformation, List<ReservationItineraryInformation> ReservationItineraryInformation, ReservationShipperInformation ReservationShipperInformation, ReservationConsigneeInformation ReservationConsigneeInformation, List<ReservationDGRArray> AWBDGRTrans, List<ReservationSHCSubGroupArray> SHCSubGroupArray, Int32 ShipperSno, Int32 ConsigneeSno, string CreateShipperParticipants, string CreateConsigneerParticipants)
        public string ExecuteBookingShipperandConsigneeInformation(Int64 AWBSNo, Int64 BookingSNo, Int64 BookingRefNo, ReservationInformation ReservationInformation, List<ReservationItineraryInformation> ReservationItineraryInformation, ReservationShipperInformation ReservationShipperInformation, ReservationConsigneeInformation ReservationConsigneeInformation, Int32 ShipperSno, Int32 ConsigneeSno, string CreateShipperParticipants, string CreateConsigneerParticipants, int RateShowOnAWBPrint, string HandlingInformation, string CallerCode, string PassengerName, string PNRNumber, string HSCode, string CreateShipperTaxParticipants, string CreateConsigneerTaxParticipants, string CreateShipperTaxId, string CreateConsigneerTaxId,string EWBEmail, string CallerType, Int64 ChkWb)
        {
            try
            {
                BaseBusiness baseBusiness = new BaseBusiness();

                List<ReservationInformation> lstReservationInformation = new List<ReservationInformation>();
                lstReservationInformation.Add(ReservationInformation);
                DataTable dtReservationInformation = CollectionHelper.ConvertTo(lstReservationInformation, "");


                DataTable dtReservationItineraryInformation = CollectionHelper.ConvertTo(ReservationItineraryInformation, "");


                List<ReservationShipperInformation> lstShipperInformation = new List<ReservationShipperInformation>();
                lstShipperInformation.Add(ReservationShipperInformation);
                DataTable dtShipperInformation = CollectionHelper.ConvertTo(lstShipperInformation, "");


                List<ReservationConsigneeInformation> lstConsigneeInformation = new List<ReservationConsigneeInformation>();
                lstConsigneeInformation.Add(ReservationConsigneeInformation);
                DataTable dtConsigneeInformation = CollectionHelper.ConvertTo(lstConsigneeInformation, "");

                //DataTable dtAWBDGRTrans = CollectionHelper.ConvertTo(AWBDGRTrans, "SNo");
                //DataTable dtSHCSubGroupArray = CollectionHelper.ConvertTo(SHCSubGroupArray, "");

                SqlParameter paramReservationInformation = new SqlParameter();
                paramReservationInformation.ParameterName = "@ReservationInformation";
                paramReservationInformation.SqlDbType = System.Data.SqlDbType.Structured;
                paramReservationInformation.Value = dtReservationInformation;

                SqlParameter paramReservationItineraryInformation = new SqlParameter();
                paramReservationItineraryInformation.ParameterName = "@ReservationItineraryInformation";
                paramReservationItineraryInformation.SqlDbType = System.Data.SqlDbType.Structured;
                paramReservationItineraryInformation.Value = dtReservationItineraryInformation;

                SqlParameter paramShipperInformation = new SqlParameter();
                paramShipperInformation.ParameterName = "@ShipperInformation";
                paramShipperInformation.SqlDbType = System.Data.SqlDbType.Structured;
                paramShipperInformation.Value = dtShipperInformation;

                SqlParameter paramConsigneeInformation = new SqlParameter();
                paramConsigneeInformation.ParameterName = "@ConsigneeInformation";
                paramConsigneeInformation.SqlDbType = System.Data.SqlDbType.Structured;
                paramConsigneeInformation.Value = dtConsigneeInformation;

                //SqlParameter paramAWBSPHCTrans = new SqlParameter();
                //paramAWBSPHCTrans.ParameterName = "@AWBSPHCTrans";
                //paramAWBSPHCTrans.SqlDbType = System.Data.SqlDbType.Structured;
                //paramAWBSPHCTrans.Value = dtAWBDGRTrans;

                //SqlParameter paramSHCSubGroupTrans = new SqlParameter();
                //paramSHCSubGroupTrans.ParameterName = "@AWBSHCSubGroupTrans";
                //paramSHCSubGroupTrans.SqlDbType = System.Data.SqlDbType.Structured;
                //paramSHCSubGroupTrans.Value = dtSHCSubGroupArray;

                DataSet ds = new DataSet();
                SqlParameter[] Parameters = {
                                            new SqlParameter("@AWBSNo", AWBSNo),
                                            new SqlParameter("@BookingSNo", BookingSNo),
                                            new SqlParameter("@BookingRefNo", BookingRefNo),
                                            paramReservationInformation,
                                            paramReservationItineraryInformation,
                                            paramShipperInformation,
                                            paramConsigneeInformation,
                                            //paramAWBSPHCTrans,
                                            //paramSHCSubGroupTrans,
                                            new SqlParameter("@BookingStationCitySNo", ((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).CitySNo.ToString()),
                                            new SqlParameter("@UpdatedBy", ((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).UserSNo.ToString()),
                                            new SqlParameter("@ShipperSno", ShipperSno),
                                            new SqlParameter("@ConsigneeSno", ConsigneeSno),
                                            new SqlParameter("@CreateShipperParticipants",CreateShipperParticipants),
                                            new SqlParameter("@CreateConsigneerParticipants",CreateConsigneerParticipants),
                                               new SqlParameter("@CreateShipperTaxParticipants",CreateShipperTaxParticipants),
                                            new SqlParameter("@CreateConsigneerTaxParticipants",CreateConsigneerTaxParticipants),
                                            new SqlParameter("@CreateShipperTaxId",CreateShipperTaxId),
                                            new SqlParameter("@CreateConsigneerTaxId",CreateConsigneerTaxId),
                                            new SqlParameter("@RateShowOnAWBPrint",RateShowOnAWBPrint),
                                            new SqlParameter("@HandlingInformation",HandlingInformation),
                                            new SqlParameter("@CallerCode",CallerCode),
                                            new SqlParameter("@PassengerName, ",PassengerName),
                                            new SqlParameter("@PNRNumber",PNRNumber),
											new SqlParameter("@HSCodeSNo",HSCode),
                                            new SqlParameter("@EWBEmail",EWBEmail),
                                            new SqlParameter("@CallerType",CallerType),
                                             new SqlParameter("@ChkWb",ChkWb)
                                        };
                DataSet ds1 = new DataSet();

                ds = SqlHelper.ExecuteDataset(DMLConnectionString.WebConfigConnectionString, "Reservation_ExecuteBookingShipperandConsigneeInformation_AWB", Parameters);
                return ds.Tables[ds.Tables.Count - 1].Rows[0][0].ToString();
            }
            catch (Exception ex)//(Exception ex)
            {
                throw ex;
            }
        }

        #region AWB E DOX
        public string SaveAWBEDoxDetail(Int32 AWBSNo, List<ReservationAWBEDoxDetail> AWBEDoxDetail, List<ReservationSPHCDoxArray> SPHCDoxArray, string AllEDoxReceived, string Remarks, string PriorApproval, string BOEVerification, Int32 UpdatedBy, string BOENo, string BOEDate, string isFOC, string FOCTypeSNo, string FocRemarks)
        {
            try
            {
                DataTable dtAWBEDoxDetail = CollectionHelper.ConvertTo(AWBEDoxDetail, "");
                DataTable dtSPHCDoxArray = CollectionHelper.ConvertTo(SPHCDoxArray, "");

                SqlParameter paramAWBEDoxDetail = new SqlParameter();
                paramAWBEDoxDetail.ParameterName = "@AWBEDoxDetail";
                paramAWBEDoxDetail.SqlDbType = System.Data.SqlDbType.Structured;
                paramAWBEDoxDetail.Value = dtAWBEDoxDetail;

                dtSPHCDoxArray.Columns.Add("FileBinary", typeof(byte[]));
                foreach (DataRow dr in dtSPHCDoxArray.Rows)
                {
                    if (dr["AltDocName"].ToString() != "")
                    {
                        var serverPath = System.Web.Hosting.HostingEnvironment.MapPath("~/UploadImage/" + dr["AltDocName"].ToString());
                        dr["FileBinary"] = ReadFile(serverPath);
                    }
                }

                SqlParameter paramAWBSPHCEDoxDetail = new SqlParameter();
                paramAWBSPHCEDoxDetail.ParameterName = "@SPHCDocDetails";
                paramAWBSPHCEDoxDetail.SqlDbType = System.Data.SqlDbType.Structured;
                paramAWBSPHCEDoxDetail.Value = dtSPHCDoxArray;


                DataSet ds = new DataSet();
                SqlParameter[] Parameters = {
                                            new SqlParameter("@AWBSNo", AWBSNo),
                                            paramAWBEDoxDetail,
                                            paramAWBSPHCEDoxDetail,
                                            new SqlParameter("@AllEDoxReceived", AllEDoxReceived),
                                            new SqlParameter("@Remarks", Remarks),
                                            new SqlParameter("@PriorApproval", PriorApproval),
                                            new SqlParameter("@BOEVerification", BOEVerification),
                                            new SqlParameter("@UpdatedBy", ((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).UserSNo.ToString()),
                                            new SqlParameter("@BOENo",BOENo),
                                            new SqlParameter("@BOEDate",BOEDate),
                                            new SqlParameter("@isFOC",isFOC),
                                            new SqlParameter("@FOCTypeSNo",FOCTypeSNo),
                                            new SqlParameter("@FocRemarks",FocRemarks)
                                        };
                DataSet ds1 = new DataSet();

                ds = SqlHelper.ExecuteDataset(DMLConnectionString.WebConfigConnectionString, "Reservation_SaveAWBEDoxDetails", Parameters);
                DeleteSelectedFiles();
                return ds.Tables[ds.Tables.Count - 1].Rows[0][0].ToString();

            }
            catch (Exception ex)//(Exception ex)
            {
                throw ex;
            }
        }

        public string GetRecordAtAWBEDox(Int32 AWBSNO)
        {
            try
            {
                SqlParameter[] Parameters = { new SqlParameter("@AWBSNO", AWBSNO) };
                DataSet ds = SqlHelper.ExecuteDataset(DMLConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, "GetRecordAtAWBEDox", Parameters);
                ds.Dispose();
                return CargoFlash.Cargo.Business.Common.CompleteDStoJSON(ds);
            }
            catch (Exception ex)//(Exception ex)
            {
                throw ex;
            }
        }

        public static byte[] ReadFile(string imageLocation)
        {
            try
            {
                byte[] imageData = null;
                FileInfo fileInfo = new FileInfo(imageLocation);
                long imageFileLength = fileInfo.Length;
                FileStream fs = new FileStream(imageLocation, FileMode.Open, FileAccess.Read);
                BinaryReader br = new BinaryReader(fs);
                imageData = br.ReadBytes((int)imageFileLength);
                fs.Dispose();
                br.Dispose();
                return imageData;
            }
            catch (Exception ex)//(Exception ex)
            {
                throw ex;
            }
        }

        public static void DeleteSelectedFiles()
        {
            if (System.IO.Directory.Exists(System.Web.Hosting.HostingEnvironment.MapPath("~/UploadImage/")))
            {
                string[] files = System.IO.Directory.GetFiles(System.Web.Hosting.HostingEnvironment.MapPath("~/UploadImage/"));
                foreach (string s in files)
                {
                    if (s.Split('\\').Last().Split('_')[0] == ((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).UserSNo.ToString())
                    {
                        File.Delete(s);
                    }
                }
            }
        }
        #endregion

        #region DGR AND Sub Group Dimension
        public string GetDGRInfo(string SPHCSNo)
        {
            try
            {
                SqlParameter[] Parameters = { new SqlParameter("@SPHCSNo", SPHCSNo.Replace(",,", ",")) };
                DataSet ds = SqlHelper.ExecuteDataset(DMLConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, "Reservation_GetDGRInfo", Parameters);
                ds.Dispose();
                return JsonConvert.SerializeObject(ds);
            }
            catch (Exception ex)//(Exception ex)
            {
                throw ex;
            }
        }

        public string GetDGRInfoByID(string SNo)
        {
            try
            {
                SqlParameter[] Parameters = { new SqlParameter("@ID", SNo) };
                DataSet ds = SqlHelper.ExecuteDataset(DMLConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, "Reservation_GetDGRInfoByID", Parameters);
                ds.Dispose();
                return JsonConvert.SerializeObject(ds);
            }
            catch (Exception ex)//(Exception ex)
            {
                throw ex;
            }
        }

        public string GetMaxQty(string UNNo, string PackGroup, string PackInst)
        {
            try
            {
                SqlParameter[] Parameters = {
                                            new SqlParameter("@UNNo", UNNo),
                                            new SqlParameter("@PackGroup", PackGroup),
                                            new SqlParameter("@PackInst", PackInst)
                                        };
                DataSet ds = SqlHelper.ExecuteDataset(DMLConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, "Reservation_GetMaxQty", Parameters);
                ds.Dispose();
                return JsonConvert.SerializeObject(ds);
            }
            catch (Exception ex)//(Exception ex)
            {
                throw ex;
            }
        }
        #endregion

        #region Reservation Dimension
        public KeyValuePair<string, List<DimensionTab>> GetDimensionTabRecord(string recordID, int page, int pageSize, string whereCondition, string sort)
        {
            try
            {
                DimensionTab DimensionTab = new DimensionTab();
                SqlParameter[] Parameters = { new SqlParameter("@BookingRefNo", recordID), new SqlParameter("@PageNo", page), new SqlParameter("@PageSize", pageSize), new SqlParameter("@WhereCondition", whereCondition), new SqlParameter("@OrderBy", sort) };
                DataSet ds = SqlHelper.ExecuteDataset(DMLConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, "GetRecordDimensionTab", Parameters);
                // return resultData.Tables[0].AsEnumerable().ToList();
                var DimensionTabList = ds.Tables[0].AsEnumerable().Select(e => new DimensionTab
                {
                    SNo = Convert.ToInt32(e["SNo"]),
                    BookingRefSNo = Convert.ToInt32(e["BookingRefSNo"]),
                    BookingRefNo = e["BookingRefNo"].ToString(),
                    Pieces = Convert.ToInt32(e["Pieces"]),
                    Length = Convert.ToInt32(e["Length"]),
                    Width = Convert.ToInt32(e["Width"]),
                    Height = Convert.ToInt32(e["Height"]),
                    VolumeWeight = Convert.ToDecimal(e["VolumeWeight"]),
                    Volume = Convert.ToDecimal(e["Volume"]),
                    IsCMS = Convert.ToInt32(e["IsCMS"]),
                    CMS = e["CMS"].ToString(),
                    CreatedBy = ((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).UserSNo.ToString(),
                    UpdatedBy = ((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).UserSNo.ToString()
                });
                return new KeyValuePair<string, List<DimensionTab>>(ds.Tables[1].Rows[0][0].ToString(), DimensionTabList.AsQueryable().ToList());
            }
            catch (Exception ex)//(Exception ex)
            {
                throw ex;
            }
        }

        public List<string> createUpdateDimensionTab(string strData)
        {
            try
            {
                int ret = 0;
                List<string> ErrorMessage = new List<string>();
                BaseBusiness baseBussiness = new BaseBusiness();
                // convert JSON string ito datatable
                var dtDimensionTab = JsonConvert.DeserializeObject<DataTable>(CargoFlash.Cargo.Business.Common.Base64ToString(strData));
                dtDimensionTab.Columns.Remove("BookingSNo");
                var dtCreateDimensionTab = (new DataView(dtDimensionTab, "SNo=0", "SNo", DataViewRowState.CurrentRows)).ToTable();
                var dtUpdateDimensionTab = (new DataView(dtDimensionTab, "SNo>0", "SNo", DataViewRowState.CurrentRows)).ToTable();
                SqlParameter param = new SqlParameter();
                param.ParameterName = "@DimensionTabTable";
                param.SqlDbType = System.Data.SqlDbType.Structured;
                // for create new record
                if (dtCreateDimensionTab.Rows.Count > 0)
                {
                    param.Value = dtCreateDimensionTab;
                    SqlParameter[] Parameters = { param };
                    ret = (int)SqlHelper.ExecuteScalar(DMLConnectionString.WebConfigConnectionString, "CreateDimensionTab", Parameters);
                }
                // for update existing record
                if (dtUpdateDimensionTab.Rows.Count > 0)
                {
                    param.Value = dtUpdateDimensionTab;
                    SqlParameter[] Parameters = { param };
                    ret = (int)SqlHelper.ExecuteScalar(DMLConnectionString.WebConfigConnectionString, "UpdateDimensionTab", Parameters);
                }
                if (ret > 0)
                {
                    if (ret > 1000)
                    {
                        string serverErrorMessage = baseBussiness.ReadServerErrorMessages(ret, "ReservationBooking");
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
            catch (Exception ex)//(Exception ex)
            {
                throw ex;
            }
        }

        public List<string> deleteDimensionTab(string recordID)
        {
            try
            {
                int ret = 0;
                List<string> ErrorMessage = new List<string>();
                BaseBusiness baseBussiness = new BaseBusiness();
                SqlParameter[] Parameters = { new SqlParameter("@SNo", recordID) };
                ret = (int)SqlHelper.ExecuteScalar(DMLConnectionString.WebConfigConnectionString, "DeleteDimensionTab", Parameters);
                if (ret > 0)
                {
                    if (ret > 1000)
                    {
                        string serverErrorMessage = baseBussiness.ReadServerErrorMessages(ret, "ReservationBooking");
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
            catch (Exception ex)//(Exception ex)
            {
                throw ex;
            }
        }

        public KeyValuePair<string, List<DimensionTab>> GetDimensionTabRecordAWB(string recordID, int page, int pageSize, string whereCondition, string sort)
        {
            try
            {
                DimensionTab DimensionTab = new DimensionTab();
                SqlParameter[] Parameters = { new SqlParameter("@BookingRefNo", recordID), new SqlParameter("@PageNo", page), new SqlParameter("@PageSize", pageSize), new SqlParameter("@WhereCondition", whereCondition), new SqlParameter("@OrderBy", sort) };
                DataSet ds = SqlHelper.ExecuteDataset(DMLConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, "GetRecordDimensionTabAWB", Parameters);
                // return resultData.Tables[0].AsEnumerable().ToList();
                var DimensionTabList = ds.Tables[0].AsEnumerable().Select(e => new DimensionTab
                {
                    SNo = Convert.ToInt32(e["SNo"]),
                    BookingRefSNo = Convert.ToInt32(e["BookingRefSNo"]),
                    BookingRefNo = e["BookingRefNo"].ToString(),
                    Pieces = Convert.ToInt32(e["Pieces"]),
                    Length = Convert.ToInt32(e["Length"]),
                    Width = Convert.ToInt32(e["Width"]),
                    Height = Convert.ToInt32(e["Height"]),
                    VolumeWeight = Convert.ToDecimal(e["VolumeWeight"]),
                    Volume = Convert.ToDecimal(e["Volume"]),
                    IsCMS = Convert.ToInt32(e["IsCMS"]),
                    CMS = e["CMS"].ToString()
                    //CreatedBy = ((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).UserSNo.ToString(),
                    //UpdatedBy = ((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).UserSNo.ToString()
                });
                return new KeyValuePair<string, List<DimensionTab>>(ds.Tables[1].Rows[0][0].ToString(), DimensionTabList.AsQueryable().ToList());
            }
            catch (Exception ex)//(Exception ex)
            {
                throw ex;
            }
        }

        public List<string> createUpdateDimensionTabAWB(string strData)
        {
            try
            {
                int ret = 0;
                List<string> ErrorMessage = new List<string>();
                BaseBusiness baseBussiness = new BaseBusiness();
                // convert JSON string ito datatable
                var dtDimensionTab = JsonConvert.DeserializeObject<DataTable>(CargoFlash.Cargo.Business.Common.Base64ToString(strData));
                dtDimensionTab.Columns.Remove("BookingSNo");
                var dtCreateDimensionTab = (new DataView(dtDimensionTab, "SNo=0", "SNo", DataViewRowState.CurrentRows)).ToTable();
                var dtUpdateDimensionTab = (new DataView(dtDimensionTab, "SNo>0", "SNo", DataViewRowState.CurrentRows)).ToTable();
                SqlParameter param = new SqlParameter();
                param.ParameterName = "@DimensionTabTable";
                param.SqlDbType = System.Data.SqlDbType.Structured;
                // for create new record
                if (dtCreateDimensionTab.Rows.Count > 0)
                {
                    param.Value = dtCreateDimensionTab;
                    SqlParameter[] Parameters = { param };
                    ret = (int)SqlHelper.ExecuteScalar(DMLConnectionString.WebConfigConnectionString, "CreateDimensionTabAWB", Parameters);
                }
                // for update existing record
                if (dtUpdateDimensionTab.Rows.Count > 0)
                {
                    param.Value = dtUpdateDimensionTab;
                    SqlParameter[] Parameters = { param };
                    ret = (int)SqlHelper.ExecuteScalar(DMLConnectionString.WebConfigConnectionString, "UpdateDimensionTabAWB", Parameters);
                }
                if (ret > 0)
                {
                    if (ret > 1000)
                    {
                        string serverErrorMessage = baseBussiness.ReadServerErrorMessages(ret, "ReservationBooking");
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
            catch (Exception ex)//(Exception ex)
            {
                throw ex;
            }
        }

        public List<string> deleteDimensionTabAWB(string recordID)
        {
            try
            {
                int ret = 0;
                List<string> ErrorMessage = new List<string>();
                BaseBusiness baseBussiness = new BaseBusiness();
                SqlParameter[] Parameters = { new SqlParameter("@SNo", recordID) };
                ret = (int)SqlHelper.ExecuteScalar(DMLConnectionString.WebConfigConnectionString, "DeleteDimensionTabAWB", Parameters);
                if (ret > 0)
                {
                    if (ret > 1000)
                    {
                        string serverErrorMessage = baseBussiness.ReadServerErrorMessages(ret, "ReservationBooking");
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
            catch (Exception ex)//(Exception ex)
            {
                throw ex;
            }
        }
        #endregion

        #region Reservation Dimension ULD
        public KeyValuePair<string, List<DimensionULDTab>> GetDimensionULDTabRecord(string recordID, int page, int pageSize, string whereCondition, string sort)
        {
            try
            {
                DimensionULDTab DimensionULDTab = new DimensionULDTab();
                SqlParameter[] Parameters = { new SqlParameter("@BookingRefNo", recordID), new SqlParameter("@PageNo", page), new SqlParameter("@PageSize", pageSize), new SqlParameter("@WhereCondition", whereCondition), new SqlParameter("@OrderBy", sort) };
                DataSet ds = SqlHelper.ExecuteDataset(DMLConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, "GetRecordDimensionULDTab", Parameters);
                // return resultData.Tables[0].AsEnumerable().ToList();
                var DimensionULDTabList = ds.Tables[0].AsEnumerable().Select(e => new DimensionULDTab
                {
                    SNo = Convert.ToInt32(e["SNo"]),
                    BookingRefSNo = Convert.ToInt32(e["BookingRefSNo"]),
                    BookingRefNo = e["BookingRefNo"].ToString(),
                    ULDTypeSNo = e["ULDType"].ToString(),
                    HdnULDTypeSNo = Convert.ToInt32(e["ULDTypeSNo"]),
                    ULDNo = e["ULDNo"].ToString(),
                    OwnerCode = e["OwnerCode"].ToString(),
                    SLAC = Convert.ToInt32(e["SLAC"]),
                    Pieces = Convert.ToInt32(e["Pieces"]),
                    Length = Convert.ToInt32(e["Length"]),
                    Width = Convert.ToInt32(e["Width"]),
                    Height = Convert.ToInt32(e["Height"]),
                    VolumeWeight = Convert.ToDecimal(e["VolumeWeight"]),
                    Volume = Convert.ToDecimal(e["Volume"]),
                    IsCMS = Convert.ToInt32(e["IsCMS"]),
                    CMS = e["CMS"].ToString(),
                    CreatedBy = ((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).UserSNo.ToString(),
                    UpdatedBy = ((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).UserSNo.ToString()
                });
                return new KeyValuePair<string, List<DimensionULDTab>>(ds.Tables[1].Rows[0][0].ToString(), DimensionULDTabList.AsQueryable().ToList());
            }
            catch (Exception ex)//(Exception ex)
            {
                throw ex;
            }
        }

        public List<string> createUpdateDimensionULDTab(string strData)
        {
            try
            {
                int ret = 0;
                List<string> ErrorMessage = new List<string>();
                BaseBusiness baseBussiness = new BaseBusiness();
                // convert JSON string ito datatable
                var dtDimensionULDTab = JsonConvert.DeserializeObject<DataTable>(CargoFlash.Cargo.Business.Common.Base64ToString(strData));
                dtDimensionULDTab.Columns.Remove("BookingSNo");
                dtDimensionULDTab.Columns.Remove("ULDTypeSNo");
                var dtCreateDimensionULDTab = (new DataView(dtDimensionULDTab, "SNo=0", "SNo", DataViewRowState.CurrentRows)).ToTable();
                var dtUpdateDimensionULDTab = (new DataView(dtDimensionULDTab, "SNo>0", "SNo", DataViewRowState.CurrentRows)).ToTable();
                SqlParameter param = new SqlParameter();
                param.ParameterName = "@DimensionULDTabTable";
                param.SqlDbType = System.Data.SqlDbType.Structured;
                // for create new record
                if (dtCreateDimensionULDTab.Rows.Count > 0)
                {
                    param.Value = dtCreateDimensionULDTab;
                    SqlParameter[] Parameters = { param };
                    ret = (int)SqlHelper.ExecuteScalar(DMLConnectionString.WebConfigConnectionString, "CreateDimensionULDTab", Parameters);
                }
                // for update existing record
                if (dtUpdateDimensionULDTab.Rows.Count > 0)
                {
                    param.Value = dtUpdateDimensionULDTab;
                    SqlParameter[] Parameters = { param };
                    ret = (int)SqlHelper.ExecuteScalar(DMLConnectionString.WebConfigConnectionString, "UpdateDimensionULDTab", Parameters);
                }
                if (ret > 0)
                {
                    if (ret > 1000)
                    {
                        string serverErrorMessage = baseBussiness.ReadServerErrorMessages(ret, "ReservationBooking");
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
            catch (Exception ex)//(Exception ex)
            {
                throw ex;
            }
        }

        public List<string> deleteDimensionULDTab(string recordID)
        {
            try
            {
                int ret = 0;
                List<string> ErrorMessage = new List<string>();
                BaseBusiness baseBussiness = new BaseBusiness();
                SqlParameter[] Parameters = { new SqlParameter("@SNo", recordID) ,
                                          new SqlParameter("@UserID",((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).UserSNo.ToString())
                                        };
                ret = (int)SqlHelper.ExecuteScalar(DMLConnectionString.WebConfigConnectionString, "DeleteDimensionULDTab", Parameters);
                if (ret > 0)
                {
                    if (ret > 1000)
                    {
                        string serverErrorMessage = baseBussiness.ReadServerErrorMessages(ret, "ReservationBooking");
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
            catch (Exception ex)//(Exception ex)
            {
                throw ex;
            }
        }
        #endregion

        #region Rate Details
        public string RateDetailsTab(Int64 BookingRefNo, Int32 AWBSNo)
        {
            try
            {
                SqlParameter[] Parameters = { new SqlParameter("@LoginSNo", ((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).UserSNo),
                                            new SqlParameter("@BookingRefNo", BookingRefNo),
                                            new SqlParameter("@AWBSNo", AWBSNo)
                                        };
                DataSet ds = new DataSet();
                ds = SqlHelper.ExecuteDataset(DMLConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, "Reservation_RateDetailsTab", Parameters);
                ds.Dispose();
                return CargoFlash.Cargo.Business.Common.CompleteDStoJSON(ds);
            }
            catch (Exception ex)//(Exception ex)
            {
                throw ex;
            }
        }

        public string SaveChargeDeclarationsRateData(Int64 AWBSNo, Int64 BookingSNo, Int64 BookingRefNo, ReservationChargeDeclarations ReservationChargeDeclarations, int TransactionType, decimal TransactionAmount, string TransactionNo)
        {
            BaseBusiness baseBusiness = new BaseBusiness();

            List<ReservationChargeDeclarations> lstReservationChargeDeclarations = new List<ReservationChargeDeclarations>();
            lstReservationChargeDeclarations.Add(ReservationChargeDeclarations);
            DataTable dtReservationChargeDeclarations = CollectionHelper.ConvertTo(lstReservationChargeDeclarations, "");

            SqlParameter paramReservationChargeDeclarations = new SqlParameter();
            paramReservationChargeDeclarations.ParameterName = "@ReservationChargeDeclarations";
            paramReservationChargeDeclarations.SqlDbType = System.Data.SqlDbType.Structured;
            paramReservationChargeDeclarations.Value = dtReservationChargeDeclarations;

            DataSet ds = new DataSet();
            SqlParameter[] Parameters = {
                                            new SqlParameter("@AWBSNo", AWBSNo),
                                            new SqlParameter("@BookingSNo", BookingSNo),
                                            new SqlParameter("@BookingRefNo", BookingRefNo),
                                            paramReservationChargeDeclarations,
                                            new SqlParameter("@UpdatedBy", ((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).UserSNo.ToString()),
                                                new SqlParameter("@TransactionBy", TransactionType), new SqlParameter("@TransactionAmount", TransactionAmount),
                                                 new SqlParameter("@TransactionNo", TransactionNo)
                                        };
            DataSet ds1 = new DataSet();
            try
            {
                ds = SqlHelper.ExecuteDataset(DMLConnectionString.WebConfigConnectionString, "Reservation_SaveChargeDeclarationsRateData", Parameters);
                return ds.Tables[ds.Tables.Count - 1].Rows[0][0].ToString();
            }
            catch (Exception ex)//(Exception ex)
            {
                throw ex;
            }
        }
        #endregion

        #region Due Carrier Other Charges Information
        public KeyValuePair<string, List<DueCarrierOtherCharge>> GetDueCarrierOtherChargeTabRecord(string recordID, int page, int pageSize, AWBSNoRequest model, string sort)
        {
            try
            {
                DueCarrierOtherCharge DueCarrierOtherCharge = new DueCarrierOtherCharge();
                SqlParameter[] Parameters = { new SqlParameter("@BookingRefNo", recordID), new SqlParameter("@AWBSNo", model.AWBSNo), new SqlParameter("@PageNo", page), new SqlParameter("@PageSize", pageSize), new SqlParameter("@WhereCondition", ""), new SqlParameter("@OrderBy", sort) };
                DataSet ds = SqlHelper.ExecuteDataset(DMLConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, "GetRecordDueCarrierOtherCharge", Parameters);
                var DueCarrierOtherChargeList = ds.Tables[0].AsEnumerable().Select(e => new DueCarrierOtherCharge
                {
                    SNo = Convert.ToInt32(e["SNo"]),
                    AWBSNo = e["AWBSNo"].ToString(),
                    BookingRefNo = e["BookingRefNo"].ToString(),
                    Type = e["Type"].ToString(),
                    OtherChargeCode = e["OtherChargeCode"].ToString(),
                    OtherchargeDetail = e["OtherchargeDetail"].ToString(),
                    ChargeValue = e["ChargeValue"].ToString(),
                    OtherchargeCurrency = e["OtherchargeCurrency"].ToString(),
                    ReferenceNumber = e["ReferenceNumber"].ToString(),
                    ConvertedChargeValue = e["ConvertedChargeValue"].ToString(),
                    ConvertedCurrencyCode = e["ConvertedCurrencyCode"].ToString(),
                    ChargeType = e["ChargeType"].ToString(),
                    CreatedBy = ((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).UserSNo.ToString(),
                    UpdatedBy = ((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).UserSNo.ToString()
                });
                return new KeyValuePair<string, List<DueCarrierOtherCharge>>(ds.Tables[1].Rows[0][0].ToString(), DueCarrierOtherChargeList.AsQueryable().ToList());
            }
            catch (Exception ex)//(Exception ex)
            {
                throw ex;
            }
        }
        #endregion

        #region Due Agent Other Charges Information
        public KeyValuePair<string, List<AgentOtherCharge>> GetAgentOtherChargeTabRecord(string recordID, int page, int pageSize, AWBSNoRequest model, string sort)
        {
            try
            {
                AgentOtherCharge AgentOtherCharge = new AgentOtherCharge();
                SqlParameter[] Parameters = { new SqlParameter("@BookingRefNo", recordID), new SqlParameter("@AWBSNo", model.AWBSNo), new SqlParameter("@PageNo", page), new SqlParameter("@PageSize", pageSize), new SqlParameter("@WhereCondition", ""), new SqlParameter("@OrderBy", sort) };
                DataSet ds = SqlHelper.ExecuteDataset(DMLConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, "GetRecordAgentOtherCharge", Parameters);
                // return resultData.Tables[0].AsEnumerable().ToList();
                var AgentOtherChargeList = ds.Tables[0].AsEnumerable().Select(e => new AgentOtherCharge
                {
                    SNo = Convert.ToInt32(e["SNo"]),
                    AWBSNo = e["AWBSNo"].ToString(),
                    BookingRefNo = e["BookingRefNo"].ToString(),
                    Type = e["Type"].ToString(),
                    OtherChargeType = e["OtherChargeType"].ToString(),
                    OtherChargeCode = e["OtherChargeCode"].ToString(),
                    OtherchargeDetail = e["OtherchargeDetail"].ToString(),
                    AgentOtherchargeCurrency = e["AgentOtherchargeCurrency"].ToString(),
                    HdnAgentOtherchargeCurrency = e["AgentOtherchargeCurrencySNo"].ToString(),
                    ReferenceNumber = e["ReferenceNumber"].ToString(),
                    ChargeValue = e["ChargeValue"].ToString(),
                    ConvertedChargeValue = e["ConvertedChargeValue"].ToString(),
                    ConvertedCurrencyCode = e["ConvertedCurrencyCode"].ToString(),
                    ChargeType = e["ChargeType"].ToString(),
                    CreatedBy = ((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).UserSNo.ToString(),
                    UpdatedBy = ((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).UserSNo.ToString()
                });
                return new KeyValuePair<string, List<AgentOtherCharge>>(ds.Tables[1].Rows[0][0].ToString(), AgentOtherChargeList.AsQueryable().ToList());
            }
            catch (Exception ex)//(Exception ex)
            {
                throw ex;
            }
        }

        public List<string> createUpdateAgentOtherChargeTab(string strData)
        {
            try
            {
                int ret = 0;
                List<string> ErrorMessage = new List<string>();
                BaseBusiness baseBussiness = new BaseBusiness();
                // convert JSON string ito datatable
                var dtAgentOtherChargeTab = JsonConvert.DeserializeObject<DataTable>(CargoFlash.Cargo.Business.Common.Base64ToString(strData));
                //dtAgentOtherChargeTab.Columns.Remove("BookingSNo");
                var dtCreateAgentOtherChargeTab = (new DataView(dtAgentOtherChargeTab, "SNo=0", "SNo", DataViewRowState.CurrentRows)).ToTable();
                var dtUpdateAgentOtherChargeTab = (new DataView(dtAgentOtherChargeTab, "SNo>0", "SNo", DataViewRowState.CurrentRows)).ToTable();
                SqlParameter param = new SqlParameter();




                param.ParameterName = "@AgentOtherChargeTabTable";
                param.SqlDbType = System.Data.SqlDbType.Structured;
                // for create new record
                if (dtCreateAgentOtherChargeTab.Rows.Count > 0)
                {
                    if (dtAgentOtherChargeTab.Columns.Contains("ReferenceNumber"))
                        dtAgentOtherChargeTab.Columns.Remove("ReferenceNumber");
                    if (dtAgentOtherChargeTab.Columns.Contains("ConvertedChargeValue"))
                        dtAgentOtherChargeTab.Columns.Remove("ConvertedChargeValue");
                    if (dtAgentOtherChargeTab.Columns.Contains("ConvertedCurrencyCode"))
                        dtAgentOtherChargeTab.Columns.Remove("ConvertedCurrencyCode");
                    if (dtCreateAgentOtherChargeTab.Columns.Contains("HdnOtherChargeCode"))
                    {
                        dtCreateAgentOtherChargeTab.Columns.Remove("HdnOtherChargeCode");
                    }
                    param.Value = dtCreateAgentOtherChargeTab;
                    SqlParameter[] Parameters = { param };
                    ret = (int)SqlHelper.ExecuteScalar(DMLConnectionString.WebConfigConnectionString, "CreateAgentOtherChargeTab", Parameters);
                }
                //for update existing record
                if (dtUpdateAgentOtherChargeTab.Rows.Count > 0)
                {
                    if (dtUpdateAgentOtherChargeTab.Columns.Contains("ReferenceNumber"))
                        dtUpdateAgentOtherChargeTab.Columns.Remove("ReferenceNumber");
                    if (dtUpdateAgentOtherChargeTab.Columns.Contains("ConvertedChargeValue"))
                        dtUpdateAgentOtherChargeTab.Columns.Remove("ConvertedChargeValue");
                    if (dtUpdateAgentOtherChargeTab.Columns.Contains("ConvertedCurrencyCode"))
                        dtUpdateAgentOtherChargeTab.Columns.Remove("ConvertedCurrencyCode");
                    if (dtUpdateAgentOtherChargeTab.Columns.Contains("HdnOtherChargeCode"))
                        dtUpdateAgentOtherChargeTab.Columns.Remove("HdnOtherChargeCode");

                    param.Value = dtUpdateAgentOtherChargeTab;
                    SqlParameter[] Parameters = { param };
                    ret = (int)SqlHelper.ExecuteScalar(DMLConnectionString.WebConfigConnectionString, "UpdateAgentOtherChargeTab", Parameters);
                }
                if (ret > 0)
                {
                    if (ret > 1000)
                    {
                        string serverErrorMessage = baseBussiness.ReadServerErrorMessages(ret, "ReservationBooking");
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
            catch (Exception ex)//(Exception ex)
            {
                throw ex;
            }
        }
        #endregion

        #region Tax Information
        public KeyValuePair<string, List<TaxChargeInformation>> GetTaxChargeInformationTabRecord(string recordID, int page, int pageSize, AWBSNoRequest model, string sort)
        {
            try
            {
                TaxChargeInformation TaxChargeInformation = new TaxChargeInformation();
                SqlParameter[] Parameters = { new SqlParameter("@BookingRefNo", recordID), new SqlParameter("@AWBSNo", model.AWBSNo), new SqlParameter("@PageNo", page), new SqlParameter("@PageSize", pageSize), new SqlParameter("@WhereCondition", ""), new SqlParameter("@OrderBy", sort) };
                DataSet ds = SqlHelper.ExecuteDataset(DMLConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, "GetRecordTaxChargeInformation", Parameters);
                // return resultData.Tables[0].AsEnumerable().ToList();
                var TaxChargeInformationList = ds.Tables[0].AsEnumerable().Select(e => new TaxChargeInformation
                {
                    SNo = Convert.ToInt32(e["SNo"]),
                    AWBSNo = e["AWBSNo"].ToString(),
                    BookingRefNo = e["BookingRefNo"].ToString(),
                    TaxCode = e["TaxCode"].ToString(),
                    TaxName = e["TaxName"].ToString(),
                    TaxType = e["TaxType"].ToString(),
                    TaxApplicable = e["TaxApplicable"].ToString(),
                    TaxRate = e["TaxRate"].ToString(),
                    TaxAmount = e["TaxAmount"].ToString(),
                    TaxCurrency = e["TaxCurrency"].ToString(),
                    //TotalTaxAmount = e["TotalTaxAmount"].ToString(),
                    MarketRateTax = e["MarketRateTax"].ToString(),
                    ReferenceNumber = e["ReferenceNumber"].ToString(),
                    ConvertedChargeValue = e["ConvertedChargeValue"].ToString(),
                    ConvertedCurrencyCode = e["ConvertedCurrencyCode"].ToString(),
                    CreatedBy = ((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).UserSNo.ToString(),
                    UpdatedBy = ((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).UserSNo.ToString()
                });
                return new KeyValuePair<string, List<TaxChargeInformation>>(ds.Tables[1].Rows[0][0].ToString(), TaxChargeInformationList.AsQueryable().ToList());
            }
            catch (Exception ex)//(Exception ex)
            {
                throw ex;
            }
        }
        #endregion

        #region Other Information
        public KeyValuePair<string, List<CustomsOtherInformationTab>> GetCustomsOtherInformationTabRecord(string recordID, int page, int pageSize, AWBSNoRequest model, string sort)
        {
            try
            {
                CustomsOtherInformationTab CustomsOtherInformationTab = new CustomsOtherInformationTab();
                SqlParameter[] Parameters = { new SqlParameter("@BookingRefNo", recordID), new SqlParameter("@AWBSNo", model.AWBSNo), new SqlParameter("@PageNo", page), new SqlParameter("@PageSize", pageSize), new SqlParameter("@WhereCondition", ""), new SqlParameter("@OrderBy", sort) };
                DataSet ds = SqlHelper.ExecuteDataset(DMLConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, "GetRecordCustomsOtherInformationTab", Parameters);
                var CustomsOtherInformationTabList = ds.Tables[0].AsEnumerable().Select(e => new CustomsOtherInformationTab
                {
                    SNo = Convert.ToInt32(e["SNo"]),
                    AWBSNo = e["AWBSNo"].ToString(),
                    OSI = e["SCI"].ToString(),
					BookingSNo= e["AWBReferenceBookingSNo"].ToString(),
					BookingRefNo = e["BookingRefNo"].ToString(),
					CreatedBy = ((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).UserSNo.ToString(),
                    UpdatedBy = ((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).UserSNo.ToString()
                });
                return new KeyValuePair<string, List<CustomsOtherInformationTab>>(ds.Tables[1].Rows[0][0].ToString(), CustomsOtherInformationTabList.AsQueryable().ToList());
            }
            catch (Exception ex)//(Exception ex)
            {
                throw ex;
            }
        }

        public List<string> createUpdateCustomsOtherInformationTab(string strData)
        {
            try
            {
                int ret = 0;
                List<string> ErrorMessage = new List<string>();
                BaseBusiness baseBussiness = new BaseBusiness();
                // convert JSON string ito datatable
                var dtCustomsOtherInformationTab = JsonConvert.DeserializeObject<DataTable>(CargoFlash.Cargo.Business.Common.Base64ToString(strData));
                //dtCustomsOtherInformationTab.Columns.Remove("BookingSNo");
                var dtCreateCustomsOtherInformationTab = (new DataView(dtCustomsOtherInformationTab, "SNo=0", "SNo", DataViewRowState.CurrentRows)).ToTable();
                var dtUpdateCustomsOtherInformationTab = (new DataView(dtCustomsOtherInformationTab, "SNo>0", "SNo", DataViewRowState.CurrentRows)).ToTable();
                SqlParameter param = new SqlParameter();
                param.ParameterName = "@CustomsOtherInformationTabTable";
                param.SqlDbType = System.Data.SqlDbType.Structured;
                // for create new record
                if (dtCreateCustomsOtherInformationTab.Rows.Count > 0)
                {
                    param.Value = dtCreateCustomsOtherInformationTab;
                    SqlParameter[] Parameters = { param };
                    ret = (int)SqlHelper.ExecuteScalar(DMLConnectionString.WebConfigConnectionString, "CreateCustomsOtherInformationTab", Parameters);
                }
                //for update existing record
                if (dtUpdateCustomsOtherInformationTab.Rows.Count > 0)
                {
                    param.Value = dtUpdateCustomsOtherInformationTab;
                    SqlParameter[] Parameters = { param };
                    ret = (int)SqlHelper.ExecuteScalar(DMLConnectionString.WebConfigConnectionString, "UpdateCustomsOtherInformationTab", Parameters);
                }
                if (ret > 0)
                {
                    if (ret > 1000)
                    {
                        string serverErrorMessage = baseBussiness.ReadServerErrorMessages(ret, "ReservationBooking");
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
            catch (Exception ex)//(Exception ex)
            {
                throw ex;
            }
        }

        public List<string> deleteCustomsOtherInformationTab(string recordID)
        {
            try
            {
                int ret = 0;
                List<string> ErrorMessage = new List<string>();
                BaseBusiness baseBussiness = new BaseBusiness();
                SqlParameter[] Parameters = { new SqlParameter("@SNo", recordID) };
                ret = (int)SqlHelper.ExecuteScalar(DMLConnectionString.WebConfigConnectionString, "DeleteCustomsOtherInformationTab", Parameters);
                if (ret > 0)
                {
                    if (ret > 1000)
                    {
                        string serverErrorMessage = baseBussiness.ReadServerErrorMessages(ret, "ReservationBooking");
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
            catch (Exception ex)//(Exception ex)
            {
                throw ex;
            }
        }
        #endregion

        #region Due Agent Other Charges Information
        public KeyValuePair<string, List<CustomsOCIInformationTab>> GetCustomsOCIInformationTabRecord(string recordID, int page, int pageSize, AWBSNoRequest model, string sort)
        {
            try
            {
                CustomsOCIInformationTab CustomsOCIInformationTab = new CustomsOCIInformationTab();
                SqlParameter[] Parameters = { new SqlParameter("@BookingRefNo", recordID), new SqlParameter("@AWBSNo", model.AWBSNo), new SqlParameter("@PageNo", page), new SqlParameter("@PageSize", pageSize), new SqlParameter("@WhereCondition", ""), new SqlParameter("@OrderBy", sort) };
                DataSet ds = SqlHelper.ExecuteDataset(DMLConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, "GetRecordCustomsOCIInformationTab", Parameters);
                var CustomsOCIInformationTabList = ds.Tables[0].AsEnumerable().Select(e => new CustomsOCIInformationTab
                {
                    SNo = Convert.ToInt32(e["SNo"]),
                    AWBSNo = e["AWBSNo"].ToString(),
					BookingSNo= e["AWBReferenceBookingSNo"].ToString(),
					BookingRefNo = e["BookingRefNo"].ToString(),
					CountryCode = e["CountrySno"].ToString() == "" ? "" : e["CountryCode"].ToString() + '-' + e["CountryName"].ToString(),
                    HdnCountryCode = e["CountrySno"].ToString() == "" ? 0 : Convert.ToInt32(e["CountrySno"]),
                    InfoType = e["InformationTypeSno"].ToString() == "" ? "" : e["InformationCode"].ToString() + '-' + e["Description"].ToString(),
                    HdnInfoType = e["InformationTypeSno"].ToString() == "" ? 0 : Convert.ToInt32(e["InformationTypeSno"]),
                    CSControlInfoIdentifire = e["CustomsSno"].ToString() == "" ? "" : e["CustomsCode"].ToString() + '-' + e["CustomDescription"].ToString(),
                    HdnCSControlInfoIdentifire = e["CustomsSno"].ToString() == "" ? 0 : Convert.ToInt32(e["CustomsSno"]),
                    SCSControlInfoIdentifire = e["SupplementaryCustoms"].ToString(),
                    CreatedBy = ((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).UserSNo.ToString(),
                    UpdatedBy = ((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).UserSNo.ToString()
                });
                return new KeyValuePair<string, List<CustomsOCIInformationTab>>(ds.Tables[1].Rows[0][0].ToString(), CustomsOCIInformationTabList.AsQueryable().ToList());
            }
            catch (Exception ex)//(Exception ex)
            {
                throw ex;
            }
        }

        public List<string> createUpdateCustomsOCIInformationTab(string strData)
        {
            try
            {
                int ret = 0;
                List<string> ErrorMessage = new List<string>();
                BaseBusiness baseBussiness = new BaseBusiness();
                // convert JSON string ito datatable
                var dtCustomsOCIInformationTab = JsonConvert.DeserializeObject<DataTable>(CargoFlash.Cargo.Business.Common.Base64ToString(strData));
                dtCustomsOCIInformationTab.Columns.Remove("CountryCode");
                dtCustomsOCIInformationTab.Columns.Remove("InfoType");
                dtCustomsOCIInformationTab.Columns.Remove("CSControlInfoIdentifire");
                var dtCreateCustomsOCIInformationTab = (new DataView(dtCustomsOCIInformationTab, "SNo=0", "SNo", DataViewRowState.CurrentRows)).ToTable();
                var dtUpdateCustomsOCIInformationTab = (new DataView(dtCustomsOCIInformationTab, "SNo>0", "SNo", DataViewRowState.CurrentRows)).ToTable();
                SqlParameter param = new SqlParameter();
                param.ParameterName = "@CustomsOCIInformationTabTable";
                param.SqlDbType = System.Data.SqlDbType.Structured;
                // for create new record
                if (dtCreateCustomsOCIInformationTab.Rows.Count > 0)
                {
                    param.Value = dtCreateCustomsOCIInformationTab;
                    SqlParameter[] Parameters = { param };
                    ret = (int)SqlHelper.ExecuteScalar(DMLConnectionString.WebConfigConnectionString, "CreateCustomsOCIInformationTab", Parameters);
                }
                //for update existing record
                if (dtUpdateCustomsOCIInformationTab.Rows.Count > 0)
                {
                    param.Value = dtUpdateCustomsOCIInformationTab;
                    SqlParameter[] Parameters = { param };
                    ret = (int)SqlHelper.ExecuteScalar(DMLConnectionString.WebConfigConnectionString, "UpdateCustomsOCIInformationTab", Parameters);
                }
                if (ret > 0)
                {
                    if (ret > 1000)
                    {
                        string serverErrorMessage = baseBussiness.ReadServerErrorMessages(ret, "ReservationBooking");
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
            catch (Exception ex)//(Exception ex)
            {
                throw ex;
            }
        }

		public List<string> deleteCustomsOCIInformationTab(string recordID)
		{
			try
			{
				int ret = 0;
				List<string> ErrorMessage = new List<string>();
				BaseBusiness baseBussiness = new BaseBusiness();
				SqlParameter[] Parameters = { new SqlParameter("@SNo", recordID),
											  new SqlParameter("@UserSNo", ((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).UserSNo)
											};
				ret = (int)SqlHelper.ExecuteScalar(DMLConnectionString.WebConfigConnectionString, "DeleteCustomsOCIInformationTab", Parameters);
				if (ret > 0)
				{
					if (ret > 1000)
					{
						string serverErrorMessage = baseBussiness.ReadServerErrorMessages(ret, "ReservationBooking");
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
			catch (Exception ex)//(Exception ex)
			{
				throw ex;
			}
		}
		#endregion

		#region Notify and Nominated Details
		public string NotifyDetailsTab(Int64 BookingRefNo, Int32 AWBSNo)
        {
            try
            {
                SqlParameter[] Parameters = { new SqlParameter("@LoginSNo", ((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).UserSNo),
                                            new SqlParameter("@BookingRefNo", BookingRefNo),
                                            new SqlParameter("@AWBSNo", AWBSNo)
										};
                DataSet ds = new DataSet();
                ds = SqlHelper.ExecuteDataset(DMLConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, "Reservation_NotifyDetailsTab", Parameters);
                ds.Dispose();
                return CargoFlash.Cargo.Business.Common.CompleteDStoJSON(ds);
            }
            catch (Exception ex)//(Exception ex)
            {
                throw ex;
            }
        }

		public string SaveNotifyData(Int32 AWBSNo, CustomNotifyDetails NotifyModel, CustomNominyDetails NominyModel, string ReferenceNumber, Int32 AwbReferenceBookingSNo, string HandlingInformation)
		{
			try
			{
				List<CustomNotifyDetails> lstNotifyInformation = new List<CustomNotifyDetails>();
				lstNotifyInformation.Add(NotifyModel);
				DataTable dtNotifyDetails = CollectionHelper.ConvertTo(lstNotifyInformation, "");

				List<CustomNominyDetails> lstNominyInformation = new List<CustomNominyDetails>();
				lstNominyInformation.Add(NominyModel);
				DataTable dtNominyDetails = CollectionHelper.ConvertTo(lstNominyInformation, "");

				SqlParameter paramNotifyDetails = new SqlParameter();
				paramNotifyDetails.ParameterName = "@NotifyDetails";
				paramNotifyDetails.SqlDbType = System.Data.SqlDbType.Structured;
				paramNotifyDetails.Value = dtNotifyDetails;

				SqlParameter paramNominyDetails = new SqlParameter();
				paramNominyDetails.ParameterName = "@NominyDetails";
				paramNominyDetails.SqlDbType = System.Data.SqlDbType.Structured;
				paramNominyDetails.Value = dtNominyDetails;

				DataSet ds = new DataSet();
				SqlParameter[] Parameters = {
											new SqlParameter("@AWBSNo", AWBSNo),
											paramNotifyDetails,
											paramNominyDetails,
											new SqlParameter("@UpdatedBy", ((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).UserSNo.ToString()),
											new SqlParameter("@ReferenceNumber", ReferenceNumber),
											new SqlParameter("@AwbReferenceBookingSNo", AwbReferenceBookingSNo),
											new SqlParameter("@HandlingInformation", HandlingInformation)
										};
				DataSet ds1 = new DataSet();

				ds = SqlHelper.ExecuteDataset(DMLConnectionString.WebConfigConnectionString, "Reservation_SaveNotifyData", Parameters);
				return ds.Tables[ds.Tables.Count - 1].Rows[0][0].ToString();

			}
			catch (Exception ex)//(Exception ex)
			{
				throw ex;
			}
		}
        #endregion


        //------------ Applied Spot Code By Akash

        public string GetAWbForSpotRate(SpotRate spotRate)
        {
            try
            {
                DataSet ds = new DataSet();
                DateTime now = DateTime.Now;

                SqlParameter[] Parameters = {
                                           new SqlParameter("@AWbno", spotRate.AWBNo)
                                        
                                        };
                ds = SqlHelper.ExecuteDataset(DMLConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, "spSpotRate_GetAWbForSpotRate", Parameters);
                //DataTable dt = ds.Tables[0];
                return CargoFlash.Cargo.Business.Common.CompleteDStoJSON(ds);
            }
            catch (Exception ex)//(Exception ex)
            {
                throw ex;
            }
        }

        public string GetApprovalRateInformation(ApprovalRateInformation SpotRate)
        {
            try
            {
                DataSet ds = new DataSet();
                SqlParameter[] Parameters = {
                                           new SqlParameter("@AWbNumber", SpotRate.AWBNumber),
                                           new SqlParameter("@SpotCode", SpotRate.SpotCode),
                                            new SqlParameter("@CodeType", SpotRate.CodeTypeValue)

                                        };
              ds = SqlHelper.ExecuteDataset(DMLConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, "spSpotRate_GetApprovalRateInformation", Parameters);
                return CargoFlash.Cargo.Business.Common.CompleteDStoJSON(ds);

            }
            catch (Exception ex)//(Exception ex)
            {
                throw ex;
            }
        }


        public string SpotCodeApplied(SpotCodeApplied spotCodeApplied)
        {
            try
            {
                DataSet ds = new DataSet();
                DateTime now = DateTime.Now;
                SqlParameter[] Parameters = {
                                           new SqlParameter("@AWbSNo", spotCodeApplied.AWbSNo),
                                           new SqlParameter("@OriginSno", spotCodeApplied.OriginSno),
                                           new SqlParameter("@DestinationCitySno", spotCodeApplied.DestinationCitySno),
                                           new SqlParameter("@Pieces",spotCodeApplied.Pieces),
                                           new SqlParameter("@GrossWeight", spotCodeApplied.GrossWeight),
                                           new SqlParameter("@Volume", spotCodeApplied.Volume),
                                           new SqlParameter("@ChargeableWeight", spotCodeApplied.ChargeableWeight),
                                           new SqlParameter("@SpotCode", spotCodeApplied.SpotCode),
                                           new SqlParameter("@SpotSno",spotCodeApplied.SpotSno),
                                           new SqlParameter("@UpdatedBy", spotCodeApplied.UpdatedBy),
                                           new SqlParameter("@CodeType", spotCodeApplied.CodeType),
                                           new SqlParameter("@CampaignCode", spotCodeApplied.CampaignCode),
                                           new SqlParameter("@AccountSNo", spotCodeApplied.AccountSNo),
                                        };
                ds = SqlHelper.ExecuteDataset(DMLConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, "spReservationBooking_GetSpotCodeApplied", Parameters);

                return CargoFlash.Cargo.Business.Common.CompleteDStoJSON(ds);
            }
            catch (Exception ex)//(Exception ex)
            {
                throw ex;
            }

        }

        public string BindSpotCode(int AccountSNo, int OriginCitySNo, int DestinationCitySNo, int AWBSNo)
        {
            try
            {
                SqlParameter[] Parameters = { new SqlParameter("@AccountSNo", AccountSNo),
                                            new SqlParameter("@CitySNo", OriginCitySNo),
                                            new SqlParameter("@DestinationSNo", DestinationCitySNo),
                                            new SqlParameter("@AwbSNo", AWBSNo)
                                        };
                DataSet ds = new DataSet();
                ds = SqlHelper.ExecuteDataset(DMLConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, "spReservationBooking_GetSpotCode", Parameters);
                ds.Dispose();
                return CargoFlash.Cargo.Business.Common.CompleteDStoJSON(ds);
            }
            catch (Exception ex)//(Exception ex)
            {
                throw ex;
            }
        }
        public string GetOperationalDetail(Int64 AWBSNo)
        {
            try
            {
                SqlParameter[] Parameters = { new SqlParameter("@AWBSNo", AWBSNo)
                                        };
                DataSet ds = new DataSet();
                ds = SqlHelper.ExecuteDataset(DMLConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, "Reservation_GetOperationalDetail", Parameters);
                ds.Dispose();
                return CargoFlash.Cargo.Business.Common.CompleteDStoJSON(ds);
            }
            catch (Exception ex)//(Exception ex)
            {
                throw ex;
            }
        }

        //Added by Akaram Ali on 20 Nov 2017
        public List<string> deleteAgentOtherChargeTab(string recordID)
        {
            try
            {
                int ret = 0;
                List<string> ErrorMessage = new List<string>();
                BaseBusiness baseBussiness = new BaseBusiness();
                SqlParameter[] Parameters = { new SqlParameter("@SNo", recordID), new SqlParameter("@UserSNo", ((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).UserSNo.ToString()) };
                ret = (int)SqlHelper.ExecuteScalar(DMLConnectionString.WebConfigConnectionString, "DeleteAgentOtherChargeTab", Parameters);
                if (ret > 0)
                {
                    if (ret > 1000)
                    {
                        string serverErrorMessage = baseBussiness.ReadServerErrorMessages(ret, "ReservationBooking");
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
            catch (Exception ex)//(Exception ex)
            {
                throw ex;
            }
        }

        public string GetCountNoOfReplan(Int64 BookingSNo, Int64 AWBSNo)
        {
            try
            {
                SqlParameter[] Parameters = { new SqlParameter("@BookingSNo", BookingSNo),
                                               new SqlParameter("@AWBSNo", AWBSNo),
                                            new SqlParameter("@UserSNo", ((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).UserSNo.ToString()) };
                DataSet ds = new DataSet();
                ds = SqlHelper.ExecuteDataset(DMLConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, "Reservation_GetCountNoOfReplan", Parameters);
                ds.Dispose();
                return CargoFlash.Cargo.Business.Common.CompleteDStoJSON(ds);
            }
            catch (Exception ex)//(Exception ex)
            {
                throw ex;
            }
        }

        public string ViewFlightDetail(Int64 DailyFlightSNo, Int64 OriginSNo, Int64 DestSNo, int Pcs, decimal Gwt, decimal Vol, decimal Chwt, int productSNo, Int64 CommoSNo, Int64 SHCSNo, Int64 AgentSNo, int pom, int NOH, string FlightDate, string FlightNo, string ETD, string ETA, string AllotmentCode, string FlightType, string CarrierCode, Int64 OriginAirportSNo, Int64 DestAirportSNo)
        {
            try
            {
                SqlParameter[] Parameters = { new SqlParameter("@DailyFlightSNo", DailyFlightSNo),
                                              new SqlParameter("@OriginSNo", OriginSNo),
                                              new SqlParameter("@DestSNo", DestSNo),
                                              new SqlParameter("@Pcs", Pcs),
                                              new SqlParameter("@GrWt", Gwt),
                                              new SqlParameter("@VolWt", Vol),
                                              new SqlParameter("@ChWt", Chwt),
                                              new SqlParameter("@productSNo", productSNo),
                                              new SqlParameter("@CommoditySNo", CommoSNo),
                                              new SqlParameter("@SHCSNo", SHCSNo),
                                              new SqlParameter("@AgentSNo", AgentSNo),
                                              new SqlParameter("@POM", pom),
                                              new SqlParameter("@NOH", NOH),
                                              new SqlParameter("@FlightDate", FlightDate),
                                              new SqlParameter("@FlightNo", FlightNo),
                                              new SqlParameter("@ETD", ETD),
                                              new SqlParameter("@ETA", ETA),
                                              new SqlParameter("@AllotmentCode", AllotmentCode),
                                              new SqlParameter("@FlightType", FlightType),
                                              new SqlParameter("@CarrierCode", CarrierCode),
                                              new SqlParameter("@UserSNo", ((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).UserSNo.ToString()),
                                              new SqlParameter("@OriginAirportSNo", OriginAirportSNo),
                                              new SqlParameter("@DestinationAirportSno", DestAirportSNo),
                                              new SqlParameter("@TransitStationSNo", "0")};
                DataSet ds = new DataSet();
                ds = SqlHelper.ExecuteDataset(DMLConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, "Usp_ShowBookingRateFlightWise", Parameters);
                ds.Dispose();
                return CargoFlash.Cargo.Business.Common.CompleteDStoJSON(ds);
            }
            catch (Exception ex)//(Exception ex)
            {
                throw ex;
            }
        }

        public List<string> createUpdateInsurance(string strData)
        {
            try
            {
                int ret = 0;
                List<string> ErrorMessage = new List<string>();
                BaseBusiness baseBussiness = new BaseBusiness();
                var dtMarineInsuranceTab = JsonConvert.DeserializeObject<DataTable>(CargoFlash.Cargo.Business.Common.Base64ToString(strData));
                var dtCreatedtMarineInsuranceTab = (new DataView(dtMarineInsuranceTab, "SNo=0", "SNo", DataViewRowState.CurrentRows)).ToTable();
                var dtUpdateMarineInsuranceTab = (new DataView(dtMarineInsuranceTab, "SNo>0", "SNo", DataViewRowState.CurrentRows)).ToTable();
                SqlParameter param = new SqlParameter();
                param.ParameterName = "@MarineInsuranceTabTable";
                param.SqlDbType = System.Data.SqlDbType.Structured;
                if (dtCreatedtMarineInsuranceTab.Rows.Count > 0)
                {
                    param.Value = dtCreatedtMarineInsuranceTab;
                    SqlParameter[] Parameters = { param };
                    ret = (int)SqlHelper.ExecuteScalar(DMLConnectionString.WebConfigConnectionString, "CreateMarineInsuranceTab", Parameters);
                }
                if (dtUpdateMarineInsuranceTab.Rows.Count > 0)
                {
                    param.Value = dtUpdateMarineInsuranceTab;
                    SqlParameter[] Parameters = { param };
                    ret = (int)SqlHelper.ExecuteScalar(DMLConnectionString.WebConfigConnectionString, "UpdateMarineInsuranceTab", Parameters);
                }
                if (ret > 0)
                {
                    if (ret > 1000)
                    {
                        string serverErrorMessage = baseBussiness.ReadServerErrorMessages(ret, "ReservationBooking");
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
            catch (Exception ex)//(Exception ex)
            {
                throw ex;
            }
        }

        public KeyValuePair<string, List<GetMarineInsuranceData>> GetInsuranceRecord(string recordID, int page, int pageSize, AWBSNoRequest model, string sort)
        {
            try
            {
                GetMarineInsuranceData MarineInsuranceData = new GetMarineInsuranceData();
                SqlParameter[] Parameters = { new SqlParameter("@BookingRefNo", recordID), new SqlParameter("@AWBSNo", model.AWBSNo), new SqlParameter("@PageNo", page), new SqlParameter("@PageSize", pageSize), new SqlParameter("@WhereCondition", ""), new SqlParameter("@OrderBy", sort) };
                DataSet ds = SqlHelper.ExecuteDataset(DMLConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, "GetRecordMarineInsurance", Parameters);
                var GetMarineInsuranceData = ds.Tables[0].AsEnumerable().Select(e => new GetMarineInsuranceData
                {
                    SNo = Convert.ToInt32(e["SNo"]),
                    AWBReferenceBookingSNo = e["AWBReferenceBookingSNo"].ToString(),
                    AWBSNo = e["AWBSNo"].ToString(),
                    NoofCertificate = e["NoofCertificate"].ToString(),
                    Pieces = e["Pieces"].ToString(),
                    Weight = e["Weight"].ToString(),
                    NOG = e["NOG"].ToString(),
                    CommoditySNo = e["CommoditySNo"].ToString(),
                    Category = e["Category"].ToString(),
                    Declvalueforcarraige = e["Declvalueforcarraige"].ToString(),
                    HAWBNo = e["HAWBNo"].ToString(),
                    PremiumRate = e["PremiumRate"].ToString(),
                    PremiumAmount = e["PremiumAmount"].ToString(),
                    CreatedBy = ((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).UserSNo.ToString(),
                    UpdatedBy = ((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).UserSNo.ToString(),
                    CountOfCertificate = e["CountOfCertificate"].ToString()
                });
                if (ds != null && ds.Tables[0].Rows.Count > 0)
                {
                    return new KeyValuePair<string, List<GetMarineInsuranceData>>(ds.Tables[0].Rows[0][0].ToString(), GetMarineInsuranceData.AsQueryable().ToList());
                }
                else
                {
                    return new KeyValuePair<string, List<GetMarineInsuranceData>>("", GetMarineInsuranceData.AsQueryable().ToList());
                }
            }
            catch (Exception ex)//(Exception ex)
            {
                throw ex;
            }
        }

        public List<string> deleteInsurance(string recordID)
        {
            try
            {
                int ret = 0;
                List<string> ErrorMessage = new List<string>();
                BaseBusiness baseBussiness = new BaseBusiness();
                SqlParameter[] Parameters = { new SqlParameter("@SNo", recordID) };
                ret = (int)SqlHelper.ExecuteScalar(DMLConnectionString.WebConfigConnectionString, "DeleteInsuranceTab", Parameters);
                if (ret > 0)
                {
                    if (ret > 1000)
                    {
                        string serverErrorMessage = baseBussiness.ReadServerErrorMessages(ret, "ReservationBooking");
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
            catch (Exception ex)//(Exception ex)
            {
                throw ex;
            }
        }

        public string BindInsuranceCategory(int CommoditySNo)
        {
            try
            {
                SqlParameter[] Parameters = { new SqlParameter("@CommoditySNo", CommoditySNo) };
                DataSet ds = new DataSet();
                ds = SqlHelper.ExecuteDataset(DMLConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, "Reservation_GetInsuranceCategory", Parameters);
                ds.Dispose();
                return CargoFlash.Cargo.Business.Common.CompleteDStoJSON(ds);
            }
            catch (Exception ex)//(Exception ex)
            {
                throw ex;
            }
        }
        public string DownloadExcel(string OriginCity, string DestinationCity, string FlightNo, string FlightDate, string AWBPrefix, string AWBNo, string LoggedInCity, string ReferenceNo)
        {
            try
            {
                DataSet ds = new DataSet();
                SqlParameter[] Parameters = {
                                            new SqlParameter("@PageNo", "1"),
                                            new SqlParameter("@PageSize", "10000"),
                                            new SqlParameter("@WhereCondition", ""),
                                            new SqlParameter("@OrderBy", ""),
                                            new SqlParameter("@UserSno", ((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).UserSNo.ToString()),
                                            new SqlParameter("@OriginCity", OriginCity=="0"?"":OriginCity),
                                            new SqlParameter("@DestinationCity", DestinationCity=="0"?"":DestinationCity),
                                            new SqlParameter("@FlightNo", FlightNo=="0"?"":FlightNo),
                                            new SqlParameter("@FlightDate", FlightDate=="0"?"":FlightDate),
                                            new SqlParameter("@AWBPrefix", AWBPrefix=="0"?"":AWBPrefix),
                                            new SqlParameter("@AWBNo", AWBNo=="0"?"":AWBNo),
                                            new SqlParameter("@LoggedInCity", LoggedInCity),
                                            new SqlParameter("@ReferenceNo", ReferenceNo=="0"?"":ReferenceNo)
                                        };
                ds = SqlHelper.ExecuteDataset(DMLConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, "spReservation_GetList_AWB_DownloadExcel", Parameters);
                ds.Dispose();
                return CargoFlash.Cargo.Business.Common.CompleteDStoJSON(ds);
                //return ExportDataSetToExcel(ds, "AuditLog");
            }
            catch (Exception ex)//(Exception ex)
            {
                throw ex;
            }
        }

        public List<ReservationGridData> DownloadData(GetReservationGridData model)
        {
            try
            {
                List<ReservationGridData> list = new List<ReservationGridData>();
                DataSet ds = new DataSet();
                SqlParameter[] Parameters = {
                                            new SqlParameter("@PageNo", "1"),
                                            new SqlParameter("@PageSize", "10000"),
                                            new SqlParameter("@WhereCondition", ""),
                                            new SqlParameter("@OrderBy", ""),
                                            new SqlParameter("@UserSno", ((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).UserSNo.ToString()),
                                            new SqlParameter("@OriginCity", model.OriginCity=="0"?"":model.OriginCity),
                                            new SqlParameter("@DestinationCity", model.DestinationCity=="0"?"":model.DestinationCity),
                                            new SqlParameter("@FlightNo", model.FlightNo=="0"?"":model.FlightNo),
                                            new SqlParameter("@FlightDate", model.FlightDate=="0"?"":model.FlightDate),
                                            new SqlParameter("@AWBPrefix", model.AWBPrefix=="0"?"":model.AWBPrefix),
                                            new SqlParameter("@AWBNo", model.AWBNo=="0"?"":model.AWBNo),
                                            new SqlParameter("@LoggedInCity", model.LoggedInCity),
                                            new SqlParameter("@ReferenceNo", model.ReferenceNo=="0"?"":model.ReferenceNo)
                                        };
                ds = SqlHelper.ExecuteDataset(DMLConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, "spReservation_GetList_AWB_DownloadExcel", Parameters);
                if (ds != null && ds.Tables.Count > 0)
                    list = ds.Tables[0].AsEnumerable().Select(e => new ReservationGridData
                    {
                        AWBPrefix = Convert.ToString(e["AWBPrefix"]),
                        AWBNo = Convert.ToString(e["AWBNo"]),
                        BookingRefNo = Convert.ToString(e["BookingRefNo"]),
                        BookingType = Convert.ToString(e["BookingType"]),
                        Origin = e["Origin"].ToString(),
                        Destination = e["Destination"].ToString(),
                        OrgAirportCode = e["OrgAirportCode"].ToString(),
                        DesAirportCode = e["DesAirportCode"].ToString(),
                        //BookingDate = e["BookingDate"] == DBNull.Value ? (DateTime?)null : DateTime.SpecifyKind(Convert.ToDateTime(e["BookingDate"]), DateTimeKind.Utc),
                        BookingDateString = e["BookingDate"] == DBNull.Value ? "" : Convert.ToDateTime(e["BookingDate"]).ToString("dd-MMM-yyyy"),
                        AgentName = e["AgentName"].ToString(),
                        AWBPieces = e["AWBPieces"].ToString(),
                        GrossWeight = e["GrossWeight"].ToString(),
                        Volume = e["Volume"].ToString(),
                        AWBStatus = e["AWBStatus"].ToString(),
                        InternationalORDomestic = e["InternationalORDomestic"].ToString(),
                        FlightNo = e["FlightNo"].ToString(),
                        //FlightDate = e["FlightDate"] == DBNull.Value ? (DateTime?)null : DateTime.SpecifyKind(Convert.ToDateTime(e["FlightDate"]), DateTimeKind.Utc),
                        FlightDateString = e["FlightDate"] == DBNull.Value ? "" : Convert.ToDateTime(e["FlightDate"].ToString()).ToString("dd-MMM-yyyy"),
                        BookingReleaseTime = e["BookingReleaseTime"].ToString(),
                        ShipmentStatus = e["ShipmentStatus"].ToString(),
                        SplitLoaded = e["SplitLoaded"].ToString(),
                        AWBStatusNo = e["AWBStatusNo"].ToString(),
                        IsCCA = e["IsCCA"].ToString(),
                        AcceptanceCutOffTime = e["AcceptanceCutOffTime"].ToString()

                    }).ToList();
                return list;
            }
            catch (Exception ex)//
            {
                throw ex;
            }

        }
        public string CheckSurpassedBCTTime(Int64 AWBSNo)
        {
            try
            {
                SqlParameter[] Parameters = {new SqlParameter("@AWBSNo", AWBSNo),
                                            new SqlParameter("@UserSNo", ((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).UserSNo.ToString()) };
                DataSet ds = new DataSet();
                ds = SqlHelper.ExecuteDataset(DMLConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, "Reservation_CheckSurpassedBCTTime", Parameters);
                ds.Dispose();
                return CargoFlash.Cargo.Business.Common.CompleteDStoJSON(ds);
            }
            catch (Exception ex)//(Exception ex)
            {
                throw ex;
            }
        }
        public List<string> createUpdateDueCarrierOtherChargeTab(string strData)
        {
            try
            {
                int ret = 0;
                List<string> ErrorMessage = new List<string>();
                BaseBusiness baseBussiness = new BaseBusiness();
                // convert JSON string ito datatable
                var dtDueCarrierOtherChargeTab = JsonConvert.DeserializeObject<DataTable>(CargoFlash.Cargo.Business.Common.Base64ToString(strData));
                //dtAgentOtherChargeTab.Columns.Remove("BookingSNo");
                var dtCreateDueCarrierOtherChargeTab = (new DataView(dtDueCarrierOtherChargeTab, "SNo=0", "SNo", DataViewRowState.CurrentRows)).ToTable();
                var dtUpdateDueCarrierOtherChargeTab = (new DataView(dtDueCarrierOtherChargeTab, "SNo>0", "SNo", DataViewRowState.CurrentRows)).ToTable();
                SqlParameter param = new SqlParameter();




                param.ParameterName = "@DueCarrierOtherChargeTabTable";
                param.SqlDbType = System.Data.SqlDbType.Structured;
                // for create new record
                if (dtCreateDueCarrierOtherChargeTab.Rows.Count > 0)
                {
                    if (dtDueCarrierOtherChargeTab.Columns.Contains("ReferenceNumber"))
                        dtDueCarrierOtherChargeTab.Columns.Remove("ReferenceNumber");
                    if (dtDueCarrierOtherChargeTab.Columns.Contains("ConvertedChargeValue"))
                        dtDueCarrierOtherChargeTab.Columns.Remove("ConvertedChargeValue");
                    if (dtDueCarrierOtherChargeTab.Columns.Contains("ConvertedCurrencyCode"))
                        dtDueCarrierOtherChargeTab.Columns.Remove("ConvertedCurrencyCode");
                    if (dtCreateDueCarrierOtherChargeTab.Columns.Contains("HdnOtherChargeCode"))
                    {
                        dtCreateDueCarrierOtherChargeTab.Columns.Remove("HdnOtherChargeCode");
                    }
                    if (dtCreateDueCarrierOtherChargeTab.Columns.Contains("HdnOtherchargeCurrency"))
                    {
                        dtCreateDueCarrierOtherChargeTab.Columns.Remove("HdnOtherchargeCurrency");
                    }
                    param.Value = dtCreateDueCarrierOtherChargeTab;
                    SqlParameter[] Parameters = { param };
                    ret = (int)SqlHelper.ExecuteScalar(DMLConnectionString.WebConfigConnectionString, "CreateDueCarrierOtherChargeTab", Parameters);
                }
                //for update existing record
                if (dtUpdateDueCarrierOtherChargeTab.Rows.Count > 0)
                {
                    if (dtUpdateDueCarrierOtherChargeTab.Columns.Contains("ReferenceNumber"))
                        dtUpdateDueCarrierOtherChargeTab.Columns.Remove("ReferenceNumber");
                    if (dtUpdateDueCarrierOtherChargeTab.Columns.Contains("ConvertedChargeValue"))
                        dtUpdateDueCarrierOtherChargeTab.Columns.Remove("ConvertedChargeValue");
                    if (dtUpdateDueCarrierOtherChargeTab.Columns.Contains("ConvertedCurrencyCode"))
                        dtUpdateDueCarrierOtherChargeTab.Columns.Remove("ConvertedCurrencyCode");
                    if (dtUpdateDueCarrierOtherChargeTab.Columns.Contains("HdnOtherChargeCode"))
                        dtUpdateDueCarrierOtherChargeTab.Columns.Remove("HdnOtherChargeCode");
                    if (dtUpdateDueCarrierOtherChargeTab.Columns.Contains("HdnOtherchargeCurrency"))
                        dtUpdateDueCarrierOtherChargeTab.Columns.Remove("HdnOtherchargeCurrency");

                    param.Value = dtUpdateDueCarrierOtherChargeTab;
                    SqlParameter[] Parameters = { param };
                    ret = (int)SqlHelper.ExecuteScalar(DMLConnectionString.WebConfigConnectionString, "UpdateDueCarrierOtherChargeTab", Parameters);
                }
                if (ret > 0)
                {
                    if (ret > 1000)
                    {
                        string serverErrorMessage = baseBussiness.ReadServerErrorMessages(ret, "ReservationBooking");
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
            catch (Exception ex)//(Exception ex)
            {
                throw ex;
            }
        }

        public List<string> deleteDueCarrierOtherChargeTab(string recordID)
        {
            try
            {
                int ret = 0;
                List<string> ErrorMessage = new List<string>();
                BaseBusiness baseBussiness = new BaseBusiness();
                SqlParameter[] Parameters = { new SqlParameter("@SNo", recordID),
               new SqlParameter("@UserSNo", ((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).UserSNo.ToString()) };
                ret = (int)SqlHelper.ExecuteScalar(DMLConnectionString.WebConfigConnectionString, "DeleteDueCarrierOtherChargeTab", Parameters);
                if (ret > 0)
                {
                    if (ret > 1000)
                    {
                        string serverErrorMessage = baseBussiness.ReadServerErrorMessages(ret, "ReservationBooking");
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
            catch (Exception ex)//(Exception ex)
            {
                throw ex;
            }
        }

        // Add By Sushant On 06-06-2018
        public string PagerightsCheck(string GroupSNo)
        {
            try
            {
                SqlParameter[] Parameters = { new SqlParameter("@MenuSNo", ""), new SqlParameter("@GroupSNo", GroupSNo)
                                                , new SqlParameter("@UserSNo", ((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).UserSNo.ToString())
                                              , new SqlParameter("@PageName", "ReservationBooking")};
                DataSet ds = SqlHelper.ExecuteDataset(ReadConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, "GetListPageRightsCargoBooking", Parameters);
                ds.Dispose();
                return CargoFlash.Cargo.Business.Common.CompleteDStoJSON(ds);
            }
            catch (Exception ex)//(Exception ex)
            {
                throw ex;
            }
        }
        public string SplitShipmentAllowed(int OriginCitySNo, int DestinationCitySNo, int AccountSNo)
        {
            try
            {
                SqlParameter[] Parameters = { new SqlParameter("@OriginCitySNo", OriginCitySNo),
                    new SqlParameter("@DestinationCitySNo", DestinationCitySNo),
                    new SqlParameter("@AccountSNo", AccountSNo),
                    new SqlParameter("@UserSNo", ((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).UserSNo)};
                DataSet ds = new DataSet();
                ds = SqlHelper.ExecuteDataset(DMLConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, "Reservation_SplitShipmentAllowed", Parameters);
                ds.Dispose();
                return CargoFlash.Cargo.Business.Common.CompleteDStoJSON(ds);
            }
            catch (Exception ex)//(Exception ex)
            {
                throw ex;
            }
        }

        public string SaveHandlingInformation(Int32 AWBSNo, string HandlingInfo, string ReferenceNumber, Int32 AwbReferenceBookingSNo)
        {
            try
            {
                DataSet ds = new DataSet();
                SqlParameter[] Parameters = {
                                            new SqlParameter("@AWBSNo", AWBSNo),
                                            new SqlParameter("@HandlingInfo", HandlingInfo),
											new SqlParameter("@ReferenceNumber", ReferenceNumber),
											new SqlParameter("@AwbReferenceBookingSNo", AwbReferenceBookingSNo),
											new SqlParameter("@UpdatedBy", ((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).UserSNo.ToString())
                                        };
                DataSet ds1 = new DataSet();

                ds = SqlHelper.ExecuteDataset(DMLConnectionString.WebConfigConnectionString, "Reservation_SaveHandlingInformation", Parameters);
                return ds.Tables[ds.Tables.Count - 1].Rows[0][0].ToString();

            }
            catch (Exception ex)//(Exception ex)
            {
                throw ex;
            }
        }
        public string CheckPirntTime(int AWBSNo, int IsLabel)
        {
            try
            {
                SqlParameter[] Parameters = {new SqlParameter("@AWBSNo", AWBSNo),
                                            new SqlParameter("@IsLabel",IsLabel)};
                DataSet ds = new DataSet();
                ds = SqlHelper.ExecuteDataset(DMLConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, "spAWB_CheckPirntTime", Parameters);
                ds.Dispose();
                return CargoFlash.Cargo.Business.Common.CompleteDStoJSON(ds);
            }
            catch (Exception ex)//(Exception ex)
            {
                throw ex;
            }
        }

        public string GetPTIData(Int64 AWBSNo)
        {
            try
            {
                SqlParameter[] Parameters = {
                                            new SqlParameter("@AWBSNo", AWBSNo),
                                            new SqlParameter("@UserID", ((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).UserSNo)
                                        };
                DataSet ds = new DataSet();
                ds = SqlHelper.ExecuteDataset(DMLConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, "Reservation_GetPTIData", Parameters);
                ds.Dispose();
                return CargoFlash.Cargo.Business.Common.CompleteDStoJSON(ds);
            }
            catch (Exception ex)//(Exception ex)
            {
                throw ex;
            }
        }

        public string SavePITDatails(Int64 AWBSNo, string OtherIdentity, int Pieces, decimal GrossWeight, string EOC)
        {
            try
            {
                DataSet ds = new DataSet();
                SqlParameter[] Parameters = {
                                            new SqlParameter("@AWBSNo", AWBSNo),
                                            new SqlParameter("@OtherIdentity",OtherIdentity) ,
                                            new SqlParameter("@Pieces", Pieces),
                                            new SqlParameter("@GrossWeight", GrossWeight),
                                            new SqlParameter("@EOC",EOC),
                                            new SqlParameter("@UpdatedBy", ((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).UserSNo.ToString())

                                        };
                DataSet ds1 = new DataSet();

                ds = SqlHelper.ExecuteDataset(DMLConnectionString.WebConfigConnectionString, "Reservation_SavePTIDetails", Parameters);
                return ds.Tables[ds.Tables.Count - 1].Rows[0][0].ToString();
            }
            catch (Exception ex)//(Exception ex)
            {
                throw ex;
            }
        }
        public string ReservationBookingGetPTIPrintData(int? AwbNo)
        {
            try
            {
                SqlParameter[] Parameters = { new SqlParameter("@AWBSNo", AwbNo)};
                DataSet ds = SqlHelper.ExecuteDataset(ReadConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, "ReservationBooking_PrintPTIData", Parameters);
                return CargoFlash.Cargo.Business.Common.CompleteDStoJSON(ds);
            }
            catch (Exception ex)//(Exception ex)
            {
                throw ex;
            }
        }

        public string BindMinimumChWt(int CommoditySNo)
        {
            try
            {
                SqlParameter[] Parameters = {
                                            new SqlParameter("@CommoditySNo", CommoditySNo),                                        
                                        };
                DataSet ds = new DataSet();
                ds = SqlHelper.ExecuteDataset(DMLConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, "Reservation_GetMinimumChWt", Parameters);
                ds.Dispose();
                return CargoFlash.Cargo.Business.Common.CompleteDStoJSON(ds);
            }
            catch (Exception ex)//(Exception ex)
            {
                throw ex;
            }
        }

		public string GetTermsandcondtion(Int64 AWBOriginSNo, Int64 AWBDestinationSNo)
		{
			try
			{
				SqlParameter[] Parameters = { new SqlParameter("@AWBOriginSNo", AWBOriginSNo) ,
											new SqlParameter("@AWBDestinationSNo", AWBDestinationSNo) ,
											new SqlParameter("@UserSNo", ((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).UserSNo.ToString())
				};
				DataSet ds = new DataSet();
				ds = SqlHelper.ExecuteDataset(DMLConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, "Reservation_GetTermsandcondtion", Parameters);
				ds.Dispose();
				return CargoFlash.Cargo.Business.Common.CompleteDStoJSON(ds);
			}
			catch (Exception ex)//(Exception ex)
			{
				throw ex;
			}
		}
        public string SaveBillingAddressData(Int32 AWBSNo, CustomBillingDetails BillingAddressModel, string ReferenceNumber, Int32 AwbReferenceBookingSNo)
        {
            try
            {
                List<CustomBillingDetails> lstbillingInformation = new List<CustomBillingDetails>();
                lstbillingInformation.Add(BillingAddressModel);
                DataTable dtbillingDetails = CollectionHelper.ConvertTo(lstbillingInformation, "");

               

                SqlParameter parambillingDetails = new SqlParameter();
                parambillingDetails.ParameterName = "@billingDetails";
                parambillingDetails.SqlDbType = System.Data.SqlDbType.Structured;
                parambillingDetails.Value = dtbillingDetails;

              

                DataSet ds = new DataSet();
                SqlParameter[] Parameters = {
                                            new SqlParameter("@AWBSNo", AWBSNo),
                                            parambillingDetails,
                                           
                                            new SqlParameter("@UpdatedBy", ((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).UserSNo.ToString()),
                                            new SqlParameter("@ReferenceNumber", ReferenceNumber),
                                            new SqlParameter("@AwbReferenceBookingSNo", AwbReferenceBookingSNo),
                                            
                                        };
                DataSet ds1 = new DataSet();

                ds = SqlHelper.ExecuteDataset(DMLConnectionString.WebConfigConnectionString, "Reservation_SaveCustomerBillingData", Parameters);
                return ds.Tables[ds.Tables.Count - 1].Rows[0][0].ToString();

            }
            catch (Exception ex)//(Exception ex)
            {
                throw ex;
            }
        }

        public string BillingDetails(Int64 BookingRefNo, Int32 AWBSNo)
        {
            try
            {
                SqlParameter[] Parameters = { new SqlParameter("@LoginSNo", ((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).UserSNo),
                                            new SqlParameter("@BookingRefNo", BookingRefNo),
                                            new SqlParameter("@AWBSNo", AWBSNo)
                                        };
                DataSet ds = new DataSet();
                ds = SqlHelper.ExecuteDataset(DMLConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, "Reservation_BillingAddress", Parameters);
                ds.Dispose();
                return CargoFlash.Cargo.Business.Common.CompleteDStoJSON(ds);
            }
            catch (Exception ex)//(Exception ex)
            {
                throw ex;
            }
        }

        public string CheckTaxId(string TaxId, string UserType,Int32 CountrySno, Int32 CustomerSno)
        {
            try
            {
                SqlParameter[] Parameters = { 
                                        new SqlParameter("@TaxId", TaxId),new SqlParameter("@UserType", UserType), new SqlParameter("@CountrySno", CountrySno),new SqlParameter("@CustomerSno", CustomerSno)};
                DataSet ds = new DataSet();
                ds = SqlHelper.ExecuteDataset(DMLConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, "Reservation_CheckTaxId", Parameters);
                ds.Dispose();
                return CargoFlash.Cargo.Business.Common.CompleteDStoJSON(ds);
            }
            catch (Exception ex)//(Exception ex)
            {
                throw ex;
            }
        }
    }
}


