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

namespace CargoFlash.Cargo.DataService.Shipment
{
    #region Reservation Service Description
    /*
	*****************************************************************************
	Service Name:	ReservationService      
	Purpose:		This Service used to get details of Reservation save update Search and delete
	Company:		CargoFlash Infotech Pvt Ltd.
	Author:			Shahbaz Akhtar
	Created On:		25 Jan 2018
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
    public class BackDateBookingService : BaseWebUISecureObject, IBackDateBookingService
    {
        public Stream GetWebForm(ReservationGetWebForm model)
        {
            return BuildWebForm(model.processName, model.moduleName, model.appName, model.Action, "", (model.IsSubModule == "1"));
        }

        public Stream GetGridData(ReservationGetGridData model)
        {
            return BuildWebForm(model.processName, model.moduleName, model.appName, model.Action, OriginCity: model.OriginCity, DestinationCity: model.DestinationCity, FlightNo: model.FlightNo, FlightDate: model.FlightDate, AWBPrefix: model.AWBPrefix, AWBNo: model.AWBNo, LoggedInCity: model.LoggedInCity, ReferenceNo: model.ReferenceNo);
        }

        private Stream BuildWebForm(string processName, string moduleName, string appName, string formAction, string recordID = "", bool IsSubModule = true, string AWBSNo = "", string CheckListTypeSNo = "", string OriginCity = "", string DestinationCity = "", string FlightNo = "", string FlightDate = "", string AWBPrefix = "", string AWBNo = "", string HAWBNo = "", string LoggedInCity = "", string FlightStatus = "", string FlightSNo = "", string SPHCSNo = "", string ChecklistTypeName = "", string Column1Name = "", string Column2Name = "", string Column3Name = "", string ReferenceNo = "")
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
                                CreateGrid(myCurrentForm, processName, OriginCity, DestinationCity, FlightNo, FlightDate, AWBPrefix, AWBNo, LoggedInCity, ReferenceNo, isV2: true);
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

        private void CreateGrid(StringBuilder Container, string ProcessName, string OriginCity = "", string DestinationCity = "", string FlightNo = "", string FlightDate = "", string AWBPrefix = "", string AWBNo = "", string LoggedInCity = "", string ReferenceNo = "", bool isV2 = false)
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
                g.FormCaptionText = "Resevation Booking";
                g.DefaultPageSize = 5;
                g.IsDisplayOnly = false;
                g.IsProcessPart = true;
                g.IsVirtualScroll = false;
                g.IsAllowedFiltering = true;
                g.ProcessName = ProcessName;
                g.IsFormHeader = false;
                g.IsShowGridHeader = false;

                //g.IsRefresh = false;
                //g.IsPager = false;
                //g.IsPageable = false;
                //g.IsPageSizeChange = false;
                g.SuccessGrid = "BindSubProcess";

                string SLICaption = (((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"]))).SysSetting["SLICaption"].ToString();
                string SLiNo, SLIStatus;
                SLiNo = SLICaption + " No";
                SLIStatus = SLICaption + " Status";
                g.Column = new List<GridColumn>();
                g.Column.Add(new GridColumn { Field = "AWBSNo", Title = "AWBSNo", DataType = GridDataType.String.ToString(), IsHidden = true });
                g.Column.Add(new GridColumn { Field = "AWBReferenceBookingSNo", Title = "AWBReferenceBookingSNo", DataType = GridDataType.String.ToString(), IsHidden = true });
                g.Column.Add(new GridColumn { Field = "BookingRefNo", IsLocked = false, Title = "Booking Ref No", DataType = GridDataType.String.ToString(), Width = 120 });
                g.Column.Add(new GridColumn { Field = "AWBPrefix", IsLocked = false, Title = "Prefix", DataType = GridDataType.String.ToString(), Width = 50 });
                g.Column.Add(new GridColumn { Field = "AWBNo", IsLocked = false, Title = "AWB No", DataType = GridDataType.String.ToString(), Width = 65 });
                g.Column.Add(new GridColumn { Field = "BookingType", IsLocked = false, Title = "Booking Type", DataType = GridDataType.String.ToString() });
                g.Column.Add(new GridColumn { Field = "Origin", IsLocked = false, Title = "Org", DataType = GridDataType.String.ToString(), Width = 50 });
                g.Column.Add(new GridColumn { Field = "Destination", IsLocked = false, Title = "Dest", DataType = GridDataType.String.ToString(), Width = 50 });
                g.Column.Add(new GridColumn { Field = "BookingDate", IsLocked = false, Title = "Booking Date", DataType = GridDataType.Date.ToString(), Width = 90 });
                //g.Column.Add(new GridColumn { Field = "BookingDate", IsLocked = false, Title = "Booking Date", IsHidden = false, DataType = GridDataType.Date.ToString(), Width = 90, Template = "# if( BookingDate==null) {# # } else {# #= kendo.toString(new Date(data.BookingDate.getTime() + data.BookingDate.getTimezoneOffset()*60000),\"" + UIDateTimeFormat.UIDateFormatString + "\") # #}#" });
                //g.Column.Add(new GridColumn { Field = "OfficeName", IsLocked = false, Title = "Office Name", DataType = GridDataType.String.ToString() });
                g.Column.Add(new GridColumn { Field = "AgentName", IsLocked = false, Title = "Agent Name", DataType = GridDataType.String.ToString() });
                g.Column.Add(new GridColumn { Field = "AWBPieces", IsLocked = false, Title = "Pcs", DataType = GridDataType.String.ToString(), Width = 40 });
                g.Column.Add(new GridColumn { Field = "GrossWeight", IsLocked = false, Title = "Gr. Wt.", DataType = GridDataType.String.ToString(), Width = 60 });
                g.Column.Add(new GridColumn { Field = "Volume", IsLocked = false, Title = "Volume", DataType = GridDataType.String.ToString(), Width = 60 });
                g.Column.Add(new GridColumn { Field = "AWBStatus", IsLocked = false, Title = "AWB Status", DataType = GridDataType.String.ToString() });
                g.Column.Add(new GridColumn { Field = "InternationalORDomestic", IsLocked = false, Title = "Type", DataType = GridDataType.String.ToString(), Width = 50 });
                g.Column.Add(new GridColumn { Field = "IsCCA", IsLocked = false, Title = "CCA", DataType = GridDataType.String.ToString(), Width = 50 });
                g.Column.Add(new GridColumn { Field = "FlightNo", Title = "Flight No", IsHidden = false, DataType = GridDataType.String.ToString() });
                g.Column.Add(new GridColumn { Field = "FlightDate", Title = "Flight Date", IsHidden = false, DataType = GridDataType.Date.ToString(), Width = 80 });
                //g.Column.Add(new GridColumn { Field = "FlightDate", Title = "Flight Date", IsHidden = false, DataType = GridDataType.Date.ToString(), Width = 90, Template = "# if( FlightDate==null) {# # } else {# #= kendo.toString(new Date(data.FlightDate.getTime() + data.FlightDate.getTimezoneOffset()*60000),\"" + UIDateTimeFormat.UIDateFormatString + "\") # #}#" });
                g.Column.Add(new GridColumn { Field = "SplitLoaded", Title = "Split Plan", IsHidden = false, DataType = GridDataType.String.ToString() });
                g.Column.Add(new GridColumn { Field = "ShipmentStatus", Title = "Shipment Status", IsHidden = false, DataType = GridDataType.String.ToString() });
                g.Column.Add(new GridColumn { Field = "BookingReleaseTime", Title = "ITL Time", IsHidden = false, DataType = GridDataType.String.ToString() });
                g.Column.Add(new GridColumn { Field = "ProcessStatus", Title = "ProcessStatus", DataType = GridDataType.String.ToString(), IsHidden = true });
                g.Column.Add(new GridColumn { Field = "AWBStatusNo", Title = "AWBStatusNo", DataType = GridDataType.String.ToString(), IsHidden = true });
                g.Column.Add(new GridColumn { Field = "ReplanComplete", Title = "ReplanComplete", DataType = GridDataType.String.ToString(), IsHidden = true });
                g.Column.Add(new GridColumn { Field = "IsGoShowAccountType", Title = "AccountType", DataType = GridDataType.String.ToString(), IsHidden = true });
                g.Column.Add(new GridColumn { Field = "IsGoShowProduct", Title = "ProductName", DataType = GridDataType.String.ToString(), IsHidden = true });

                g.ExtraParam = new List<GridExtraParam>();
                g.ExtraParam.Add(new GridExtraParam { Field = "OriginCity", Value = OriginCity });
                g.ExtraParam.Add(new GridExtraParam { Field = "DestinationCity", Value = DestinationCity });
                g.ExtraParam.Add(new GridExtraParam { Field = "FlightNo", Value = FlightNo });
                g.ExtraParam.Add(new GridExtraParam { Field = "FlightDate", Value = FlightDate });
                g.ExtraParam.Add(new GridExtraParam { Field = "AWBPrefix", Value = AWBPrefix });
                g.ExtraParam.Add(new GridExtraParam { Field = "AWBNo", Value = AWBNo });
                g.ExtraParam.Add(new GridExtraParam { Field = "LoggedInCity", Value = LoggedInCity });
                g.ExtraParam.Add(new GridExtraParam { Field = "ReferenceNo", Value = ReferenceNo });
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
                                            new SqlParameter("@WhereCondition",filters==""?"": filters.Replace("FlightDate", "FlightDateSearch").Replace("BookingDate", "BookingDateSearch")), 
                                            //new SqlParameter("@WhereCondition", filters), 
                                            new SqlParameter("@OrderBy", sorts),
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
                ds = SqlHelper.ExecuteDataset(DMLConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, ProcName, Parameters);
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
                    ProcessStatus = e["ProcessStatus"].ToString()
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

        public string SearchFlightResult(string Origin, String Destination, string ItineraryDate, string ItineraryCarrierCode, string ItineraryFlightNo, string ItineraryTransit, decimal ItineraryGrossWeight, decimal ItineraryVolumeWeight, Int32 Product, string Commodity, string SHCSNo, Int32 AgentSNo, int OverrideBCT, int OverrideMCT, int IsMCT, string ETD, string SearchFrom, string BookingNo)
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
                ds = SqlHelper.ExecuteDataset(DMLConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, "Reservation_CheckValidAWBNumber_backdate", Parameters);
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

        public string AddBookingShipperandConsigneeInformation(Int64 BookingRefNo, ReservationInformation ReservationInformation, List<ReservationItineraryInformation> ReservationItineraryInformation, ReservationShipperInformation ReservationShipperInformation, ReservationConsigneeInformation ReservationConsigneeInformation, Int32 ShipperSno, Int32 ConsigneeSno, string CreateShipperParticipants, string CreateConsigneerParticipants, string CallerCode,string BookingDate)
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
                                            new SqlParameter("@CallerCode",CallerCode),
                                            new SqlParameter("@BookingDate",BookingDate)
                                        };
                DataSet ds1 = new DataSet();

                ds = SqlHelper.ExecuteDataset(DMLConnectionString.WebConfigConnectionString, "Reservation_AddBookingShipperandConsigneeInformation_Backdate", Parameters);
                return ds.Tables[ds.Tables.Count - 1].Rows[0][0].ToString();
            }
            catch (Exception ex)//(Exception ex)
            {
                throw ex;
            }
        }

        public string UpdateBookingShipperandConsigneeInformation(Int64 AWBSNo, Int64 BookingSNo, Int64 BookingRefNo, ReservationInformation ReservationInformation, List<ReservationItineraryInformation> ReservationItineraryInformation, ReservationShipperInformation ReservationShipperInformation, ReservationConsigneeInformation ReservationConsigneeInformation, Int32 ShipperSno, Int32 ConsigneeSno, string CreateShipperParticipants, string CreateConsigneerParticipants, int RateShowOnAWBPrint, string CallerCode)
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
                                            new SqlParameter("@RateShowOnAWBPrint",RateShowOnAWBPrint),
                                            new SqlParameter("@CallerCode",CallerCode)
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
        public string ExecuteBookingShipperandConsigneeInformation(Int64 AWBSNo, Int64 BookingSNo, Int64 BookingRefNo, ReservationInformation ReservationInformation, List<ReservationItineraryInformation> ReservationItineraryInformation, ReservationShipperInformation ReservationShipperInformation, ReservationConsigneeInformation ReservationConsigneeInformation, Int32 ShipperSno, Int32 ConsigneeSno, string CreateShipperParticipants, string CreateConsigneerParticipants, int RateShowOnAWBPrint, string HandlingInformation, string CallerCode)
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
                                            new SqlParameter("@RateShowOnAWBPrint",RateShowOnAWBPrint),
                                            new SqlParameter("@HandlingInformation",HandlingInformation),
                                            new SqlParameter("@CallerCode",CallerCode)
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

        public string SaveChargeDeclarationsRateData(Int64 AWBSNo, Int64 BookingSNo, Int64 BookingRefNo, ReservationChargeDeclarations ReservationChargeDeclarations)
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
                                            new SqlParameter("@UpdatedBy", ((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).UserSNo.ToString())
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
                    OtherChargeCode = e["OtherChargeCode"].ToString(),
                    OtherchargeDetail = e["OtherchargeDetail"].ToString(),
                    ChargeValue = e["ChargeValue"].ToString(),
                    OtherchargeCurrency = e["OtherchargeCurrency"].ToString(),
                    ReferenceNumber = e["ReferenceNumber"].ToString(),
                    ConvertedChargeValue = e["ConvertedChargeValue"].ToString(),
                    ConvertedCurrencyCode = e["ConvertedCurrencyCode"].ToString(),
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
                    OtherChargeCode = e["OtherChargeCode"].ToString(),
                    OtherchargeDetail = e["OtherchargeDetail"].ToString(),
                    AgentOtherchargeCurrency = e["AgentOtherchargeCurrency"].ToString(),
                    HdnAgentOtherchargeCurrency = e["AgentOtherchargeCurrencySNo"].ToString(),
                    ReferenceNumber = e["ReferenceNumber"].ToString(),
                    ChargeValue = e["ChargeValue"].ToString(),
                    ConvertedChargeValue = e["ConvertedChargeValue"].ToString(),
                    ConvertedCurrencyCode = e["ConvertedCurrencyCode"].ToString(),
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

        public string SaveNotifyData(Int32 AWBSNo, CustomNotifyDetails NotifyModel, CustomNominyDetails NominyModel)
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
                                            new SqlParameter("@UpdatedBy", ((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).UserSNo.ToString())
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
                SqlParameter[] Parameters = { new SqlParameter("@SNo", recordID) };
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




    }
}