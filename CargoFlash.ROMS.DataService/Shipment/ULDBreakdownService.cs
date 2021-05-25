using System;
using System.Collections.Generic;
using System.Linq;
using System.Runtime.Serialization;
using System.ServiceModel;
using System.Text;
using System.ServiceModel.Activation;
using System.ServiceModel.Web;
using System.Configuration;
using System.Data;
using System.Data.SqlClient;
using CargoFlash.Cargo.Model.Shipment;
using CargoFlash.SoftwareFactory.Data;
using CargoFlash.Cargo.Business;
using Newtonsoft.Json;
using CargoFlash.SoftwareFactory.WebUI.Controls;
using System.IO;
using CargoFlash.SoftwareFactory.WebUI.Adapters;
using CargoFlash.SoftwareFactory.WebUI;
using System.Net;

namespace CargoFlash.Cargo.DataService.Shipment
{
    #region ULD Breakdown Service Description
    /*
	*****************************************************************************
	Service Name:	ULDBreakdownService      
	Purpose:		This Service used to get details of ULD save update Search and delete
	Company:		CargoFlash Infotech Pvt Ltd.
	Author:			Tarun Kumar
	Created On:		23 Oct 2015
    Updated By:    
	Updated On:	
	Approved By:    
	Approved On:	
	*****************************************************************************
	*/
    #endregion
    [GlobalErrorHandlerBehaviour(typeof(GlobalErrorHandler))]   [ServiceBehavior(IncludeExceptionDetailInFaults = true)]
    [AspNetCompatibilityRequirements(RequirementsMode = AspNetCompatibilityRequirementsMode.Allowed)]
    public class ULDBreakdownService : BaseWebUISecureObject, IULDBreakdownService
    {
        public KeyValuePair<string, List<ULDBreakdown>> GetULDBreakdownRecord(string recordID, int page, int pageSize, string whereCondition, string sort)
        {
            try
            {
                string DailyFlightSNo = whereCondition.Split('-')[0];
                string ULDNo ="";
                if (whereCondition.Split('-').Length > 4)
                {
                    ULDNo = (whereCondition.Split('-')[1].ToString() + '-' + whereCondition.Split('-')[2].ToString() + '-' + whereCondition.Split('-')[3].ToString());
                }
                else
                {
                    ULDNo = whereCondition.Split('-')[1];
                }
              
                whereCondition = "";

                ULDBreakdown ULDBreakdown = new ULDBreakdown();
                SqlParameter[] Parameters = { new SqlParameter("@DailyFlightSNo", DailyFlightSNo), new SqlParameter("@ULDNo", ULDNo), new SqlParameter("@PageNo", page), new SqlParameter("@PageSize", pageSize), new SqlParameter("@WhereCondition", whereCondition), new SqlParameter("@OrderBy", sort) };
                DataSet ds = SqlHelper.ExecuteDataset(DMLConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, "GetULDBreakdownRecord", Parameters);
                var ULDBreakdownList = ds.Tables[0].AsEnumerable().Select(e => new ULDBreakdown
                {
                    SNo = Convert.ToInt32(e["SNo"]),
                    AWBNo = Convert.ToString(e["AWBNo"].ToString()),
                    TotalandPlannedPcs = Convert.ToString(e["Piece"].ToString() + '/' + e["PlannedPieces"].ToString()),
                    TotalandPlannedGrwt = Convert.ToString(e["GrossWeight"].ToString() + '/' + e["PlannedGrossWeight"].ToString()),
                    TotalandPlannedVolwt = Convert.ToString(e["VolumeWeight"].ToString() + '/' + e["PlannedVolumeWeight"].ToString()),
                    Origin = Convert.ToString(e["OriginCity"].ToString()),
                    Destination = Convert.ToString(e["DestinationCity"].ToString()),
                    MainULDNo = ULDNo,
                    DailFlightSNo = DailyFlightSNo,
                    WHLocation = "",
                    HdnWHLocation = "",
                    RequestedBy = "",
                    HdnRequestedBy = "",
                    BilledTo = "",
                    HdnBilledTo = "",
                    Remove = "Remove"
                });
                return new KeyValuePair<string, List<ULDBreakdown>>(ds.Tables[1].Rows[0][0].ToString(), ULDBreakdownList.AsQueryable().ToList());
            }
            catch(Exception ex)//(Exception ex)
            {
                throw ex;
            }
        }

        public KeyValuePair<string, List<ULDBreakdown>> GetULDBreakdownTransitRecord(string recordID, int page, int pageSize, string whereCondition, string sort)
        {
            try
            {
                page = 1;
                string DailyFlightSNo = whereCondition.Split('-')[0];
                string ULDNo = whereCondition.Split('-')[1];
                whereCondition = "";

                ULDBreakdown ULDBreakdown = new ULDBreakdown();
                SqlParameter[] Parameters = { new SqlParameter("@DailyFlightSNo", DailyFlightSNo), new SqlParameter("@ULDNo", ULDNo), new SqlParameter("@PageNo", page), new SqlParameter("@PageSize", pageSize), new SqlParameter("@WhereCondition", whereCondition), new SqlParameter("@OrderBy", sort) };
                DataSet ds = SqlHelper.ExecuteDataset(DMLConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, "GetULDBreakdownTransitRecord", Parameters);
                var ULDBreakdownList = ds.Tables[0].AsEnumerable().Select(e => new ULDBreakdown
                {
                    SNo = Convert.ToInt32(e["SNo"]),
                    AWBNo = Convert.ToString(e["AWBNo"].ToString()),
                    TotalandPlannedPcs = Convert.ToString(e["Piece"].ToString() + '/' + e["PlannedPieces"].ToString()),
                    TotalandPlannedGrwt = Convert.ToString(e["GrossWeight"].ToString() + '/' + e["PlannedGrossWeight"].ToString()),
                    TotalandPlannedVolwt = Convert.ToString(e["VolumeWeight"].ToString() + '/' + e["PlannedVolumeWeight"].ToString()),
                    Origin = Convert.ToString(e["OriginCity"].ToString()),
                    Destination = Convert.ToString(e["DestinationCity"].ToString()),
                    MainULDNo = ULDNo,
                    DailFlightSNo = DailyFlightSNo,
                    WHLocation = "",
                    HdnWHLocation = "",
                    RequestedBy = "",
                    HdnRequestedBy = "",
                    BilledTo = "",
                    HdnBilledTo = "",
                    Remove = "Remove"
                });
                return new KeyValuePair<string, List<ULDBreakdown>>(ds.Tables[1].Rows[0][0].ToString(), ULDBreakdownList.AsQueryable().ToList());
            }
            catch(Exception ex)//(Exception ex)
            {
                throw ex;
            }
        }

        public string CreateULDBreakdownTable(Int32 DailyFlightSNo, String ULDNo, int Type)
        {
            try
            {
                if (Type == 0)
                {
                    if (ULDNo.Split('-').Length > 3)
                    {
                        ULDNo = (ULDNo.Split('-')[0].ToString()+'-'+ ULDNo.Split('-')[1].ToString()+'-'+ ULDNo.Split('-')[2].ToString());
                    }
                    else
                    {
                        ULDNo = ULDNo.Split('-')[0];
                    }
                }
                SqlParameter[] Parameters = { new SqlParameter("@DailyFlightSNo", DailyFlightSNo), new SqlParameter("@ULDNo", ULDNo), new SqlParameter("@Type", Type) };
                DataSet ds = new DataSet();
                ds = SqlHelper.ExecuteDataset(DMLConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, "GetRecordULDBreakdowntable", Parameters);
                ds.Dispose();
                return CompleteDStoJSON(ds);
            }
            catch(Exception ex)//(Exception ex)
            {
                throw ex;
            }
        }

        public string GetULDBreakdownTransitRecordMixtoCleanLoad(Int32 DailyFlightSNo, String ULDNo)
        {
            try
            {
                SqlParameter[] Parameters = { new SqlParameter("@DailyFlightSNo", DailyFlightSNo), new SqlParameter("@ULDNo", ULDNo) };
                DataSet ds = new DataSet();
                ds = SqlHelper.ExecuteDataset(DMLConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, "GetULDBreakdownTransitRecordMixtoCleanLoad", Parameters);
                ds.Dispose();
                //return Common.DStoJSON(ds);
                return CompleteDStoJSON(ds);
            }
            catch(Exception ex)//(Exception ex)
            {
                throw ex;
            }
        }

        public static string CompleteDStoJSON(DataSet ds)
        {
            try
            {
                StringBuilder json = new StringBuilder();
                if (ds != null && ds.Tables.Count > 0)
                {
                    json.Append("{");
                    for (int tblCount = 0; tblCount < ds.Tables.Count; tblCount++)
                    {
                        if (tblCount > 0)
                            json.Append(",");
                        json.Append("\"Table" + tblCount.ToString() + "\":");
                        int lInteger = 0;
                        json.Append("[");
                        foreach (DataRow dr in ds.Tables[tblCount].Rows)
                        {
                            lInteger = lInteger + 1;
                            json.Append("{");
                            int i = 0;
                            int colcount = dr.Table.Columns.Count;
                            foreach (DataColumn dc in dr.Table.Columns)
                            {
                                json.Append("\"");
                                json.Append(dc.ColumnName);
                                json.Append("\":\"");
                                json.Append(dr[dc].ToString() == "" ? "" : dr[dc].ToString().Trim());
                                json.Append("\"");
                                i++;
                                if (i < colcount) json.Append(",");
                            }

                            if (lInteger < ds.Tables[tblCount].Rows.Count)
                            {
                                json.Append("},");
                            }
                            else
                            {
                                json.Append("}");
                            }
                        }
                        json.Append("]");
                    }
                    json.Append("}");
                }
                else
                {
                    json.Append("[");
                    json.Append("]");
                }


                return json.ToString();
            }
            catch(Exception ex)//(Exception ex)
            {
                throw ex;
            }
        }

        public string UpdateULDBreakdown(Int32 Action, Int32 DailFlightSNo, String MainULDNo, String TransferULDNo, string TransferDailFlightSNo, string ULDLocation, string ULDLocationSNo, string RequestedBy, string BilledTo, string Reason, string Remark, string createdBy, string DivData)
        {
            try
            {
                string mainULD = "";
                if (MainULDNo.Split('-').Length > 3)
                {
                    mainULD = (MainULDNo.Split('-')[0].ToString() + '-' + MainULDNo.Split('-')[1].ToString() + '-' + MainULDNo.Split('-')[2].ToString());
                }
                else
                {
                    mainULD = MainULDNo.Split('-')[0];
                }

                DataSet ds = new DataSet();
                // convert JSON string into datatable
                var dtULDBreakdown = JsonConvert.DeserializeObject<DataTable>(CargoFlash.Cargo.Business.Common.Base64ToString(DivData));
                SqlParameter[] Parameters = { 
                new SqlParameter("@ULDBreakdown",dtULDBreakdown),
                new SqlParameter("@Action", Action),
                new SqlParameter("@DailFlightSNo", DailFlightSNo),
                new SqlParameter("@MainULDNo", mainULD.ToString()),
                new SqlParameter("@TransferULDNo", TransferULDNo),
                new SqlParameter("@TransferDailFlightSNo", TransferDailFlightSNo),
                new SqlParameter("@ULDLocation", ULDLocation),
                new SqlParameter("@ULDLocationSNo", ULDLocationSNo), 
                new SqlParameter("@RequestedBy", RequestedBy),
                new SqlParameter("@BilledTo", BilledTo),
                new SqlParameter("@Reason", Reason),
                new SqlParameter("@Remark", Remark),
                new SqlParameter("@createdBy", createdBy),
                new SqlParameter("@AirportSNo", ((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).AirportSNo.ToString()),
                };
                ds = SqlHelper.ExecuteDataset(DMLConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, "UpdateULDBreakdown", Parameters);
                //Finish:
                ds.Dispose();
                return CompleteDStoJSON(ds);
            }
            catch(Exception ex)//(Exception ex)
            {
                throw ex;
            }
        }

        public Stream GetWebForm(string processName, string moduleName, string appName, string formAction, string IsSubModule)
        {
            return BuildWebForm(processName, moduleName, appName, formAction, "", (IsSubModule == "1"));
        }

        private Stream BuildWebForm(string processName, string moduleName, string appName, string formAction, string recordID = "", bool IsSubModule = true, string FlightNo = "", string FlightDate = "", string LoggedInCity = "", string Origin = "", string Destination = "", string AWBNo = "", string DailyFlightSNo = "")
        {
            try
            {
                this.DisplayMode = "FORMACTION." + formAction.ToUpper().Trim();
                StringBuilder myCurrentForm = new StringBuilder();
                switch (this.DisplayMode)
                {
                    case DisplayModeNew:
                        if (processName.ToUpper() == "ULDDETAILS")
                        {
                            using (HtmlFormGenerator htmlFormAdapter = new HtmlFormGenerator(processName))
                            {
                                htmlFormAdapter.DisplayMode = DisplayModeType.New;
                                myCurrentForm.Append(htmlFormAdapter.InstantiateIn(moduleName, appName, formAction, IsSubModule: IsSubModule));
                                myCurrentForm.Append("<input type='button' class='btn btn-block btn-success btn-sm' name='btnPrintULD' id='btnPrintULD' style='width:120px;' value='Print ULD Tag'>");
                                myCurrentForm.Append("<button class='btn btn-block btn-success btn-sm'  id='btnSaveULD' onclick='SaveBuildUpPlan();'>Save</button>");
                            }
                        }
                        else if (processName.ToUpper() == "FLIGHTDETAILS")
                        {
                            using (HtmlFormGenerator htmlFormAdapter = new HtmlFormGenerator(processName))
                            {
                                htmlFormAdapter.DisplayMode = DisplayModeType.New;
                                myCurrentForm.Append("<table class='WebFormTable'><tr><td style='width:100%;vertical-align:top;'><div id='divFlightSection' style='width:100%;vertical-align:top;'>");
                                myCurrentForm.Append(htmlFormAdapter.InstantiateIn(moduleName, appName, formAction, IsSubModule: IsSubModule));

                                myCurrentForm.Append("</div></td></tr>");
                            }
                            //myCurrentForm.Append("<td style='width:45%;vertical-align:top;' rowspan='2'><div id='divNonUldShipmentSection' style='width:100%;vertical-align:top;'></div><div id='divLyingListSearchSection' style='width:100%;vertical-align:top;'></div><div id='divLyingListSection'></div></td></tr>");
                            myCurrentForm.Append("<tr><td style='width:100%;vertical-align:top;'><div id='divAddUldShipmentSection'></div></td></tr>");
                            myCurrentForm.Append("</table>");
                        }
                        else
                        {
                            using (HtmlFormGenerator htmlFormAdapter = new HtmlFormGenerator(processName))
                            {
                                htmlFormAdapter.DisplayMode = DisplayModeType.New;
                                myCurrentForm.Append("<table class='WebFormTable'><tr><td style='width:50%;vertical-align:top;'><table class='WebFormTable'><tr><td  style='vertical-align:top;' colspan='2'><div id='divAddUldSection' style='width:100%;vertical-align:top;'>");
                                myCurrentForm.Append(htmlFormAdapter.InstantiateIn(moduleName, appName, formAction, IsSubModule: IsSubModule));
                                myCurrentForm.Append("</div></td></tr>");
                                myCurrentForm.Append("<tr><td style='width:90%;vertical-align:top;'><div id='divUldShipmentSection'></div></td><td style='width:10%;vertical-align:middle;'><div id='divShipmentMoveSection' style='width:50%;vertical-align:top;float:right;'>");
                                myCurrentForm.Append("<span class='rightmovableme' data-action='fromuldmove' style='position:relative;'>");
                                myCurrentForm.Append("<i class='fa fa-arrow-circle-right hit'></i></span>");
                                myCurrentForm.Append("<span class='leftmovableme' data-action='touldmove' style='position:relative;'>");
                                myCurrentForm.Append("<i class='fa fa-arrow-circle-left hit'></i></span>");
                                myCurrentForm.Append("</div></td></tr></table></td>");
                            }
                            myCurrentForm.Append("<td style='width:50%;vertical-align:top;' rowspan='2'><div id='ApplicationTabs'><ul><li class='k-state-active'>Build Up</li><li>Lying List</li></ul><div id='divBuildUpPlan' style='width:95%;vertical-align:top;'><div id='divNonUldShipmentSection' style='width:98%;vertical-align:top;'></div></div><div id='divLyingList' style='width:95%;vertical-align:top;'><div id='divLyingListSearchSection' style='width:98%;vertical-align:top;'></div><div id='divLyingListSection' style='width:98%;vertical-align:top;'></div></div></div></td></tr>");
                            myCurrentForm.Append("</table>");
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
                            case "BUILDUP":
                                if (appName.ToUpper().Trim() == "SEARCHLYINGLIST")
                                    CreateLyingListGrid(myCurrentForm, FlightNo, FlightDate, Origin, Destination, AWBNo);
                                //else if (appName.ToUpper().Trim() == "SEARCHBUILDUPULD")
                                //    CreateBuildupULDGrid(myCurrentForm, DailyFlightSNo);
                                //else if (appName.ToUpper().Trim() == "SEARCHBUILDUP")
                                //    CreateBuildupGrid(myCurrentForm, DailyFlightSNo);
                                //else if (appName.ToUpper().Trim() == "OFFLOADFROMPROCESS")
                                //    CreateProcessOffloadListGrid(myCurrentForm);
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

        private void CreateLyingListGrid(StringBuilder Container, string FlightNo = "", string FlightDate = "", string Origin = "", string Destination = "", string AWBNo = "")
        {
            try
            {
                using (Grid g = new Grid())
                {
                    g.Height = 300;
                    g.IsAutoHeight = false;
                    g.PageName = this.MyPageName;
                    g.PrimaryID = "SNo";
                    g.ModuleName = this.MyModuleID;
                    g.AppsName = this.MyAppID;
                    //     g.IsDisplayOnly = true;
                    g.IsActionRequired = false;
                    g.DefaultPageSize = 50;
                    g.IsAllowCopy = false;
                    g.DataSoruceUrl = "Services/Shipment/ULDBreakdownService.svc/GetLyingListGridData1";
                    g.NewURL = MyPageName + "?" + GetWebURLString("New", false);
                    g.ServiceModuleName = this.MyModuleID;
                    g.UserID = this.MyUserID;
                    g.FormCaptionText = "Lying List Shipment";
                    g.IsPageable = true;
                    g.IsAllowedPaging = true;
                    g.IsProcessPart = true;
                    g.IsRowChange = false;
                    g.IsRowDataBound = false;
                    g.IsPageSizeChange = false;
                    g.IsPager = false;
                    g.IsOnlyTotalDisplay = true;
                    g.ProcessName = "LyingList";
                    g.SuccessOnBlank = "AttachLyingListShipment";
                    g.IsSortable = true;
                    g.IsAllowedFiltering = true;

                    g.Column = new List<GridColumn>();
                    g.Column.Add(new GridColumn { Field = "AWBSNo", Title = "SNo", IsHidden = true, DataType = GridDataType.Number.ToString() });
                    g.Column.Add(new GridColumn { Field = "AWBSNo", Template = "<input type=\"checkbox\" id=\"chkSelect\" /> ", Title = "Action", Sortable = "false", DataType = GridDataType.String.ToString(), Width = 25 });

                    g.Column.Add(new GridColumn { Field = "AWBNo", Title = "AWB No", DataType = GridDataType.String.ToString(), Width = 60 });
                    g.Column.Add(new GridColumn { Field = "LIPieces", Title = "Pieces", DataType = GridDataType.String.ToString(), IsHidden = true });
                    g.Column.Add(new GridColumn { Field = "Pieces", Title = "Pieces", FixTooltip = "Available / Total", DataType = GridDataType.String.ToString(), Width = 50 });
                    g.Column.Add(new GridColumn { Field = "GrossWeight", Title = "Gross Weight", IsHidden = true, DataType = GridDataType.String.ToString() });
                    g.Column.Add(new GridColumn { Field = "VolumeWeight", Title = "Volume Weight", IsHidden = true, DataType = GridDataType.String.ToString() });
                    g.Column.Add(new GridColumn { Field = "WeightDetail", Title = "Wt. Detail", FixTooltip = "Gross / Volume", DataType = GridDataType.String.ToString(), Width = 80 });

                    g.Column.Add(new GridColumn { Field = "LoadDetail", Template = "<input type=\"text\" value=\"#=LoadPieces#\" id=\"txtLPcs\" onblur=\"CalculateLyingValues(this);\" style=\"width:30px\"  readonly=\"readonly\"/>/<input type=\"text\" value=\"#=LoadGrossWeight#\" id=\"txtLGross\" onblur=\"CheckLyingGrossValues(this);\"  style=\"width:50px\" readonly=\"readonly\"/>/<input type=\"text\" value=\"#=LoadVol#\" id=\"txtLVol\" onblur=\"CheckLyingVolValues(this);\"  style=\"width:50px\"  readonly=\"readonly\"/> ", Title = "Load Detail", DataType = GridDataType.Number.ToString(), Width = 110 });
                    g.Column.Add(new GridColumn { Field = "LoadPieces", Title = "Load Pcs", IsHidden = true, DataType = GridDataType.Number.ToString() });
                    g.Column.Add(new GridColumn { Field = "LoadGrossWeight", Title = "Load Gr. Wt", IsHidden = true, DataType = GridDataType.Number.ToString() });
                    g.Column.Add(new GridColumn { Field = "LoadVol", Title = "Load Vol. Wt", IsHidden = true, DataType = GridDataType.Number.ToString() });
                    g.Column.Add(new GridColumn { Field = "SPHC", Title = "SPHC", Tooltip = "SPHC", DataType = GridDataType.String.ToString(), Width = 30 });
                    g.Column.Add(new GridColumn { Field = "ShipmentDetail", Title = "Shipment Info", FixTooltip = "[Origin]-[Destination]/[Flight No]/[Flight Date(dd-mm)]", DataType = GridDataType.String.ToString(), Width = 93 });
                    g.Column.Add(new GridColumn { Field = "FromTable", Title = "From", DataType = GridDataType.String.ToString(), IsHidden = true, Width = 50 });
                    g.Column.Add(new GridColumn { Field = "FromTableSNo", Title = "From", DataType = GridDataType.String.ToString(), IsHidden = true, Width = 50 });
                    g.Column.Add(new GridColumn { Field = "AWBPieces", Title = "AWBPieces", DataType = GridDataType.String.ToString(), IsHidden = true });
                    g.Column.Add(new GridColumn { Field = "AWBGrossWeight", Title = "AWB Gross Weight", DataType = GridDataType.String.ToString(), IsHidden = true });
                    g.Column.Add(new GridColumn { Field = "AWBVolumeWeight", Title = "AWB Volume Weight", DataType = GridDataType.String.ToString(), IsHidden = true });

                    g.ExtraParam = new List<GridExtraParam>();
                    g.ExtraParam.Add(new GridExtraParam { Field = "FlightNo", Value = FlightNo });
                    g.ExtraParam.Add(new GridExtraParam { Field = "FlightDate", Value = FlightDate });
                    g.ExtraParam.Add(new GridExtraParam { Field = "Origin", Value = Origin });
                    g.ExtraParam.Add(new GridExtraParam { Field = "Destination", Value = Destination });
                    g.ExtraParam.Add(new GridExtraParam { Field = "AWBNo", Value = AWBNo });
                    g.InstantiateIn(Container);
                }
            }
            catch(Exception ex)//(Exception ex)
            {
                throw ex;
            }
           
        }

        public Stream GetLyingListGridData(string processName, string moduleName, string appName, string Origin, string Destination, string FlightNo, string FlightDate, string AWBNo)
        {
            return BuildWebForm(processName, moduleName, appName, "IndexView", FlightNo: FlightNo, FlightDate: FlightDate, Origin: Origin, Destination: Destination, AWBNo: AWBNo);
        }

        public DataSourceResult GetLyingListGridData1(String FlightNo, string FlightDate, string Origin, string Destination, string AWBNo, int skip, int take, int page, int pageSize, List<SoftwareFactory.Data.GridSort> sort, SoftwareFactory.Data.GridFilter filter)
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

                ProcName = "GetLyingListBuildUpGridDataULD";

                string filters = GridFilter.ProcessFilters<LyingBuildup>(filter);

                SqlParameter[] Parameters = { new SqlParameter("@PageNo", page), new SqlParameter("@PageSize", pageSize), new SqlParameter("@WhereCondition", filters), new SqlParameter("@OrderBy", sorts), new SqlParameter("@FlightNo", FlightNo), new SqlParameter("@FlightDate", FlightDate), new SqlParameter("@Origin", Origin), new SqlParameter("@Destination", Destination), new SqlParameter("@AWBNo", AWBNo) };

                ds = SqlHelper.ExecuteDataset(DMLConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, ProcName, Parameters);

                var wmsBuildupList = ds.Tables[0].AsEnumerable().Select(e => new LyingBuildup
                {
                    SNo = Convert.ToInt32(e["SNo"]),
                    AWBSNo = Convert.ToInt32(e["AWBSNo"]),
                    AWBNo = e["AWBNo"].ToString(),
                    FlightNo = e["FlightNo"].ToString(),
                    FlightDate = e["FlightDate"].ToString() == "" ? "" : Convert.ToDateTime(e["FlightDate"].ToString()).ToString(DateFormat.DateFormatString),
                    OriginCity = e["OriginCity"].ToString(),
                    Pieces = e["Pieces"].ToString(),
                    GrossWeight = e["GrossWeight"].ToString(),
                    VolumeWeight = e["VolumeWeight"].ToString(),
                    LoadPieces = Convert.ToInt32(e["LoadPieces"]),
                    LoadGrossWeight = Convert.ToDecimal(e["LoadGrossWeight"]),
                    LoadVol = Convert.ToDecimal(e["LoadVol"]),
                    SPHC = e["SPHC"].ToString(),
                    Plan = e["Plan"].ToString(),
                    LIPieces = Convert.ToInt32(e["LIPieces"]),
                    FromTable = Convert.ToInt32(e["FromTable"]),
                    FromTableSNo = Convert.ToInt32(e["FromTableSNo"]),
                    ShipmentOrigin = e["ShipmentOrigin"].ToString(),
                    ShipmentDestination = e["ShipmentDestination"].ToString(),
                    ShipmentDetail = e["ShipmentOrigin"].ToString() + "-" + e["ShipmentDestination"].ToString() + "/" + e["FlightNo"].ToString() + "/" + (e["FlightDate"].ToString() == "" ? "" : Convert.ToDateTime(e["FlightDate"].ToString()).ToString("dd-MM")),
                    WeightDetail = e["TotalGrWt"].ToString() + "/" + e["TotalVolWt"].ToString(),
                    LoadDetail = "",
                    AWBPieces = e["TotalPieces"].ToString(),
                    AWBGrossWeight = e["TotalGrWt"].ToString(),
                    AWBVolumeWeight = e["TotalVolWt"].ToString(),

                });
                //DateTime.ParseExact(e["BookingDate"].ToString(), "yyyy-MM-dd",                                       System.Globalization.CultureInfo.InvariantCulture)
                ds.Dispose();
                return new DataSourceResult
                {
                    Data = wmsBuildupList.AsQueryable().ToList(),
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

        public string ADDTransitReBuildData(List<ULDBreakdownArray> ULDBreakdown, Int32 DailyFlightSNo, string ULDNo, Int32 UpdatedBy)
        {

            DataTable dtULDBreakdownArray = CollectionHelper.ConvertTo(ULDBreakdown, "");

            BaseBusiness baseBusiness = new BaseBusiness();

            SqlParameter paramULDBreakdownArray = new SqlParameter();
            paramULDBreakdownArray.ParameterName = "@ULDBreakdownArray";
            paramULDBreakdownArray.SqlDbType = System.Data.SqlDbType.Structured;
            paramULDBreakdownArray.Value = dtULDBreakdownArray;

            DataSet ds = new DataSet();
            SqlParameter[] Parameters = { paramULDBreakdownArray, new SqlParameter("@DailyFlightSNo", DailyFlightSNo), new SqlParameter("@ULDNo", ULDNo), new SqlParameter("@UpdatedBy", ((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).UserSNo.ToString()) };
            DataSet ds1 = new DataSet();
            try
            {
                ds = SqlHelper.ExecuteDataset(DMLConnectionString.WebConfigConnectionString, "ADDTransitReBuildData", Parameters);
                return ds.Tables[ds.Tables.Count - 1].Rows[0][0].ToString();
            }
            catch(Exception ex)//(Exception ex)
            {
                throw ex;
            }
        }

        public string DeleteOffloadedCargo(Int32 OffloadedSNo, Int32 UpdatedBy)
        {
            BaseBusiness baseBusiness = new BaseBusiness();
            DataSet ds = new DataSet();
            SqlParameter[] Parameters = { new SqlParameter("@OffloadedSNo", OffloadedSNo), new SqlParameter("@UpdatedBy", ((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).UserSNo.ToString()) };
            DataSet ds1 = new DataSet();
            try
            {
                ds = SqlHelper.ExecuteDataset(DMLConnectionString.WebConfigConnectionString, "DeleteOffloadedCargo", Parameters);
                return ds.Tables[ds.Tables.Count - 1].Rows[0][0].ToString();
            }
            catch(Exception ex)//(Exception ex)
            {
                throw ex;
            }
        }

        public string SaveULDDetails(CargoFlash.Cargo.Model.BuildUp.ULDDetails ULDDetails, List<CargoFlash.Cargo.Model.BuildUp.ULDConsumables> ULDConsumables, Int32 ULDStockSNo, Int32 DailyFlightSNo, Int32 UpdatedBy, CargoFlash.Cargo.Model.BuildUp.ULDBuildUpOverhangPallet ULDBuildUpOverhangPallet, List<CargoFlash.Cargo.Model.BuildUp.ULDBuildUpOverhangTrans> ULDBuildUpOverhangTrans)
        {
            List<CargoFlash.Cargo.Model.BuildUp.ULDDetails> lstULDDetails = new List<CargoFlash.Cargo.Model.BuildUp.ULDDetails>();
            lstULDDetails.Add(ULDDetails);

            DataTable dtULDDetails = CollectionHelper.ConvertTo(lstULDDetails, "IsOverhangPallet,Location,Build,LoadCode,LoadIndicator,AbbrCode");
            DataTable dtULDConsumables = CollectionHelper.ConvertTo(ULDConsumables, "");


            List<CargoFlash.Cargo.Model.BuildUp.ULDBuildUpOverhangPallet> lstULDBuildUpOverhangPallet = new List<CargoFlash.Cargo.Model.BuildUp.ULDBuildUpOverhangPallet>();
            lstULDBuildUpOverhangPallet.Add(ULDBuildUpOverhangPallet);

            DataTable dtOverhangMaster = CollectionHelper.ConvertTo(lstULDBuildUpOverhangPallet, "");
            DataTable dtOverhangTrans = CollectionHelper.ConvertTo(ULDBuildUpOverhangTrans, "");

            BaseBusiness baseBusiness = new BaseBusiness();

            SqlParameter paramULDDetails = new SqlParameter();
            paramULDDetails.ParameterName = "@ULDDetails";
            paramULDDetails.SqlDbType = System.Data.SqlDbType.Structured;
            paramULDDetails.Value = dtULDDetails;

            SqlParameter paramULDConsumables = new SqlParameter();
            paramULDConsumables.ParameterName = "@ULDConsumables";
            paramULDConsumables.SqlDbType = System.Data.SqlDbType.Structured;
            paramULDConsumables.Value = dtULDConsumables;

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
                                            paramULDConsumables, 
                                            new SqlParameter("@ULDStockSNo", ULDStockSNo), 
                                            new SqlParameter("@DailyFlightSNo", DailyFlightSNo), 
                                            new SqlParameter("@UpdatedBy", UpdatedBy),
                                            paramOverhangMaster,
                                            paramOverhangTrans
                                        };
            DataSet ds1 = new DataSet();
            try
            {
                ds = SqlHelper.ExecuteDataset(DMLConnectionString.WebConfigConnectionString, "SaveULDDetails", Parameters);
                return ds.Tables[ds.Tables.Count - 1].Rows[0][0].ToString();
            }
            catch(Exception ex)//(Exception ex)
            {
                throw ex;
            }
        }
    }
}
