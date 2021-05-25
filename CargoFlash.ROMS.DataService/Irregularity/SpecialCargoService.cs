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
using CargoFlash.Cargo.Model.Irregularity;
using System.Net;

namespace CargoFlash.Cargo.DataService.Irregularity
{
    [GlobalErrorHandlerBehaviour(typeof(GlobalErrorHandler))]   [ServiceBehavior(IncludeExceptionDetailInFaults = true)]
    [AspNetCompatibilityRequirements(RequirementsMode = AspNetCompatibilityRequirementsMode.Allowed)]
    // NOTE: You can use the "Rename" command on the "Refactor" menu to change the class name "SpecialCargoService" in both code and config file together.
    public class SpecialCargoService : BaseWebUISecureObject, ISpecialCargoService
    {
        public Stream GetWebForm(string processName, string moduleName, string appName, string formAction, string IsSubModule)
        {
            try
            { 
            return BuildWebForm(processName, moduleName, appName, formAction, "", (IsSubModule == "1"));
            }
        catch(Exception ex)//
            {
                throw new System.ServiceModel.Web.WebFaultException<string>("Bad Request.", HttpStatusCode.BadRequest);
            }
        }
        public Stream GetGridData(string processName, string moduleName, string appName, string SpecialCargoType, string SpecialCargoNo)
        {
            try
            {
                return BuildWebForm(processName, moduleName, appName, "IndexView", SpecialCargoType: SpecialCargoType, SpecialCargoNo: SpecialCargoNo);
            }
            catch(Exception ex)//
            {
                throw new System.ServiceModel.Web.WebFaultException<string>("Bad Request.", HttpStatusCode.BadRequest);
            }
        }
        private Stream BuildWebForm(string processName, string moduleName, string appName, string formAction, string recordID = "", bool IsSubModule = true, string SpecialCargoType = "", string SpecialCargoNo = "")
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
                        case "SpecialCargo":
                            if (appName.ToUpper().Trim() == "SPECIALCARGOSEARCH")
                                CreateGrid(myCurrentForm, processName, SpecialCargoType, SpecialCargoNo);
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
            catch(Exception ex)//
            {
                throw new System.ServiceModel.Web.WebFaultException<string>("Bad Request.", HttpStatusCode.BadRequest);
            }
        }

        private void CreateGrid(StringBuilder Container, string ProcessName, string SpecialCargoType = "", string SpecialCargoNo = "")
        {
            try
            { 
            using (Grid g = new Grid())
            {
                g.PageName = this.MyPageName;
                g.PrimaryID = this.MyPrimaryID;
                g.ModuleName = this.MyModuleID;
                g.AppsName = this.MyAppID;
                g.DataSoruceUrl = "Services/Irregularity/SpecialCargoService.svc/GeSpecialCargoGridData";
                g.NewURL = MyPageName + "?" + GetWebURLString("New", false);
                g.ServiceModuleName = this.MyModuleID;
                g.UserID = this.MyUserID;
                g.FormCaptionText = "Special Cargo";
                g.DefaultPageSize = 5;
                g.IsDisplayOnly = false;
                g.IsActionRequired = false;
                g.IsProcessPart = true;
                g.IsVirtualScroll = false;
                g.IsShowGridHeader = false;
                g.ProcessName = ProcessName;
                g.Column = new List<GridColumn>();
                g.Column.Add(new GridColumn { Field = "SNo", Title = "SNo", DataType = GridDataType.String.ToString(), IsHidden = true});
                g.Column.Add(new GridColumn { Field = "SpecialCargoType", IsLocked = false, Title = "Special Cargo Type", DataType = GridDataType.String.ToString()});
                g.Column.Add(new GridColumn { Field = "SpecialCargoNo", IsLocked = false, Title = "Special Cargo No", DataType = GridDataType.String.ToString() });
                g.Column.Add(new GridColumn { Field = "Remarks", IsLocked = false, Title = "Remarks", DataType = GridDataType.String.ToString()});
                g.Column.Add(new GridColumn { Field = "CreatedBy", IsLocked = false, Title = "Created By", DataType = GridDataType.String.ToString() });
                g.Column.Add(new GridColumn { Field = "CreatedOn", Title = "Created On", IsHidden = false, DataType = GridDataType.Date.ToString(), Template = "# if( CreatedOn==null) {# # } else {# #= kendo.toString(new Date(data.CreatedOn.getTime() + data.CreatedOn.getTimezoneOffset()*60000),\"" + UIDateTimeFormat.UIDateFormatString + "\") # #}#", Width = 80 });
                g.Column.Add(new GridColumn { Field = "SNo", IsLocked = false, Title = "Document", DataType = GridDataType.String.ToString(), Template = "# if(IsDoc==true){#<a onclick=\"DownloadDoc(this,#=SNo#);\" style=\"cursor:pointer;\" title=\"Download\" ><i class=\"fa fa-download fa-2x\"></i></a>#} #" });
                g.ExtraParam = new List<GridExtraParam>();
                g.ExtraParam.Add(new GridExtraParam { Field = "SpecialCargoType", Value = SpecialCargoType });
                g.ExtraParam.Add(new GridExtraParam { Field = "SpecialCargoNo", Value = SpecialCargoNo });                
                g.InstantiateIn(Container);
            }
                }
            catch(Exception ex)//
            {
                throw new System.ServiceModel.Web.WebFaultException<string>("Bad Request.", HttpStatusCode.BadRequest);
            }
        }

        public DataSourceResult GeSpecialCargoGridData(string SpecialCargoType, string SpecialCargoNo, int skip, int take, int page, int pageSize, List<SoftwareFactory.Data.GridSort> sort, SoftwareFactory.Data.GridFilter filter)
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

            ProcName = "GeSpecialCargoGridData";

            string filters = GridFilter.ProcessFilters<SpecialCargo>(filter);

            SqlParameter[] Parameters = { new SqlParameter("@PageNo", page), new SqlParameter("@PageSize", pageSize), new SqlParameter("@WhereCondition", filters), new SqlParameter("@OrderBy", sorts), new SqlParameter("@SpecialCargoType", SpecialCargoType), new SqlParameter("@SpecialCargoNo", SpecialCargoNo) };

            ds = SqlHelper.ExecuteDataset(DMLConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, ProcName, Parameters);

            var SpecialCargoList = ds.Tables[0].AsEnumerable().Select(e => new SpecialCargo
            {
                SNo = Convert.ToInt32(e["SNo"]),
                SpecialCargoType = e["SpecialCargoType"].ToString(),
                SpecialCargoNo = e["SpecialCargoNo"].ToString(),
                Remarks = e["Remarks"].ToString(),
                IsDoc = Convert.ToBoolean(e["IsDoc"].ToString()),
                CreatedBy = e["CreatedBy"].ToString(),
                CreatedOn = e["CreatedOn"] == DBNull.Value ? (DateTime?)null : DateTime.SpecifyKind(Convert.ToDateTime(e["CreatedOn"]), DateTimeKind.Utc)
            });
            ds.Dispose();
            return new DataSourceResult
            {
                Data = SpecialCargoList.AsQueryable().ToList(),
                Total = Convert.ToInt32(ds.Tables[1].Rows[0][0].ToString()),
                FilterCondition = filters,
                SortCondition = sorts,
                StoredProcedure = ProcName
            };
                }
            catch(Exception ex)//
            {
                throw new System.ServiceModel.Web.WebFaultException<string>("Bad Request.", HttpStatusCode.BadRequest);
            }
        }
    }
}
