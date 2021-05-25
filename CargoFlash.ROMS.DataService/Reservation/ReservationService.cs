using System;
using System.Collections.Generic;
using System.Linq;
using System.ServiceModel;
using System.ServiceModel.Activation;
using System.Text;
using CargoFlash.SoftwareFactory.Data;
using System.Data;
using System.Data.SqlClient;
using CargoFlash.Cargo.Model.Reservation;
using CargoFlash.SoftwareFactory.WebUI.Controls;
using CargoFlash.SoftwareFactory.WebUI;
using System.ServiceModel.Web;
using System.IO;
using CargoFlash.SoftwareFactory.WebUI.Adapters;
using System.Globalization;
using bb = CargoFlash.Cargo.Business;

namespace CargoFlash.Cargo.DataService.Reservation
{
    [GlobalErrorHandlerBehaviour(typeof(GlobalErrorHandler))]   [ServiceBehavior(IncludeExceptionDetailInFaults = true)]
    [AspNetCompatibilityRequirements(RequirementsMode = AspNetCompatibilityRequirementsMode.Allowed)]
    public class ReservationService : BaseWebUISecureObject, IReservationService
    {

        public Stream GetPartialWebForm(string moduleName, string pageName, string colspan, string displayMode)
        {
            StringBuilder myCurrentForm = new StringBuilder();
            using (HtmlFormGenerator htmlFormAdapter = new HtmlFormGenerator())
            {

                htmlFormAdapter.DisplayMode = DisplayModeType.New;
                // htmlFormAdapter.objFormData = GetRecord();
                myCurrentForm.Append(htmlFormAdapter.InstantiatePartialIn(moduleName, pageName, colspan, displayMode));
                myCurrentForm.Append(htmlFormAdapter.InstantiatePartialIn(moduleName, "ShipmentItinerary", colspan, displayMode));
            }
            byte[] resultMyForm = Encoding.UTF8.GetBytes(myCurrentForm.ToString());
            WebOperationContext.Current.OutgoingResponse.ContentType = "text/html";
            return new MemoryStream(resultMyForm);
        }
        public DataSourceResult GetReservationGridData(string OriginCity, string DestinationCity, string FlightNo, string FlightDate, string AWBPrefix, string AWBNo, string LoggedInCity, int skip, int take, int page, int pageSize, List<GridSort> sort, GridFilter filter)
        {
            FlightDate = Convert.ToDateTime(FlightDate, CultureInfo.CurrentCulture).ToString("yyyy/MM/dd");
            string sorts = GridSort.ProcessSorting(sort);
            string ProcName = "";
            if (filter == null)
            {
                filter = new GridFilter();
                filter.Logic = "AND";
                filter.Filters = new List<GridFilter>();
            }
            DataSet ds = new DataSet();

            ProcName = "spReservation_GetList";

            string filters = GridFilter.ProcessFilters<ReservationGridData>(filter);

            SqlParameter[] Parameters = { new SqlParameter("@PageNo", page), 
                                            new SqlParameter("@PageSize", pageSize), 
                                            new SqlParameter("@WhereCondition", filters), 
                                            new SqlParameter("@OrderBy", sorts), 
                                            new SqlParameter("@OriginCity", OriginCity), 
                                            new SqlParameter("@DestinationCity", DestinationCity), 
                                            new SqlParameter("@FlightNo", FlightNo), 
                                            new SqlParameter("@FlightDate", FlightDate), 
                                            new SqlParameter("@AWBPrefix", AWBPrefix), 
                                            new SqlParameter("@AWBNo", AWBNo), 
                                            new SqlParameter("@LoggedInCity", LoggedInCity) };

            ds = SqlHelper.ExecuteDataset(DMLConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, ProcName, Parameters);

            var reservationList = ds.Tables[0].AsEnumerable().Select(e => new ReservationGridData
            {
                SNo = Convert.ToInt32(e["SNo"]),
                ProcessStatus = Convert.ToString(e["ProcessStatus"]),
                AWBNo = e["AWBNo"].ToString(),
                AWBDate = e["AWBDate"].ToString() == "" ? "" : Convert.ToDateTime(e["AWBDate"].ToString()).ToString("yyyy/MM/dd"),
                ShipmentOrigin = e["ShipmentOrigin"].ToString(),
                ShipmentDestination = e["ShipmentDestination"].ToString(),
                CommodityCode = e["CommodityCode"].ToString(),
                ProductName = e["ProductName"].ToString(),
                TotalPieces=Convert.ToInt16(e["TotalPieces"]),
                TotalChargeableWeight = Convert.ToDecimal(e["TotalChargeableWeight"]),
                AccGrWt = Convert.ToDecimal(e["AccGrWt"].ToString()),
                AccVolWt = Convert.ToDecimal(e["AccVolWt"].ToString() == "" ? "0" : e["AccVolWt"].ToString()),
                AccPcs = Convert.ToInt32(e["AccPcs"].ToString() == "" ? "0" : e["AccPcs"].ToString()),
                FBLWt = Convert.ToDecimal(e["FBLWt"].ToString() == "" ? "0" : e["FBLWt"].ToString()),
                FWBWt = Convert.ToDecimal(e["FWBWt"].ToString() == "" ? "0" : e["FWBWt"].ToString()),
                RCSWt = Convert.ToDecimal(e["RCSWt"].ToString() == "" ? "0" : e["RCSWt"].ToString())
            });
            ds.Dispose();
            return new DataSourceResult
            {
                Data = reservationList.AsQueryable().ToList(),
                Total = Convert.ToInt32(ds.Tables[1].Rows[0][0].ToString()),
                FilterCondition = filters,
                SortCondition = sorts,
                StoredProcedure = ProcName
            };
        }

        public RouteSearchList GetRouteSearch(int OriginSNo, int DestSNo)
        {
            SqlParameter[] Parameters = { new SqlParameter("@OriginSNo", OriginSNo), 
                                            new SqlParameter("@DestSNo", DestSNo) };
            DataSet ds = SqlHelper.ExecuteDataset(DMLConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, "spReservation_RouteSearch", Parameters);

            var routeTransList = ds.Tables[1].AsEnumerable().Select(e => new RouteSearchTrans
            {
                OriginAirportSNo = Convert.ToInt32(e["OriginAirportSNo"]),
                DestAirportSNo = Convert.ToInt32(e["DestinationAirportSNo"]),
                RouteSNo = Convert.ToInt32(e["RouteSNo"])
            }).ToList();

            var routeList = ds.Tables[0].AsEnumerable().Select(e => new RouteSearch
            {
                SNo = Convert.ToInt32(e["SNo"]),
                RowNo = Convert.ToInt32(e["RowNo"]),
                Routing = e["Routing"].ToString()
            }).ToList();

            var routeSearchList = new RouteSearchList { RouteSearch = routeList, Route = routeTransList };

            return routeSearchList;
        }

        public string GetProcessSequence(string ProcessName)
        {
            SqlParameter[] Parameters = { new SqlParameter("@ProcessName", ProcessName) };
            DataSet ds = SqlHelper.ExecuteDataset(DMLConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, "GetProcessSequence", Parameters);
            ds.Dispose();
            return bb.Common.CompleteDStoJSON(ds);
        }

        public List<FlightSearchResult> GetFlightSearch(FlightSearch fs)
        {
            SqlParameter[] Parameters = { new SqlParameter("@LoginSNo", fs.LoginSNo), 
                                          new SqlParameter("@FlightDate", fs.FlightDate),
                                          new SqlParameter("@OriginAirportSNo", fs.OriginAirportSNo),
                                          new SqlParameter("@DestinationAirportSNo", fs.DestinationAirportSNo),
                                          new SqlParameter("@VolWeight", fs.VolumeWeight),
                                          new SqlParameter("@GrWeight", fs.GrossWeight),
                                          new SqlParameter("@ProductSNo", fs.ProductSNo),
                                          new SqlParameter("@CommoditySNo", fs.CommoditySNo),
                                          new SqlParameter("@IsCAO", fs.IsCAO),
                                          new SqlParameter("@IsULD", fs.IsULD),
                                          new SqlParameter("@ErrorMessage",DbType.String){Direction=ParameterDirection.Output,Size=250}};
            DataSet ds = SqlHelper.ExecuteDataset(DMLConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, "spReservation_FlightSearch", Parameters);

            var flightList = ds.Tables[0].AsEnumerable().Select(e => new FlightSearchResult
            {
                DailyFlightSNo = Convert.ToInt32(e["SNo"]),
                FlightNo = e["FlightNo"].ToString(),
                From = e["OriginAirportCode"].ToString(),
                ETD = Convert.ToDateTime(e["ETD"]).ToString("dd-MMM-yyyy hh:mm"),
                To = e["DestinationAirportCode"].ToString(),
                ETA = Convert.ToDateTime(e["ETA"]).ToString("dd-MMM-yyyy hh:mm"),
                AircraftType = e["AircraftType"].ToString(),
                AvailableGross = Convert.ToDecimal(e["AvailableGross"]),
                AvailableVolume = Convert.ToDecimal(e["AvailableVolume"]),
                DestAirportSNo = Convert.ToInt32(e["DestinationAirPortSNo"]),
                OriginAirportSNo = Convert.ToInt32(e["OriginAirPortSNo"])
            }).ToList();

            return flightList;
        }

        private Stream BuildWebForm(string processName, string moduleName, string appName, string formAction, string recordID = "", bool IsSubModule = true, string AWBSNo = "", string CheckListTypeSNo = "", string OriginCity = "", string DestinationCity = "", string FlightNo = "", string FlightDate = "", string AWBPrefix = "", string AWBNo = "", string HAWBNo = "", string LoggedInCity = "", string FlightStatus = "", string FlightSNo = "")
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
                        case "RESERVATION":
                            if (appName.ToUpper().Trim() == "BOOKING")
                                CreateResGrid(myCurrentForm, processName, OriginCity, DestinationCity, FlightNo, FlightDate, AWBPrefix, AWBNo, LoggedInCity);
                            break;
                        case DisplayModeReadView:

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
        private void CreateResGrid(StringBuilder Container, string ProcessName, string OriginCity = "", string DestinationCity = "", string FlightNo = "", string FlightDate = "", string AWBPrefix = "", string AWBNo = "", string LoggedInCity = "")
        {
            using (Grid g = new Grid())
            {
                g.Height = 100;
                g.PageName = this.MyPageName;
                g.PrimaryID = this.MyPrimaryID;
                g.ModuleName = this.MyModuleID;
                g.AppsName = this.MyAppID;
                g.IsDisplayOnly = false;
                g.DefaultPageSize = 5;
                g.IsAllowCopy = false;
                g.DataSoruceUrl = "Services/Reservation/ReservationService.svc/GetReservationGridData";
                g.NewURL = MyPageName + "?" + GetWebURLString("New", false);
                g.ServiceModuleName = this.MyModuleID;
                g.UserID = this.MyUserID;
                g.FormCaptionText = "Booking";
                g.IsPageable = true;
                g.IsAllowedPaging = true;
                g.IsProcessPart = true;
                g.IsRowChange = true;//added by Manoj Kumar
                g.IsRowDataBound = true;//added by Manoj Kumar
                g.IsPageSizeChange = false;
                g.IsPager = false;
                g.IsOnlyTotalDisplay = true;
                g.ProcessName = ProcessName;

                g.Column = new List<GridColumn>();
                g.Column.Add(new GridColumn { Field = "SNo", Title = "SNo", DataType = GridDataType.String.ToString(), IsHidden = true, Width = 90 });
                //g.Column.Add(new GridColumn { Field = "SNo", Title = "Warning!!", DataType = GridDataType.String.ToString(), Template = "#if(IsWarning==true){#<img src=\"images/warning.png\" title=\"#=WarningRemarks#\" style=\"cursor:pointer;\">#}#", Width = 20 });

                g.Column.Add(new GridColumn { Field = "AWBNo", IsLocked = false, Title = "AWB No", DataType = GridDataType.String.ToString(), Width = 90 });
                g.Column.Add(new GridColumn { Field = "ShipmentOrigin", IsLocked = false, Title = "Org", DataType = GridDataType.String.ToString(), Width = 40 });
                //g.Column.Add(new GridColumn { Field = "Destination", IsLocked = false, Title = "Dest", DataType = GridDataType.String.ToString(), Width = 35 });
                g.Column.Add(new GridColumn { Field = "ShipmentDestination", IsLocked = false, Title = "Final Dest", DataType = GridDataType.String.ToString(), Width = 35 });
                //g.Column.Add(new GridColumn { Field = "Status", IsLocked = false, Title = "Status", DataType = GridDataType.String.ToString(), Width = 40 });

                g.Column.Add(new GridColumn { Field = "AWBDate", Title = "AWB Date", IsHidden = false, DataType = GridDataType.Date.ToString(), Width = 80 });
                g.Column.Add(new GridColumn { Field = "TotalPieces", Title = "Pcs", DataType = GridDataType.Number.ToString(), Width = 40 });
                g.Column.Add(new GridColumn { Field = "TotalChargeableWeight", Title = "Ch. Wt", IsHidden = false, DataType = GridDataType.Number.ToString(), Width = 50, Format = "n" });
                //g.Column.Add(new GridColumn { Field = "FlightNo", Title = "Flt No", IsHidden = false, DataType = GridDataType.String.ToString(), Width = 70 });
                //g.Column.Add(new GridColumn { Field = "FlightDate", Title = "Flt Date", IsHidden = false, DataType = GridDataType.Date.ToString(), Width = 80 });
                g.Column.Add(new GridColumn { Field = "CommodityCode", Title = "Commodity", IsHidden = true, DataType = GridDataType.String.ToString(), Width = 80 });

                //g.Column.Add(new GridColumn { Field = "DailyFlightSNo", Title = "DailyFlightSNo", DataType = GridDataType.String.ToString(), IsHidden = true, Width = 90 });
                g.Column.Add(new GridColumn { Field = "ProcessStatus", Title = "ProcessStatus", DataType = GridDataType.String.ToString(), IsHidden = true, Width = 90 });
                g.Column.Add(new GridColumn { Field = "AccPcs", Title = "AccPcs", DataType = GridDataType.Number.ToString(), IsHidden = true });
                g.Column.Add(new GridColumn { Field = "AccGrWt", Title = "AccGrWt", DataType = GridDataType.Number.ToString(), IsHidden = true });
                g.Column.Add(new GridColumn { Field = "AccVolWt", Title = "AccVolWt", DataType = GridDataType.Number.ToString(), IsHidden = true });
                g.Column.Add(new GridColumn { Field = "FBLWt", Title = "FBLWt", DataType = GridDataType.Number.ToString(), IsHidden = true, Format = "n" });// Added by RH 12-08-15
                g.Column.Add(new GridColumn { Field = "FWBWt", Title = "FWBWt", DataType = GridDataType.Number.ToString(), IsHidden = true, Format = "n" });// Added by RH 12-08-15
                g.Column.Add(new GridColumn { Field = "RCSWt", Title = "RCSWt", DataType = GridDataType.Number.ToString(), IsHidden = true, Format = "n" });// Added by RH 12-08-15

                g.ExtraParam = new List<GridExtraParam>();
                g.ExtraParam.Add(new GridExtraParam { Field = "OriginCity", Value = OriginCity });
                g.ExtraParam.Add(new GridExtraParam { Field = "DestinationCity", Value = DestinationCity });
                g.ExtraParam.Add(new GridExtraParam { Field = "FlightNo", Value = FlightNo });
                g.ExtraParam.Add(new GridExtraParam { Field = "FlightDate", Value = FlightDate });
                g.ExtraParam.Add(new GridExtraParam { Field = "AWBPrefix", Value = AWBPrefix });
                g.ExtraParam.Add(new GridExtraParam { Field = "AWBNo", Value = AWBNo });
                g.ExtraParam.Add(new GridExtraParam { Field = "LoggedInCity", Value = LoggedInCity });
                g.InstantiateIn(Container);

            }
        }

        public Stream GetWebForm(string processName, string moduleName, string appName, string formAction, string IsSubModule)
        {
            return BuildWebForm(processName, moduleName, appName, formAction, "", (IsSubModule == "1"));
        }
        public Stream GetGridData(string processName, string moduleName, string appName, string OriginCity, string DestinationCity, string FlightNo, string FlightDate, string AWBPrefix, string AWBNo, string LoggedInCity)
        {
            return BuildWebForm(processName, moduleName, appName, "IndexView", OriginCity: OriginCity, DestinationCity: DestinationCity, FlightNo: FlightNo, FlightDate: FlightDate, AWBPrefix: AWBPrefix, AWBNo: AWBNo, LoggedInCity: LoggedInCity);
        }

        public string SaveReservationInfo(ReservationInfo r)
        {
            List<ReservationInfo> res= new List<ReservationInfo>();
            res.Add(r);

            DataTable dtReservationInfo = CollectionHelper.ConvertTo<ReservationInfo>(res, "flightPlan");
            DataTable dtFlightPlan = CollectionHelper.ConvertTo<FlightPlan>(r.flightPlan,"");
            SqlParameter[] param ={ new SqlParameter("@AWBInfo",SqlDbType.Structured){SqlValue=dtReservationInfo},
                                      new SqlParameter("@FlightPlan",SqlDbType.Structured){SqlValue=dtFlightPlan},
                                      new SqlParameter("@CreatedBy",1),
                                      new SqlParameter("@ErrorMessage",SqlDbType.VarChar){Direction=ParameterDirection.Output,Size=250}
                                   };
            DataSet ds = SqlHelper.ExecuteDataset(DMLConnectionString.WebConfigConnectionString,CommandType.StoredProcedure,"spReservation_SaveInfo",param);
            if (!string.IsNullOrEmpty(param[param.Length - 1].Value.ToString()))
                return param[param.Length - 1].Value.ToString();
            else
                return "";
        }

        public string GetShipperAndConsigneeInfo(Int32 AWBSNo)
        {
            SqlParameter[] Parameters = { new SqlParameter("@AWBSNO", AWBSNo) };
            DataSet ds = SqlHelper.ExecuteDataset(DMLConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, "spReservation_CustomerInfo", Parameters);
            ds.Dispose();
            return bb.Common.CompleteDStoJSON(ds);
        }

        public string GetHandlingInfo(Int32 AWBSNO)
        {
            SqlParameter[] Parameters = { new SqlParameter("@AWBSNO", AWBSNO) };
            DataSet ds = SqlHelper.ExecuteDataset(DMLConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, "spReservation_HandlingInfo", Parameters);
            ds.Dispose();
            return bb.Common.CompleteDStoJSON(ds);
        }

        public string GetDimemsionsAndULD(Int32 AWBSNO)
        {
            SqlParameter[] Parameters = { new SqlParameter("@AWBSNO", AWBSNO) };
            DataSet ds = SqlHelper.ExecuteDataset(DMLConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, "spReservation_GetDimemsionsAndULD", Parameters);
            ds.Dispose();
            return bb.Common.CompleteDStoJSON(ds);
        }

        public string GetCustomerInfo(Int32 CustomerSNo)
        {
            SqlParameter[] Parameters = { new SqlParameter("@CustomerSNo", CustomerSNo) };
            DataSet ds = SqlHelper.ExecuteDataset(DMLConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, "spReservation_GetCustomerInfo", Parameters);
            ds.Dispose();
            return bb.Common.CompleteDStoJSON(ds);
        }

        //public string SetCustomerInfo(ObjCustomerInfo obj)
        //{
        //    List<CustomerInfo> lstShipperInformation = new List<CustomerInfo>();
        //    lstShipperInformation.Add(obj.ShipperInfo);
        //    DataTable dtShipperInformation = CollectionHelper.ConvertTo(lstShipperInformation, "");

        //    List<CustomerInfo> lstConsigneeInformation = new List<CustomerInfo>();
        //    lstConsigneeInformation.Add(obj.ConsigneeInfo);
        //    DataTable dtConsigneeInformation = CollectionHelper.ConvertTo(lstConsigneeInformation, "");


        //    DataSet ds = new DataSet();
        //    SqlParameter[] param = { new SqlParameter("@AWBSNo", obj.AWBSNo), 
        //                                    new SqlParameter("@ShipperInfo",SqlDbType.Structured){SqlValue=dtShipperInformation} ,
        //                                    new SqlParameter("@ConsigneeInfo",SqlDbType.Structured){SqlValue=dtConsigneeInformation} ,
        //                                    new SqlParameter("@UpdatedBy", obj.UpdatedBy),
        //                                    new SqlParameter("@ErrorMessage",SqlDbType.VarChar){Direction=ParameterDirection.Output,Size=250}};
        //    try
        //    {
        //        ds = SqlHelper.ExecuteDataset(DMLConnectionString.WebConfigConnectionString, "spReservation_SetCustomerInfo", param);
        //        if (!string.IsNullOrEmpty(param[param.Length - 1].Value.ToString()))
        //            return param[param.Length - 1].Value.ToString();
        //        else
        //            return "";

        //    }
        //    catch(Exception ex)// (Exception ex)
        //    {
        //        return ex.Message;
        //    }
        //}

        //public string SetHandlingInfo(Int32 AWBSNo, List<AWBOCIModel> AWBOciInfo, List<AWBOSIModel> AWBOsiInfo, List<AWBHandlingMessage> AWBHandling, Int32 UpdatedBy)
        //{
        //    DataTable dtAWBHandling = CollectionHelper.ConvertTo(AWBHandling, "");
        //    DataTable dtAWBOSIModel = CollectionHelper.ConvertTo(AWBOsiInfo, "");
        //    DataTable dtAWBOCIModel = CollectionHelper.ConvertTo(AWBOciInfo, "");

        //    DataSet ds = new DataSet();
        //    SqlParameter[] param = { new SqlParameter("@AWBSNo", AWBSNo), 
        //                                    new SqlParameter("@AWBOCIInfo",SqlDbType.Structured){SqlValue=dtAWBOCIModel},
        //                                    new SqlParameter("@AWBOSIInfo",SqlDbType.Structured){SqlValue=dtAWBOSIModel},
        //                                    new SqlParameter("@AWBHandling",SqlDbType.Structured){SqlValue=dtAWBHandling},
        //                                    new SqlParameter("@UpdatedBy", UpdatedBy),
        //                                    new SqlParameter("@ErrorMessage",SqlDbType.VarChar){Direction=ParameterDirection.Output,Size=250}};
        //    try
        //    {
        //        ds = SqlHelper.ExecuteDataset(DMLConnectionString.WebConfigConnectionString, "spReservation_SetHandlingInfo", param);
        //        if (!string.IsNullOrEmpty(param[param.Length - 1].Value.ToString()))
        //            return param[param.Length - 1].Value.ToString();
        //        else
        //            return "";
        //    }
        //    catch(Exception ex)// (Exception ex)
        //    {
        //        return ex.Message;
        //    }
        //}

        //public string UpdateDimemsionsAndULD(Int32 AWBSNo, List<Dimensions> Dimensions, List<AWBULDTrans> AWBULDTrans, Int32 UpdatedBy)
        //{
        //    DataTable dtDimensions = CollectionHelper.ConvertTo(Dimensions, "");
        //    DataTable dtAWBULDTrans = CollectionHelper.ConvertTo(AWBULDTrans, "");

        //    DataSet ds = new DataSet();
        //    SqlParameter[] param = { new SqlParameter("@AWBSNo", AWBSNo), 
        //                                    new SqlParameter("@Dimensions",SqlDbType.Structured){SqlValue=dtDimensions}, 
        //                                    new SqlParameter("@AWBULDTrans",SqlDbType.Structured){SqlValue=dtAWBULDTrans},
        //                                    new SqlParameter("@UpdatedBy", UpdatedBy),
        //                                    new SqlParameter("@ErrorMessage",SqlDbType.VarChar){Direction=ParameterDirection.Output,Size=250}};
        //    try
        //    {
        //        ds = SqlHelper.ExecuteDataset(DMLConnectionString.WebConfigConnectionString, "spReservation_SetDimensionULDInfo", param);
        //        return param[param.Length - 1].Value.ToString();
        //    }
        //    catch(Exception ex)// (Exception ex)
        //    {
        //        return ex.Message;
        //    }
        //}
    }

}
