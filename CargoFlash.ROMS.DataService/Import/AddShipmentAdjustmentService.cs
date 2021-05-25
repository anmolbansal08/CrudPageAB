using CargoFlash.Cargo.Model.Import;
using CargoFlash.SoftwareFactory.Data;
using CargoFlash.SoftwareFactory.WebUI;
using CargoFlash.SoftwareFactory.WebUI.Adapters;
using CargoFlash.SoftwareFactory.WebUI.Controls;
using System;
using System.Collections.Generic;
using System.Data;
using System.Data.SqlClient;
using System.IO;
using System.Linq;
using System.Runtime.Serialization;
using System.ServiceModel;
using System.ServiceModel.Activation;
using System.ServiceModel.Web;
using System.Text;
using Newtonsoft.Json;

namespace CargoFlash.Cargo.DataService.Import
{
    //[GlobalErrorHandlerBehaviour(typeof(GlobalErrorHandler))]
    //[ServiceBehavior(IncludeExceptionDetailInFaults = true)]
    [AspNetCompatibilityRequirements(RequirementsMode = AspNetCompatibilityRequirementsMode.Allowed)]
    public class AddShipmentAdjustmentService : BaseWebUISecureObject, IAddShipmentAdjustmentService
    {
        public Stream GetWebForm(string processName, string moduleName, string appName, string formAction, string IsSubModule)
        {
            try
            {
                return BuildWebForm(processName, moduleName, appName, formAction, "", (IsSubModule == "1"));
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }

        private Stream BuildWebForm(string processName, string moduleName, string appName, string formAction, string recordID = "", bool IsSubModule = true, string searchAWBSNo = "",string LoggedInCity = "")
        {
            LoggedInCity = (((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"]))).AirportCode;
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
                        case "ADDSHIPMENTADJUSTMENT":
                            if (appName.ToUpper().Trim() == "ADDSHIPMENTADJUSTMENT")
                                CreateGrid(myCurrentForm, processName, searchAWBSNo, LoggedInCity, isV2: true);
                            break;
                        default:
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

        public Stream GetGridData(AddShipmentAdjustmentSearch model)
        {
            return BuildWebForm(model.processName, model.moduleName, model.appName, model.Action, searchAWBSNo: model.searchAWBSNo);
        }

        private void CreateGrid(StringBuilder Container, string ProcessName, string searchAWBSNo, string LoggedInCity, bool isV2 = false)
        {
            using (Grid g = new Grid())
            {
                g.PageName = this.MyPageName;
                g.PrimaryID = this.MyPrimaryID;
                g.ModuleName = this.MyModuleID;
                g.AppsName = this.MyAppID;
                g.DataSoruceUrl = "Services/Import/AddShipmentAdjustmentService.svc/GetAddShipmentAdjustmentGridData";
                g.NewURL = MyPageName + "?" + GetWebURLString("New", false);
                g.ServiceModuleName = this.MyModuleID;
                g.UserID = this.MyUserID;
                g.FormCaptionText = "";
                g.DefaultPageSize = 5;
                g.IsDisplayOnly = false;
                g.IsActionRequired = false;
                g.IsProcessPart = true;
                g.IsVirtualScroll = false;
                g.ProcessName = ProcessName;
                g.IsShowGridHeader = false;

                g.Column = new List<GridColumn>();
                g.Column.Add(new GridColumn { Field = "SNo", Title = "SNo", DataType = GridDataType.String.ToString(), IsHidden = true });
                //g.Column.Add(new GridColumn { Field = "SNo", Title = "Warning!!", IsHidden = false, DataType = GridDataType.String.ToString(), Template = "#if(IsWarning==true){#<img src=\"images/warning.png\" title=\"#=WarningRemarks#\" style=\"cursor:pointer;\">#}#", Width = 20, Filterable = "false" });

                g.Column.Add(new GridColumn { Field = "AirlineName", Title = "Airline", DataType = GridDataType.String.ToString(), Width = 40 });
                g.Column.Add(new GridColumn { Field = "AWBNo", Title = "AWB No", DataType = GridDataType.String.ToString(), Width = 40 });
                g.Column.Add(new GridColumn { Field = "AWBOD", Title = "AWB O/D", DataType = GridDataType.String.ToString(), Width = 30 });
                g.Column.Add(new GridColumn { Field = "AWBPieces", Title = "AWB Pieces", DataType = GridDataType.String.ToString(), Width = 25 });

                //g.Column.Add(new GridColumn { Field = "S1", Title = "Station", DataType = GridDataType.String.ToString(), Width = 20 });
                //g.Column.Add(new GridColumn { Field = "SP1", Title = "Pcs", DataType = GridDataType.String.ToString(), Width = 20 });
                //g.Column.Add(new GridColumn { Field = "S2", Title = "Station", DataType = GridDataType.String.ToString(), Width = 20 });
                //g.Column.Add(new GridColumn { Field = "SP2", Title = "Pcs", DataType = GridDataType.String.ToString(), Width = 20 });
                //g.Column.Add(new GridColumn { Field = "S3", Title = "Station", DataType = GridDataType.String.ToString(), Width = 20 });
                //g.Column.Add(new GridColumn { Field = "SP3", Title = "Pcs", DataType = GridDataType.String.ToString(), Width = 20 });
                //g.Column.Add(new GridColumn { Field = "S4", Title = "Station", DataType = GridDataType.String.ToString(), Width = 20 });
                //g.Column.Add(new GridColumn { Field = "SP4", Title = "Pcs", DataType = GridDataType.String.ToString(), Width = 20 });
                //g.Column.Add(new GridColumn { Field = "S5", Title = "Station", DataType = GridDataType.String.ToString(), Width = 20 });
                //g.Column.Add(new GridColumn { Field = "SP5", Title = "Pcs", DataType = GridDataType.String.ToString(), Width = 20 });
                //g.Column.Add(new GridColumn { Field = "Total", Title = "Total pcs All Station", DataType = GridDataType.String.ToString(), Width = 40 });
                //g.Column.Add(new GridColumn { Field = "ExtraPieces", Title = "Excess Pcs", DataType = GridDataType.String.ToString(), Width = 40 });

                g.ExtraParam = new List<GridExtraParam>();
                g.ExtraParam.Add(new GridExtraParam { Field = "searchAWBSNo", Value = searchAWBSNo });
                g.ExtraParam.Add(new GridExtraParam { Field = "LoggedInCity", Value = LoggedInCity });
                g.InstantiateIn(Container, isV2);

            }
        }

        public DataSourceResult GetAddShipmentAdjustmentGridData(GetAddShipmentAdjustmentGridFilter model, int skip, int take, int page, int pageSize, List<SoftwareFactory.Data.GridSort> sort, SoftwareFactory.Data.GridFilter filter)
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
                ProcName = "AddShipmentAdjustmentGrid";
                string filters = GridFilter.ProcessFilters<AddShipmentAdjustment>(filter);

                SqlParameter[] Parameters = {
                                            new SqlParameter("@PageNo", page),
                                            new SqlParameter("@PageSize", pageSize),
                                            new SqlParameter("@WhereCondition", filters),
                                            new SqlParameter("@OrderBy", sorts),
                                            new SqlParameter("@searchAWBSNo", model.searchAWBSNo),
                                            new SqlParameter("@LoginCitySNo",Convert.ToInt32( ((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).CitySNo)),
                                            new SqlParameter("@UserSNo", ((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).UserSNo.ToString())
                                        };

                ds = SqlHelper.ExecuteDataset(DMLConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, ProcName, Parameters);

                var AddShipmentAdjustmentList = ds.Tables[0].AsEnumerable().Select(e => new AddShipmentAdjustment
                {
                    SNo = Convert.ToInt32(e["AWBSNo"]),
                    AirlineName =e["AirlineName"].ToString(),
                    AWBNo = e["AWBNo"].ToString(),
                    AWBOD = e["AWBOD"].ToString(),
                    AWBPieces = Convert.ToInt32(e["AWBPieces"]),
                    //S1 = e["S1"].ToString(),
                    //SP1 = e["SP1"].ToString(),
                    //S2 = e["S2"].ToString(),
                    //SP2 = e["SP2"].ToString(),
                    //S3 = e["S3"].ToString(),
                    //SP3 = e["SP3"].ToString(),
                    //S4 = e["S4"].ToString(),
                    //SP4 = e["SP4"].ToString(),
                    //S5 = e["S5"].ToString(),
                    //SP5 = e["SP5"].ToString(),
                    //Total = e["Total"].ToString(),
                    //ExtraPieces = e["ExtraPieces"].ToString(),
                    ProcessStatus = e["Status"].ToString(),
                });

                ds.Dispose();
                return new DataSourceResult
                {
                    Data = AddShipmentAdjustmentList.AsQueryable().ToList(),
                    Total = Convert.ToInt32(ds.Tables[1].Rows[0][0].ToString()),
                    FilterCondition = filters,
                    SortCondition = sorts,
                    StoredProcedure = ProcName
                };
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }

        public string GetWaybillCompleteDetail(string AWBSNo,string AWBNo, string StationSNo,string Station)
        {
            try
            {
                SqlParameter[] Parameters = { new SqlParameter("@AWBSNo", AWBSNo),
                                              new SqlParameter("@AWBNo",AWBNo),
                                              new SqlParameter("@StationSNo", StationSNo),
                                              new SqlParameter("@Station", Station),
                                              new SqlParameter("@UserSNo", ((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).UserSNo.ToString())

                                        };
                DataSet ds = SqlHelper.ExecuteDataset(DMLConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, "GetWaybillCompleteDetail", Parameters);
                return CargoFlash.Cargo.Business.Common.CompleteDStoJSON(ds);
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }

        public string SaveRevisedData(string strData)
        {
            RevisedRequest revisedRequest = new RevisedRequest();
            revisedRequest = JsonConvert.DeserializeObject<RevisedRequest>(CargoFlash.Cargo.Business.Common.Base64ToString(strData));
            DataSet ds = new DataSet();
            SqlParameter[] param =
                                    {
                                        new SqlParameter("@AWBSNo",revisedRequest.AWBSNo),
                                        new SqlParameter("@SNo",revisedRequest.SNo),
                                        new SqlParameter("@fromtable",revisedRequest.fromtable),
                                        new SqlParameter("@Pieces",revisedRequest.Pieces),                                       
                                        new SqlParameter("@StationSNo",revisedRequest.StationSNo),
                                         new SqlParameter("@Station",revisedRequest.Station),
                                        new SqlParameter("@UpdatedBy",((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).UserSNo.ToString())
                                    };
            try
            {
                ds = SqlHelper.ExecuteDataset(DMLConnectionString.WebConfigConnectionString, "SaveRevisedData", param);                
                return ds.Tables[ds.Tables.Count - 1].Rows[0][0].ToString();
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }

        public Stream GetAllStationwaybillDetails(string AWBSNo, string AWBNo)
        {
            try
            {
                SqlParameter[] Parameters = {   new SqlParameter("@AWBSNo", AWBSNo),
                                                new SqlParameter("@AWBNo",AWBNo)
                                            };
                DataSet ds = SqlHelper.ExecuteDataset(DMLConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, "GetAllStationwaybillDetails", Parameters);
                byte[] resultBytes = Encoding.UTF8.GetBytes(GetHTML(ds));
                WebOperationContext.Current.OutgoingResponse.ContentType = "text/html";
                return new MemoryStream(resultBytes);
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }

        private string GetHTML(DataSet ds)
        {
            try
            {
                StringBuilder tbl = new StringBuilder();
                if (ds != null && ds.Tables[0].Rows.Count > 0)
                {
                    tbl.Append("<table id=\"tblViewAddShipment\" align=\"center\" style=\"border: 1px solid black;'\" width=\"99%\" cellpadding=\"0\" cellspacing=\"0\">");

                    tbl.Append("<tr align=\"center\">");
                    foreach (DataRow dr in ds.Tables[0].Rows)
                    {
                        var columns = ds.Tables[0].Columns;
                        for (int i = 0; i < columns.Count; i++)
                        {
                            tbl.Append("<td colspan=\"1\" class=\"grdTableHeader\">" + ((ds.Tables[0].Columns[i].ColumnName).Contains('_')==true? ds.Tables[0].Columns[i].ColumnName.Split('_')[0] : ds.Tables[0].Columns[i].ColumnName) + "</td>");
                        }

                    }
                    tbl.Append("</tr>");
                    tbl.Append("<tr align=\"center\">");
                    foreach (DataRow dr in ds.Tables[0].Rows)
                    {
                        var columns = ds.Tables[0].Columns;
                        for (int i = 0; i < columns.Count; i++)
                        {
                            tbl.Append("<td colspan=\"1\" class=\"grdTableRow\">" + dr[ds.Tables[0].Columns[i].ColumnName].ToString() + "</td>");
                        }

                    }
                    tbl.Append("</tr>");
                }
                return tbl.ToString();
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }

    }
}

public class RevisedRequest
{
    public int? AWBSNo { get; set; }
    public int? SNo { get; set; }
    public int fromtable { get; set; }
    public int Pieces { get; set; }
    public int StationSNo { get; set; }
    public string Station { get; set; }
}
