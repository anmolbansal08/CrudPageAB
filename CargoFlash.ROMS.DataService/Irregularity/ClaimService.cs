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
    public class ClaimService : BaseWebUISecureObject, IClaimService
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

        private Stream BuildWebForm(string processName, string moduleName, string appName, string formAction, string recordID = "", bool IsSubModule = true, string RecID = "0", string searchClaimNo = "", string searchClaimStatus = "", string searchAWBNo = "", string searchFromDate = "", string searchToDate = "", string LoggedInCity = "")
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
                            if (RecID != "0" && appName.ToUpper() != "CLAIMEDOX" && appName.ToUpper() != "AIRLINEEDOX")
                            {
                                if (appName.ToUpper() == "CALCULATECLAIM")
                                {
                                    htmlFormAdapter.objFormData = (ClaimAmountDetails)getClaimAmountDetails(RecID);
                                }
                                else if (appName.ToUpper() == "CLAIMNEW")
                                {
                                    htmlFormAdapter.objFormData = (ComplaintNew)GetRecordComplaint(RecID);
                                }
                                else if (appName.ToUpper() == "AWBDETAILS")
                                {
                                    htmlFormAdapter.objFormData = (AWBDetails)GetRecordAWBDetails(RecID);
                                }
                                else
                                {
                                    htmlFormAdapter.objFormData = (ClaimNew)GetRecordClaim(RecID);
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
                            htmlFormAdapter.objFormData = (ClaimNew)GetRecordClaim(RecID);
                            htmlFormAdapter.DisplayMode = DisplayModeType.Edit;
                            myCurrentForm.Append(htmlFormAdapter.InstantiateIn(moduleName, appName, formAction, IsSubModule: IsSubModule));
                        }
                        break;
                    case DisplayModeDelete:

                        break;
                    case DisplayModeIndexView:
                        switch (processName)
                        {
                            case "CLAIM":
                                if (appName.ToUpper().Trim() == "CLAIM")
                                    CreateGrid(myCurrentForm, processName, searchClaimNo, searchClaimStatus, searchAWBNo, searchFromDate, searchToDate, LoggedInCity, isV2: true);
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
            catch(Exception ex)//(Exception ex)
            {
                throw ex;
            }
        }

        private void CreateGrid(StringBuilder Container, string ProcessName, string searchClaimNo, string searchClaimStatus, string searchAWBNo, string searchFromDate, string searchToDate, string LoggedInCity, bool isV2 = false)
        {
            try
            {
                using (Grid g = new Grid())
                {
                    g.PageName = this.MyPageName;
                    g.PrimaryID = this.MyPrimaryID;
                    g.ModuleName = this.MyModuleID;
                    g.AppsName = this.MyAppID;
                    g.DataSoruceUrl = "Services/Irregularity/ClaimService.svc/GetClaimGridData";
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
                    g.Column.Add(new GridColumn { Field = "ClaimSNo", Title = "ClaimSNo", DataType = GridDataType.String.ToString(), IsHidden = true });
                    g.Column.Add(new GridColumn { Field = "ClaimNumber", Title = "Claim No", DataType = GridDataType.String.ToString(), Width = 50 });
                    g.Column.Add(new GridColumn { Field = "AWBNumber", Title = "AWB No", DataType = GridDataType.String.ToString(), Width = 50 });
                    g.Column.Add(new GridColumn { Field = "ClaimDate", Title = "Date Raised", DataType = GridDataType.Date.ToString(), Width = 50 });
                    g.Column.Add(new GridColumn { Field = "claimamount", Title = "Claim Amount", DataType = GridDataType.String.ToString(), Width = 50 });
                    g.Column.Add(new GridColumn { Field = "Name", Title = "Status", DataType = GridDataType.String.ToString(), Width = 50 });
                    g.Column.Add(new GridColumn { Field = "IsInternational", Title = "International", DataType = GridDataType.String.ToString(), Width = 50 });
                    g.Column.Add(new GridColumn { Field = "IsClosed", Title = "IsClosed", DataType = GridDataType.String.ToString(), IsHidden = true });
                    g.Column.Add(new GridColumn { Field = "IsAssign", Title = "IsAssign", DataType = GridDataType.String.ToString(), IsHidden = true });
                    g.Column.Add(new GridColumn { Field = "IsEdit", Title = "IsEdit", DataType = GridDataType.String.ToString(), IsHidden = true });
                    g.Column.Add(new GridColumn { Field = "IsAction", Title = "IsAction", DataType = GridDataType.String.ToString(), IsHidden = true });
                    g.Column.Add(new GridColumn { Field = "IsEdox", Title = "IsEdox", DataType = GridDataType.String.ToString(), IsHidden = true });
                    g.Column.Add(new GridColumn { Field = "IsAirlineEdox", Title = "IsAirlineEdox", DataType = GridDataType.String.ToString(), IsHidden = true });
                    g.ExtraParam = new List<GridExtraParam>();
                    g.ExtraParam.Add(new GridExtraParam { Field = "searchClaimNo", Value = searchClaimNo });
                    g.ExtraParam.Add(new GridExtraParam { Field = "searchClaimStatus", Value = searchClaimStatus });
                    g.ExtraParam.Add(new GridExtraParam { Field = "searchAWBNo", Value = searchAWBNo });
                    g.ExtraParam.Add(new GridExtraParam { Field = "searchFromDate", Value = searchFromDate });
                    g.ExtraParam.Add(new GridExtraParam { Field = "searchToDate", Value = searchToDate });
                    g.ExtraParam.Add(new GridExtraParam { Field = "LoggedInCity", Value = LoggedInCity });
                    g.InstantiateIn(Container, isV2);

                }
            }
            catch(Exception ex)//(Exception ex)
            {
                throw ex;
            }
        }

        public Stream GetGridData(ClaimWhereConditionModel modal)
        {
            try
            {
                return BuildWebForm(modal.processName, modal.moduleName, modal.appName, "IndexView", RecID: modal.RecID, searchClaimNo: modal.searchClaimNo, searchClaimStatus: modal.searchClaimStatus, searchAWBNo: modal.searchAWBNo, searchFromDate: modal.searchFromDate, searchToDate: modal.searchToDate, LoggedInCity: modal.LoggedInCity);
            }
            catch(Exception ex)//(Exception ex)
            {
                throw ex;
            }
        }

        public DataSourceResult GetClaimGridData(GetClaimGridData model, int skip, int take, int page, int pageSize, List<SoftwareFactory.Data.GridSort> sort, SoftwareFactory.Data.GridFilter filter)
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
                ProcName = "GetClaimGridData";
                string filters = GridFilter.ProcessFilters<ClaimGrid>(filter);

                SqlParameter[] Parameters = {
                                            new SqlParameter("@PageNo", page),
                                            new SqlParameter("@PageSize", pageSize),
                                            new SqlParameter("@WhereCondition", filters),
                                            new SqlParameter("@OrderBy", sorts),
                                            new SqlParameter("@searchClaimNo", model.searchClaimNo),
                                            new SqlParameter("@searchComplainStatus", model.searchClaimStatus),
                                            new SqlParameter("@searchAWBNo", model.searchAWBNo),
                                            new SqlParameter("@searchFromDate", model.searchFromDate),
                                            new SqlParameter("@searchToDate", model.searchToDate),
                                            new SqlParameter("@LoggedInCity", model.LoggedInCity),
                                            new SqlParameter("@UserSno", usersno)

                                          
                                        };

                ds = SqlHelper.ExecuteDataset(DMLConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, ProcName, Parameters);

                var ClaimList = ds.Tables[0].AsEnumerable().Select(e => new ClaimGrid
                {
                    ClaimSNo = Convert.ToInt32(e["ClaimSno"]),
                    ClaimNumber = e["ClaimNumber"].ToString(),
                    ClaimDate = DateTime.SpecifyKind(Convert.ToDateTime(e["ClaimDate"]), DateTimeKind.Utc),
                    AWBNumber = e["AWBNumber"].ToString(),
                    claimamount = e["claimamount"].ToString(),
                    ClaimStatusSNo = Convert.ToInt32(e["ClaimStatusSNo"]),
                    Name = (e["Name"]).ToString(),
                    Remarks = e["Remarks"].ToString(),
                    IsInternational = e["IsInternational"].ToString(),
                    IsClosed = Convert.ToBoolean(e["IsClosed"]),
                    IsAssign = Convert.ToBoolean(e["IsAssign"]),
                    IsEdit = Convert.ToBoolean(e["IsEdit"]),
                    IsAction = Convert.ToBoolean(e["IsAction"]),
                    IsAirlineEdox = Convert.ToBoolean(e["IsAirlineEdox"]),
                    IsEdox = Convert.ToBoolean(e["IsEdox"]),
                });

                ds.Dispose();
                return new DataSourceResult
                {
                    Data = ClaimList.AsQueryable().ToList(),
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

        private ClaimNew GetRecordClaim(string ClaimSNo)
        {
            try
            {
                int usersno = (((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"]))).UserSNo;
                DataSet ds = new DataSet();

                SqlParameter[] Parameters = {
                                            new SqlParameter("@ClaimSNo", ClaimSNo)
                                        };

                //try
                //{
                ds = SqlHelper.ExecuteDataset(DMLConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, "GetClaimRecord", Parameters);
                //return CargoFlash.Cargo.Business.Common.CompleteDStoJSON(ds);
                DataTable dt = new DataTable();
                dt = ds.Tables[0];
                ClaimNew comp = new ClaimNew();
                foreach (DataRow dr in dt.Rows)
                {
                    comp.ClaimSourceSNo = Convert.ToInt32(dr["SourceClaimSno"]);
                    comp.ClaimTypeSNo = Convert.ToInt32(dr["ClaimTypeSno"]);
                    comp.Claimnumber = dr["Claimnumber"].ToString();
                    comp.EmailId = dr["EmailId"].ToString();
                    comp.Pcs = dr["Pieces"].ToString();
                    comp.Weight = dr["weight"].ToString();
                    comp.WeightType = Convert.ToInt32(dr["WeightType"]);
                    comp.ClaimSNo = Convert.ToInt32(dr["sno"]);
                    comp.Text_HAWBNo = Convert.ToString(dr["HAWBNumber"]);
                    comp.HAWBNo = Convert.ToInt32(dr["HAWBSNo"]);
                    comp.RaisedDate = dr["RaisedDate"].ToString();
                    comp.Text_AWBNo = dr["AWBNumber"].ToString();
                    comp.Type = dr["MovementTypeSNo"].ToString();
                    comp.AWBNo = Convert.ToInt32(dr["AWBSNo"]);
                    comp.Text_CitySNo = dr["Text_CitySNo"].ToString();
                    comp.CitySNo = Convert.ToInt32(dr["CitySNo"]);
                    comp.ClaimSNo = Convert.ToInt32(dr["SNo"]);
                    comp.ClaimStatusSNo = Convert.ToInt32(dr["ClaimStatusSNo"]);
                    comp.Text_ClaimStatusSNo = dr["Text_ClaimStatusSNo"].ToString();
                    comp.Text_ClaimTypeSNo = dr["Text_ClaimTypeSNo"].ToString();
                    comp.Text_ClaimSourceSNo = dr["Text_ClaimSourceSNo"].ToString();
                    comp.ContactNo = dr["Contactno"].ToString();
                    comp.Remarks = dr["Remarks"].ToString();
                    comp.ClaimAmount = dr["ClaimAmount"].ToString();
                    comp.Text_WeightType = Convert.ToBoolean(dr["WeightType"]) ? "Lbs" : "KG";
                    comp.Currency = Convert.ToInt32(dr["currency"].ToString());
                    comp.Text_Currency = dr["Text_Currency"].ToString();
                    comp.ComplaintIrregularityList = Convert.ToInt32(dr["ComplaintIrregularityList"]);
                    comp.Text_ComplaintIrregularityList = Convert.ToString(dr["Text_ComplaintIrregularityList"]);
                    comp.ClaimantName = Convert.ToString(dr["ClaimantName"]);

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
            }
            catch(Exception ex)//(Exception ex)//(Exception ex)
            {
                throw ex;
            }
            //}
            //catch(Exception ex)//(Exception ex) (Exception ex)
            //{
            //    return null;
            //}
        }

        private ComplaintNew GetRecordComplaint(string complaintSNo)
        {
            try
            {
                DataSet ds = new DataSet();

                SqlParameter[] Parameters = {
                                            new SqlParameter("@ComplaintSNo", complaintSNo)
                                        };
                ds = SqlHelper.ExecuteDataset(DMLConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, "GetComplaintRecord", Parameters);
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

                    //comp.ComplaintSourceSNo = Convert.ToInt32(dr["AppEntityListSNo"]);
                    //comp.Text_ComplaintSourceSNo = dr["ComplainSourceName"].ToString();
                    //comp.Name = dr["Name"].ToString();
                    //comp.EmailId = dr["EmailId"].ToString();
                    //comp.ContactNo = dr["ContactNo"].ToString();
                    //comp.Address = dr["Address"].ToString();
                    //comp.Expectation = dr["Expectation"].ToString();
                    //comp.Description = dr["Description"].ToString();
                    //comp.PreliminaryClaim = Convert.ToBoolean(dr["PreClaim"]);
                    //comp.AccountNo = dr["AccountNo"].ToString();
                    //comp.RaisedDate = Convert.ToDateTime(dr["RaisedDate"]).ToString();
                    //comp.AWBNo = Convert.ToInt32(dr["AWBNo"].ToString());
                    //comp.Text_AWBNo = dr["AWBNo"].ToString();
                    //comp.Text_CitySNo = dr["CityName"].ToString();
                    //comp.CitySNo = Convert.ToInt32(dr["CitySNo"]);
                    //comp.ComplaintSNo = Convert.ToInt32(dr["SNo"]);
                    //comp.ComplaintStatusSNo = Convert.ToInt32(dr["Status"]);
                    //comp.Text_ComplaintStatusSNo = dr["ComplaintStatusName"].ToString();
                    //comp.ComplaintNo = dr["ComplaintNo"].ToString();
                    //comp.Text_ComplaintIrregularityList = dr["ComplaintNo"].ToString();
                    //comp.ComplaintIrregularityList = Convert.ToInt32(dr["SNo"]);
                }
                return comp;
            }
            catch(Exception ex)//(Exception ex) //(Exception ex)
            {
               // return null;
                throw ex;
            }
        }

        private AWBDetails GetRecordAWBDetails(string claimSNO)
        {
            try
            {
                DataSet ds = new DataSet();

                SqlParameter[] Parameters = {
                                            new SqlParameter("@CurrentClaimSNo", claimSNO)
                                        };
                ds = SqlHelper.ExecuteDataset(DMLConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, "GetAWBClaimDetails", Parameters);
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
                    //comp.PreliminaryClaim = Convert.ToBoolean(dr["PreClaim"]);
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
            //}
            //catch(Exception ex)//(Exception ex) (Exception ex)
            //{
            //    return null;
            //}
        }

        public string SaveNewClaim(ClaimNew obj)
        {
            try
            {
                int usersno = (((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"]))).UserSNo;
                DataSet ds = new DataSet();
                SqlParameter[] Parameters = {
                                            new SqlParameter("@Text_AWBNo", obj.Text_AWBNo),
                                            new SqlParameter("@AWBNo", obj.AWBNo),
                                            new SqlParameter("@MovementTypeSNo", obj.Type),
                                            new SqlParameter("@SourceClaimSNo", obj.ClaimSourceSNo),
                                            new SqlParameter("@RaisedDate", obj.RaisedDate),
                                            new SqlParameter("@HAWBNo", obj.HAWBNo),
                                            new SqlParameter("@Text_HAWBNo", obj.Text_HAWBNo),
                                            new SqlParameter("@ClaimTypeSNo", obj.ClaimTypeSNo),
                                            new SqlParameter("@ContactNo", obj.ContactNo),
                                            new SqlParameter("@Remarks",  CargoFlash.Cargo.Business.Common.Base64ToString(obj.Remarks)),
                                            new SqlParameter("@EmailId", obj.EmailId),
                                            new SqlParameter("@CitySNo", obj.CitySNo),
                                            new SqlParameter("@ClaimStatusSno", obj.ClaimStatusSNo),
                                            new SqlParameter("@Pieces", obj.Pcs),
                                            new SqlParameter("@Weight", obj.Weight),
                                            new SqlParameter("@ClaimAmount", obj.ClaimAmount),
                                            new SqlParameter("@WeightType", obj.WeightType),
                                            new SqlParameter("@User", usersno),
                                            new SqlParameter("@Currency",obj.Currency),
                                            new SqlParameter("@Text_Currency",obj.Text_Currency),
                                            new SqlParameter("@ComplaintIrregularityList",obj.ComplaintIrregularityList),
                                            new SqlParameter("@Text_ComplaintIrregularityList",obj.Text_ComplaintIrregularityList),
                                            new SqlParameter("@Text_ClaimSourceSNo",obj.Text_ClaimSourceSNo),
                                            new SqlParameter("@Text_ClaimStatusSNo",obj.Text_ClaimStatusSNo),
                                            new SqlParameter("@Text_ClaimTypeSNo",obj.Text_ClaimTypeSNo),
                                            new SqlParameter("@ClaimantName",obj.ClaimantName),
                                            new SqlParameter("@LoginCitySno",obj.LoginCitySno)
                                        };


                ds = SqlHelper.ExecuteDataset(DMLConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, "SaveNewClaim", Parameters);
                return CargoFlash.Cargo.Business.Common.CompleteDStoJSON(ds);
            }
            catch(Exception ex)//(Exception ex) //(Exception ex)
            {
              //  return ex.Message;
                throw ex;
            }

        }

        public string UpdateClaim(ClaimNew obj)
        {
            try
            {
                int usersno = (((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"]))).UserSNo;
                DataSet ds = new DataSet();

                SqlParameter[] Parameters = {
                                            new SqlParameter("@Text_AWBNo", obj.Text_AWBNo),
                                            new SqlParameter("@AWBNo", obj.AWBNo),
                                            new SqlParameter("@MovementTypeSNo", obj.Type),
                                            new SqlParameter("@SourceClaimSNo", obj.ClaimSourceSNo),
                                            new SqlParameter("@HAWBNo", obj.HAWBNo),
                                            new SqlParameter("@HAWBNumber", obj.Text_HAWBNo),
                                            new SqlParameter("@ClaimTypeSNo", obj.ClaimTypeSNo),
                                            new SqlParameter("@ContactNo", obj.ContactNo),
                                            new SqlParameter("@Remarks",  CargoFlash.Cargo.Business.Common.Base64ToString(obj.Remarks)),
                                            new SqlParameter("@EmailId", obj.EmailId),
                                            new SqlParameter("@CitySNo", obj.CitySNo),
                                            new SqlParameter("@ClaimStatusSno", obj.ClaimStatusSNo),
                                            new SqlParameter("@Pieces", obj.Pcs),
                                            new SqlParameter("@Weight", obj.Weight),
                                            new SqlParameter("@ClaimAmount", obj.ClaimAmount),
                                            new SqlParameter("@WeightType", obj.WeightType),
                                            new SqlParameter("@User", usersno),
                                            new SqlParameter("@claimno", obj.ClaimSNo),
                                            new SqlParameter("@Currency",obj.Currency),
                                            new SqlParameter("@Text_Currency",obj.Text_Currency),
                                            new SqlParameter("@ComplaintIrregularityList",obj.ComplaintIrregularityList),
                                            new SqlParameter("@Text_ComplaintIrregularityList",obj.Text_ComplaintIrregularityList),
                                            new SqlParameter("@Text_ClaimSourceSNo",obj.Text_ClaimSourceSNo),
                                            new SqlParameter("@Text_ClaimStatusSNo",obj.Text_ClaimStatusSNo),
                                            new SqlParameter("@Text_ClaimTypeSNo",obj.Text_ClaimTypeSNo),
                                            new SqlParameter("@ClaimantName",obj.ClaimantName)
                                        };



                ds = SqlHelper.ExecuteDataset(DMLConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, "UpdateClaim", Parameters);
                //return ds.Tables[ds.Tables.Count - 1].Rows[0][0].ToString();
                return CargoFlash.Cargo.Business.Common.CompleteDStoJSON(ds);
            }
            catch(Exception ex)//(Exception ex) //(Exception ex)
            {
               // return ex.Message;
                throw ex;
            }
        }

        public string SaveAssign(ClaimAssign obj)
        {
            try
            {
                int usersno = (((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"]))).UserSNo;
                DataSet ds = new DataSet();
                SqlParameter[] Parameters = {
                                            new SqlParameter("@UserID", obj.UserID),
                                            new SqlParameter("@AssignDate", obj.AssignDate),
                                            new SqlParameter("@AssignMessage", obj.AssignMessage),
                                            new SqlParameter("@ClaimSNo", obj.ClaimSNo),
                                            new SqlParameter("@UserSno", usersno),
                                            new SqlParameter("@CitySNo", obj.AssignCitySNo)
                                          
                                        };


                ds = SqlHelper.ExecuteDataset(DMLConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, "SaveClaimAssign", Parameters);
               // return ds.Tables[ds.Tables.Count - 1].Rows[0][0].ToString();
                return CargoFlash.Cargo.Business.Common.CompleteDStoJSON(ds);
            }
            catch(Exception ex)//(Exception ex) //(Exception ex)
            {
               // return ex.Message;
                throw ex;
            }

        }

        public string GetEdoxAtClaimSNo(Int32 CurrentClaimSNo, Int32 UserType)
        {
            try
            {
                SqlParameter[] Parameters = { new SqlParameter("@CurrentClaimSNo", CurrentClaimSNo),
                                        new SqlParameter("@Usertype", UserType)};
                DataSet ds = SqlHelper.ExecuteDataset(DMLConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, "GetCurrentClaimEdox", Parameters);
                ds.Dispose();
                return CargoFlash.Cargo.Business.Common.CompleteDStoJSON(ds);
            }
            catch(Exception ex)//(Exception ex)
            {
                throw ex;
            }
        }

        public string SaveClaimEDoxDetail(int CurrentClaimSNo, List<ClaimEDoxDetail> ClaimEDoxDetail, int UserType)
        {
            try
            {
            DataTable dtClaimEDoxDetail = CollectionHelper.ConvertTo(ClaimEDoxDetail, "");
            int usersno = (((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"]))).UserSNo;

            SqlParameter paramClaimEDoxDetail = new SqlParameter();
            paramClaimEDoxDetail.ParameterName = "@ClaimEDoxDetail";
            paramClaimEDoxDetail.SqlDbType = System.Data.SqlDbType.Structured;
            paramClaimEDoxDetail.Value = dtClaimEDoxDetail;

            DataSet ds = new DataSet();
            SqlParameter[] Parameters = { 
                                            paramClaimEDoxDetail,
                                            new SqlParameter("@CurrentClaimSNo", CurrentClaimSNo),
                                            new SqlParameter("@UserSno", usersno),
                                            new SqlParameter("@UserType", UserType)
                                        };
            //DataSet ds1 = new DataSet();
            
                ds = SqlHelper.ExecuteDataset(DMLConnectionString.WebConfigConnectionString, "SaveClaimEDox", Parameters);
                // DeleteSelectedFiles();
               // return ds.Tables[ds.Tables.Count - 1].Rows[0][0].ToString();
                return CargoFlash.Cargo.Business.Common.CompleteDStoJSON(ds);
            }
            catch(Exception ex)//(Exception ex)// (Exception ex)
            {
                //return ex.Message;
                throw ex;
            }
        }

        public string GetActionHistory(int CurrentClaimSNo)
        {
            try
            {
            BaseBusiness baseBusiness = new BaseBusiness();
            SqlParameter[] param = 
                                    {
                                       new SqlParameter("@CurrentClaimSNo", CurrentClaimSNo)
                                    };
           
                DataSet ds = new DataSet();
                ds = SqlHelper.ExecuteDataset(ReadConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, "GetClaimActionRecord", param);
                ds.Dispose();
                return CargoFlash.Cargo.Business.Common.CompleteDStoJSON(ds);
            }
            catch(Exception ex)//(Exception ex)// (Exception ex)
            {
               // return ex.Message;
                throw ex;
            }
        }

        public string GetAssignHistory(int CurrentClaimSNo)
        {
            try
            {
            BaseBusiness baseBusiness = new BaseBusiness();
            SqlParameter[] param = 
                                    {
                                       new SqlParameter("@CurrentClaimSNo", CurrentClaimSNo)
                                    };
            
                DataSet ds = new DataSet();
                ds = SqlHelper.ExecuteDataset(ReadConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, "GetClaimAssignRecord", param);
                ds.Dispose();
                return CargoFlash.Cargo.Business.Common.CompleteDStoJSON(ds);
            }
            catch(Exception ex)//(Exception ex)// (Exception ex)
            {
              //  return ex.Message;
                throw ex;
            }
        }

        public string GetIrregularityHistory(int CurrentClaimSNo)
        {
            try
            {
            BaseBusiness baseBusiness = new BaseBusiness();
            SqlParameter[] param = 
                                    {
                                       new SqlParameter("@CurrentClaimSNo", CurrentClaimSNo)
                                    };
          
                DataSet ds = new DataSet();
                ds = SqlHelper.ExecuteDataset(ReadConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, "GetClaimIrregulartityRecord", param);
                ds.Dispose();
                return CargoFlash.Cargo.Business.Common.CompleteDStoJSON(ds);
            }
            catch(Exception ex)//(Exception ex)// (Exception ex)
            {
                //return ex.Message;
                throw ex;
            }
        }

        public string GetClaimAmountRecord(int CurrentClaimSNo)
        {
            try
            {
            BaseBusiness baseBusiness = new BaseBusiness();
            SqlParameter[] param = 
                                    {
                                       new SqlParameter("@CurrentClaimSNo", CurrentClaimSNo)
                                    };
          
                DataSet ds = new DataSet();
                ds = SqlHelper.ExecuteDataset(ReadConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, "GetClaimAmountRecord", param);
                ds.Dispose();
                return CargoFlash.Cargo.Business.Common.CompleteDStoJSON(ds);
            }
            catch(Exception ex)//(Exception ex) //(Exception ex)
            {
                //return ex.Message;
                throw ex;
            }
        }

        private ClaimAmountDetails getClaimAmountDetails(string CurrentClaimSNo)
        {
            try
            {
            ClaimAmountDetails camtdetails = new ClaimAmountDetails();
            BaseBusiness baseBusiness = new BaseBusiness();
            SqlParameter[] param = 
                                    {
                                       new SqlParameter("@CurrentClaimSNo", CurrentClaimSNo)
                                    };
            
                DataSet ds = new DataSet();
                ds = SqlHelper.ExecuteDataset(ReadConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, "GetClaimAmountRecord", param);
                DataTable dt = new DataTable();
                dt = ds.Tables[0];

                foreach (DataRow dr in dt.Rows)
                {
                    camtdetails.AWBNo = dr["AWBNo"].ToString();
                    camtdetails.MKTFreight = dr["MKTFreight"].ToString();
                    camtdetails.DeclaredCarriagevalue = dr["DeclaredCarriagevalue"].ToString();
                    camtdetails.DeclaredCustomValue = dr["DeclaredCustomValue"].ToString();
                    camtdetails.InsauranceAmount = dr["InsauranceAmount"].ToString();
                    camtdetails.OtherChargeValue = dr["OtherChargeValue"].ToString();
                    camtdetails.IsInsurance = Convert.ToBoolean(dr["IsInsurance"] == "True" ? true : false);
                    camtdetails.IsVal = Convert.ToBoolean(dr["IsVal"]);
                    camtdetails.IsInternational = Convert.ToBoolean(dr["IsInternational"]);
                    camtdetails.ValuationAmount = dr["ValuationAmount"].ToString();
                    camtdetails.SubrogationValue = "0.00";
                    camtdetails.IsPaid = Convert.ToBoolean(dr["IsFreightPrepaid"]);
                    camtdetails.AirlineParameterSDRrate =Convert.ToString(dr["AirlineParameterSDRrate"]);
                }
                return camtdetails;
            }
            catch(Exception ex)//(Exception ex)// (Exception ex)
            {
                //return camtdetails;
                throw ex;
            }
        }

        public string SaveAction(ClaimAction obj)
        {
            try
            { 
            int usersno = (((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"]))).UserSNo;
            DataSet ds = new DataSet();
            SqlParameter[] Parameters = {
                                            new SqlParameter("@ClaimActionSNo", obj.ClaimActionSNo),
                                            new SqlParameter("@ActionDate", obj.ActionDate),
                                            new SqlParameter("@ActionDescription", obj.ActionDescription),
                                            new SqlParameter("@IsNotify", obj.IsNotify),
                                            new SqlParameter("@EmailID", obj.EmailId),
                                            new SqlParameter("@ClaimActionStatusSNo", obj.ClaimActionStatusSNo),
                                            new SqlParameter("@ClaimSNo", obj.ClaimSNo),
                                            new SqlParameter("@ClaimAmount", obj.ClaimAmount),
                                            new SqlParameter("@UserSno", usersno),
                                                
                                            new SqlParameter("@InsuranceCompany", obj.InsuranceCompany),
                                            new SqlParameter("@InsuranceAmount", obj.InsuranceAmount),
                                            new SqlParameter("@SubrogationValue", obj.Subrogationvalue),
                                            new SqlParameter("@ApprovedAmount", obj.ApprovedAmount),
                                            new SqlParameter("@MaxLiability", obj.Maxliability),
                                            new SqlParameter("@Rejected_PaymentSNo", obj.RejectedReason),
                                            new SqlParameter("@Text_Rejected_PaymentSNo", obj.Text_RejectedReason),
                                            new SqlParameter("@IssuanceDate", obj.IssuanceDate),
                                            new SqlParameter("@RemitanceDetails", obj.RemitanceDetails),
                                            new SqlParameter("@Rate", obj.Rate)
                                          
                                        };

          
                ds = SqlHelper.ExecuteDataset(DMLConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, "SaveClaimAction", Parameters);
              
                return CargoFlash.Cargo.Business.Common.CompleteDStoJSON(ds);
            }
            catch(Exception ex)
            {
             
                throw ex;
            }

        }

        public string GetAWBComplaintIrregularityList(string AWBNo, int Status)
        {
            try
            {
            SqlParameter[] param = 
                                    {
                                       new SqlParameter("@AWBNo", AWBNo),
                                       new SqlParameter("@status",Status)
                                    };
           
                DataSet ds = new DataSet();
                ds = SqlHelper.ExecuteDataset(ReadConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, "GetAWBComplaintIrregularity", param);
                ds.Dispose();
                return CargoFlash.Cargo.Business.Common.CompleteDStoJSON(ds);
            }
            catch(Exception ex)//(Exception ex) //(Exception ex)
            {
               // return ex.Message;
                throw ex;
            }
        }
        public string GetAWBPieces(string CurrentClaimSNo)
        {
            try
            {
            SqlParameter[] param = 
                                    {
                                       new SqlParameter("@CurrentClaimSNo", CurrentClaimSNo)
                                    };
           
                DataSet ds = new DataSet();
                ds = SqlHelper.ExecuteDataset(ReadConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, "GetAWBpieces", param);
                ds.Dispose();
                return CargoFlash.Cargo.Business.Common.CompleteDStoJSON(ds);
            }
            catch(Exception ex)//(Exception ex) //(Exception ex)
            {
                //return ex.Message;
                throw ex;
            }
        }

        public string GetAWBRecords(int AWBSNo, int MovementTypeSNo)
        {
            SqlParameter[] param = 
                                    {
                                       new SqlParameter("@AWBNo", AWBSNo),
                                       new SqlParameter("@MovementTypeSNo", MovementTypeSNo)
                                    };
            try
            {
                DataSet ds = new DataSet();
                ds = SqlHelper.ExecuteDataset(ReadConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, "GetAWBRecords", param);
                ds.Dispose();
                return CargoFlash.Cargo.Business.Common.CompleteDStoJSON(ds);
            }
            catch(Exception ex)//(Exception ex) //(Exception ex)
            {
               // return ex.Message;
                throw ex;
            }
        }

        public string GetHouseAWBRecords(int HAWBSNo, int MovementTypeSNo)
        {
            SqlParameter[] param = 
                                    {
                                       new SqlParameter("@HAWBNo", HAWBSNo),
                                       new SqlParameter("@MovementTypeSNo", MovementTypeSNo)
                                    };
            try
            {
                DataSet ds = new DataSet();
                ds = SqlHelper.ExecuteDataset(ReadConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, "GetHouseAWBRecords", param);
                ds.Dispose();
                return CargoFlash.Cargo.Business.Common.CompleteDStoJSON(ds);
            }
            catch(Exception ex)//(Exception ex)// (Exception ex)
            {
               // return ex.Message;
                throw ex;
            }
        }


        public string GetCargoClaimFormPrint(string CurrentClaimSNo)
        {
            try
            {
                SqlParameter[] Parameters = { new SqlParameter("@CurrentClaimSNo", Convert.ToString(CurrentClaimSNo)) };
                DataSet ds = SqlHelper.ExecuteDataset(ReadConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, "CCFClaimDetails", Parameters);
                return CargoFlash.Cargo.Business.Common.CompleteDStoJSON(ds);
            }
            catch(Exception ex)//(Exception ex)
            {
                throw ex;
            }
        }

        public string GetFinalReleasePrint(string CurrentClaimSNo)
        {
            try
            {
                SqlParameter[] Parameters = { new SqlParameter("@CurrentClaimSNo", Convert.ToString(CurrentClaimSNo)) };
                DataSet ds = SqlHelper.ExecuteDataset(ReadConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, "GetFinalReleasePrint", Parameters);
                return CargoFlash.Cargo.Business.Common.CompleteDStoJSON(ds);
            }
            catch(Exception ex)//(Exception ex)
            {
                throw ex;
            }
        }

        public string GetSettelmentClaimPrint(string CurrentClaimSNo)
        {
            try
            {
                SqlParameter[] Parameters = { new SqlParameter("@CurrentClaimSNo", Convert.ToString(CurrentClaimSNo)) };
                DataSet ds = SqlHelper.ExecuteDataset(ReadConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, "GetSettlementCargoClaimPrint", Parameters);
                return CargoFlash.Cargo.Business.Common.CompleteDStoJSON(ds);
            }
            catch(Exception ex)//(Exception ex)
            {
                throw ex;
            }
        }

        public string GetOffice(string CitySNo, string UserSNo)
        {
            try
            {
                SqlParameter[] Parameters = { new SqlParameter("@CitySNo", Convert.ToString(CitySNo)), new SqlParameter("@UserSNo", UserSNo) };
                DataSet ds = SqlHelper.ExecuteDataset(ReadConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, "GetClaimOffice", Parameters);
                return CargoFlash.Cargo.Business.Common.CompleteDStoJSON(ds);
            }
            catch(Exception ex)//(Exception ex)
            {
                throw ex;
            }
        }

        public string GetCarrierSurveyReportFormPrint(string CurrentClaimSNo)
        {
            try
            {
                SqlParameter[] Parameters = { new SqlParameter("@CurrentClaimSNo", Convert.ToString(CurrentClaimSNo)) };
                DataSet ds = SqlHelper.ExecuteDataset(ReadConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, "GetCarrierSurveyReportFormPrint", Parameters);
                return CargoFlash.Cargo.Business.Common.CompleteDStoJSON(ds);
            }
            catch(Exception ex)//(Exception ex)
            {
                throw ex;
            }
        }

        public string GetAnalysisClaimCargoFormPrint(string CurrentClaimSNo)
        {
            try
            {
                SqlParameter[] Parameters = { new SqlParameter("@CurrentClaimSNo", Convert.ToString(CurrentClaimSNo)) };
                DataSet ds = SqlHelper.ExecuteDataset(ReadConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, "GetAnalysisClaimCargoFormPrint", Parameters);
                return CargoFlash.Cargo.Business.Common.CompleteDStoJSON(ds);
            }
            catch(Exception ex)//(Exception ex)
            {
                throw ex;
            }
        }
    }
}
