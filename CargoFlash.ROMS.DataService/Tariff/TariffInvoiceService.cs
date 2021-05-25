using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.ServiceModel;
using System.ServiceModel.Activation;
using System.Data;
using System.Data.SqlClient;
using CargoFlash.Cargo.Model.Tariff;
using CargoFlash.SoftwareFactory.Data;
using CargoFlash.Cargo.Business;
using System.IO;
using System.ServiceModel.Web;
using CargoFlash.SoftwareFactory.WebUI.Adapters;
using CargoFlash.SoftwareFactory.WebUI.Controls;
using CargoFlash.SoftwareFactory.WebUI;
using System.Net;
namespace CargoFlash.Cargo.DataService.Tariff
{

    #region ESS Charge Class Description

    /*
	*****************************************************************************
	Class Name:		Tariff Invoice      
	Purpose:		This class used to Extend Tariff Invoice. 
	Company:		CargoFlash 
	Author:			Madhav Kumar Jha
	Created On:	    05 May 2016
	Approved By:    
	Approved On:	
	*****************************************************************************
	*/
    #endregion
    [GlobalErrorHandlerBehaviour(typeof(GlobalErrorHandler))]   [ServiceBehavior(IncludeExceptionDetailInFaults = true)]
    [AspNetCompatibilityRequirements(RequirementsMode = AspNetCompatibilityRequirementsMode.Allowed)]
    public class TariffInvoiceService : BaseWebUISecureObject, ITariffInvoiceService
    {
        public Stream GetWebForm(string processName, string moduleName, string appName, string formAction, string IsSubModule)
        {
            return BuildWebForm(processName, moduleName, appName, formAction, "", (IsSubModule == "1"));
        }

        public Stream GetSummaryCreditInvoiceGrid(string processName, string moduleName, string appName, string IssueType, string AirlineInvoiceSNo, string InvoiceType)
        {
            return BuildWebForm(processName, moduleName, appName, "IndexView", IssueType: IssueType, AirlineInvoiceSNo: AirlineInvoiceSNo, InvoiceType: InvoiceType);
        }

        private Stream BuildWebForm(string processName, string moduleName, string appName, string formAction, string recordID = "", bool IsSubModule = true, string IssueType = "", string IssueSNo = "", string CurrentAirportCode = "", string Period = "", string CurrentDate = "", string AirlineInvoiceSNo = "", string AirlineAccountSNo = "", string ToDate ="", string InvoiceType="")
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
                            case "TariffInvoice":
                                {
                                    switch (appName)
                                    {
                                        case "TariffInvoice":
                                            CreateGrid(myCurrentForm, processName, IssueType, IssueSNo, CurrentAirportCode, Period, CurrentDate, AirlineAccountSNo, ToDate, InvoiceType);
                                            break;
                                        default:
                                            break;
                                    }
                                    break;
                                }

                            case "PI":
                                {
                                    if (appName == "SummaryCreditInvoice")
                                    {
                                        CreateNestedCreditInvoice(myCurrentForm, IssueType, AirlineInvoiceSNo);
                                    }
                                    else
                                    {
                                        CreateInvoiceGrid(myCurrentForm, processName, IssueType, IssueSNo, CurrentAirportCode, Period, CurrentDate, InvoiceType);
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
            catch(Exception ex)//(Exception ex)
            {
                throw ex;
            }
        }

        public Stream GetGridData(string processName, string moduleName, string appName, string IssueType, string IssueSNo, string CurrentAirportCode, string Period, string CurrentDate, string AirlineAccountSNo, string ToDate, string InvoiceType)
        {
            return BuildWebForm(processName, moduleName, appName, "IndexView", IssueType: IssueType, IssueSNo: IssueSNo, CurrentAirportCode: CurrentAirportCode, Period: Period,CurrentDate: CurrentDate, AirlineAccountSNo: AirlineAccountSNo, ToDate: ToDate, InvoiceType: InvoiceType);
        }
        public Stream GetInvoiceGridData(string processName, string moduleName, string appName, string IssueType, string IssueSNo, string CurrentAirportCode, string Period, string CurrentDate, string InvoiceType)
        {
            return BuildWebForm(processName, moduleName, appName, "IndexView", IssueType: IssueType, IssueSNo: IssueSNo, CurrentAirportCode: CurrentAirportCode, Period: Period, CurrentDate: CurrentDate, InvoiceType: InvoiceType);
        }
        private void CreateGrid(StringBuilder Container, string ProcessName, string IssueType, string IssueSNo, string CurrentAirportCode, string Period, string CurrentDate, string AirlineAccountSNo, string ToDate, string InvoiceType)
        {
            try
            {
                if (IssueType == "1")
                {
                    using (Grid g = new Grid())
                    {
                        g.Height = 100;
                        g.PageName = this.MyPageName;
                        g.PrimaryID = this.MyPrimaryID;
                        g.ModuleName = this.MyModuleID;
                        g.AppsName = this.MyAppID;
                        g.DataSoruceUrl = "Services/Tariff/TariffInvoiceService.svc/GetTariffInvoiceAirlineGridData";
                        g.NewURL = MyPageName + "?" + GetWebURLString("New", false);
                        g.ServiceModuleName = this.MyModuleID;
                        g.UserID = this.MyUserID;
                        g.FormCaptionText = "Credit Invoice";
                        g.DefaultPageSize = 5;
                        g.IsDisplayOnly = true;
                        g.IsProcessPart = true;
                        g.IsVirtualScroll = false;
                        g.IsDisplayOnly = false;
                        g.IsActionRequired = false;
                        g.IsSortable = true;
                        g.IsAllowedFiltering = true;
                        g.IsShowGridHeader = false;
                        g.ProcessName = ProcessName;
                        g.SuccessGrid = "checkProgress";
                        g.ErrorGrid = "checkProgress";
                        g.Column = new List<GridColumn>();
                        g.Column.Add(new GridColumn { Field = "AirlineSNo", Title = "SNo", DataType = GridDataType.String.ToString(), IsHidden = true });
                        g.Column.Add(new GridColumn { Field = "IssueType", Title = "IssueType", DataType = GridDataType.String.ToString(), IsHidden = true });
                        g.Column.Add(new GridColumn { Field = "IssueSNo", Title = "IssueSNo", DataType = GridDataType.String.ToString(), IsHidden = true });
                        //g.Column.Add(new GridColumn { Field = "AirlineSNo", Title = "Select", DataType = GridDataType.String.ToString(), Width = 30, Template = "<input type=\"checkbox\" id=\"chkSelect\"  />" });
                        g.Column.Add(new GridColumn { Field = "AirlineName", Title = "Airline Name", DataType = GridDataType.String.ToString(), Width = 70 });
                        g.Column.Add(new GridColumn { Field = "AirlineCode", Title = "Airline Code", DataType = GridDataType.String.ToString(), Width = 70 });
                        g.Column.Add(new GridColumn { Field = "CarrierCode", Title = "Carrier Code", DataType = GridDataType.String.ToString(), Width = 70 });
                        g.Column.Add(new GridColumn { Field = "Period", Title = "Period", DataType = GridDataType.String.ToString(), Width = 15 });
                        g.ExtraParam = new List<GridExtraParam>();
                        g.ExtraParam.Add(new GridExtraParam { Field = "IssueType", Value = IssueType });
                        g.ExtraParam.Add(new GridExtraParam { Field = "IssueSNo", Value = IssueSNo });
                        g.ExtraParam.Add(new GridExtraParam { Field = "CurrentAirportCode", Value = CurrentAirportCode });
                        g.ExtraParam.Add(new GridExtraParam { Field = "Period", Value = Period });
                        g.ExtraParam.Add(new GridExtraParam { Field = "AirlineAccountSNo", Value = AirlineAccountSNo });
                        g.ExtraParam.Add(new GridExtraParam { Field = "ToDate", Value = ToDate });
                        g.ExtraParam.Add(new GridExtraParam { Field = "InvoiceType", Value = InvoiceType });

                        g.InstantiateIn(Container);
                    }
                }
                else
                {
                    using (Grid g = new Grid())
                    {
                        g.Height = 100;
                        g.PageName = this.MyPageName;
                        g.PrimaryID = this.MyPrimaryID;
                        g.ModuleName = this.MyModuleID;
                        g.AppsName = this.MyAppID;
                        g.DataSoruceUrl = "Services/Tariff/TariffInvoiceService.svc/GetTariffInvoiceAgentGridData";
                        g.NewURL = MyPageName + "?" + GetWebURLString("New", false);
                        g.ServiceModuleName = this.MyModuleID;
                        g.UserID = this.MyUserID;
                        g.FormCaptionText = "Credit Invoice";
                        g.DefaultPageSize = 5;
                        g.IsDisplayOnly = true;
                        g.IsProcessPart = true;
                        g.IsVirtualScroll = false;
                        g.IsDisplayOnly = false;
                        g.IsActionRequired = false;
                        g.IsSortable = true;
                        g.IsAllowedFiltering = true;
                        g.IsShowGridHeader = false;
                        g.ProcessName = ProcessName;
                        g.SuccessGrid = "checkProgress";
                        g.ErrorGrid = "checkProgress";
                        g.Column = new List<GridColumn>();
                        g.Column.Add(new GridColumn { Field = "AccountSNo", Title = "SNo", DataType = GridDataType.String.ToString(), IsHidden = true });
                        g.Column.Add(new GridColumn { Field = "IssueType", Title = "IssueType", DataType = GridDataType.String.ToString(), IsHidden = true });
                        g.Column.Add(new GridColumn { Field = "IssueSNo", Title = "IssueSNo", DataType = GridDataType.String.ToString(), IsHidden = true });
                        //g.Column.Add(new GridColumn { Field = "AirlineSNo", Title = "Select", DataType = GridDataType.String.ToString(), Width = 30, Template = "<input type=\"checkbox\" id=\"chkSelect\"/>" });
                        g.Column.Add(new GridColumn { Field = "AccountName", Title = "Account Name", DataType = GridDataType.String.ToString(), Width = 70 });
                        g.Column.Add(new GridColumn { Field = "AirlineCode", Title = "Airline Code", DataType = GridDataType.String.ToString(), Width = 70 });
                        g.Column.Add(new GridColumn { Field = "OfficeName", Title = "Office Name", DataType = GridDataType.String.ToString(), Width = 70 });
                        g.Column.Add(new GridColumn { Field = "Period", Title = "Period", DataType = GridDataType.String.ToString(), Width = 70 });
                        g.ExtraParam = new List<GridExtraParam>();
                        g.ExtraParam.Add(new GridExtraParam { Field = "IssueType", Value = IssueType });
                        g.ExtraParam.Add(new GridExtraParam { Field = "IssueSNo", Value = IssueSNo });
                        g.ExtraParam.Add(new GridExtraParam { Field = "CurrentAirportCode", Value = CurrentAirportCode });
                        g.ExtraParam.Add(new GridExtraParam { Field = "Period", Value = Period });
                        g.ExtraParam.Add(new GridExtraParam { Field = "AirlineAccountSNo", Value = AirlineAccountSNo });
                        g.ExtraParam.Add(new GridExtraParam { Field = "CurrentDate", Value = CurrentDate });
                        g.ExtraParam.Add(new GridExtraParam { Field = "ToDate", Value = ToDate });
                        g.ExtraParam.Add(new GridExtraParam { Field = "InvoiceType", Value = InvoiceType });

                        g.InstantiateIn(Container);
                    }
                }
            }
            catch(Exception ex)//(Exception ex)
            {
                throw ex;
            }
        }

        private void CreateInvoiceGrid(StringBuilder Container, string ProcessName, string IssueType, string IssueSNo, string CurrentAirportCode, string Period, string CurrentDate, string InvoiceType)
        {

            try
            {
                if (IssueType == "1")
                {
                    using (Grid g = new Grid())
                    {
                        g.Height = 100;
                        g.PageName = this.MyPageName;
                        g.PrimaryID = this.MyPrimaryID;
                        g.ModuleName = this.MyModuleID;
                        g.AppsName = this.MyAppID;
                        g.DataSoruceUrl = "Services/Tariff/TariffInvoiceService.svc/GetAirlineInvoiceGridData";
                        g.NewURL = MyPageName + "?" + GetWebURLString("New", false);
                        g.ServiceModuleName = this.MyModuleID;
                        g.UserID = this.MyUserID;
                        g.FormCaptionText = "Invoice Details";
                        g.DefaultPageSize = 5;
                        g.IsDisplayOnly = true;
                        g.IsProcessPart = true;
                        g.IsVirtualScroll = false;
                        g.IsDisplayOnly = false;
                        g.IsActionRequired = false;
                        g.IsSortable = true;
                        g.IsAllowedFiltering = true;
                        g.ProcessName = ProcessName;
                        g.IsPageable = false;
                        g.ErrorGrid = "SuccessInvoiceGrid";
                        g.SuccessGrid = "SuccessInvoiceGrid";

                        g.Column = new List<GridColumn>();
                        g.Column.Add(new GridColumn { Field = "IsApproved", Title = "IsApproved", DataType = GridDataType.String.ToString(), IsHidden = true });
                        g.Column.Add(new GridColumn { Field = "AirlineInvoiceSNo", Title = "AirlineInvoiceSNo", DataType = GridDataType.String.ToString(), IsHidden = true });
                        g.Column.Add(new GridColumn { Field = "AirlineSNo", Title = "SNo", DataType = GridDataType.String.ToString(), IsHidden = true });
                        g.Column.Add(new GridColumn { Field = "AirlineName", Title = "Airline Name", DataType = GridDataType.String.ToString(), Width = 70 });
                        g.Column.Add(new GridColumn { Field = "ChargeGroupName", Title = "Charge Group", DataType = GridDataType.String.ToString(), Width = 70 });
                        //g.Column.Add(new GridColumn { Field = "IssueType", Title = "IssueType", DataType = GridDataType.String.ToString(), IsHidden = true });
                        //g.Column.Add(new GridColumn { Field = "IssueSNo", Title = "IssueSNo", DataType = GridDataType.String.ToString(), IsHidden = true });
                        //g.Column.Add(new GridColumn { Field = "AirlineCode", Title = "Airline Code", DataType = GridDataType.String.ToString(), Width = 15 });
                        g.Column.Add(new GridColumn { Field = "CarrierCode", Title = "Carrier Code", DataType = GridDataType.String.ToString(), Width = 70 });
                        g.Column.Add(new GridColumn { Field = "InvoiceDate", Title = "Invoice Date", DataType = GridDataType.String.ToString(), Width = 70 });
                        g.Column.Add(new GridColumn { Field = "InvoiceNo", Title = "Invoice No.", DataType = GridDataType.String.ToString(), Width = 70 });
                        g.Column.Add(new GridColumn { Field = "InvoiceAmount", Title = "Invoice Amount", DataType = GridDataType.String.ToString(), Width = 70 });
                        g.Column.Add(new GridColumn { Field = "Period", Title = "Period", DataType = GridDataType.String.ToString(), Width = 70 });
                        g.Column.Add(new GridColumn { Field = "StartPeriod", Title = "Start Period", DataType = GridDataType.String.ToString(), Width = 70 });
                        g.Column.Add(new GridColumn { Field = "EndPeriod", Title = "End Period", DataType = GridDataType.String.ToString(), Width = 70 });
                        g.Column.Add(new GridColumn { Field = "ApprovedBy", Title = "Approved By", DataType = GridDataType.String.ToString(), Width = 70 });
                        g.Column.Add(new GridColumn { Field = "ApprovedOn", Title = "Approved On", IsHidden = false, DataType = GridDataType.Date.ToString(), Template = "# if( ApprovedOn==null) {# # } else {# #= kendo.toString(new Date(data.ApprovedOn.getTime() + data.ApprovedOn.getTimezoneOffset()*60000),\"" + UIDateTimeFormat.UIDateFormatString + "\") # #}#", Width = 80 });
                        g.Column.Add(new GridColumn { Field = "PreparedBy", Title = "Prepared By", DataType = GridDataType.String.ToString(), Width = 70 });
                        g.Column.Add(new GridColumn { Field = "PreparedOn", Title = "Prepared On", IsHidden = false, DataType = GridDataType.Date.ToString(), Template = "# if( PreparedOn==null) {# # } else {# #= kendo.toString(new Date(data.PreparedOn.getTime() + data.PreparedOn.getTimezoneOffset()*60000),\"" + UIDateTimeFormat.UIDateFormatString + "\") # #}#", Width = 80 });

                        g.ExtraParam = new List<GridExtraParam>();
                        g.ExtraParam.Add(new GridExtraParam { Field = "IssueType", Value = IssueType });
                        g.ExtraParam.Add(new GridExtraParam { Field = "IssueSNo", Value = IssueSNo });
                        g.ExtraParam.Add(new GridExtraParam { Field = "CurrentAirportCode", Value = CurrentAirportCode });
                        g.ExtraParam.Add(new GridExtraParam { Field = "Period", Value = Period });
                        g.ExtraParam.Add(new GridExtraParam { Field = "CurrentDate", Value = CurrentDate });
                        g.ExtraParam.Add(new GridExtraParam { Field = "InvoiceType", Value = InvoiceType });
                        g.InstantiateIn(Container);
                    }
                }
                else
                {
                    using (Grid g = new Grid())
                    {
                        g.Height = 100;
                        g.PageName = this.MyPageName;
                        g.PrimaryID = this.MyPrimaryID;
                        g.ModuleName = this.MyModuleID;
                        g.AppsName = this.MyAppID;
                        g.DataSoruceUrl = "Services/Tariff/TariffInvoiceService.svc/GetAgentInvoiceGridData";
                        g.NewURL = MyPageName + "?" + GetWebURLString("New", false);
                        g.ServiceModuleName = this.MyModuleID;
                        g.UserID = this.MyUserID;
                        g.FormCaptionText = "Invoice Details";
                        g.DefaultPageSize = 5;
                        g.IsDisplayOnly = true;
                        g.IsProcessPart = true;
                        g.IsVirtualScroll = false;
                        g.IsDisplayOnly = false;
                        g.IsActionRequired = false;
                        g.IsSortable = true;
                        g.IsAllowedFiltering = true;
                        g.ProcessName = ProcessName;
                        g.IsPageable = false;
                        g.ErrorGrid = "SuccessInvoiceGrid";
                        g.SuccessGrid = "SuccessInvoiceGrid";

                        g.Column = new List<GridColumn>();
                        g.Column.Add(new GridColumn { Field = "IsApproved", Title = "IsApproved", DataType = GridDataType.String.ToString(), IsHidden = true });
                        g.Column.Add(new GridColumn { Field = "AirlineInvoiceSNo", Title = "AirlineInvoiceSNo", DataType = GridDataType.String.ToString(), IsHidden = true });
                        g.Column.Add(new GridColumn { Field = "AccountSNo", Title = "AccountSNo", DataType = GridDataType.String.ToString(), IsHidden = true });

                        g.Column.Add(new GridColumn { Field = "AccountName", Title = "AccountName", DataType = GridDataType.String.ToString(), Width = 70 });
                        g.Column.Add(new GridColumn { Field = "ChargeGroupName", Title = "Charge Group", DataType = GridDataType.String.ToString(), Width = 70 });
                        //g.Column.Add(new GridColumn { Field = "IssueType", Title = "IssueType", DataType = GridDataType.String.ToString(), IsHidden = true });
                        //g.Column.Add(new GridColumn { Field = "IssueSNo", Title = "IssueSNo", DataType = GridDataType.String.ToString(), IsHidden = true });
                        //g.Column.Add(new GridColumn { Field = "AirlineCode", Title = "Airline Code", DataType = GridDataType.String.ToString(), Width = 15 });
                        g.Column.Add(new GridColumn { Field = "OfficeName", Title = "OfficeName", DataType = GridDataType.String.ToString(), Width = 70 });
                        g.Column.Add(new GridColumn { Field = "InvoiceDate", Title = "Invoice Date", DataType = GridDataType.String.ToString(), Width = 70 });
                        g.Column.Add(new GridColumn { Field = "InvoiceNo", Title = "Invoice No.", DataType = GridDataType.String.ToString(), Width = 70 });
                        g.Column.Add(new GridColumn { Field = "InvoiceAmount", Title = "Invoice Amount", DataType = GridDataType.String.ToString(), Width = 70 });
                        g.Column.Add(new GridColumn { Field = "Period", Title = "Period", DataType = GridDataType.String.ToString(), Width = 70 });
                        g.Column.Add(new GridColumn { Field = "StartPeriod", Title = "Start Period", DataType = GridDataType.String.ToString(), Width = 70 });
                        g.Column.Add(new GridColumn { Field = "EndPeriod", Title = "End Period", DataType = GridDataType.String.ToString(), Width = 70 });
                        g.Column.Add(new GridColumn { Field = "ApprovedBy", Title = "Approved By", DataType = GridDataType.String.ToString(), Width = 70 });
                        g.Column.Add(new GridColumn { Field = "ApprovedOn", Title = "Approved On", IsHidden = false, DataType = GridDataType.Date.ToString(), Template = "# if( ApprovedOn==null) {# # } else {# #= kendo.toString(new Date(data.ApprovedOn.getTime() + data.ApprovedOn.getTimezoneOffset()*60000),\"" + UIDateTimeFormat.UIDateFormatString + " " + UIDateTimeFormat.UITimeFormatString + "\") # #}#", Width = 80 });
                        g.Column.Add(new GridColumn { Field = "PreparedBy", Title = "Prepared By", DataType = GridDataType.String.ToString(), Width = 70 });
                        g.Column.Add(new GridColumn { Field = "PreparedOn", Title = "Prepared On", IsHidden = false, DataType = GridDataType.Date.ToString(), Template = "# if( PreparedOn==null) {# # } else {# #= kendo.toString(new Date(data.PreparedOn.getTime() + data.PreparedOn.getTimezoneOffset()*60000),\"" + UIDateTimeFormat.UIDateFormatString + " " + UIDateTimeFormat.UITimeFormatString + "\") # #}#", Width = 80 });
                        g.ExtraParam = new List<GridExtraParam>();
                        g.ExtraParam.Add(new GridExtraParam { Field = "IssueType", Value = IssueType });
                        g.ExtraParam.Add(new GridExtraParam { Field = "IssueSNo", Value = IssueSNo });
                        g.ExtraParam.Add(new GridExtraParam { Field = "CurrentAirportCode", Value = CurrentAirportCode });
                        g.ExtraParam.Add(new GridExtraParam { Field = "Period", Value = Period });
                        g.ExtraParam.Add(new GridExtraParam { Field = "CurrentDate", Value = CurrentDate });
                        g.ExtraParam.Add(new GridExtraParam { Field = "InvoiceType", Value = InvoiceType });
                        g.InstantiateIn(Container);
                    }
                }
            }
            catch(Exception ex)//(Exception ex)
            {
                throw ex;
            }
        }
        public DataSourceResult GetAirlineInvoiceGridData(string IssueType, string IssueSNo, string CurrentAirportCode, string Period, string CurrentDate, int skip, int take, int page, int pageSize, List<SoftwareFactory.Data.GridSort> sort, SoftwareFactory.Data.GridFilter filter)
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
                ProcName = "CI_createCreditInvoice";
                string filters = GridFilter.ProcessFilters<TariffInvoiceAirline>(filter);
                SqlParameter[] Parameters = { new SqlParameter("@PageNo", page), 
                new SqlParameter("@PageSize", pageSize), 
                new SqlParameter("@WhereCondition", filters), 
                new SqlParameter("@OrderBy", sorts), 
                new SqlParameter("@IssueType", IssueType), 
                new SqlParameter("@IssueSNo", IssueSNo), 
                new SqlParameter("@CurrentAirportCode", CurrentAirportCode), 
                new SqlParameter("@Period", Period), 
                new SqlParameter("@CurrentDate", CurrentDate), 
                new SqlParameter("@InvoiceType", ""), 
                new SqlParameter("@CreatedBy", Convert.ToInt32(((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).UserSNo.ToString())),              
                new SqlParameter("@IsFreightInvoice", "")};

                ds = SqlHelper.ExecuteDataset(DMLConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, ProcName, Parameters);
                var tariffInvoiceAirline = ds.Tables[0].AsEnumerable().Select(e => new TariffInvoiceAirline
                {
                    IsApproved = Convert.ToInt32(e["IsApproved"]),
                    AirlineInvoiceSNo = Convert.ToInt32(e["AirlineInvoiceSNo"]),
                    AirlineSNo = Convert.ToInt32(e["AirlineSNo"]),
                    AirlineName = e["AirlineName"].ToString().ToUpper(),
                    AirlineCode = e["AirlineCode"].ToString().ToUpper(),
                    CarrierCode = e["CarrierCode"].ToString().ToUpper(),
                    InvoiceNo = e["InvoiceNo"].ToString().ToUpper(),
                    InvoiceDate = e["InvoiceDate"].ToString().ToUpper(),
                    InvoiceAmount = e["InvoiceAmount"].ToString().ToUpper(),
                    Period = e["Period"].ToString().ToUpper(),
                    StartPeriod = e["StartPeriod"].ToString(),
                    EndPeriod = e["EndPeriod"].ToString(),
                    ApprovedBy = e["ApprovedBy"].ToString().ToUpper(),
                    ApprovedOn = e["ApprovedOn"].ToString() == "1/1/1900 12:00:00 AM" ? (DateTime?)null : DateTime.SpecifyKind(Convert.ToDateTime(e["ApprovedOn"]), DateTimeKind.Utc),
                    PreparedBy = e["PreparedBy"].ToString().ToUpper(),
                    PreparedOn = e["PreparedOn"] == DBNull.Value ? (DateTime?)null : DateTime.SpecifyKind(Convert.ToDateTime(e["PreparedOn"]), DateTimeKind.Utc),
                    ChargeGroupName = e["ChargeGroupName"].ToString()
                });

                ds.Dispose();
                return new DataSourceResult
                {
                    Data = tariffInvoiceAirline.AsQueryable().ToList(),
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
        public DataSourceResult GetAgentInvoiceGridData(string IssueType, string IssueSNo, string CurrentAirportCode, string Period, string CurrentDate, string InvoiceType, int skip, int take, int page, int pageSize, List<SoftwareFactory.Data.GridSort> sort, SoftwareFactory.Data.GridFilter filter)
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
                ProcName = "CI_createCreditInvoice";
                string filters = GridFilter.ProcessFilters<TariffInvoiceAgent>(filter);
                SqlParameter[] Parameters = { new SqlParameter("@PageNo", page),
                new SqlParameter("@PageSize", pageSize),
                new SqlParameter("@WhereCondition", filters),
                new SqlParameter("@OrderBy", sorts),
                new SqlParameter("@IssueType", IssueType),
                new SqlParameter("@IssueSNo", IssueSNo),
                new SqlParameter("@CurrentAirportCode", CurrentAirportCode),
                new SqlParameter("@Period", Period),
                new SqlParameter("@CurrentDate", CurrentDate),
                new SqlParameter("@InvoiceType", InvoiceType),
                new SqlParameter("@CreatedBy", Convert.ToInt32(((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).UserSNo.ToString()))
            };

                ds = SqlHelper.ExecuteDataset(DMLConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, ProcName, Parameters);
                var tariffInvoiceAirline = ds.Tables[0].AsEnumerable().Select(e => new TariffInvoiceAgent
                {
                    IsApproved = Convert.ToInt32(e["IsApproved"]),
                    AccountSNo = Convert.ToInt32(e["AccountSNo"]),
                    AirlineInvoiceSNo = Convert.ToInt32(e["AirlineInvoiceSNo"]),
                    AccountName = e["AccountName"].ToString().ToUpper(),
                    AirlineCode = e["AirlineCode"].ToString().ToUpper(),
                    OfficeName = e["OfficeName"].ToString().ToUpper(),
                    InvoiceNo = e["InvoiceNo"].ToString().ToUpper() == "" ? "" : e["InvoiceNo"].ToString().ToUpper(),
                    InvoiceDate = e["InvoiceDate"].ToString().ToUpper() == "" ? "" : e["InvoiceDate"].ToString().ToUpper(),
                    InvoiceAmount = e["InvoiceAmount"].ToString().ToUpper(),
                    Period = e["Period"].ToString().ToUpper(),
                    StartPeriod = e["StartPeriod"].ToString(),
                    EndPeriod = e["EndPeriod"].ToString(),
                    ApprovedBy = e["ApprovedBy"].ToString().ToUpper(),
                    ApprovedOn = Convert.ToDateTime(e["ApprovedOn"]).ToString("dd-MMM-yyyy") == "01-Jan-1900" ? (DateTime?)null : DateTime.SpecifyKind(Convert.ToDateTime(e["ApprovedOn"]), DateTimeKind.Utc),
                    PreparedBy = e["PreparedBy"].ToString().ToUpper(),
                    PreparedOn = e["PreparedOn"] == DBNull.Value ? (DateTime?)null : DateTime.SpecifyKind(Convert.ToDateTime(e["PreparedOn"]), DateTimeKind.Utc),
                    ChargeGroupName = e["ChargeGroupName"].ToString()
                });

                ds.Dispose();
                return new DataSourceResult
                {
                    Data = tariffInvoiceAirline.AsQueryable().ToList(),
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
        public DataSourceResult GetTariffInvoiceAirlineGridData(string IssueType, string IssueSNo, string CurrentAirportCode, string Period, string CurrentDate, string AirlineAccountSNo, string InvoiceType, int skip, int take, int page, int pageSize, List<SoftwareFactory.Data.GridSort> sort, SoftwareFactory.Data.GridFilter filter)
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
                ProcName = "CI_GetAgentAirlineGridData1";
                string filters = GridFilter.ProcessFilters<TariffInvoiceAirline>(filter);
                SqlParameter[] Parameters = { new SqlParameter("@PageNo", page),
                new SqlParameter("@PageSize", pageSize),
                new SqlParameter("@WhereCondition", filters),
                new SqlParameter("@OrderBy", sorts),
                new SqlParameter("@IssueType", IssueType),
                new SqlParameter("@IssueSNo", IssueSNo),
                new SqlParameter("@CurrentAirportCode", CurrentAirportCode),
                new SqlParameter("@Period", Period),
                new SqlParameter("@CurrentDate", CurrentDate),
                new SqlParameter("@InvoiceType", InvoiceType),
                 new SqlParameter("@ToDate", CurrentDate), 
                new SqlParameter("@AirlineAccountSNo",AirlineAccountSNo)
            };

                ds = SqlHelper.ExecuteDataset(DMLConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, ProcName, Parameters);
                var tariffInvoiceAirline = ds.Tables[0].AsEnumerable().Select(e => new TariffInvoiceAirline
                {
                    AirlineSNo = Convert.ToInt32(e["AirlineSNo"]),
                    IssueType = e["IssueType"].ToString(),
                    IssueSNo = e["IssueSNo"].ToString(),
                    AirlineName = e["AirlineName"].ToString().ToUpper(),
                    AirlineCode = e["AirlineCode"].ToString().ToUpper(),
                    CarrierCode = e["CarrierCode"].ToString().ToUpper(),
                    Period = e["Period"].ToString().ToUpper(),
                });
                ds.Dispose();
                return new DataSourceResult
                {
                    Data = tariffInvoiceAirline.AsQueryable().ToList(),
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
        public DataSourceResult GetTariffInvoiceAgentGridData(string IssueType, string IssueSNo, string CurrentAirportCode, string Period, string CurrentDate, string AirlineAccountSNo, string ToDate, string InvoiceType, int skip, int take, int page, int pageSize, List<SoftwareFactory.Data.GridSort> sort, SoftwareFactory.Data.GridFilter filter)
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
                ProcName = "CI_GetAgentAirlineGridData1";
                string filters = GridFilter.ProcessFilters<TariffInvoiceAgent>(filter);
                SqlParameter[] Parameters = { new SqlParameter("@PageNo", page), 
                                                new SqlParameter("@PageSize", pageSize),
                                                new SqlParameter("@WhereCondition", filters),
                                                new SqlParameter("@OrderBy", sorts),
                                                new SqlParameter("@IssueType", IssueType), 
                                                new SqlParameter("@IssueSNo", IssueSNo),
                                                new SqlParameter("@CurrentAirportCode", CurrentAirportCode),
                                                new SqlParameter("@Period", Period), 
                                                 new SqlParameter("@InvoiceType", InvoiceType),
                                                new SqlParameter("@CurrentDate", CurrentDate), 
                                                   new SqlParameter("@ToDate", ToDate), 
                                                new SqlParameter("@AirlineAccountSNo", AirlineAccountSNo) };

                ds = SqlHelper.ExecuteDataset(DMLConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, ProcName, Parameters);
                var tariffInvoiceAirline = ds.Tables[0].AsEnumerable().Select(e => new TariffInvoiceAgent
                {
                    AccountSNo = Convert.ToInt32(e["AccountSNo"]),
                    AccountName = e["AccountName"].ToString().ToUpper(),
                    IssueType = e["IssueType"].ToString(),
                    IssueSNo = e["IssueSNo"].ToString(),
                    AirlineCode = e["AirlineCode"].ToString().ToUpper(),
                    OfficeName = e["OfficeName"].ToString().ToUpper(),
                    Period = e["Period"].ToString().ToUpper()
                });
                ds.Dispose();
                return new DataSourceResult
                {
                    Data = tariffInvoiceAirline.AsQueryable().ToList(),
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
        public string GetAgentwiselastApproveDate(string AgentSno)
        {
            DataSet ds = new DataSet();
            SqlParameter[] Parameters = { new SqlParameter("@AgentSno", Convert.ToInt32(AgentSno)) };
            try
            {
                ds = SqlHelper.ExecuteDataset(DMLConnectionString.WebConfigConnectionString, "usp_GetAgentwiselastApproveDate", Parameters);
                return ds.Tables[ds.Tables.Count - 1].Rows[0][0].ToString();
            }
            catch(Exception ex)//(Exception ex)
            {
                throw ex;
            }
        }
        public string ApproveInvoiceDetails(int SNo)
        {
            BaseBusiness baseBusiness = new BaseBusiness();
            DataSet ds = new DataSet();
            SqlParameter[] Parameters = { new SqlParameter("@DailyFlightSNo", SNo) };
            try
            {
                ds = SqlHelper.ExecuteDataset(DMLConnectionString.WebConfigConnectionString, "ApproveInvoiceDetails", Parameters);
                return ds.Tables[ds.Tables.Count - 1].Rows[0][0].ToString();
            }
            catch(Exception ex)//(Exception ex)
            {
                throw ex;
            }
        }
        public string GetInvoiceReport(string AirlineInvoiceSNo, string ProcedureName)
        {
            try
            {
                SqlParameter[] Parameters = { new SqlParameter("@AirlineInvoiceSNo", AirlineInvoiceSNo) };
                DataSet ds = SqlHelper.ExecuteDataset(DMLConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, ProcedureName, Parameters);
                ds.Dispose();
                return CargoFlash.Cargo.Business.Common.CompleteDStoJSON(ds);
            }
            catch(Exception ex)//(Exception ex)
            {
                throw ex;
            }
        }

        private void CreateNestedCreditInvoice(StringBuilder Container, string IssueType = "", string AirlineInvoiceSNo = "")
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
                    g.DataSoruceUrl = "Services/Tariff/TariffInvoiceService.svc/GetSummaryCreditInvoiceGridData";
                    g.PrimaryID = "InvHandlingChargeMasterSNo";
                    g.NewURL = MyPageName + "?" + GetWebURLString("New", false);
                    g.ModuleName = this.MyModuleID;
                    g.FormCaptionText = "Invoice Summary & Details " + "<span style='float:right;margin-right:20px;'><input id='btnApprovedInvoice' type='button' class='btn btn-block btn-success btn-sm' onclick='ApprovedInvoice()' value='Approve Invoice'/></span>";
                    g.IsFormHeader = false;
                    g.IsModule = true;
                    g.IsAllowedSorting = false;
                    g.IsAllowedScrolling = true;
                    g.IsShowEdit = false;
                    // g.ParentSuccessGrid = "DisableFlight";
                    g.IsSaveChanges = false;
                    g.IsColumnMenu = false;
                    g.IsAllowedFiltering = false;

                    g.Column = new List<GridColumn>();
                    g.Column.Add(new GridColumn { Field = "AirlineInvoiceSNo", Title = "AirlineInvoiceSNo", IsHidden = true, DataType = GridDataType.String.ToString() });
                    g.Column.Add(new GridColumn { Field = "InvHandlingChargeMasterSNo", Title = "InvHandlingChargeMasterSNo", IsHidden = true, DataType = GridDataType.String.ToString() });
                    g.Column.Add(new GridColumn { Field = "ChargeName", Title = "Charge Name", IsHidden = false, DataType = GridDataType.String.ToString(), Width = 140 });
                    g.Column.Add(new GridColumn { Field = "ChargeAmount", Title = "Charge Amount", IsHidden = false, DataType = GridDataType.String.ToString(), Width = 140 });
                    g.ExtraParam = new List<GridExtraParams>();
                    g.ExtraParam.Add(new GridExtraParams { Field = "IssueType", Value = IssueType });
                    g.ExtraParam.Add(new GridExtraParams { Field = "AirlineInvoiceSNo", Value = AirlineInvoiceSNo });

                    #region Nested Grid Start
                    g.NestedPrimaryID = "WorkOrderNo";
                    g.NestedModuleName = this.MyModuleID;
                    g.NestedAppsName = this.MyAppID;
                    g.NestedParentID = "InvHandlingChargeMasterSNo";
                    g.NestedIsShowEdit = false;
                    g.NestedDefaultPageSize = 1000;
                    g.NestedIsPageable = false;
                    //  g.IsNestedAllowedFiltering = true;
                    g.IsNestedAllowedSorting = false;
                    // g.SuccessGrid = "DisableFlight";
                    //g.IsNestedAllowedFiltering = false;

                    g.NestedDataSoruceUrl = "Services/Tariff/TariffInvoiceService.svc/GetDetailsCreditInvoiceGridData";
                    g.NestedColumn = new List<GridColumn>();
                    g.NestedColumn.Add(new GridColumn { Field = "AWBNo", IsLocked = false, Title = "AWB No", IsHidden = false, DataType = GridDataType.String.ToString(), Width = 90 });
                    g.NestedColumn.Add(new GridColumn { Field = "WorkOrderNo", IsLocked = false, Title = "Order No", IsHidden = false, DataType = GridDataType.String.ToString(), Width = 90 });
                    g.Column.Add(new GridColumn { Field = "InvHandlingChargeMasterSNo", Title = "InvHandlingChargeMasterSNo", IsHidden = true, DataType = GridDataType.String.ToString() });
                    g.NestedColumn.Add(new GridColumn { Field = "WorkOrderDate", Title = "Date", IsHidden = false, DataType = GridDataType.Date.ToString(), Width = 90 });
                    g.NestedColumn.Add(new GridColumn { Field = "ChargeName", IsLocked = false, Title = "Charge Name", IsHidden = false, DataType = GridDataType.String.ToString(), Width = 90 });
                    g.NestedColumn.Add(new GridColumn { Field = "ChargeAmount", Title = "Charge Amount", IsHidden = false, DataType = GridDataType.String.ToString(), Width = 90 });

                    g.NestedExtraParam = new List<NestedGridExtraParam>();
                    g.NestedExtraParam.Add(new NestedGridExtraParam { Field = "IssueType", Value = IssueType });
                    g.NestedExtraParam.Add(new NestedGridExtraParam { Field = "AirlineInvoiceSNo", Value = AirlineInvoiceSNo });

                    #endregion

                    g.InstantiateIn(Container);
                }
            }
            catch(Exception ex)//(Exception ex)
            {
                throw ex;
            }
        }

        public DataSourceResult GetSummaryCreditInvoiceGridData(string IssueType, string AirlineInvoiceSNo, int skip, int take, int page, int pageSize, List<SoftwareFactory.Data.GridSort> sort, SoftwareFactory.Data.GridFilter filter)
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
                ProcName = "CI_getSummaryCreditInvoice";
                string filters = GridFilter.ProcessFilters<SummaryCreditInvoiceGridData>(filter);
                SqlParameter[] Parameters = { new SqlParameter("@PageNo", page), new SqlParameter("@PageSize", pageSize), new SqlParameter("@WhereCondition", filters), new SqlParameter("@OrderBy", sorts), new SqlParameter("@IssueType", IssueType), new SqlParameter("@AirlineInvoiceSNo", AirlineInvoiceSNo), new SqlParameter("@CreatedBy", Convert.ToInt32(((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).UserSNo.ToString())) };

                ds = SqlHelper.ExecuteDataset(DMLConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, ProcName, Parameters);
                var wmsBookingList = ds.Tables[0].AsEnumerable().Select(e => new SummaryCreditInvoiceGridData
                {
                    AirlineInvoiceSNo = Convert.ToInt32(e["AirlineInvoiceSNo"]),
                    InvHandlingChargeMasterSNo = Convert.ToInt32(e["InvHandlingChargeMasterSNo"]),
                    ChargeName = e["ChargeName"].ToString().ToUpper(),
                    ChargeAmount = Convert.ToDecimal(e["ChargeAmount"])
                });
                ds.Dispose();
                return new DataSourceResult
                {
                    Data = wmsBookingList.AsQueryable().ToList(),
                    Total = Convert.ToInt32(ds.Tables[3].Rows[0][0].ToString()),
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

        public DataSourceResult GetDetailsCreditInvoiceGridData(string IssueType, string AirlineInvoiceSNo, int skip, int take, int page, int pageSize, List<SoftwareFactory.Data.GridSort> sort, SoftwareFactory.Data.GridFilter filter)
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
                ProcName = "CI_getDetailsCreditInvoice";
                string filters = GridFilter.ProcessFilters<DetailsCreditInvoiceGridData>(filter);
                SqlParameter[] Parameters = { new SqlParameter("@PageNo", page), new SqlParameter("@PageSize", pageSize), new SqlParameter("@WhereCondition", filters), new SqlParameter("@OrderBy", sorts), new SqlParameter("@IssueType", IssueType), new SqlParameter("@AirlineInvoiceSNo", AirlineInvoiceSNo), new SqlParameter("@CreatedBy", Convert.ToInt32(((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).UserSNo.ToString())) };

                ds = SqlHelper.ExecuteDataset(DMLConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, ProcName, Parameters);
                var DetailsCreditInvoiceList = ds.Tables[0].AsEnumerable().Select(e => new DetailsCreditInvoiceGridData
                {
                    AWBNo = e["AWBNo"].ToString(),
                    WorkOrderNo = e["WorkOrderNo"].ToString().ToUpper(),
                    InvHandlingChargeMasterSNo = Convert.ToInt32(e["InvHandlingChargeMasterSNo"]),
                    WorkOrderDate = Convert.ToDateTime(e["WorkOrderDate"]),
                    ChargeName = e["ChargeName"].ToString().ToUpper(),
                    ChargeAmount = Convert.ToDecimal(e["ChargeAmount"])
                });
                ds.Dispose();
                return new DataSourceResult
                {
                    Data = DetailsCreditInvoiceList.AsQueryable().ToList(),
                    Total = Convert.ToInt32(ds.Tables[2].Rows[0][0].ToString()),
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

        //public string CreateInvoiceData(string CurrentIssueType)
        //{
        //    BaseBusiness baseBusiness = new BaseBusiness();
        //    DataSet ds = new DataSet();
        //    SqlParameter[] Parameters = { new SqlParameter("@CurrentIssueType", CurrentIssueType) };
        //    try
        //    {
        //        ds = SqlHelper.ExecuteDataset(DMLConnectionString.WebConfigConnectionString, "CI_CreateInvoiceData", Parameters);
        //        return ds.Tables[ds.Tables.Count - 1].Rows[0][0].ToString();
        //    }
        //    catch(Exception ex)// (Exception ex)
        //    {
        //        return ex.Message;
        //    }
        //}

    

        public string ApproveInvoiceData(string CurrentAirlineInvoiceSNo)
        {

            BaseBusiness baseBusiness = new BaseBusiness();
            DataSet ds = new DataSet();
            SqlParameter[] Parameters = { new SqlParameter("@CurrentAirlineInvoiceSNo", CurrentAirlineInvoiceSNo), new SqlParameter("@CreatedBy", Convert.ToInt32(((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).UserSNo.ToString())) };
            try
            {
                ds = SqlHelper.ExecuteDataset(DMLConnectionString.WebConfigConnectionString, "CI_approveCreditInvoice", Parameters);

                return CargoFlash.Cargo.Business.Common.CompleteDStoJSON(ds);
            }
            catch (Exception ex)//
            {
                throw ex;
            }
        }






        public string ReGenerateInvoice(string CurrentIssueSNo, string CurrentAirlineInvoiceSNo, string Period)
        {
            BaseBusiness baseBusiness = new BaseBusiness();
            DataSet ds = new DataSet();
            SqlParameter[] Parameters = { new SqlParameter("@CurrentIssueSNo", CurrentIssueSNo), new SqlParameter("@CurrentAirlineInvoiceSNo", CurrentAirlineInvoiceSNo), new SqlParameter("@Period", Period), new SqlParameter("@UpdatedBy", Convert.ToInt32(((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).UserSNo.ToString())), new SqlParameter("@CurrentCityCode", ((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).CityCode.ToString()) };
            try
            {
                ds = SqlHelper.ExecuteDataset(DMLConnectionString.WebConfigConnectionString, "CI_ReGenerateInvoice", Parameters);
                return ds.Tables[ds.Tables.Count - 1].Rows[0][0].ToString();
            }
            catch(Exception ex)//
            {
                throw ex;
            }
        }

        public string GetPrintInvoice(int AirlineInvoiceSNo)
        {
            DataSet ds = new DataSet();
            try
            {
                SqlParameter[] Parameters = { new SqlParameter("@AirlineInvoiceSNo", AirlineInvoiceSNo) };
                ds = SqlHelper.ExecuteDataset(DMLConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, "GetPrintWorkorderInvoiceSNo", Parameters);
                ds.Dispose();
            }
            catch(Exception ex)//(Exception ex)
            {
                throw ex;
            }
            return CargoFlash.Cargo.Business.Common.CompleteDStoJSON(ds);
        }
    }
}
