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
using CargoFlash.Cargo.Model.Irregularity;
using CargoFlash.SoftwareFactory.WebUI.Controls;
using CargoFlash.SoftwareFactory.WebUI;
using System.ServiceModel.Web;
using System.IO;
using CargoFlash.SoftwareFactory.WebUI.Adapters;
using System.Globalization;
using KLAS.Business.EDI;
using CargoFlash.Cargo.Business;
using Newtonsoft.Json;
using System.Net;
namespace CargoFlash.Cargo.DataService.Irregularity
{

    [GlobalErrorHandlerBehaviour(typeof(GlobalErrorHandler))]   [ServiceBehavior(IncludeExceptionDetailInFaults = true)]
    [AspNetCompatibilityRequirements(RequirementsMode = AspNetCompatibilityRequirementsMode.Allowed)]
    public class ComplaintService : BaseWebUISecureObject, IComplaintService
    {
        public Stream GetWebForm(string processName, string moduleName, string appName, string formAction, string IsSubModule, string RecID)
        {
            try
            {
                return BuildWebForm(processName, moduleName, appName, formAction, "", (IsSubModule == "1"), RecID);
            }
            catch(Exception ex)//(Exception ex)
            {
                throw ex;
            }
        }

        private Stream BuildWebForm(string processName, string moduleName, string appName, string formAction, string recordID = "", bool IsSubModule = true, string RecID = "0", string searchComplainNo = "", string searchComplainStatus = "", string searchAWBNo = "", string searchFromDate = "", string searchToDate = "", string SearchClaim = "", string LoggedInCity = "")
        {
            try
            {
                //LoggedInCity = (((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"]))).CityCode;
                this.DisplayMode = "FORMACTION." + formAction.ToUpper().Trim();
                StringBuilder myCurrentForm = new StringBuilder();
                switch (this.DisplayMode)
                {
                    case DisplayModeNew:
                        using (HtmlFormGenerator htmlFormAdapter = new HtmlFormGenerator(processName))
                        {
                            htmlFormAdapter.DisplayMode = DisplayModeType.New;
                            if (RecID != "0")
                            {
                                if (appName.ToUpper() == "COMPLAINTAWBDETAILS")
                                {
                                    htmlFormAdapter.objFormData = (AWBDetails)GetRecordAWBDetails(RecID);
                                }
                                else
                                {
                                    htmlFormAdapter.objFormData = (ComplaintNew)GetRecordComplaint(RecID);
                                }
                            }

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
                        using (HtmlFormGenerator htmlFormAdapter = new HtmlFormGenerator(processName))
                        {
                            htmlFormAdapter.objFormData = (ComplaintNew)GetRecordComplaint(RecID);
                            htmlFormAdapter.DisplayMode = DisplayModeType.Edit;
                            myCurrentForm.Append(htmlFormAdapter.InstantiateIn(moduleName, appName, formAction, IsSubModule: IsSubModule));
                        }
                        break;
                    case DisplayModeDelete:

                        break;
                    case DisplayModeIndexView:
                        switch (processName)
                        {
                            case "COMPLAINT":
                                if (appName.ToUpper().Trim() == "COMPLAINT")
                                    CreateGrid(myCurrentForm, processName, searchComplainNo, searchComplainStatus, searchAWBNo, searchFromDate, searchToDate, SearchClaim, LoggedInCity, isV2: true);
                                break;
                            default:
                                break;
                        }
                        break;
                    case DisplayModeReadView:
                        using (HtmlFormGenerator htmlFormAdapter = new HtmlFormGenerator(processName))
                        {
                            htmlFormAdapter.DisplayMode = DisplayModeType.ReadOnly;
                            htmlFormAdapter.objFormData = (ComplaintNew)GetRecordComplaint(RecID);
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

            catch(Exception ex)//(Exception ex)
            {
                throw ex;
            }
        }
        private void CreateGrid(StringBuilder Container, string ProcessName, string searchComplainNo, string searchComplainStatus, string searchAWBNo, string searchFromDate, string searchToDate, string SearchClaim, string LoggedInCity, bool isV2 = false)
        {
            try {
                using (Grid g = new Grid())
                {
                    g.PageName = this.MyPageName;
                    g.PrimaryID = this.MyPrimaryID;
                    g.ModuleName = this.MyModuleID;
                    g.AppsName = this.MyAppID;
                    g.DataSoruceUrl = "Services/Irregularity/ComplaintService.svc/GetComplaintGridData";
                    g.NewURL = MyPageName + "?" + GetWebURLString("New", false);
                    g.ServiceModuleName = this.MyModuleID;
                    g.UserID = this.MyUserID;
                    g.FormCaptionText = "Complaint";
                    g.DefaultPageSize = 5;
                    g.IsDisplayOnly = false;
                    g.IsActionRequired = false;
                    g.IsProcessPart = true;
                    g.IsVirtualScroll = false;
                    g.ProcessName = ProcessName;
                    g.IsShowGridHeader = false;
                    g.SuccessGrid = "OnSuccessGrid";
                    g.Column = new List<GridColumn>();
                    g.Column.Add(new GridColumn { Field = "ComplaintSNo", Title = "ComplaintSNo", DataType = GridDataType.String.ToString(), IsHidden = true });
                    g.Column.Add(new GridColumn { Field = "PreliminaryClaim", Title = "PreliminaryClaim", DataType = GridDataType.Boolean.ToString(), IsHidden = true });
                    g.Column.Add(new GridColumn { Field = "ComplaintNo", Title = "Complaint No", DataType = GridDataType.String.ToString(), Width = 50 });
                    g.Column.Add(new GridColumn { Field = "ComplainSourceName", Title = "Complaint Source", DataType = GridDataType.String.ToString(), Width = 50 });
                    g.Column.Add(new GridColumn { Field = "AWBNo", Title = "AWB No", DataType = GridDataType.String.ToString(), Width = 50 });
                    g.Column.Add(new GridColumn { Field = "RaisedDate", Title = "Date Raised", DataType = GridDataType.Date.ToString(), Width = 50 });
                    g.Column.Add(new GridColumn { Field = "ComplaintName", Title = "Name", DataType = GridDataType.String.ToString(), Width = 50 });
                    g.Column.Add(new GridColumn { Field = "ContactNo", Title = "Contact No.", DataType = GridDataType.String.ToString(), Width = 50 });
                    g.Column.Add(new GridColumn { Field = "Claim", Title = "Pre Claim", DataType = GridDataType.String.ToString(), Width = 30 });
                    g.Column.Add(new GridColumn { Field = "ComplaintStatusName", Title = "Complaint Status", DataType = GridDataType.String.ToString(), Width = 50 });
                    g.Column.Add(new GridColumn { Field = "IsClosed", Title = "IsClosed", DataType = GridDataType.String.ToString(), IsHidden = true });
                    g.Column.Add(new GridColumn { Field = "IsAssign", Title = "IsAssign", DataType = GridDataType.String.ToString(), IsHidden = true });
                    g.Column.Add(new GridColumn { Field = "IsAction", Title = "IsAction", DataType = GridDataType.String.ToString(), IsHidden = true });
                    g.Column.Add(new GridColumn { Field = "IsEdox", Title = "IsEdox", DataType = GridDataType.String.ToString(), IsHidden = true });
                    g.Column.Add(new GridColumn { Field = "IsEdit", Title = "IsEdit", DataType = GridDataType.String.ToString(), IsHidden = true });
                    g.ExtraParam = new List<GridExtraParam>();
                    g.ExtraParam.Add(new GridExtraParam { Field = "searchComplainNo", Value = searchComplainNo });
                    g.ExtraParam.Add(new GridExtraParam { Field = "searchComplainStatus", Value = searchComplainStatus });
                    g.ExtraParam.Add(new GridExtraParam { Field = "searchAWBNo", Value = searchAWBNo });
                    g.ExtraParam.Add(new GridExtraParam { Field = "searchFromDate", Value = searchFromDate });
                    g.ExtraParam.Add(new GridExtraParam { Field = "searchToDate", Value = searchToDate });
                    g.ExtraParam.Add(new GridExtraParam { Field = "SearchClaim", Value = SearchClaim });
                    g.ExtraParam.Add(new GridExtraParam { Field = "LoggedInCity", Value = LoggedInCity });
                    g.InstantiateIn(Container, isV2);
                }
             }
             catch(Exception ex)//(Exception ex)
              {
                throw ex;
              }
          }


        public DataSourceResult GetComplaintGridData(GetComplaintGridData model, int skip, int take, int page, int pageSize, List<SoftwareFactory.Data.GridSort> sort, SoftwareFactory.Data.GridFilter filter)
        {
            try
            {
                int usersno = (((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"]))).UserSNo;
                string sorts = GridSort.ProcessSorting(sort);
                string ProcName = "";
                if (filter == null)
                {
                    filter = new GridFilter();
                    filter.Logic = "AND";
                    filter.Filters = new List<GridFilter>();
                }
                DataSet ds = new DataSet();
                ProcName = "GetComplaintGridData";
                string filters = GridFilter.ProcessFilters<ComplaintGrid>(filter);

                SqlParameter[] Parameters = {
                                            new SqlParameter("@PageNo", page),
                                            new SqlParameter("@PageSize", pageSize),
                                            new SqlParameter("@WhereCondition", filters),
                                            new SqlParameter("@OrderBy", sorts),
                                            new SqlParameter("@searchComplainNo", model.searchComplainNo),
                                            new SqlParameter("@searchComplainStatus", model.searchComplainStatus),
                                            new SqlParameter("@searchAWBNo", model.searchAWBNo),
                                            new SqlParameter("@searchFromDate", model.searchFromDate),
                                            new SqlParameter("@searchToDate", model.searchToDate),
                                            new SqlParameter("@SearchClaim", model.SearchClaim),
                                            new SqlParameter("@LoggedInCity", model.LoggedInCity),
                                            new SqlParameter("@UserSNo", usersno)
                                          
                                        };

                ds = SqlHelper.ExecuteDataset(DMLConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, ProcName, Parameters);

                var ComplaintList = ds.Tables[0].AsEnumerable().Select(e => new ComplaintGrid
                {
                    //SNo = Convert.ToInt32(e["SNo"]),
                    ComplaintSNo = Convert.ToInt32(e["ComplaintSNo"]),
                    ComplaintNo = e["ComplaintNo"].ToString(),
                    RaisedDate = DateTime.SpecifyKind(Convert.ToDateTime(e["RaisedDate"]), DateTimeKind.Utc),
                    AWBNo = e["AWBNo"].ToString(),
                    ComplaintName = e["ComplaintName"].ToString(),
                    Claim = (Convert.ToBoolean(e["PreClaim"]) == true ? "Yes" : "No").ToString(),
                    ContactNo = e["ContactNo"].ToString(),
                    ComplainSourceName = e["ComplainSourceName"].ToString(),
                    ComplaintStatusName = e["ComplaintStatusName"].ToString(),
                    PreClaim = Convert.ToBoolean(e["PreClaim"]),
                    IsClosed = Convert.ToBoolean((e["IsClosed"])),
                    IsAssign = Convert.ToBoolean((e["IsAssign"])),
                    IsEdox = Convert.ToBoolean((e["IsEdox"])),
                    IsAction = Convert.ToBoolean((e["IsAction"])),
                    IsEdit = Convert.ToBoolean((e["IsEdit"])),
                });

                ds.Dispose();
                return new DataSourceResult
                {
                    Data = ComplaintList.AsQueryable().ToList(),
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
        public Stream GetGridData(ComplainWhereConditionModel modal)
        {
            try
            {
                return BuildWebForm(modal.processName, modal.moduleName, modal.appName, "IndexView", RecID: modal.RecID, searchComplainNo: modal.searchComplainNo, searchComplainStatus: modal.searchComplainStatus, searchAWBNo: modal.searchAWBNo, searchFromDate: modal.searchFromDate, searchToDate: modal.searchToDate, SearchClaim: modal.SearchClaim, LoggedInCity: modal.LoggedInCity);
            }
            catch(Exception ex)//
            {
                throw ex;
            }
        }
        public string SaveNewComplaint(ComplaintNew obj)
        {
            try { 
            int usersno = (((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"]))).UserSNo;
            DataSet ds = new DataSet();
            SqlParameter[] Parameters = {
                                            new SqlParameter("@Text_AWBNo", obj.Text_AWBNo),
                                            new SqlParameter("@AWBNo", obj.AWBNo),
                                            new SqlParameter("@MovementTypeSNo", obj.Type),
                                            new SqlParameter("@RaisedDate", obj.RaisedDate),
                                            new SqlParameter("@AccountSNo", obj.AccountSNo),
                                            new SqlParameter("@AccountNo", obj.AccountNo),
                                            new SqlParameter("@Name", obj.Name),
                                            new SqlParameter("@Address", obj.Address),
                                            new SqlParameter("@CitySNo", obj.CitySNo),
                                            new SqlParameter("@ContactNo", obj.ContactNo),
                                            new SqlParameter("@EmailId", obj.EmailId),
                                            new SqlParameter("@PreClaim", obj.PreliminaryClaim),
                                            new SqlParameter("@ComplaintSourceSNo", obj.ComplaintSourceSNo),
                                            new SqlParameter("@Text_ComplaintSourceSNo", obj.Text_ComplaintSourceSNo),
                                            new SqlParameter("@Description", obj.Description),
                                            new SqlParameter("@Expectation", obj.Expectation),
                                            new SqlParameter("@ComplaintStatusSNo", obj.ComplaintStatusSNo),
                                            new SqlParameter("@Text_ComplaintStatusSNo", obj.Text_ComplaintStatusSNo),
                                            new SqlParameter("@UserSno", usersno),
                                            new SqlParameter("@LoginCitySno", obj.LoginCitySno),
                                            new SqlParameter("@ComplaintImportancy", obj.ComplaintImportancy),
                                            new SqlParameter("@Text_ComplaintImportancy", obj.Text_ComplaintImportancy)
                                          
                                        };

                ds = SqlHelper.ExecuteDataset(DMLConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, "SaveNewComplaint", Parameters);
                return CargoFlash.Cargo.Business.Common.CompleteDStoJSON(ds);
            }
            catch(Exception ex)//(Exception ex)
            {
                throw ex;
            }

        }

        private ComplaintNew GetRecordComplaint(string complaintSNo)
        {
            try
            {
                int usersno = (((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"]))).UserSNo;
                DataSet ds = new DataSet();

                SqlParameter[] Parameters = {
                                            new SqlParameter("@ComplaintSNo", complaintSNo)
                                        };

                //try
                //{
                ds = SqlHelper.ExecuteDataset(DMLConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, "GetComplaintRecord", Parameters);
                //return CargoFlash.Cargo.Business.Common.CompleteDStoJSON(ds);
                DataTable dt = new DataTable();
                dt = ds.Tables[0];
                ComplaintNew comp = new ComplaintNew();
                foreach (DataRow dr in dt.Rows)
                {
                    comp.ComplaintSourceSNo = Convert.ToInt32(dr["ComplaintSourceSNo"]);
                    comp.Text_ComplaintSourceSNo = dr["Text_ComplaintSourceSNo"].ToString();
                    comp.Name = dr["Name"].ToString();
                    comp.EmailId = dr["EmailId"].ToString();
                    comp.ContactNo = dr["ContactNo"].ToString();
                    comp.Address = dr["Address"].ToString();
                    comp.Expectation = dr["Expectation"].ToString();
                    comp.Description = dr["Description"].ToString();
                    comp.PreliminaryClaim = Convert.ToBoolean(dr["PreClaim"]);
                    comp.AccountNo = dr["AccountNo"].ToString();
                    comp.RaisedDate = Convert.ToDateTime(dr["RaisedDate"]).ToString();
                    comp.AWBNo = Convert.ToInt32(dr["AWBSNo"]);
                    comp.Text_AWBNo = dr["AWBNo"].ToString();
                    comp.Text_CitySNo = dr["CityName"].ToString();
                    comp.CitySNo = Convert.ToInt32(dr["CitySNo"]);
                    comp.ComplaintSNo = Convert.ToInt32(dr["SNo"]);
                    comp.ComplaintStatusSNo = Convert.ToInt32(dr["ComplaintStatusSNo"]);
                    comp.Text_ComplaintStatusSNo = dr["Text_ComplaintStatusSNo"].ToString();
                    comp.ComplaintNo = dr["ComplaintNo"].ToString();
                    comp.ComplaintImportancy = dr["ComplaintImportancy"].ToString();
                    comp.Text_ComplaintImportancy = dr["Text_ComplaintImportancy"].ToString();
                    comp.Type = (dr["MovementTypeSNo"].ToString());

                    if (!string.IsNullOrEmpty((dr["ClosedDate"]).ToString()))
                    {
                        comp.ClosedDate = Convert.ToDateTime(dr["ClosedDate"]).ToString();
                    }
                    else
                    {
                        comp.ClosedDate = (dr["ClosedDate"]).ToString();
                    }
                }
                return comp;
                //}
                //catch(Exception ex)//(Exception ex) (Exception ex)
                //{
                //    return null;
                //}
            }
            catch(Exception ex)//(Exception ex)
            {
                throw ex;
            }
        }
        private AWBDetails GetRecordAWBDetails(string ComplaintSNO)
        {
            try
            {
                DataSet ds = new DataSet();

                SqlParameter[] Parameters = {
                                            new SqlParameter("@CurrentComplainSNo", ComplaintSNO)
                                        };
                ds = SqlHelper.ExecuteDataset(DMLConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, "GetComplaintAWBDetails", Parameters);
                DataTable dt = new DataTable();
                dt = ds.Tables[0];
                AWBDetails comp = new AWBDetails();
                foreach (DataRow dr in dt.Rows)
                {
                    comp.TotalPieces = dr["TotalPieces"].ToString();
                    comp.TotalGrossWt = dr["TotalGrossWeight"].ToString();
                    comp.TotalVolumeWT = dr["TotalVolumeWeight"].ToString();

                    comp.TotalAmount = dr["TotalAmount"].ToString();
                    comp.TotalTaxAmount = dr["TotalTaxAmount"].ToString();
                    comp.MKTFreight = dr["MKTFreight"].ToString();
                    comp.OtherCharges = dr["ChargeValue"].ToString();

                    comp.ShipperName = dr["ShipperName"].ToString();
                    comp.ConsigneeName = dr["CONsigneeName"].ToString();
                    comp.OriginCity = dr["Orgincity"].ToString();
                    comp.DestinationCity = dr["DestinatiONCity"].ToString();
                    comp.AgentCity = dr["CityName"].ToString();
                    comp.AgentName = (dr["Name"]).ToString();
                    comp.ShipperCity = dr["ShipperCityName"].ToString();
                    comp.ConsigneeCity = dr["ConsigneeCityName"].ToString();
                    comp.AWBNumber = dr["AWBNumber"].ToString();
                }
                return comp;
            }
            catch(Exception ex)//(Exception ex)
            {
                throw ex;
            }
        }

        public string UpdateComplaint(ComplaintNew obj)
        {
            try { 
            int usersno = (((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"]))).UserSNo;
            DataSet ds = new DataSet();

            SqlParameter[] Parameters = {
                                            
                                            new SqlParameter("@Text_AWBNo", obj.Text_AWBNo),
                                            new SqlParameter("@AWBNo", obj.AWBNo),
                                            new SqlParameter("@MovementTypeSNo", obj.Type),
                                            new SqlParameter("@ComplaintSNo", obj.ComplaintSNo),
                                            new SqlParameter("@AccountSNo", obj.AccountSNo),
                                            new SqlParameter("@AccountNo", obj.AccountNo),
                                            new SqlParameter("@Name", obj.Name),
                                            new SqlParameter("@Address", obj.Address),
                                            new SqlParameter("@CitySNo", obj.CitySNo),
                                            new SqlParameter("@ContactNo", obj.ContactNo),
                                            new SqlParameter("@EmailId", obj.EmailId),
                                            new SqlParameter("@PreClaim", obj.PreliminaryClaim),
                                            new SqlParameter("@Expectation", obj.Expectation),
                                            new SqlParameter("@Description", obj.Description),
                                            new SqlParameter("@ComplaintStatusSNo", obj.ComplaintStatusSNo),
                                            new SqlParameter("@UserSno", usersno),
                                            new SqlParameter("@ComplaintImportancy", obj.ComplaintImportancy),
                                            new SqlParameter("@Text_ComplaintStatusSNo", obj.Text_ComplaintStatusSNo),
                                            new SqlParameter("@Text_ComplaintImportancy", obj.Text_ComplaintImportancy)
                                        };


            ds = SqlHelper.ExecuteDataset(DMLConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, "UpdateComplaint", Parameters);
                return ds.Tables[ds.Tables.Count - 1].Rows[0][0].ToString();
            }
            catch(Exception ex)//(Exception ex) 
            {
                throw ex;
            }
        }

        public string SaveAction(ComplaintAction obj)
        {
            try { 
            int usersno = (((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"]))).UserSNo;
            DataSet ds = new DataSet();
            SqlParameter[] Parameters = {
                                            new SqlParameter("@ComplaintActionSNo", obj.ComplaintActionSNo),
                                            new SqlParameter("@ActionDate", obj.ActionDate),
                                            new SqlParameter("@ActionDescription", obj.ActionDescription),
                                            new SqlParameter("@IsNotify", obj.IsNotify),
                                            new SqlParameter("@EmailID", obj.EmailId),
                                            new SqlParameter("@ComplaintActionStatusSNo", obj.ComplaintActionStatusSNo),
                                            new SqlParameter("@ComplaintSNo", obj.ComplaintSNo),
                                            new SqlParameter("@UserSno", usersno)
                                          
                                        };

         
                ds = SqlHelper.ExecuteDataset(DMLConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, "SaveComplaintAction", Parameters);
                return ds.Tables[ds.Tables.Count - 1].Rows[0][0].ToString();
            }
            catch(Exception ex)//(Exception ex) 
            {
                throw ex;
            }

        }

        public string SaveAssign(ComplaintAssign obj)
        {
            try { 
            int usersno = (((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"]))).UserSNo;
            DataSet ds = new DataSet();
            SqlParameter[] Parameters = {
                                            new SqlParameter("@UserID", obj.UserID),
                                            new SqlParameter("@AssignDate", obj.AssignDate),
                                            new SqlParameter("@AssignMessage", obj.AssignMessage),
                                            new SqlParameter("@ComplaintSNo", obj.ComplaintSNo),
                                            new SqlParameter("@UserSno", usersno),
                                            new SqlParameter("@CitySNo", obj.AssignCitySNo)
                                        };

         
                ds = SqlHelper.ExecuteDataset(DMLConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, "SaveComplaintAssign", Parameters);
                return ds.Tables[ds.Tables.Count - 1].Rows[0][0].ToString();
            }
            catch(Exception ex)//(Exception ex) 
            {
                throw ex;
            }

        }

        public string GetEdoxAtComplaintSNo(Int32 CurrentComplaintSNo)
        {
            try
            {
                SqlParameter[] Parameters = { new SqlParameter("@CurrentComplaintSNo", CurrentComplaintSNo) };
                DataSet ds = SqlHelper.ExecuteDataset(DMLConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, "GetCurrentComplaintEdox", Parameters);
                ds.Dispose();
                return CargoFlash.Cargo.Business.Common.CompleteDStoJSON(ds);
            }
            catch(Exception ex)//(Exception ex)
            {
                throw ex;
            }

        }

        public string SaveComplaintEDoxDetail(int CurrentComplaintSNo, List<ComplaintEDoxDetail> ComplaintEDoxDetail)
        {
            try { 
            DataTable dtComplaintEDoxDetail = CollectionHelper.ConvertTo(ComplaintEDoxDetail, "");
            int usersno = (((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"]))).UserSNo;

            SqlParameter paramComplaintEDoxDetail = new SqlParameter();
            paramComplaintEDoxDetail.ParameterName = "@ComplaintEDoxDetail";
            paramComplaintEDoxDetail.SqlDbType = System.Data.SqlDbType.Structured;
            paramComplaintEDoxDetail.Value = dtComplaintEDoxDetail;

            DataSet ds = new DataSet();
            SqlParameter[] Parameters = { 
                                            paramComplaintEDoxDetail,
                                            new SqlParameter("@CurrentComplaintSNo", CurrentComplaintSNo),
                                            new SqlParameter("@UserSno", usersno)
                                        };
            //DataSet ds1 = new DataSet();
          
                ds = SqlHelper.ExecuteDataset(DMLConnectionString.WebConfigConnectionString, "SaveComplaintEDox", Parameters);
                // DeleteSelectedFiles();
                return ds.Tables[ds.Tables.Count - 1].Rows[0][0].ToString();
            }
            catch(Exception ex)//(Exception ex)
            {
                throw ex;
            }
        }

        public string GetAccountRecords(string AccountNo)
        {
            try
            {
                SqlParameter[] Parameters = { new SqlParameter("@AccountNo", AccountNo) };
                DataSet ds = SqlHelper.ExecuteDataset(DMLConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, "GetAccountRecord", Parameters);
                ds.Dispose();
                return CargoFlash.Cargo.Business.Common.CompleteDStoJSON(ds);
            }
            catch(Exception ex)//(Exception ex)
            {
                throw ex;
            }
        }

        public string GetActionHistory(int CurrentComplaintSNo)
        {
            try { 
            BaseBusiness baseBusiness = new BaseBusiness();
            SqlParameter[] param = 
                                    {
                                       new SqlParameter("@ComplaintSNo", CurrentComplaintSNo)
                                    };
          
                DataSet ds = new DataSet();
                ds = SqlHelper.ExecuteDataset(ReadConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, "GetComplaintActionRecord", param);
                ds.Dispose();
                return CargoFlash.Cargo.Business.Common.CompleteDStoJSON(ds);
            }
            catch(Exception ex)//(Exception ex) 
            {
                throw ex; 
            }
        }

        public string GetAssignHistory(int CurrentComplaintSNo)
        {
            try { 
            BaseBusiness baseBusiness = new BaseBusiness();
            SqlParameter[] param = 
                                    {
                                       new SqlParameter("@ComplaintSNo", CurrentComplaintSNo)
                                    };
            
                DataSet ds = new DataSet();
                ds = SqlHelper.ExecuteDataset(ReadConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, "GetComplaintAssignRecord", param);
                ds.Dispose();
                return CargoFlash.Cargo.Business.Common.CompleteDStoJSON(ds);
            }
            catch(Exception ex)//(Exception ex)
            {
                throw ex; 
            }
        }

        public string GetIrregularityHistory(int CurrentComplaintSNo)
        {
            try { 
            BaseBusiness baseBusiness = new BaseBusiness();
            SqlParameter[] param = 
                                    {
                                       new SqlParameter("@ComplaintSNo", CurrentComplaintSNo)
                                    };
            
                DataSet ds = new DataSet();
                ds = SqlHelper.ExecuteDataset(ReadConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, "GetComplaintIrregulartityRecord", param);
                ds.Dispose();
                return CargoFlash.Cargo.Business.Common.CompleteDStoJSON(ds);
            }
            catch(Exception ex)//(Exception ex) 
            {
                throw ex;  
            }
        }

    }
}
