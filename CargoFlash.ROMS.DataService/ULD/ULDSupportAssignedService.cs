using CargoFlash.Cargo.Business;
using CargoFlash.Cargo.Model.ULD;
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

namespace CargoFlash.Cargo.DataService.ULD
{
    [GlobalErrorHandlerBehaviour(typeof(GlobalErrorHandler))]
    [ServiceBehavior(IncludeExceptionDetailInFaults = true)]
    [AspNetCompatibilityRequirements(RequirementsMode = AspNetCompatibilityRequirementsMode.Allowed)]

    public class ULDSupportAssignedService : BaseWebUISecureObject, IULDSupportAssignedService
    {
        CargoFlash.Cargo.Business.BaseBusiness basebusiness = new CargoFlash.Cargo.Business.BaseBusiness();
        public Stream GetWebForm(string processName, string moduleName, string appName, string formAction, string IsSubModule)
        {
            try
            {
                return BuildWebForm(processName, moduleName, appName, formAction, "", (IsSubModule == "1"));
            }
            catch (Exception ex)//(Exception ex)
            {
                throw ex;
            }
        }
        public Stream GetGridData(string processName, string moduleName, string appName)
        {
            try
            {
                return BuildWebForm(processName, moduleName, appName, "IndexView");
            }
            catch (Exception ex)//(Exception ex)
            {
                throw ex;
            }
        }
        private Stream BuildWebForm(string processName, string moduleName, string appName, string formAction, string recordID = "", bool IsSubModule = true)
        {
            try
            {
                var LoggedInCity = (((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"]))).CityCode;
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
                            myCurrentForm.Append("<table class='WebFormTable'><tr><td style='width:50%;vertical-align:top;'  rowspan='2' class='formSection'><div id='ApplicationTabs' style='margin-top:5px;'> ULD Support Assign</div></td></tr></table>");
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
                            case "ULDSupportAssigned":
                                if (appName.ToUpper().Trim() == "ULDSUPPORTASSIGNED")
                                {
                                    CreateGrid(myCurrentForm, processName);
                                }
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
            catch (Exception ex)//(Exception ex)
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
            catch (Exception ex)//(Exception ex)
            {
                throw ex;
            }
        }
        private void CreateGrid(StringBuilder Container, string ProcessName)
        {
            try
            {
                using (Grid g = new Grid())
                {

                    g.PageName = this.MyPageName;
                    g.PrimaryID = this.MyPrimaryID;
                    g.ModuleName = this.MyModuleID;
                    g.AppsName = this.MyAppID;
                    g.IsActionRequired = false;

                    g.DataSoruceUrl = "Services/ULD/ULDSupportAssignedService.svc/GetRecord";
                    g.NewURL = MyPageName + "?" + GetWebURLString("New", false);
                    g.ServiceModuleName = this.MyModuleID;
                    g.UserID = this.MyUserID;
                    g.FormCaptionText = "ULD Support Request Assigned";
                    g.DefaultPageSize = 5;
                    g.IsDisplayOnly = false;
                    g.IsProcessPart = true;
                    g.IsVirtualScroll = false;
                    g.IsAllowedFiltering = true;
                    g.ProcessName = ProcessName;
                    g.IsFormHeader = false;
                    g.IsShowGridHeader = false;
                    g.SuccessGrid = "BindSubProcess";

                    g.Column = new List<GridColumn>();
                    g.Column.Add(new GridColumn { Field = "SNo", Title = "SNo", DataType = GridDataType.String.ToString(), IsHidden = true, Width = 40 });
                    g.Column.Add(new GridColumn { Field = "ReferenceNo", IsLocked = false, Title = "Ref No", DataType = GridDataType.String.ToString(), Width = 50 });
                    g.Column.Add(new GridColumn { Field = "ReqByAirport", IsLocked = false, Title = "Req By Airport", DataType = GridDataType.String.ToString(), Width = 50 });
                    g.Column.Add(new GridColumn { Field = "ReqToAirport", IsLocked = false, Title = "Req To Airport", DataType = GridDataType.String.ToString(), Width = 50 });
                    //g.Column.Add(new GridColumn { Field = "EmailAddress", IsLocked = false, Title = "Email", DataType = GridDataType.String.ToString(), Width = 100 });
                    g.Column.Add(new GridColumn { Field = "ReqStatus", IsLocked = false, Title = "Req Status", DataType = GridDataType.String.ToString(), Width = 35 });
                    g.Column.Add(new GridColumn { Field = "Remarks", IsLocked = false, Title = "Initiate Remarks", DataType = GridDataType.String.ToString(), Width = 35 });
                    g.Column.Add(new GridColumn { Field = "UserName", IsLocked = false, Title = "Created By", DataType = GridDataType.String.ToString(), Width = 55 });
                    g.Column.Add(new GridColumn { Field = "CreatedOn", Title = "Created On", IsHidden = false, DataType = GridDataType.Date.ToString(), Width = 50, Template = "# if( CreatedOn==null) {# # } else {# #= kendo.toString(new Date(data.CreatedOn.getTime() + data.CreatedOn.getTimezoneOffset()*60000),\"" + UIDateTimeFormat.UIDateFormatString + "\") # #}#" });
                    g.Column.Add(new GridColumn { Field = "ProcessStatus", Title = "ProcessStatus", DataType = GridDataType.String.ToString(), IsHidden = true, Width = 90 });
                    g.InstantiateIn(Container);
                }
            }
            catch (Exception ex)//(Exception ex)
            {
                throw ex;
            }
        }

        public DataSourceResult GetRecord(int skip, int take, int page, int pageSize, List<SoftwareFactory.Data.GridSort> sort, SoftwareFactory.Data.GridFilter filter)
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
                var CurrentAirportSNo = ((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).AirportSNo.ToString();
                string filters = GridFilter.ProcessFilters<ULDSupportAssigned>(filter);
                if (filters == "")
                {
                    filters = "OriginAirportSNo=" + CurrentAirportSNo;
                }
                else
                {
                    filters = filters + " And OriginAirportSNo=" + CurrentAirportSNo;
                }


                DataSet ds = new DataSet();

                ProcName = "GetListULDSupportAssigned";

                SqlParameter[] Parameters = { new SqlParameter("@PageNo", page), new SqlParameter("@PageSize", pageSize), new SqlParameter("@WhereCondition", filters), new SqlParameter("@OrderBy", sorts) };

                //SqlDataReader dr = SqlHelper.ExecuteReader(DMLConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, ProcName, Parameters);

                ds = SqlHelper.ExecuteDataset(ReadConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, ProcName, Parameters);

                var wmsBookingList = ds.Tables[0].AsEnumerable().Select(e => new ULDSupportAssigned
                {
                    SNo = Convert.ToInt32(e["SNo"]),
                    ReferenceNo = e["ReferenceNo"].ToString(),
                    ReqByAirport = e["ReqByAirport"].ToString(),
                    ReqToAirport = e["ReqToAirport"].ToString(),
                    EmailAddress = e["EmailAddress"].ToString(),
                    ReqStatus = e["ReqStatus"].ToString(),
                    Remarks = e["Remarks"].ToString(),
                    CreatedOn = e["CreatedOn"] == DBNull.Value ? (DateTime?)null : DateTime.SpecifyKind(Convert.ToDateTime(e["CreatedOn"]), DateTimeKind.Utc),
                    UserName = e["UserName"].ToString(),
                    ProcessStatus = e["ProcessStatus"].ToString(),
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
            catch (Exception ex)//(Exception ex)
            {
                throw ex;
            }
        }

        public KeyValuePair<string, List<USRULDType>> GetUldType(string recordID, int page, int pageSize, string whereCondition, string sort)
        {
            try
            {
                whereCondition = "ULDSupportRequestSNo=" + Convert.ToInt16(recordID);
                SqlParameter[] Parameters = { new SqlParameter("@PageNo", page), new SqlParameter("@PageSize", pageSize), new SqlParameter("@WhereCondition", whereCondition), new SqlParameter("@OrderBy", sort) };
                DataSet ds = SqlHelper.ExecuteDataset(DMLConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, "spULDSupport_GetULDType", Parameters);
                var ULDTypeList = ds.Tables[0].AsEnumerable().Select(e => new USRULDType
                {
                    SNo = Convert.ToInt32(e["SNo"]),
                    UldTypeSNo = e["Text_UldTypeSNo"].ToString(),
                    HdnUldTypeSNo = e["UldTypeSNo"].ToString(),
                    Qty = e["Qty"].ToString(),

                });
                return new KeyValuePair<string, List<USRULDType>>(ds.Tables[1].Rows[0][0].ToString(), ULDTypeList.AsQueryable().ToList());
            }
            catch (Exception ex)//(Exception ex)
            {
                throw ex;
            }
        }

        public KeyValuePair<string, List<USRConsumableType>> GetConsumableType(string recordID, int page, int pageSize, string whereCondition, string sort)
        {
            try
            {
                whereCondition = "ULDSupportRequestSNo=" + Convert.ToInt16(recordID);
                SqlParameter[] Parameters = { new SqlParameter("@PageNo", page), new SqlParameter("@PageSize", pageSize), new SqlParameter("@WhereCondition", whereCondition), new SqlParameter("@OrderBy", sort) };
                DataSet ds = SqlHelper.ExecuteDataset(DMLConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, "spULDSupport_GetConsumableType", Parameters);
                var ConsumableList = ds.Tables[0].AsEnumerable().Select(e => new USRConsumableType
                {
                    SNo = Convert.ToInt32(e["SNo"]),
                    ConsumableTypeSNo = e["Text_ConsumableTypeSNo"].ToString(),
                    HdnConsumableTypeSNo = e["ConsumableTypeSNo"].ToString(),
                    CQty = e["Qty"].ToString(),

                });
                return new KeyValuePair<string, List<USRConsumableType>>(ds.Tables[1].Rows[0][0].ToString(), ConsumableList.AsQueryable().ToList());
            }
            catch (Exception ex)//(Exception ex)
            {
                throw ex;
            }
        }
        public List<string> DeleteULDSupportRequestAssigned(string SNo)
        {
            try
            {
                int ret = 0;
                List<string> ErrorMessage = new List<string>();
                BaseBusiness baseBussiness = new BaseBusiness();
                SqlParameter[] Parameters = { new SqlParameter("@SNo", SNo) };
                ret = (int)SqlHelper.ExecuteScalar(DMLConnectionString.WebConfigConnectionString, "sp_DeleteULDSupportRequestAssigned", Parameters);
                if (ret > 0)
                {
                    if (ret > 1000)
                    {
                        string serverErrorMessage = baseBussiness.ReadServerErrorMessages(ret, "ULDSupportRequest");
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
            catch (Exception ex)
            {
                throw ex;
            }
        }
        public KeyValuePair<string, List<USRAssigned>> GetUldAssigned(string recordID, int page, int pageSize, string whereCondition, string sort)
        {
            try
            {
                if (Convert.ToInt16(recordID) > 0)
                {
                    whereCondition = "ULDSupportRequestSNo=" + Convert.ToInt16(recordID);
                }
                SqlParameter[] Parameters = { new SqlParameter("@PageNo", page), new SqlParameter("@PageSize", pageSize), new SqlParameter("@WhereCondition", whereCondition), new SqlParameter("@OrderBy", sort) };
                DataSet ds = SqlHelper.ExecuteDataset(DMLConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, "spULDSupport_GetUldProcessed", Parameters);
                var ProcessdList = ds.Tables[0].AsEnumerable().Select(e => new USRAssigned
                {
                    SNo = Convert.ToInt32(e["SNo"]),
                    AUldTypeSNo = e["Text_UldTypeSNo"].ToString(),
                    HdnAUldTypeSNo = e["UldTypeSNo"].ToString(),
                    AssignToAirportSNo = e["Text_AssignToAirportSNo"].ToString(),
                    HdnAssignToAirportSNo = e["AssignToAirportSNo"].ToString(),
                    Qty = e["Qty"].ToString(),

                });
                return new KeyValuePair<string, List<USRAssigned>>(ds.Tables[1].Rows[0][0].ToString(), ProcessdList.AsQueryable().ToList());
            }
            catch (Exception ex)//(Exception ex)
            {
                throw ex;
            }
        }
        public KeyValuePair<string, List<USRProcessed>> GetUldProcessed(string recordID, int page, int pageSize, string whereCondition, string sort)
        {
            try
            {
                whereCondition = "AssignAirportSNo=" + ((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).AirportSNo.ToString();
                if (Convert.ToInt16(recordID) > 0)
                {
                    whereCondition = whereCondition + " and ULDSupportRequestSNo=" + Convert.ToInt16(recordID);
                }
                SqlParameter[] Parameters = { new SqlParameter("@PageNo", page), new SqlParameter("@PageSize", pageSize), new SqlParameter("@WhereCondition", whereCondition), new SqlParameter("@OrderBy", sort) };
                DataSet ds = SqlHelper.ExecuteDataset(DMLConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, "spULDSupport_GetUldProcessed", Parameters);
                var ProcessdList = ds.Tables[0].AsEnumerable().Select(e => new USRProcessed
                {
                    SNo = Convert.ToInt32(e["ProceesedSNo"]),
                    PUldTypeSNo = e["Text_UldTypeSNo"].ToString(),
                    HdnPUldTypeSNo = e["UldTypeSNo"].ToString(),
                    AssignToAirportSNo = e["Text_AssignToAirportSNo"].ToString(),
                    HdnAssignToAirportSNo = e["AssignToAirportSNo"].ToString(),
                    Qty = e["Qty"].ToString(),
                    AQty = e["AQty"].ToString(),
                    Remark = e["Remark"].ToString(),

                });
                return new KeyValuePair<string, List<USRProcessed>>(ds.Tables[1].Rows[0][0].ToString(), ProcessdList.AsQueryable().ToList());
            }
            catch (Exception ex)//(Exception ex)
            {
                throw ex;
            }
        }
        public KeyValuePair<string, List<USRClosed>> GetUldClosed(string recordID, int page, int pageSize, string whereCondition, string sort)
        {
            try
            {
                whereCondition = "AssignAirportSNo=" + ((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).AirportSNo.ToString();
                if (Convert.ToInt16(recordID) > 0)
                {
                    whereCondition = whereCondition + " and ULDSupportRequestSNo=" + Convert.ToInt16(recordID);
                }
                SqlParameter[] Parameters = { new SqlParameter("@PageNo", page), new SqlParameter("@PageSize", pageSize), new SqlParameter("@WhereCondition", whereCondition), new SqlParameter("@OrderBy", sort) };
                DataSet ds = SqlHelper.ExecuteDataset(DMLConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, "spULDSupport_GetUldClosed", Parameters);
                var ProcessdList = ds.Tables[0].AsEnumerable().Select(e => new USRClosed
                {
                    SNo = Convert.ToInt32(e["ClosedSNo"]),
                    CUldTypeSNo = e["Text_UldTypeSNo"].ToString(),
                    HdnCUldTypeSNo = e["UldTypeSNo"].ToString(),
                    AssignToAirportSNo = e["Text_AssignToAirportSNo"].ToString(),
                    HdnAssignToAirportSNo = e["AssignToAirportSNo"].ToString(),
                    Qty = e["Qty"].ToString(),
                    AQty = e["AQty"].ToString(),
                    Remark = e["Remark"].ToString(),
                    CloseRemark = e["CloseRemark"].ToString(),

                });
                return new KeyValuePair<string, List<USRClosed>>(ds.Tables[1].Rows[0][0].ToString(), ProcessdList.AsQueryable().ToList());
            }
            catch (Exception ex)//(Exception ex)
            {
                throw ex;
            }
        }
        public string SaveUSRDetais(int USRSNo, ULDSRequest ULDSRequest, List<USRULDType> USRULDType, List<USRConsumableType> USRConsumableType)
        {
            try
            {
                List<ULDSRequest> lstULDSRequest = new List<ULDSRequest>();
                lstULDSRequest.Add(ULDSRequest);


                DataTable dtULDSRequest = CollectionHelper.ConvertTo(lstULDSRequest, "");
                DataTable dtUSRULDType = CollectionHelper.ConvertTo(USRULDType, "HdnUldTypeSNo");
                DataTable dtUSRConsumableType = CollectionHelper.ConvertTo(USRConsumableType, "HdnConsumableTypeSNo");

                SqlParameter paramULDSRequest = new SqlParameter();
                paramULDSRequest.ParameterName = "@ULDSRequest";
                paramULDSRequest.SqlDbType = System.Data.SqlDbType.Structured;
                paramULDSRequest.Value = dtULDSRequest;

                SqlParameter paramUSRULDType = new SqlParameter();
                paramUSRULDType.ParameterName = "@USRULDType";
                paramUSRULDType.SqlDbType = System.Data.SqlDbType.Structured;
                paramUSRULDType.Value = dtUSRULDType;

                SqlParameter paramUSRConsumableType = new SqlParameter();
                paramUSRConsumableType.ParameterName = "@USRConsumableType";
                paramUSRConsumableType.SqlDbType = System.Data.SqlDbType.Structured;
                paramUSRConsumableType.Value = dtUSRConsumableType;
                DataSet ds = new DataSet();
                SqlParameter[] Parameters = {                                             
                                            new SqlParameter("@USRSNo", USRSNo),                                               
                                            paramULDSRequest,    
                                            paramUSRULDType,  
                                            paramUSRConsumableType,                                          
                                            new SqlParameter("@CreatedBy", ((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).UserSNo.ToString()),
                                        };

                ds = SqlHelper.ExecuteDataset(DMLConnectionString.WebConfigConnectionString, "spULDSupport_SaveUpdateDetails", Parameters);
                return CargoFlash.Cargo.Business.Common.CompleteDStoJSON(ds);
            }
            catch (Exception ex)//(Exception ex) 
            {
                throw ex;
            }
        }

        public string GetULDSUPPORTREQUEST(int SNo)
        {
            try
            {
                SqlParameter[] Parameters = { new SqlParameter("@SNo", SNo) };
                DataSet ds = SqlHelper.ExecuteDataset(DMLConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, "GetULDSUPPORTREQUEST", Parameters);
                ds.Dispose();
                return CargoFlash.Cargo.Business.Common.CompleteDStoJSON(ds);
            }
            catch (Exception ex)//(Exception ex)
            {
                throw ex;
            }
        }
        public string SaveUSRAssignDetais(int USRSNo, List<USRAssigned> USRULDType)
        {
            try
            {

                DataTable dtUSRULDType = CollectionHelper.ConvertTo(USRULDType, "HdnAUldTypeSNo,HdnAssignToAirportSNo");

                SqlParameter paramUSRULDType = new SqlParameter();
                paramUSRULDType.ParameterName = "@USRULDType";
                paramUSRULDType.SqlDbType = System.Data.SqlDbType.Structured;
                paramUSRULDType.Value = dtUSRULDType;
                DataSet ds = new DataSet();
                SqlParameter[] Parameters = {                                             
                                            new SqlParameter("@USRSNo", USRSNo),                                   
                                            paramUSRULDType,                                                                                     
                                            new SqlParameter("@CreatedBy", ((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).UserSNo.ToString()),
                                        };

                ds = SqlHelper.ExecuteDataset(DMLConnectionString.WebConfigConnectionString, "spULDSupport_SaveUpdateAssignDetais", Parameters);
                return CargoFlash.Cargo.Business.Common.CompleteDStoJSON(ds);
            }
            catch (Exception ex)//(Exception ex)
            {
                throw ex;
            }
        }

        public string UpdateProcessremarks(int USRSNo, List<USRProcessedRemarks> USRProcessedRemarks)
        {
            try
            {
                DataTable dtUSRULDType = CollectionHelper.ConvertTo(USRProcessedRemarks, "");

                SqlParameter paramUSRULDType = new SqlParameter();
                paramUSRULDType.ParameterName = "@USRProcessedRemarks";
                paramUSRULDType.SqlDbType = System.Data.SqlDbType.Structured;
                paramUSRULDType.Value = dtUSRULDType;
                DataSet ds = new DataSet();
                SqlParameter[] Parameters = {                                             
                                            new SqlParameter("@USRSNo", USRSNo),                                   
                                            paramUSRULDType,                                                                                     
                                            new SqlParameter("@CreatedBy", ((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).UserSNo.ToString()),
                                        };

                ds = SqlHelper.ExecuteDataset(DMLConnectionString.WebConfigConnectionString, "spULDSupport_UpdateProcessedDetais", Parameters);
                return CargoFlash.Cargo.Business.Common.CompleteDStoJSON(ds);
            }
            catch (Exception ex)//(Exception ex) 
            {
                throw ex;
            }
        }

        public string UpdateClosedremarks(int USRSNo, List<USRClosedRemarks> USRClosedRemarks)
        {
            try
            {
                DataTable dtUSRULDType = CollectionHelper.ConvertTo(USRClosedRemarks, "");

                SqlParameter paramUSRULDType = new SqlParameter();
                paramUSRULDType.ParameterName = "@USRClosedRemarks";
                paramUSRULDType.SqlDbType = System.Data.SqlDbType.Structured;
                paramUSRULDType.Value = dtUSRULDType;
                DataSet ds = new DataSet();
                SqlParameter[] Parameters = {                                             
                                            new SqlParameter("@USRSNo", USRSNo),                                   
                                            paramUSRULDType,                                                                                     
                                            new SqlParameter("@CreatedBy", ((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).UserSNo.ToString()),
                                        };

                ds = SqlHelper.ExecuteDataset(DMLConnectionString.WebConfigConnectionString, "spULDSupport_UpdateClosedDetais", Parameters);
                return CargoFlash.Cargo.Business.Common.CompleteDStoJSON(ds);
            }
            catch (Exception ex)//(Exception ex) 
            {
                throw ex;
            }
        }

        public KeyValuePair<string, List<CheckULDAvailability>> GetULDAvailability(string recordID, int page, int pageSize, WhereConditionAssign model, string sort)
        {
            try
            {
                DataSet ds = new DataSet();
                string whereCondition = "ULDSNo=" + model.ULDSNo;

                SqlParameter[] Parameters = { new SqlParameter("@PageNo", page), new SqlParameter("@PageSize", pageSize), new SqlParameter("@WhereCondition", whereCondition), new SqlParameter("@OrderBy", sort) };
                ds = SqlHelper.ExecuteDataset(DMLConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, "spULDSupportAssign_GetULDAvailabilityDetails", Parameters);
                var CheckULDAvailabilityList = ds.Tables[0].AsEnumerable().Select(e => new CheckULDAvailability
                {
                    ULDCode = e["ULDType"].ToString(),
                    ULDSNo = e["ULDSNO"].ToString(),
                    Airport = e["Airportcode"].ToString(),
                    TotalULD = e["totalULD"].ToString(),
                    RequiredULD = e["RequiredULD"].ToString(),
                    Deviation = e["Deviation"].ToString(),
                    DeviationPercentage = e["DeviationPercentage"].ToString(),
                    hdnULDCode = e["ULDType"].ToString(),
                    hdnAirportSno = e["AirportSno"].ToString(),
                    hdnAirport = e["Airportcode"].ToString(),
                    hdnTotalULD = Convert.ToInt32(e["totalULD"]),
                });
                return new KeyValuePair<string, List<CheckULDAvailability>>(null, CheckULDAvailabilityList.AsQueryable().ToList());
            }
            catch (Exception ex)//(Exception ex)
            {
                throw ex;
            }
        }
    }
}


