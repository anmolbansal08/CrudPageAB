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
using CargoFlash.SoftwareFactory.WebUI.Controls;
using CargoFlash.SoftwareFactory.WebUI;
using System.ServiceModel.Web;
using System.IO;
using CargoFlash.SoftwareFactory.WebUI.Adapters;
using System.Globalization;
using KLAS.Business.EDI;
using CargoFlash.Cargo.Business;
using Newtonsoft.Json;
using CargoFlash.Cargo.Model.Report;
using System.Reflection;
using ClosedXML;
using ClosedXML.Excel;


namespace CargoFlash.Cargo.DataService.Report
{
    [GlobalErrorHandlerBehaviour(typeof(GlobalErrorHandler))]
    [ServiceBehavior(IncludeExceptionDetailInFaults = true)]
    [AspNetCompatibilityRequirements(RequirementsMode = AspNetCompatibilityRequirementsMode.Allowed)]

    public class NonExecutedBookingService : BaseWebUISecureObject, INonExecutedBookingService
    {
        public DataSourceResult GetWMSWaybillGridDataFBL(string AWBNumber, string OriginCity, string DestinationCity, string FlightNo, string FlightDateSearch, string LoggedInCity, int skip, int take, int page, int pageSize, List<SoftwareFactory.Data.GridSort> sort, SoftwareFactory.Data.GridFilter filter)
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

            ProcName = "GetListNonExecutedBooking";

            string filters = GridFilter.ProcessFilters<NonExecutedBooking>(filter);

            SqlParameter[] Parameters = { new SqlParameter("@PageNo", page), new SqlParameter("@PageSize", pageSize), new SqlParameter("@WhereCondition", filters), new SqlParameter("@OrderBy", sorts), new SqlParameter("@AWBNumber", AWBNumber), new SqlParameter("@OriginCity", OriginCity), new SqlParameter("@DestinationCity", DestinationCity), new SqlParameter("@FlightNo", FlightNo), new SqlParameter("@FlightDateSearch", FlightDateSearch), new SqlParameter("@LoggedInCity", LoggedInCity)/*For Multicity*/ , new SqlParameter("@UserSNo", ((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).UserSNo.ToString()) };

            ds = SqlHelper.ExecuteDataset(DMLConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, ProcName, Parameters);

            var wmsBookingList = ds.Tables[0].AsEnumerable().Select(e => new NonExecutedBooking
            {
                SNo = Convert.ToInt32(e["SNo"]),
                AWBNo = Convert.ToString(e["AWBNo"].ToString()),
                OriginCity = Convert.ToString(e["OriginCity"]),
                DestinationCity = Convert.ToString(e["DestinationCity"]),
                FlightNo = Convert.ToString(e["FlightNo"].ToString()),
                FlightDate = e["FlightDate"] == DBNull.Value ? (DateTime?)null : DateTime.SpecifyKind(Convert.ToDateTime(e["FlightDate"]), DateTimeKind.Utc),
                //FlightDate = Convert.ToString(e["FlightDate"]),

                FFMDetail = Convert.ToString(e["FFMDetail"]),
                //ProcessStatus = ",FreightBookingListSendFBL_"+Convert.ToString(e["EnableSENDFBL"]) + ",FreightBookingListPRINTFBL_" + Convert.ToString(e["EnablePRINT"]) + ",FreightBookingListVersion_" + Convert.ToString(e["EnableVERSION"])
                // ProcessStatus = Convert.ToString(e["EnableSENDFBL"]) + ',' + Convert.ToString(e["EnablePRINT"]) + ',' + Convert.ToString(e["EnableVERSION"])
                //EnableSENDFBL = Convert.ToString(e["EnableSENDFBL"]),
                //EnablePRINT = Convert.ToString(e["EnablePRINT"]),
                //EnableVERSION = Convert.ToString(e["EnableVERSION"])
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
        public Stream GetWebForm(string processName, string moduleName, string appName, string formAction, string IsSubModule)
        {
            return BuildWebForm(processName, moduleName, appName, formAction, "", (IsSubModule == "1"));
        }
        public Stream GetGridData(string processName, string moduleName, string appName, string AWBNumber, string OriginCity, string DestinationCity, string FlightNo, string FlightDate)
        {
            return BuildWebForm(processName, moduleName, appName, "IndexView", AWBNumber: AWBNumber, OriginCity: OriginCity, DestinationCity: DestinationCity, FlightNo: FlightNo, FlightDate: FlightDate);
        }
        private Stream BuildWebForm(string processName, string moduleName, string appName, string formAction, string recordID = "", bool IsSubModule = true, string AWBSNo = "", string CheckListTypeSNo = "", string AWBNumber = "", string OriginCity = "", string DestinationCity = "", string FlightNo = "", string FlightDate = "", string AWBPrefix = "", string AWBNo = "", string HAWBNo = "", string LoggedInCity = "", string FlightStatus = "", string FlightSNo = "")
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
                        case "NonExecutedBooking":
                            if (appName.ToUpper().Trim() == "NONEXECUTEDBOOKING")
                                CreateGrid(myCurrentForm, processName, AWBNumber, OriginCity, DestinationCity, FlightNo, FlightDate);
                            break;
                    }
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
            byte[] resultMyForm = Encoding.UTF8.GetBytes(myCurrentForm.ToString());
            WebOperationContext.Current.OutgoingResponse.ContentType = "text/html";
            return new MemoryStream(resultMyForm);
        }
        private void CreateGrid(StringBuilder Container, string ProcessName, string AWBNumber = "", string OriginCity = "", string DestinationCity = "", string FlightNo = "", string FlightDateSearch = "")
        {
            using (Grid g = new Grid())
            {
                g.PageName = "Default.cshtml";
                g.PrimaryID = this.MyPrimaryID;
                g.ModuleName = "Report";
                g.AppsName = "NonExecutedBooking";
                g.IsActionRequired = false;
                //g.PrimaryID = "SNo";
                //g.GridID = "FirstGrid";
                //g.PageName = "Default.cshtml";
                //g.ModuleName = "Report";
                //g.AppsName = "NonExecutedBooking";
                ////g.SuccessGrid = "ChangeActionName";
                //g.FormCaptionText = "Invoice Payment";
                //g.EditName = "Payment";
                //g.IsDisplayOnly = false;
                //g.IsShowDelete = false;
                //g.ServiceModuleName = this.MyModuleID;
                //g.IsAllowedGrouping = true;




                g.DataSoruceUrl = "Services/Report/NonExecutedBookingService.svc/GetWMSWaybillGridDataFBL";
                g.NewURL = MyPageName + "?" + GetWebURLString("New", false);
                g.ServiceModuleName = this.MyModuleID;
                g.UserID = this.MyUserID;
                g.FormCaptionText = "Non Executed Booking";
                g.DefaultPageSize = 5;
                g.IsDisplayOnly = false;
                g.IsProcessPart = true;
                g.IsVirtualScroll = false;
                g.IsShowGridHeader = false;
                g.ProcessName = ProcessName;
                g.IsFormHeader = false;
                g.IsShowGridHeader = false;
                g.IsAllowedFiltering = true;
                g.Column = new List<GridColumn>();
                g.Column.Add(new GridColumn { Field = "SNo", Title = "SNo", DataType = GridDataType.String.ToString(), IsHidden = true, Width = 90 });
                g.Column.Add(new GridColumn { Field = "AWBNo", IsLocked = false, Title = "AWB No", DataType = GridDataType.String.ToString(), Width = 50 });
                g.Column.Add(new GridColumn { Field = "OriginCity", IsLocked = false, Title = "Origin City", DataType = GridDataType.String.ToString(), Width = 40 });
                g.Column.Add(new GridColumn { Field = "DestinationCity", IsLocked = false, Title = "Destination City", DataType = GridDataType.String.ToString(), Width = 40 });
                g.Column.Add(new GridColumn { Field = "FlightNo", IsLocked = false, Title = "Flight No", DataType = GridDataType.String.ToString(), Width = 40 });
                g.Column.Add(new GridColumn { Field = "FlightDate", IsLocked = false, Title = "Flight Date", DataType = GridDataType.Date.ToString(), Width = 40 });

                g.Column.Add(new GridColumn { Field = "FFMDetail", Title = "FFM Pcs/Grwt/Vol Wt/CBM", DataType = GridDataType.String.ToString(), Width = 70, IsHidden = true });

                g.ExtraParam = new List<GridExtraParam>();
                g.ExtraParam.Add(new GridExtraParam { Field = "AWBNumber", Value = AWBNumber });
                g.ExtraParam.Add(new GridExtraParam { Field = "OriginCity", Value = OriginCity });
                g.ExtraParam.Add(new GridExtraParam { Field = "DestinationCity", Value = DestinationCity });
                g.ExtraParam.Add(new GridExtraParam { Field = "FlightNo", Value = FlightNo });
                g.ExtraParam.Add(new GridExtraParam { Field = "FlightDateSearch", Value = FlightDateSearch });
                g.InstantiateIn(Container);
            }
        }

        public string GetCompleteReservationData(string AWBNo)
        {
            try
            {
                SqlParameter[] Parameters = {
                                           // new SqlParameter("@AWBReferenceBookingSNo", AWBReferenceBookingSNo),
                                          //  new SqlParameter("@BookingRefNo", BookingRefNo),
                                            new SqlParameter("@AWBNo", AWBNo),
                                            new SqlParameter("@UserID", ((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).UserSNo)
                                        };
                DataSet ds = new DataSet();
                ds = SqlHelper.ExecuteDataset(DMLConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, "NonExecuted_GetCompleteReservationData_AWB", Parameters);
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
                ds = SqlHelper.ExecuteDataset(DMLConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, "spReservation_FlightSearch_Akhtar", Parameters);
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

        public string AddBookingShipperandConsigneeInformation(Int64 BookingRefNo, ReservationInformation ReservationInformation, List<ReservationItineraryInformation> ReservationItineraryInformation, ReservationShipperInformation ReservationShipperInformation, ReservationConsigneeInformation ReservationConsigneeInformation, Int32 ShipperSno, Int32 ConsigneeSno, string CreateShipperParticipants, string CreateConsigneerParticipants, string CallerCode, string BookingDate)
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

    }
}
