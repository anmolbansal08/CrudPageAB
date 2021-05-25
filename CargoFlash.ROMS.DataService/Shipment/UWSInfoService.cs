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
using System.Net;
using System.ServiceModel;
using System.ServiceModel.Activation;
using System.ServiceModel.Web;
using System.Text;

namespace CargoFlash.Cargo.DataService.Shipment
{
    [GlobalErrorHandlerBehaviour(typeof(GlobalErrorHandler))]   [ServiceBehavior(IncludeExceptionDetailInFaults = true)]
    [AspNetCompatibilityRequirements(RequirementsMode = AspNetCompatibilityRequirementsMode.Allowed)]
    public class UWSInfoService : BaseWebUISecureObject, IUWSInfoService
    {
        public Stream GetWebForm(string processName, string moduleName, string appName, string formAction, string IsSubModule)
        {
            try 
            { 
            return BuildWebForm(processName, moduleName, appName, formAction, "", (IsSubModule == "1"));
            }
            catch(Exception ex)//(Exception ex)
            {
                throw ex;
            }
        }
        public Stream GetUWSGridData(string processName, string moduleName, string appName, string AirlineSNo, string ProcessSNo, string FlightDate, string FlightSNo, string AWBNo)
        {
            try 
            {
            return BuildWebForm(processName, moduleName, appName, "IndexView", AirlineSNo: AirlineSNo, ProcessSNo: ProcessSNo, FlightDate: FlightDate, FlightSNo: FlightSNo);
            }
            catch(Exception ex)//(Exception ex)
            {
                throw ex;
            }
        }
        public Stream GetTransGridData(string processName, string moduleName, string appName, string AWBSNo)
        {
            try 
            {
            return BuildWebForm(processName, moduleName, appName, "IndexView", AWBSNo: AWBSNo);
            }
            catch(Exception ex)//(Exception ex)
            {
                throw ex;
            }
        }

        private Stream BuildWebForm(string processName, string moduleName, string appName, string formAction, string recordID = "", bool IsSubModule = true, string AirlineSNo = "0", string ProcessSNo = "0", string FlightDate = "", string FlightSNo = "0", string AWBSNo = "")
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
                        case "UWSInfo":
                            if (appName.ToUpper().Trim() == "BOOKING")
                                CreateSLIGrid(myCurrentForm, processName, AirlineSNo, ProcessSNo, FlightDate, FlightSNo);
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
        //Created By Manoj Kumar on 17.11.2015 for SLI Info
        private void CreateSLIGrid(StringBuilder Container, string ProcessName, string AirlineSNo = "0", string ProcessSNo = "0", string FlightDate = "0", string FlightSNo = "0")
        {
            using (Grid g = new Grid())
            {

                g.PageName = this.MyPageName;
                g.PrimaryID = this.MyPrimaryID;
                g.ModuleName = this.MyModuleID;
                g.AppsName = this.MyAppID;
                g.IsActionRequired = false;
                // g.ActionTitle = "Action";
                g.DataSoruceUrl = "Services/Shipment/UWSInfoService.svc/GetUWSInfoGridData";
                g.NewURL = MyPageName + "?" + GetWebURLString("New", false);
                g.ServiceModuleName = this.MyModuleID;
                g.UserID = this.MyUserID;
                g.FormCaptionText = "UWS";
                g.DefaultPageSize = 5;
                g.IsDisplayOnly = false;
                g.IsProcessPart = true;
                g.IsVirtualScroll = false;
                g.ProcessName = ProcessName;
                g.SuccessGrid = "OnSuccessGrid";
                g.IsShowGridHeader = true;
                // g.IsRowDataBound = true;

                ////
                g.Column = new List<GridColumn>();
                g.Column.Add(new GridColumn { Field = "SNo", Title = "SNo", DataType = GridDataType.String.ToString(), IsHidden = true });
                g.Column.Add(new GridColumn { Field = "FlightNo", IsLocked = false, Title = "Flight No", DataType = GridDataType.String.ToString(), Width = 60 });
                //g.Column.Add(new GridColumn { Field = "FlightDate", IsLocked = false, Title = "Flight Date", DataType = GridDataType.Date.ToString(), Width = 70 });
                g.Column.Add(new GridColumn { Field = "FlightDate", Title = "Flight Date", IsHidden = false, DataType = GridDataType.Date.ToString(), Width = 80, Template = "# if( FlightDate==null) {# # } else {# #= kendo.toString(new Date(data.FlightDate.getTime() + data.FlightDate.getTimezoneOffset()*60000),\"" + UIDateTimeFormat.UIDateFormatString + "\") # #}#" });
                g.Column.Add(new GridColumn { Field = "Text_LoadType", IsLocked = false, Title = "Load Type", DataType = GridDataType.String.ToString(), Width = 90 });
                g.Column.Add(new GridColumn { Field = "EquipmentNo", IsLocked = false, Title = "Equipment No", DataType = GridDataType.String.ToString(), Width = 90 });
                g.Column.Add(new GridColumn { Field = "issued", IsLocked = false, Title = "Issued", DataType = GridDataType.String.ToString(), Width = 50 });
                g.Column.Add(new GridColumn { Field = "Shipment", IsLocked = false, Title = "ULD No/BULK", DataType = GridDataType.String.ToString(), Width = 90, Template = "# if( Shipment==\"BULK\" || IsCart==true) {#<a onclick=\"ShowGridBulkData(this)\" id=\"ancBulkData\" style=\"cursor:pointer;color:blue\">#=Shipment#</a># } else {#<span  title= \"#= Shipment #\">#= Shipment #</span>#}#" });

                g.Column.Add(new GridColumn { Field = "OriginCode", IsLocked = false, Title = "Origin", DataType = GridDataType.String.ToString(), Width = 60 });
                g.Column.Add(new GridColumn { Field = "DestinationCode", IsLocked = false, Title = "Destination", DataType = GridDataType.String.ToString(), Width = 70 });
                g.Column.Add(new GridColumn { Field = "Process", IsLocked = false, Title = "Process", DataType = GridDataType.String.ToString(), Width = 60 });
                g.Column.Add(new GridColumn { Field = "ScaleWeight", IsLocked = false, Title = "Scale WT", DataType = GridDataType.String.ToString(), Width = 70 });
                g.Column.Add(new GridColumn { Field = "TareWeight", IsLocked = false, Title = "Tare WT", DataType = GridDataType.String.ToString(), Width = 70 });
                g.Column.Add(new GridColumn { Field = "TotalShipWeight", IsLocked = false, Title = "Total WT", DataType = GridDataType.String.ToString(), Width = 70 });
                g.Column.Add(new GridColumn { Field = "NetWeight", IsLocked = false, Title = "Net WT", DataType = GridDataType.String.ToString(), Width = 70 });
                g.Column.Add(new GridColumn { Field = "Variance", IsLocked = false, Title = "Variance%", DataType = GridDataType.String.ToString(), Width = 70 });
                g.Column.Add(new GridColumn { Field = "Manual", IsLocked = false, Title = "Manual", DataType = GridDataType.String.ToString(), Width = 60 });
                g.Column.Add(new GridColumn { Field = "Remarks", IsLocked = false, Title = "Remarks", DataType = GridDataType.String.ToString(), Width = 60 });
                g.Column.Add(new GridColumn { Field = "SHC", IsLocked = false, Title = "SHC", DataType = GridDataType.String.ToString(), Width = 60, Template = "<span title=\"#= SHC #\">#= SHC #</span>" });
                g.Column.Add(new GridColumn { Field = "CreatedBy", IsLocked = false, Title = "Created By", DataType = GridDataType.String.ToString(), Width = 70 });
                //g.Column.Add(new GridColumn { Field = "CreatedOn", IsLocked = false, Title = "Created On", DataType = GridDataType.DateTime.ToString(), Width = 70, Template = "<span title=\"#= CreatedOn #\">#= CreatedOn #</span>" });
                g.Column.Add(new GridColumn { Field = "CreatedOn", Title = "Created On", IsHidden = false, DataType = GridDataType.DateTime.ToString(), Width = 70, Template = "# if( CreatedOn==null) {# # } else {#<span  title= \"#= kendo.toString(new Date(data.CreatedOn.getTime() + data.CreatedOn.getTimezoneOffset()*60000),\"" + UIDateTimeFormat.UIDateFormatString + " " + UIDateTimeFormat.UITimeFormatString + "\") #\">#= kendo.toString(new Date(data.CreatedOn.getTime() + data.CreatedOn.getTimezoneOffset()*60000),\"" + UIDateTimeFormat.UIDateFormatString + " " + UIDateTimeFormat.UITimeFormatString + "\") #</span>#}#" });
                //    #  #}#" 
                g.Column.Add(new GridColumn { Field = "PartnerAirline", IsLocked = false, Title = "PartnerAirline", DataType = GridDataType.String.ToString(), IsHidden = true });
                g.Column.Add(new GridColumn { Field = "IsULD", IsLocked = false, Title = "IsULD", DataType = GridDataType.Boolean.ToString(), IsHidden = true });
                g.Column.Add(new GridColumn { Field = "IsCart", IsLocked = false, Title = "IsCart", DataType = GridDataType.Boolean.ToString(), IsHidden = true });
                g.Column.Add(new GridColumn { Field = "IsDGR", IsLocked = false, Title = "IsDGR", DataType = GridDataType.Boolean.ToString(), IsHidden = true });
                g.Column.Add(new GridColumn { Field = "IsPrint", IsLocked = false, Title = "IsPrint", DataType = GridDataType.Boolean.ToString(), IsHidden = true });
                g.Column.Add(new GridColumn { Field = "IsDeparted", IsLocked = false, Title = "IsDeparted", DataType = GridDataType.Boolean.ToString(), IsHidden = true });
              
                //g.Column.Add(new GridColumn { Field = "ScaleWeight", Title = "Warning!!", IsHidden = false, DataType = GridDataType.String.ToString(), Template = "#if(ScaleWeight>0){#<img src=\"images/warning.png\" title=\"#=WarningRemarks#\" style=\"cursor:pointer;\">#}#", Width = 20 });
                g.Column.Add(new GridColumn { Field = "ProcessStatus", Title = "ProcessStatus", DataType = GridDataType.String.ToString(), IsHidden = true });
                // g.IsActionRequired = false;
                //g.Action = new List<GridAction>();
                //g.Action.Add(new GridAction
                //{
                //    ButtonCaption = "Read",
                //    ClientAction = "GetSLIAction",
                //    ActionName = "EDIT",
                //    AppsName = this.MyAppID,
                //    CssClassName = "read",
                //    ModuleName = this.MyModuleID
                //});
                //g.Action.Add(new GridAction
                //{
                //    ButtonCaption = "Part",
                //    ClientAction = "GetSLIAction",
                //    ActionName = "EDIT",
                //    AppsName = this.MyAppID,
                //    CssClassName = "read",
                //    ModuleName = this.MyModuleID
                //});
                //g.Action.Add(new GridAction
                //{
                //    ButtonCaption = "Final",
                //    ClientAction = "GetSLIAction",
                //    ActionName = "EDIT",
                //    AppsName = this.MyAppID,
                //    CssClassName = "read",
                //    ModuleName = this.MyModuleID
                //});
                g.ExtraParam = new List<GridExtraParam>();
                g.ExtraParam.Add(new GridExtraParam { Field = "AirlineSNo", Value = AirlineSNo });
                g.ExtraParam.Add(new GridExtraParam { Field = "ProcessSNo", Value = ProcessSNo });
                g.ExtraParam.Add(new GridExtraParam { Field = "FlightDate", Value = FlightDate });
                g.ExtraParam.Add(new GridExtraParam { Field = "FlightSNo", Value = FlightSNo });

                g.InstantiateIn(Container);

            }
        }

        public DataSourceResult GetUWSInfoGridData(string AirlineSNo, string ProcessSNo, string FlightDate, string FlightSNo, int skip, int take, int page, int pageSize, List<SoftwareFactory.Data.GridSort> sort, SoftwareFactory.Data.GridFilter filter)
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

            ProcName = "GetListUWSDetails";

            string filters = GridFilter.ProcessFilters<UWSAWBInfo>(filter);

            SqlParameter[] Parameters = { new SqlParameter("@PageNo", page), new SqlParameter("@PageSize", pageSize), new SqlParameter("@WhereCondition", filters.Replace("FlightDate", "FlightDateSearch").Replace("CreatedOn", "CreatedOnSearch")), new SqlParameter("@OrderBy", sorts), new SqlParameter("@AirlineSNo", AirlineSNo), new SqlParameter("@ProcessSNo", ProcessSNo), new SqlParameter("@FlightDate", FlightDate), new SqlParameter("@FlightSNo", FlightSNo), new SqlParameter("@AirportSNo", ((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).AirportSNo) };

            ds = SqlHelper.ExecuteDataset(DMLConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, ProcName, Parameters);

            var SLIList = ds.Tables[0].AsEnumerable().Select(e => new UWSAWBInfo
            {

                SNo = Convert.ToInt32(e["SNo"]),
                FlightNo = e["FlightNo"].ToString(),
                OriginCode = e["OriginCode"].ToString(),
                DestinationCode = e["DestinationCode"].ToString(),
                FlightDate = e["FlightDate"] == DBNull.Value ? (DateTime?)null : DateTime.SpecifyKind(Convert.ToDateTime(e["FlightDate"]), DateTimeKind.Utc),
                EquipmentNo = e["EquipmentNo"].ToString().ToUpper(),
                issued = e["issued"].ToString().ToUpper(),
                ScaleWeight = e["ScaleWeight"].ToString() == null ? "" : e["ScaleWeight"].ToString(), //== "" ? (decimal)0 : Convert.ToDecimal(e["ScaleWeight"]),
                Process = e["Process"].ToString(),
                //Shipment = e["Shipment"].ToString(),
                Shipment = e["Shipment"].ToString().ToUpper(),
                Text_LoadType = e["Text_LoadType"].ToString(),
                TareWeight = e["TareWeight"].ToString() == null ? "" : e["TareWeight"].ToString(),// == "" ? (decimal)0 : Convert.ToDecimal(e["TareWeight"]),
                NetWeight = e["NetWeight"].ToString() == null ? "" : e["NetWeight"].ToString(), //== "" ? (decimal)0 : Convert.ToDecimal(e["NetWeight"]),
                Manual = e["Manual"].ToString().ToUpper(),
                Remarks = e["Remarks"].ToString(),
                //   SHC = e["SHC"].ToString(),
                SHC = e["SHC"].ToString().ToUpper() == "" ? e["SHC"].ToString().ToUpper() : e["SHC"].ToString().ToUpper().Remove(e["SHC"].ToString().Length - 1),
                CreatedBy = e["CreatedBy"].ToString(),
                CreatedOn = DateTime.SpecifyKind(Convert.ToDateTime(e["CreatedOn"]), DateTimeKind.Utc),
                IsULD = Convert.ToInt32(e["IsULD"]),
                IsDGR = Convert.ToInt32(e["IsDGR"]),
                IsPrint = Convert.ToInt16(e["IsPrint"]),
                IsDeparted = Convert.ToInt16(e["IsDeparted"]),
                TotalShipWeight = e["TotalShipWeight"].ToString(), //== "" ? (decimal)0 : Convert.ToDecimal(e["TotalShipWeight"]),
                IsCart=Convert.ToBoolean(e["IsCart"]),
                Variance = Convert.ToDecimal(e["Variance"]).ToString("F"),
                PartnerAirline = Convert.ToString(e["PartnerAirline"])

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
            SqlParameter[] Parameters = { new SqlParameter("@ProcessName", ProcessName) };
            DataSet ds = SqlHelper.ExecuteDataset(DMLConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, "GetProcessSequence", Parameters);
            ds.Dispose();
            return CargoFlash.Cargo.Business.Common.CompleteDStoJSON(ds);
            }
            catch(Exception ex)//(Exception ex)
            {
                throw ex;
            }
        }
        public string SaveUWSInfo(Int32 FlightSNo, Int32 ProcessSNo, Int32 AirlineSNo, string FlightDate, Int32 EquipmentSNo, Int32 UWSSNo, string EquipmentNo, UWSAWBInfo ShipmentInformation)
        {
            try 
            {

            List<UWSAWBInfo> lstShipmentInformation = new List<UWSAWBInfo>();
            lstShipmentInformation.Add(ShipmentInformation);
            lstShipmentInformation.ForEach(e => e.EquipmentSNo = EquipmentSNo);
            DataTable dtShipmentInformation = CollectionHelper.ConvertTo(lstShipmentInformation, "SNo,FlightNo,FlightDate,Airline,Text_LoadType,Multi_SHC,Text_SHC,EquipmentNo,OriginCode,DestinationCode,Process,TareWeight,NetWeight,Shipment,issued,Manual,CreatedBy,CreatedOn,IsULD,IsDGR,IsPrint,IsDeparted,Variance,TotalShipWeight");
            BaseBusiness baseBusiness = new BaseBusiness();
            SqlParameter paramShipmentInformation = new SqlParameter();
            paramShipmentInformation.ParameterName = "@ShipmentInformation";
            paramShipmentInformation.SqlDbType = System.Data.SqlDbType.Structured;
            paramShipmentInformation.Value = dtShipmentInformation;

            DataSet ds = new DataSet();
            SqlParameter[] Parameters = { new SqlParameter("@FlightSNo", FlightSNo), new SqlParameter("@ProcessSNo", ProcessSNo), new SqlParameter("@AirlineSNo", AirlineSNo), new SqlParameter("@FlightDate", FlightDate), new SqlParameter("@EquipmentNo", EquipmentNo), new SqlParameter("@UWSSNo", UWSSNo), paramShipmentInformation, new SqlParameter("@UpdatedBy", ((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).UserSNo.ToString()), new SqlParameter("@AirportSNo", ((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).AirportSNo) };//Add LoginCitySNo Here,and LoginAirport 
            DataSet ds1 = new DataSet();
           
                ds = SqlHelper.ExecuteDataset(DMLConnectionString.WebConfigConnectionString, "saveUWSAWBInfo", Parameters);
                return ds.Tables[ds.Tables.Count - 1].Rows[0][0].ToString();
           
            }
            catch(Exception ex)//(Exception ex)
            {
                throw ex;
            }
        }
        public string SaveAssignFlight(Int32 FlightSNo, string EquipmentNo, int UWSSNo)
        {
            try 
            {


            DataSet ds = new DataSet();
            SqlParameter[] Parameters = { new SqlParameter("@FlightSNo", FlightSNo), new SqlParameter("@EquipmentNo", EquipmentNo), new SqlParameter("@UWSSNo", UWSSNo), new SqlParameter("@UpdatedBy", ((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).UserSNo.ToString()) };//Add LoginCitySNo Here,and LoginAirport 
            DataSet ds1 = new DataSet();
                ds = SqlHelper.ExecuteDataset(DMLConnectionString.WebConfigConnectionString, "spUWS_AssignFlight", Parameters);
                return ds.Tables[ds.Tables.Count - 1].Rows[0][0].ToString();
           
            }
            catch(Exception ex)//(Exception ex)
            {
                throw ex;
            }
        }
        public string SaveRemovepieces(List<RemoveUWSDetails> UWSDataList, decimal NewScaleWeight,bool IsCart)
        {
            DataTable dtUWSDataList = CollectionHelper.ConvertTo(UWSDataList, "");
            SqlParameter paramUWSDataList = new SqlParameter();
            paramUWSDataList.ParameterName = "@UWSDataList";
            paramUWSDataList.SqlDbType = System.Data.SqlDbType.Structured;
            paramUWSDataList.Value = dtUWSDataList;

            DataSet ds = new DataSet();
            SqlParameter[] Parameters = { paramUWSDataList, new SqlParameter("@NewScaleWeight", NewScaleWeight), new SqlParameter("@IsCart", IsCart), new SqlParameter("@UpdatedBy", ((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).UserSNo.ToString()) };//Add LoginCitySNo Here,and LoginAirport 
            DataSet ds1 = new DataSet();
            try
            {
                ds = SqlHelper.ExecuteDataset(DMLConnectionString.WebConfigConnectionString, "spUWS_SaveRemovepieces", Parameters);
                return ds.Tables[ds.Tables.Count - 1].Rows[0][0].ToString();
           
            }
            catch(Exception ex)//(Exception ex)
            {
                throw ex;
            }
        }
        public string SaveNewScaleWeight(int UWSSNo, string EquipmentNo, decimal NewScaleWeight)
        {
            try 
            {
            DataSet ds = new DataSet();
            SqlParameter[] Parameters = { new SqlParameter("@UWSSNo", UWSSNo), new SqlParameter("@EquipmentNo", EquipmentNo), new SqlParameter("@NewScaleWeight", NewScaleWeight), new SqlParameter("@UpdatedBy", ((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).UserSNo.ToString()) };//Add LoginCitySNo Here,and LoginAirport 
            DataSet ds1 = new DataSet();          
                ds = SqlHelper.ExecuteDataset(DMLConnectionString.WebConfigConnectionString, "spUWS_SaveNewScaleWeight", Parameters);
                return ds.Tables[ds.Tables.Count - 1].Rows[0][0].ToString();
            
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
        public string GetEquipmentExist(string EquipmentNo, int FlightSNo, int ProcessSNo, int SpecialRights)
        {
            try 
            {
            SqlParameter[] Parameters = { new SqlParameter("@EquipmentNo", EquipmentNo), new SqlParameter("@FlightSNo", FlightSNo), new SqlParameter("@ProcessSNo", ProcessSNo), new SqlParameter("@SpecialRights", SpecialRights) };
            DataSet ds = SqlHelper.ExecuteDataset(DMLConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, "CheckEquipmentExistUWS", Parameters);
            ds.Dispose();
            //return Convert.ToString(ds.Tables[0].Rows[0][0].ToString() + "," + ds.Tables[0].Rows[0][1].ToString() + "," + ds.Tables[0].Rows[0][2].ToString() + "," + ds.Tables[0].Rows[0][3].ToString() + "," + ds.Tables[0].Rows[0][4].ToString());
            return CargoFlash.Cargo.Business.Common.CompleteDStoJSON(ds);
            }
            catch(Exception ex)//(Exception ex)
            {
                throw ex;
            }
        }
        public string GetULDDetails(string ULDNo, int UWSSNo)
        {
            try 
            {
            SqlParameter[] Parameters = { new SqlParameter("@ULDNo", ULDNo), new SqlParameter("@UWSSNo", UWSSNo) };
            DataSet ds = SqlHelper.ExecuteDataset(DMLConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, "spUWS_ULDDetails", Parameters);
            ds.Dispose();
            return CargoFlash.Cargo.Business.Common.CompleteDStoJSON(ds);
            }
            catch(Exception ex)//(Exception ex)
            {
                throw ex;
            }
        }
        public string GetULDOverhangData(Int64 ULDStockSNo, Int32 DailyFlightSNo)
        {
            try 
            {
            SqlParameter[] Parameters = { new SqlParameter("@ULDStockSNo", ULDStockSNo), new SqlParameter("@DailyFlightSNo", DailyFlightSNo) };
            DataSet ds = SqlHelper.ExecuteDataset(DMLConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, "spUWS_ULDOverhang", Parameters);
            ds.Dispose();
            return CargoFlash.Cargo.Business.Common.CompleteDStoJSON(ds);
            }
            catch(Exception ex)//(Exception ex)
            {
                throw ex;
            }
        }
        public string GetGridWaybillDetails(int UWSSNo, string EquipmentNo)
        {
            try 
            {
            SqlParameter[] Parameters = { new SqlParameter("@UWSSNo", UWSSNo), new SqlParameter("@EquipmentNo", EquipmentNo) };
            DataSet ds = SqlHelper.ExecuteDataset(DMLConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, "spUWS_GridWaybillDetails", Parameters);
            ds.Dispose();
            return CargoFlash.Cargo.Business.Common.CompleteDStoJSON(ds);
            }
            catch(Exception ex)//(Exception ex)
            {
                throw ex;
            }
        }
        public string GetWaybillDetails(int EquipmentSNo, int UWSSNo)
        {
            try 
            {
            SqlParameter[] Parameters = { new SqlParameter("@EquipmentSNo", EquipmentSNo), new SqlParameter("@UWSSNo", UWSSNo) };
            DataSet ds = SqlHelper.ExecuteDataset(DMLConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, "spUWS_WaybillDetails", Parameters);
            ds.Dispose();
            return CargoFlash.Cargo.Business.Common.CompleteDStoJSON(ds);
            }
            catch(Exception ex)//(Exception ex)
            {
                throw ex;
            }
        }
        public string GetUWSPrint(string FlightNo, string FlightDate, string EquipmentNo, string UserSNo)
        {
            try 
            {
            //UserSNo = (((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).UserSNo).ToString();
            SqlParameter[] Parameters = { new SqlParameter("@FlightNo", FlightNo), new SqlParameter("@FlightDate", FlightDate), new SqlParameter("@EquipmentNo", EquipmentNo), new SqlParameter("@UserSNo", UserSNo) };
            DataSet ds = SqlHelper.ExecuteDataset(ReadConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, "UWSPrintRecord", Parameters);
            return CargoFlash.Cargo.Business.Common.CompleteDStoJSON(ds);
            }
            catch(Exception ex)//(Exception ex)
            {
                throw ex;
            }
        }
        public string GetUWSULDPrint(int UWSSNo, string EquipmentNo, string UserSNo)
        {
            try 
            {
            //UserSNo = (((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).UserSNo).ToString();
            SqlParameter[] Parameters = { new SqlParameter("@UWSSNo", UWSSNo), new SqlParameter("@EquipmentNo", EquipmentNo), new SqlParameter("@UserSNo", UserSNo) };
            DataSet ds = SqlHelper.ExecuteDataset(ReadConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, "UWSULDPrintRecord", Parameters);
            return CargoFlash.Cargo.Business.Common.CompleteDStoJSON(ds);
            }
            catch(Exception ex)//(Exception ex)
            {
                throw ex;
            }
        }
        public string GetUWSEquipmentPrint(int UWSSNo, string EquipmentNo, bool IsULD, string UserSNo)
        {
            try 
            {
            SqlParameter[] Parameters = { new SqlParameter("@UWSSNo", UWSSNo), new SqlParameter("@EquipmentNo", EquipmentNo), new SqlParameter("@IsULD", IsULD), new SqlParameter("@UserSNo", UserSNo) };
            DataSet ds = SqlHelper.ExecuteDataset(ReadConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, "UWSEquipmentPrintRecord", Parameters);
            return CargoFlash.Cargo.Business.Common.CompleteDStoJSON(ds);
            }
            catch(Exception ex)//(Exception ex)
            {
                throw ex;
            }
        }
        public string GetUWSRemoveBulk(int UWSSNo, string EquipmentNo, string UserSNo)
        {
            try 
            {
            SqlParameter[] Parameters = { new SqlParameter("@UWSSNo", UWSSNo), new SqlParameter("@EquipmentNo", EquipmentNo), new SqlParameter("@UserSNo", UserSNo) };
            DataSet ds = SqlHelper.ExecuteDataset(ReadConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, "GetUWSRemoveBulk", Parameters);
            return CargoFlash.Cargo.Business.Common.CompleteDStoJSON(ds);
            }
            catch(Exception ex)//(Exception ex)
            {
                throw ex;
            }
        }
        public int SaveUWSPrintDetails(List<UWSPrintTableData> UWSModel)
        {
            try 
            {
            DataTable dt = CollectionHelper.ConvertTo(UWSModel, "");
            List<string> ErrorMessage = new List<string>();
            BaseBusiness baseBusiness = new BaseBusiness();
            SqlParameter[] Parameters = { new SqlParameter("@UWSPrintTrans", SqlDbType.Structured) { Value = dt } };
            int ret = (int)SqlHelper.ExecuteScalar(DMLConnectionString.WebConfigConnectionString, "spUWS_Update", Parameters);
            return ret;
            }
            catch(Exception ex)//(Exception ex)
            {
                throw ex;
            }
        }
        public string GetUnAssignFlightNReleaseEquipment(int UWSSNo, string EquipmentNo, string UserSNo)
        {
            try 
            {
            //UserSNo = (((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).UserSNo).ToString();
            SqlParameter[] Parameters = { new SqlParameter("@UWSSNo", UWSSNo), new SqlParameter("@EquipmentNo", EquipmentNo), new SqlParameter("@UserSNo", UserSNo) };
            DataSet ds = SqlHelper.ExecuteDataset(ReadConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, "GetUWSUnAssignFlightNReleaseEquipment", Parameters);
            return CargoFlash.Cargo.Business.Common.CompleteDStoJSON(ds);
            }
            catch(Exception ex)//(Exception ex)
            {
                throw ex;
            }
        }
        public string SaveUnAssignFlightNReleaseEquipment(List<UnAssignFlightNReleaseEquipment> Data, string OldEquipmentNo, int NewEquipmentSNo, int UWSSNo, int ShipmentType)
        {
            try 
            {
            string Result = "";
            DataSet ds = new DataSet();
            DataTable dt = CollectionHelper.ConvertTo(Data, "");
            List<string> ErrorMessage = new List<string>();
            BaseBusiness baseBusiness = new BaseBusiness();
            SqlParameter[] Parameters = { new SqlParameter("@SaveUnAssignFlightNReleaseEquipment", SqlDbType.Structured) { Value = dt }, new SqlParameter("@OldEquipmentNo", OldEquipmentNo), new SqlParameter("@NewEquipmentSNo", NewEquipmentSNo), new SqlParameter("@UWSSNo", UWSSNo), new SqlParameter("@ShipmentType", ShipmentType), new SqlParameter("@UpdatedBy", ((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).UserSNo.ToString()) };
            //string ret = (string)SqlHelper.ExecuteScalar(DMLConnectionString.WebConfigConnectionString, "SaveUnAssignFlightNReleaseEquipment", Parameters);
            ds = SqlHelper.ExecuteDataset(DMLConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, "SaveUnAssignFlightNReleaseEquipment", Parameters);
            Result = CargoFlash.Cargo.Business.Common.CompleteDStoJSON(ds);
            return Result;
            }
            catch(Exception ex)//(Exception ex)
            {
                throw ex;
            }
        }
        //added for Release Equipment Button by Anmol Sharma
        public string ReleaseEquipment(string EquipmentNo, int UWSSNo)
        {
            
            try 
            {

            DataSet ds = new DataSet();
            SqlParameter[] Parameters = { new SqlParameter("@UWSSNo", UWSSNo), new SqlParameter("@EquipmentNo", EquipmentNo), new SqlParameter("@UpdatedBy", ((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).UserSNo.ToString()) };//Add LoginCitySNo Here,and LoginAirport 
            DataSet ds1 = new DataSet();
            try
            {
                ds = SqlHelper.ExecuteDataset(DMLConnectionString.WebConfigConnectionString, "spUWS_ReleseEquipment", Parameters);
                return ds.Tables[ds.Tables.Count - 1].Rows[0][0].ToString();
            }
            catch(Exception ex)// (Exception ex)
            {
                return ex.Message;
            }
            }
            catch(Exception ex)//
            {
                throw ex;
            }
        }
        //end

        public string SaveChangeEquipment(int UWSSNo, string EquipmentNo, int NewEquipmentSNo, string UserSNo)
        {
            //UserSNo = (((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).UserSNo).ToString();
            SqlParameter[] Parameters = { new SqlParameter("@UWSSNo", UWSSNo), new SqlParameter("@EquipmentNo", EquipmentNo), new SqlParameter("@NewEquipmentSNo", NewEquipmentSNo), new SqlParameter("@UserSNo", UserSNo) };
            DataSet ds = SqlHelper.ExecuteDataset(ReadConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, "SaveChangeEquipment", Parameters);
            return ds.Tables[ds.Tables.Count - 1].Rows[0][0].ToString();
        }
        

        public string CheckEquipmentNoOFLD_Status(int UWSSNo, string EquipmentNumber)
        {
            //UserSNo = (((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).UserSNo).ToString();
            SqlParameter[] Parameters = { new SqlParameter("@UWSSNo", UWSSNo), new SqlParameter("@EquipmentNumber", EquipmentNumber) };
            DataSet ds = SqlHelper.ExecuteDataset(ReadConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, "spCheckEquipmentNoOFLD_Status", Parameters);
            return ds.Tables[ds.Tables.Count - 1].Rows[0][0].ToString();
        }
        public string OffloadCart(int UWSSNo, string EquipmentNumber)
        {
            //UserSNo = (((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).UserSNo).ToString();
            SqlParameter[] Parameters = { new SqlParameter("@UWSSNo", UWSSNo), new SqlParameter("@EquipmentNumber", EquipmentNumber),
            new SqlParameter("@UpdatedBy", ((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).UserSNo.ToString()),
            new SqlParameter("@LoginAirportSNo", ((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).AirportSNo.ToString())};
            DataSet ds = SqlHelper.ExecuteDataset(ReadConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, "spUWS_OffloadCart", Parameters);
            return ds.Tables[ds.Tables.Count - 1].Rows[0][0].ToString();
        }
    }
}
