using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.ServiceModel;
using System.ServiceModel.Activation;
using System.Configuration;
using System.Data;
using System.Data.SqlClient;
using CargoFlash.Cargo.Model.Export;
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
using System.Net;
namespace CargoFlash.Cargo.DataService.Export
{
    
    [GlobalErrorHandlerBehaviour(typeof(GlobalErrorHandler))]   [ServiceBehavior(IncludeExceptionDetailInFaults = true)]
    [AspNetCompatibilityRequirements(RequirementsMode = AspNetCompatibilityRequirementsMode.Allowed)]
    public class RampOffloadService : BaseWebUISecureObject, IRampOffloadService
    {
        public Stream GetWebForm(string processName, string moduleName, string appName, string formAction, string IsSubModule)
        {
            try
            { 
            return BuildWebForm(processName, moduleName, appName, formAction, "", (IsSubModule == "1"));
            }
            catch(Exception ex)//
            {
                throw ex;
            }
        }

        public Stream GetFlightArrivalShipmentGrid(string processName, string moduleName, string appName,  string SearchFlightNo, string searchFromDate)
        {
            try
            { 
            return BuildWebForm(processName, moduleName, appName, "IndexView",  SearchFlightNo: SearchFlightNo, searchFromDate: searchFromDate);
            }
            catch(Exception ex)//
            {
                throw ex;
            }
        }

        private Stream BuildWebForm(string processName, string moduleName, string appName, string formAction, string recordID = "", bool IsSubModule = true,  string SearchFlightNo = "", string FlightDate = "", string searchFromDate = "", string searchToDate = "", string StartTime = "", string EndTime = "", string DailyFlightSNo = "0",  string ULDNo = "0", string SearchFFMRcvd = "0", string SearchQRT = "0", string SearchSHCDGR = "0", string SearchTransitFlight = "0", string SearchConnectingFlights = "0", string SearchFilterULDCounts = "0", string SearchFilterMCT = "0")
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
                        case "RampOffloadFlightArrival":
                            {
                                switch (appName)
                                {
                                    case "RampOffloadFlightArrivalShipment":
                                        CreateNestedFligthArrivalalLDGrid(myCurrentForm,  SearchFlightNo, searchFromDate, searchToDate);
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
            catch(Exception ex)//
            {
                throw ex;
            }
        }

        private void CreateNestedFligthArrivalalLDGrid(StringBuilder Container, string SearchFlightNo = "", string searchFromDate = "", string searchToDate = "", string DailyFlightSNo = "")
        {
            try
            { 
            using (NestedGrid g = new NestedGrid())
            {
                g.Height = 100;
                g.PrimaryID = this.MyPrimaryID;
                g.ModuleName = this.MyModuleID;
                g.AppsName = this.MyAppID;
                g.DefaultPageSize = 1000;
                g.DataSoruceUrl = "Services/Export/RampOffloadService.svc/GetManifestULDGridData";
                g.PrimaryID = "ULDStockSNo";
                g.NewURL = MyPageName + "?" + GetWebURLString("New", false);
                g.ModuleName = this.MyModuleID;
                g.FormCaptionText = "AWB Details";
                g.IsFormHeader = false;
                g.IsModule = true;
                g.IsAllowedSorting = false;
                g.IsAllowedScrolling = true;
                g.IsShowEdit = false;
                g.ParentSuccessGrid = "AddLocationDrp";
                g.IsSaveChanges = false;
                g.IsColumnMenu = false;
                g.IsAllowedFiltering = false;
                g.Column = new List<GridColumn>();

                g.Column.Add(new GridColumn { Field = "isSelect", Title = "Select", Template = "# if(ULDStockSNo!=0) {#<input type=\"checkbox\" id=\"chkbtnSelect_#=ULDStockSNo#\" onclick=\"CheckData(this);\" value=\"#=isSelect#\" />#}  #", DataType = GridDataType.String.ToString(), Width = 50 });
                //g.Column.Add(new GridColumn { Field = "IsCTM", Title = "CH", IsHidden = false, DataType = GridDataType.Boolean.ToString(), Template = "#if(IsCTM==true){#<input type=\"button\" value=\"C\" style=\"#=ChargeCSS#\" title=\"#=ChargesRemarks#\">#}#",Width=35, Filterable = "false" });
                g.Column.Add(new GridColumn { Field = "ULDStockSNo", Title = "ULD No", IsHidden = true, DataType = GridDataType.Number.ToString() });
                g.Column.Add(new GridColumn { Field = "ULDNo", Title = "ULD No", IsHidden = false, DataType = GridDataType.String.ToString() });
             //   g.Column.Add(new GridColumn { Field = "EmptyWeight", Title = "Tare Weight", IsHidden = false, DataType = GridDataType.String.ToString() });
                g.Column.Add(new GridColumn { Field = "GrossWeight", Title = "Max. Gross Weight", DataType = GridDataType.String.ToString() });
                g.Column.Add(new GridColumn { Field = "VolumeWeight", Title = "Max Volume Weight", DataType = GridDataType.String.ToString() });
                g.Column.Add(new GridColumn { Field = "Location", Title = "Location", FixTooltip = "Off Point", Template = "#if(ULDStockSNo!=0){#<select id=\"txtLocation\" class=\"k-dropdown-wrap k-state-default\" HideULDStockSNo=\"#=ULDStockSNo#\" onchange=\"GatLocationValue(this, #=ULDStockSNo#);\"></select><input type=\"hidden\" value=\"#=Location#\"/>#}else{#<input type=\"hidden\" value=\"#=Location#\"/>#}#", DataType = GridDataType.String.ToString(), Width = 175, Filterable = "false" });
                //g.Column.Add(new GridColumn { Field = "Location", Title = "Location", Template = " <select id=\"txtLocation\" HideAWBSNo=\"#=ULDStockSNo#\" onchange=\"GatLocationValue(this);\"></select><input type=\"hidden\" value=\"#=Location#\"/>", DataType = GridDataType.String.ToString(), Width = 80, Filterable = "false" });
                //    g.Column.Add(new GridColumn { Field = "MaxGrossWeight", Title = "Total Weight", DataType = GridDataType.Number.ToString() });
            //    g.Column.Add(new GridColumn { Field = "Shipments", Title = "Total Shipment", DataType = GridDataType.Number.ToString() });
                //  g.Column.Add(new GridColumn { Field = "Status", Title = "Status", IsHidden = false, DataType = GridDataType.String.ToString()});
              //  g.Column.Add(new GridColumn { Field = "IsDisabledULD", Title = "IsDisabledULD", IsHidden = true, DataType = GridDataType.Boolean.ToString() });
          //      g.Column.Add(new GridColumn { Field = "LastPoint", Title = "Off Point", FixTooltip = "Off Point", Template = "#if(ULDStockSNo!=0){# <input type=\"hidden\" name=\"offloadPoint_#=ULDStockSNo#\" id=\"offloadPoint_#=ULDStockSNo#\" value=\"#=LastPoint#\" /><input type=\"text\" class=\"\" name=\"Text_offloadPoint_#=ULDStockSNo#\"  id=\"Text_offloadPoint_#=ULDStockSNo#\"  tabindex=1002  controltype=\"autocomplete\"   maxlength=\"10\" data-width=\"65px\"  value=\"#=LastPoint#\" placeholder=\"City\" />#}else{#<input type=\"hidden\" name=\"offloadPoint_#=ULDStockSNo#\" id=\"offloadPoint_#=ULDStockSNo#\" value=\"#=LastPoint#\" /><input type=\"text\" class=\"\" name=\"Text_offloadPoint_#=ULDStockSNo#\"  id=\"Text_offloadPoint_#=ULDStockSNo#\"  tabindex=1002  controltype=\"autocomplete\"   maxlength=\"10\" data-width=\"65px\" style=\"height:25px;font-family: Verdana; font-size: 12px; position: relative; vertical-align: top; background-color: transparent; display:none; \" value=\"#=LastPoint#\" placeholder=\"City\" />#}#", DataType = GridDataType.String.ToString(), Width = 75 });
                //     g.Column.Add(new GridColumn { Field = "RFSRemarks", Title = "Remarks", Template = "#if(ULDStockSNo>0){if(RFSRemarks!=\"\"){#<input type=\"button\" value=\"R\" class=\"completeprocess\" onclick=fn_GetSetULDAWBRemarks(\"U\",#=ULDStockSNo#,this); /><input type=hidden id=\"hdnRFSRemarks\" value=\"#=RFSRemarks#\" >#}else{#<input type=\"button\" value=\"R\" onclick=fn_GetSetULDAWBRemarks(\"U\",#=ULDStockSNo#,this); /><input type=hidden id=\"hdnRFSRemarks\" value=\"#=RFSRemarks#\" >#}}else{##}#", DataType = GridDataType.String.ToString(), Width = 70 });
                g.Column.Add(new GridColumn { Field = "DailyFlightSNo", Title = "DailyFlightSNo", DataType = GridDataType.Number.ToString(), IsHidden = true });
                g.Column.Add(new GridColumn { Field = "FlightNo", Title = "FlightNo", DataType = GridDataType.String.ToString(), IsHidden = true });

                g.ExtraParam = new List<GridExtraParams>();
                g.ExtraParam.Add(new GridExtraParams { Field = "FlightNo", Value = SearchFlightNo });
                g.ExtraParam.Add(new GridExtraParams { Field = "FlightDate", Value = searchFromDate });
                g.ExtraParam.Add(new GridExtraParams { Field = "CurrentProcessSNo", Value = "484" });
                //#region Nested Grid Section

                g.NestedPrimaryID = "AWBSno";
                g.NestedModuleName = this.MyModuleID;
                g.NestedAppsName = this.MyAppID;
                g.NestedParentID = "ULDStockSNo";
                g.NestedIsShowEdit = false;
                g.NestedDefaultPageSize = 1000;
                g.NestedIsPageable = false;
                //  g.IsNestedAllowedFiltering = false;
                //  g.IsNestedAllowedFiltering = true;
                g.IsNestedAllowedSorting = false;
                g.SuccessGrid = "fn_HideBulkChild";
                //g.IsNestedAllowedFiltering = false;

                g.NestedDataSoruceUrl = "Services/Export/RampOffloadService.svc/GetMULDShipmentGridData";
                g.NestedColumn = new List<GridColumn>();

                g.NestedColumn.Add(new GridColumn { Field = "Bulk", Title = "", Template = "#if(IsBulk==1){#<input type=\"checkbox\"  id=\"chkbtnSelect1_#=AWBSNo#\" onclick=\"CheckDataChild(this);\"/><input type=\"hidden\" value=\"#=isHold#\" />#}else if(IsBulk==2){#<input type=\"checkbox\" checked=\"1\" id=\"chkBulk\" onclick=\"MarkSelected(this);\"/><input type=\"hidden\" value=\"#=isHold#\" />#} else{#<label></label>#}#", DataType = GridDataType.String.ToString(), Width = 50, Filterable = "false" });

                g.NestedColumn.Add(new GridColumn { Field = "AWBSNo", Title = "AWBSNo", DataType = GridDataType.String.ToString(), IsHidden = true });
                g.NestedColumn.Add(new GridColumn { Field = "AWBNo", Title = "AWB No", Template = "<sapn title=\"#= AWBNo #\">#= AWBNo #</span>", DataType = GridDataType.String.ToString(), Width = 70, Filterable = "false" });
                g.NestedColumn.Add(new GridColumn { Field = "AWBSector", Title = "AWB Sector", DataType = GridDataType.String.ToString(), Width = 70, Filterable = "false" });
                g.NestedColumn.Add(new GridColumn { Field = "TotalPieces", Title = "Total Pcs", DataType = GridDataType.String.ToString(), Width = 50, Filterable = "false" });
                g.NestedColumn.Add(new GridColumn { Field = "Act_G_V", Title = "Actual G/V", Template = "<sapn title=\"#= Act_G_V #\">#= Act_G_V #</span>", DataType = GridDataType.String.ToString(), Width = 110, Filterable = "false" });
                g.NestedColumn.Add(new GridColumn { Field = "PlannedPieces", Title = "Planned Pieces", Template = "#if(IsBulk!=0){#<input type=\"text\" id=\"txt_PlannedPieces_#=AWBSNo#\" value=\"#=PlannedPieces#\" style=\"width:50%;\" MaxLength=\"5\" onkeyup=\"fn_CalVolGrWt(this);\" onkeypress=\"return IsValidateNumber(this,event)\" onblur=\"fn_CalVolGrWt(this);\" /><input type=\"hidden\" id=\"hdnPlannedPieces\" value=\"#=PlannedPieces#\" />#}else{##=PlannedPieces##}#", DataType = GridDataType.Number.ToString(), Width = 70, Filterable = "false" });
                g.NestedColumn.Add(new GridColumn { Field = "Plan_G_V", Title = "Planned G/V", Template = "#{##=Plan_G_V##}#", DataType = GridDataType.String.ToString(), Width = 150, Filterable = "false" });
                g.NestedColumn.Add(new GridColumn { Field = "Status", Title = "Status", DataType = GridDataType.String.ToString(), Width = 50, Filterable = "false" });
                //g.NestedColumn.Add(new GridColumn { Field = "Location", Title = "Location", Template = " <select id=\"txtLocation\" HideAWBSNo=\"#=AWBSNo#\" HideULDStockSNo=\"#=ULDStockSNo#\" onchange=\"GatLocationValue(this, #=AWBSNo#);\"></select><input type=\"hidden\" value=\"#=Location#\"/>", DataType = GridDataType.String.ToString(), Width = 100, Filterable = "false" });
                g.NestedColumn.Add(new GridColumn { Field = "Location", Title = "Location", FixTooltip = "Off Point", Template = "#if(ULDStockSNo!=0){#<input type=\"hidden\" value=\"#=Location#\"/>#}else{#<select id=\"txtLocation\"  class=\"k-dropdown-wrap k-state-default\" HideAWBSNo=\"#=AWBSNo#\" HideULDStockSNo=\"#=ULDStockSNo#\" onchange=\"GatLocationValue(this, #=AWBSNo#);\"></select><input type=\"hidden\" value=\"#=Location#\"/>#}#", DataType = GridDataType.String.ToString(), Width = 75, Filterable = "false" });
                //   g.NestedColumn.Add(new GridColumn { Field = "SHC", Title = "SHC", Template = "<sapn title=\"#= SHCCodeName #\">#= SHC #</span>", DataType = GridDataType.String.ToString(), Width = 70, Filterable = "false" });
             //   g.NestedColumn.Add(new GridColumn { Field = "Agent", Title = "FRWDR(Agent)", DataType = GridDataType.String.ToString(), Width = 70, Filterable = "false" });
             //   g.NestedColumn.Add(new GridColumn { Field = "HOLDRemarks", Title = "HOLDRemarks", DataType = GridDataType.String.ToString(), IsHidden = true });
           //     g.NestedColumn.Add(new GridColumn { Field = "CTMSNo", Title = "CTMSNo", DataType = GridDataType.Number.ToString(), IsHidden = true });
             //   g.NestedColumn.Add(new GridColumn { Field = "Priority", Title = "Priority", DataType = GridDataType.String.ToString(), Width = 70, Filterable = "false" });
             //   g.NestedColumn.Add(new GridColumn { Field = "AWBOffPoint", Title = "Off Point", FixTooltip = "Off Point", Template = "#if(ULDStockSNo==0){# <input type=\"hidden\" name=\"AWBOffPoint_#=ULDStockSNo#_#=AWBSNo#\" id=\"AWBOffPoint_#=ULDStockSNo#_#=AWBSNo#\" value=\"#=AWBOffPoint#\" /><input type=\"text\" class=\"\" name=\"Text_AWBOffPoint_#=ULDStockSNo#_#=AWBSNo#\"  id=\"Text_AWBOffPoint_#=ULDStockSNo#_#=AWBSNo#\"  controltype=\"autocomplete\"   maxlength=\"10\" data-width=\"65px\" value=\"#=AWBOffPoint#\" placeholder=\"Off Point\" /> #}else{#<input type=\"hidden\" name=\"AWBOffPoint_#=ULDStockSNo#_#=AWBSNo#\" id=\"AWBOffPoint_#=ULDStockSNo#_#=AWBSNo#\" value=\"#=AWBOffPoint#\" /><input type=\"text\" class=\"\" name=\"Text_AWBOffPoint_#=ULDStockSNo#_#=AWBSNo#\"  id=\"Text_AWBOffPoint_#=ULDStockSNo#_#=AWBSNo#\"  controltype=\"autocomplete\"   maxlength=\"10\" data-width=\"65px\" value=\"#=AWBOffPoint#\" placeholder=\"Off Point\" style=\"display:none\" />#}#", DataType = GridDataType.String.ToString(), Width = 75, Filterable = "false" });
            //    g.NestedColumn.Add(new GridColumn { Field = "IsCTM", Title = "Charges", IsHidden = false, DataType = GridDataType.Boolean.ToString(), Template = "#if(IsCTM==true){#<input type=\"button\" value=\"C\" style=\"#=ChargeCSS#\" onclick=\"fn_GetCTMChargeDetails(#=AWBSNo#,#=CTMSNo#,this,1);\" title=\"#=ChargesRemarks#\">#}#", Width = 35, Filterable = "false" });
          //      g.NestedColumn.Add(new GridColumn { Field = "RFSRemarks", Title = "Remarks", Template = "#if(ULDStockSNo==0){ if(RFSRemarks!=\"\"){ #<input type=\"button\" value=\"R\" class=\"completeprocess\" onclick=fn_GetSetULDAWBRemarks(\"A\",#=AWBSNo#,this); /><input type=hidden id=\"hdnRFSRemarks\" value=\"#=RFSRemarks#\" > #}else{ #<input type=\"button\" value=\"R\" onclick=fn_GetSetULDAWBRemarks(\"A\",#=AWBSNo#,this); /><input type=hidden id=\"hdnRFSRemarks\" value=\"#=RFSRemarks#\" > #} }else{##}#", DataType = GridDataType.String.ToString(), Width = 35, Filterable = "false" });
                g.NestedColumn.Add(new GridColumn { Field = "TotalPPcs", Title = "TotalPPcs", DataType = GridDataType.String.ToString(), IsHidden = true });
                g.NestedColumn.Add(new GridColumn { Field = "ULDStockSNo", Title = "ULDStockSNo", DataType = GridDataType.String.ToString(), IsHidden = true });
            //    g.NestedColumn.Add(new GridColumn { Field = "PVW", Title = "PVW", DataType = GridDataType.String.ToString(), IsHidden = true });
          //      g.NestedColumn.Add(new GridColumn { Field = "PCCBM", Title = "PCCBM", DataType = GridDataType.String.ToString(), IsHidden = true });
         //       g.NestedColumn.Add(new GridColumn { Field = "IsPreManifested", Title = "IsPreManifested", DataType = GridDataType.Boolean.ToString(), IsHidden = true });
                g.NestedColumn.Add(new GridColumn { Field = "DailyFlightSNo", Title = "DailyFlightSNo", DataType = GridDataType.Number.ToString(), IsHidden = true });
                g.NestedColumn.Add(new GridColumn { Field = "FlightNo", Title = "FlightNo", DataType = GridDataType.String.ToString(), IsHidden = true });

                g.NestedExtraParam = new List<NestedGridExtraParam>();
                //g.NestedExtraParam.Add(new NestedGridExtraParam { Field = "DailyFlightSNo", Value = "DailyFlightSNo" });
                g.NestedExtraParam.Add(new NestedGridExtraParam { Field = "FlightNo", Value = SearchFlightNo });
                g.NestedExtraParam.Add(new NestedGridExtraParam { Field = "FlightDate", Value = searchFromDate });
                g.NestedExtraParam.Add(new NestedGridExtraParam { Field = "CurrentProcessSNo", Value = "484" });

                //g.NestedExtraParamParent = new List<NestedGridExtraParam>();
                //g.NestedExtraParamParent.Add(new NestedGridExtraParam { Field = "DailyFlightSNo", Value = searchFromDate });

                g.InstantiateIn(Container);

            }
            }
            catch(Exception ex)//
            {
                throw ex;
            }
        }



        public DataSourceResult GetManifestULDGridData(String FlightNo, String FlightDate, string CurrentProcessSNo, int skip, int take, int page, int pageSize, List<SoftwareFactory.Data.GridSort> sort, SoftwareFactory.Data.GridFilter filter)
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

            ProcName = "GetRampOffload";

            string filters = GridFilter.ProcessFilters<ManifestULD>(filter);


            SqlParameter[] Parameters = { new SqlParameter("@PageNo", page),
                new SqlParameter("@PageSize", pageSize),
                new SqlParameter("@WhereCondition", filters),
                new SqlParameter("@OrderBy", sorts),
                new SqlParameter("@FlightNo", FlightNo),
                new SqlParameter("@FlightDate", FlightDate),
                new SqlParameter("@LoggedAirport", ((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).AirportCode.ToString()),
                new SqlParameter("@CurrentProcessSNo", CurrentProcessSNo)
            };

            ds = SqlHelper.ExecuteDataset(DMLConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, ProcName, Parameters);

            var wmsManifestULDList = ds.Tables[0].AsEnumerable().Select(e => new ManifestULD
            {
                        ULDStockSNo = Convert.ToInt32(e["ULDStockSNo"]),
                Pieces = Convert.ToInt32(e["Pieces"]),
                    ULDNo = e["ULDNo"].ToString(),
                GrossWeight = Convert.ToString(e["GrossWeight"]),
                VolumeWeight = Convert.ToString(e["VolumeWeight"]),
                FlightNo = e["FlightNo"].ToString(),
                FlightDate = e["FlightDate"].ToString(),
                OriginCity = e["CityCode"].ToString(),
                DailyFlightSNo = Convert.ToInt32(e["DailyFlightSNo"]),            // Daily Flight Sno
                Status = e["Status"].ToString(),
                 isSelect = Convert.ToInt16(e["isSelect"]),
     


            });
            //DateTime.ParseExact(e["BookingDate"].ToString(), "yyyy-MM-dd",                                       System.Globalization.CultureInfo.InvariantCulture)
            ds.Dispose();
            return new DataSourceResult
            {
                Data = wmsManifestULDList.AsQueryable().ToList(),
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
        public DataSourceResult GetMULDShipmentGridData(String FlightNo, String FlightDate, string CurrentProcessSNo, int skip, int take, int page, int pageSize, List<SoftwareFactory.Data.GridSort> sort, SoftwareFactory.Data.GridFilter filter)
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

            ProcName = "GetMULDShipmentChild_RampOffload";

            string filters = GridFilter.ProcessFilters<ManifestShipment>(filter);
         SqlParameter[] Parameters = { 
                                         new SqlParameter("@PageNo", page), 
                                         new SqlParameter("@PageSize", pageSize), 
                                         new SqlParameter("@WhereCondition", filters), 
                                         new SqlParameter("@OrderBy", sorts), 
                                         new SqlParameter("@FlightNo", FlightNo), 
                                         new SqlParameter("@FlightDate", FlightDate), 
                                         new SqlParameter("@CurrentProcessSNo", CurrentProcessSNo) ,
                                         new SqlParameter("@LoggedAirport", ((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).AirportCode.ToString())
                                     };
            ds = SqlHelper.ExecuteDataset(DMLConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, ProcName, Parameters);

            var wmsManifestShipList = ds.Tables[0].AsEnumerable().Select(e => new ManifestShipment
            {
                     AWBSNo = Convert.ToInt64(e["AWBSNo"]),
                AWBNo = Convert.ToString(e["AWBNo"]),
                AWBSector = Convert.ToString(e["AWBSector"]),
                TotalPieces = Convert.ToDecimal(e["TotalPieces"]),
                PlannedPieces = Convert.ToInt64(e["PlannedPieces"]),
                 Act_G_V = e["Act_G_V"].ToString(),
                 Plan_G_V = e["Plan_G_V"].ToString(),
                       Status = e["Status"].ToString(),
                ULDStockSNo = Convert.ToInt32(e["ULDStockSNo"]),
                    DailyFlightSNo = Convert.ToInt64(e["DailyFlightSNo"]),
                PG = Convert.ToDecimal(e["PG"]),
                PV = Convert.ToDecimal(e["PV"]),
               PGW = Convert.ToDecimal(e["PGW"]),
               PVW = Convert.ToDecimal(e["PVW"]),
                IsBulk = Convert.ToInt16(e["IsBulk"]),
                     TotalPPcs = Convert.ToInt64(e["PlannedPieces"]),
                     Location = Convert.ToInt32(e["Location"]),
                  });
             ds.Dispose();
            return new DataSourceResult
            {
                Data = wmsManifestShipList.AsQueryable().ToList(),
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




        public string SaveOffloadData(List<RampOffloadData> RampOffloadData, List<RampOffloadDataDetail> RampOffloadDataDetail, string Reason)
        {
            try
            { 
            DataTable dtRampOffloadData = CollectionHelper.ConvertTo(RampOffloadData, "RampOffloadData");
            DataTable dtRampOffloadDataDetail = CollectionHelper.ConvertTo(RampOffloadDataDetail, "RampOffloadDataDetail");
           

            List<string> ErrorMessage = new List<string>();
            BaseBusiness baseBusiness = new BaseBusiness();
            //if (!baseBusiness.ValidateBaseBusiness("CTM", dtCreateCTM, "SAVE"))
            //{
            //    ErrorMessage = baseBusiness.ErrorMessage;
            //    return ErrorMessage;
            //}


            SqlParameter[] param = 
                                { 
                                   new SqlParameter("@dtRampOffloadData",dtRampOffloadData),
                                   new SqlParameter("@dtRampOffloadDataDetail",dtRampOffloadDataDetail),
                                   new SqlParameter("@Reason",Reason),
                                   new SqlParameter("@CreatedBy",((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).UserSNo.ToString()),
                                   new SqlParameter("@CurrentAirportSNo", ((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).AirportSNo.ToString())

                                };

            DataSet ds = SqlHelper.ExecuteDataset(ReadConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, "SaveOffloadData", param);
            ds.Dispose();
            string ret = ds.Tables[0].Rows[0][0].ToString();
            //string ret = (string)SqlHelper.ExecuteScalar(DMLConnectionString.WebConfigConnectionString, "CreateCTM", param).ToString();
            ErrorMessage.Add(ret);
            return ret;
            }
            catch(Exception ex)//
            {
                throw ex;
            }

        }
        public DataSourceResult GetOffloadedWHName()
        {
            try
            { 
            DataSet ds = new DataSet();
            SqlParameter[] Parameters = { 
                                            new SqlParameter("@AirportSNo", ((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).AirportSNo.ToString()), 
                                            new SqlParameter("@TerminalSno", ((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).TerminalSNo.ToString()), 
                                            new SqlParameter("@OperationType", 1) };

            ds = SqlHelper.ExecuteDataset(DMLConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, "GetOffloadedWHName", Parameters);
            var wmsULDTypeList = ds.Tables[0].AsEnumerable().Select(e => new WHLocation
            {
                SNo = Convert.ToInt64(e["SNo"]),
                LocationName = Convert.ToString(e["LocationName"])

            });
            ds.Dispose();
            return new DataSourceResult
            {
                Data = wmsULDTypeList.AsQueryable().ToList(),

            };

            }
            catch(Exception ex)//
            {
                throw ex;
            }
        }
    }
}
