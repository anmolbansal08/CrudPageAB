using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.ServiceModel;
using System.ServiceModel.Activation;
using System.Configuration;
using System.Data;
using System.Data.SqlClient;
using CargoFlash.SoftwareFactory.Data;
using CargoFlash.Cargo.Model.Accounts;
using System.ServiceModel.Web;
using CargoFlash.SoftwareFactory.WebUI.Adapters;
using System.IO;
using CargoFlash.Cargo.Business;
using CargoFlash.SoftwareFactory.WebUI;

namespace CargoFlash.Cargo.DataService.Accounts
{
    [GlobalErrorHandlerBehaviour(typeof(GlobalErrorHandler))]   [ServiceBehavior(IncludeExceptionDetailInFaults = true)]
    [AspNetCompatibilityRequirements(RequirementsMode = AspNetCompatibilityRequirementsMode.Allowed)]
    public class InvoiceGroupService : BaseWebUISecureObject, IInvoiceGroupService
    {
        public DataSourceResult GetGridData(int skip, int take, int page, int pageSize, List<GridSort> sort, GridFilter filter)
        {
            string sorts = GridSort.ProcessSorting(sort);
            string filters = GridFilter.ProcessFilters<InvoiceGroupGrid>(filter);
            SqlParameter[] Parameters = { new SqlParameter("@PageNo", page), new SqlParameter("@PageSize", pageSize), new SqlParameter("@WhereCondition", filters), new SqlParameter("@OrderBy", sorts) };
            DataSet ds = SqlHelper.ExecuteDataset(DMLConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, "GetListInvoiceGroup", Parameters);
            var InvoiceGroupList = ds.Tables[0].AsEnumerable().Select(e => new InvoiceGroupGrid
            {
                SNo = e["SNo"]== DBNull.Value ?0 : Convert.ToInt32(e["SNo"]),
               // RefNo = e["RefNo"].ToString().ToUpper(),
                Text_AccountSNo = e["Text_AccountSNo"].ToString().ToUpper(),
                Text_Type = e["Text_Type"].ToString().ToUpper(),
                Validity = e["Validity"] == DBNull.Value ? (DateTime?)null : DateTime.SpecifyKind(Convert.ToDateTime(e["Validity"]), DateTimeKind.Utc), 
                Active = e["Active"].ToString().ToUpper()
            });
            ds.Dispose();
            return new DataSourceResult
            {
                Data = InvoiceGroupList.AsQueryable().ToList(),
                Total = Convert.ToInt32(ds.Tables[1].Rows[0][0].ToString())
            };
        }

        public Stream GetWebForm(string processName, string moduleName, string appName, string formAction, string IsSubModule)
        {
            return BuildWebForm(processName, moduleName, appName, formAction, "", (IsSubModule == "1"));
        }

        private Stream BuildWebForm(string processName, string moduleName, string appName, string formAction, string recordID = "", bool IsSubModule = true, string searchAirline = "", string searchFlightNo = "", string searchAWBNo = "", string searchFromDate = "", string searchToDate = "", string SearchIncludeTransitAWB = "", string SearchExcludeDeliveredAWB = "", string LoggedInCity = "", string searchSPHC = "", string searchConsignee = "")
        {
            LoggedInCity = (((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"]))).CityCode;
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
                        //case "ESS":
                        //    if (appName.ToUpper().Trim() == "ESS")
                        //        CreateGrid(myCurrentForm, processName, searchAirline, searchFlightNo, searchAWBNo, searchFromDate, searchToDate, SearchIncludeTransitAWB, SearchExcludeDeliveredAWB, searchSPHC, searchConsignee);
                        //    break;
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



        public InvoiceGroup GetInvoiceGroupRecord(string recordID, string UserID)
        {
            InvoiceGroup InvoiceGroup = new InvoiceGroup();
            SqlDataReader dr = null;
            try
            {
                SqlParameter[] Parameters = { new SqlParameter("@SNo", recordID), new SqlParameter("@UserID", Convert.ToInt32(UserID)) };
                dr = SqlHelper.ExecuteReader(ReadConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, "GetRecordInvoiceGroup", Parameters);
                if (dr.Read())
                {
                   // InvoiceGroup.RefNo = dr["RefNo"].ToString();
                    InvoiceGroup.IsActive = Convert.ToBoolean(dr["IsActive"]);
                    InvoiceGroup.Type = Convert.ToInt32(dr["Type"].ToString());
                    InvoiceGroup.Text_Type = string.IsNullOrEmpty(dr["Text_Type"].ToString()) ? "" : dr["Text_Type"].ToString();
                    InvoiceGroup.Text_AccountSNo = Convert.ToString(dr["Text_AccountSNo"]);
                    InvoiceGroup.Validity = Convert.ToString(dr["Validity"]);
                    InvoiceGroup.Active = Convert.ToString(dr["Active"]);
                    InvoiceGroup.isUsed = Convert.ToInt32(dr["isUsed"]);
                }
            }
            catch(Exception ex)// (Exception ex)
            {
                dr.Close();
            }
            return InvoiceGroup;
        }

        public string GetRecordInvoiceGroupTrans(string SNo)
        {
            SqlParameter[] Parameters = { new SqlParameter("@SNo", SNo) };
            DataSet ds = SqlHelper.ExecuteDataset(ReadConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, "GetRecordInvoiceGroupTrans", Parameters);
            return CargoFlash.Cargo.Business.Common.CompleteDStoJSON(ds);
        }

        public string CreateInvoiceGroup(InvoiceGroup InvoiceGroup)
        {
            BaseBusiness baseBusiness = new BaseBusiness();
            List<string> ErrorMessage = new List<string>();
            string ret = "5";
            try
            {
                DataTable dtInvoiceGroupTrans = CollectionHelper.ConvertTo(InvoiceGroup.InvoiceGroupTrans, "Text_ChargeSNo");
                SqlParameter[] Parameters = {
                                               //new SqlParameter("@SNo", InvoiceGroup.SNo),
                                               new SqlParameter("@Type", InvoiceGroup.Type),
                                               new SqlParameter("@AccountSNo", InvoiceGroup.AccountSNo),                                               
                                               new SqlParameter("@Validity", InvoiceGroup.Validity),
                                               new SqlParameter("@IsActive", InvoiceGroup.IsActive),
                                               new SqlParameter("@CreatedBy", ((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session    ["UserDetail"])).UserSNo.ToString()),
                                        new SqlParameter("@InvoiceGroupTrans",SqlDbType.Structured){Value=dtInvoiceGroupTrans}};
                DataSet ds = SqlHelper.ExecuteDataset(ReadConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, "CreateInvoiceGroup", Parameters);
                ds.Dispose();
                ret = ds.Tables[0].Rows[0][0].ToString();

            }
            catch(Exception ex)// (Exception ex)
            {
                //  return ex.Message;
            }
            return ret.ToString();
        }

        public string UpdateInvoiceGroup(InvoiceGroup InvoiceGroup)
        {
            BaseBusiness baseBusiness = new BaseBusiness();
            List<string> ErrorMessage = new List<string>();
           
            string ret = "1";
            try
            {
                DataTable dtInvoiceGroupTrans = CollectionHelper.ConvertTo(InvoiceGroup.InvoiceGroupTrans, "Text_ChargeSNo");
                SqlParameter[] Parameters = {
                                               new SqlParameter("@SNo", InvoiceGroup.SNo),
                                               //new SqlParameter("@Validity", InvoiceGroup.Validity),
                                               //new SqlParameter("@IsActive", InvoiceGroup.IsActive),
                                               new SqlParameter("@CreatedBy", ((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session    ["UserDetail"])).UserSNo.ToString()),
                                        new SqlParameter("@InvoiceGroupTrans",SqlDbType.Structured){Value=dtInvoiceGroupTrans}};
                DataSet ds = SqlHelper.ExecuteDataset(ReadConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, "UpdateInvoiceGroup", Parameters);
                ds.Dispose();
                ret = ds.Tables[0].Rows[0][0].ToString();

            }
            catch(Exception ex)// (Exception ex)
            {
                //  return ex.Message;
            }
            return ret.ToString();
        }

        public List<string> DeleteInvoiceGroup(List<string> listID)
        {
            List<string> ErrorMessage = new List<string>();
            BaseBusiness baseBusiness = new BaseBusiness();
            if (listID.Count > 1)
            {
                string RecordID = listID[0].ToString();

                SqlParameter[] Parameters = { new SqlParameter("@SNo", Convert.ToString(RecordID))};

                int ret = (int)SqlHelper.ExecuteScalar(DMLConnectionString.WebConfigConnectionString, "DeleteInvoiceGroup", Parameters);
                if (ret > 0)
                {
                    if (ret > 1000)
                    {
                        //For Customised Validation Messages like 'Record Already Exists' etc
                        string serverErrorMessage = baseBusiness.ReadServerErrorMessages(ret, "InvoiceGroup");
                        if (!string.IsNullOrEmpty(serverErrorMessage))
                            ErrorMessage.Add(serverErrorMessage);
                    }
                    else
                    {

                        //For DataBase Exceptions like 'Foreign Key refrence Errors' etc
                        string dataBaseExceptionMessage = baseBusiness.ReadServerErrorMessages(ret, baseBusiness.DatabaseExceptionFileName);
                        if (!string.IsNullOrEmpty(dataBaseExceptionMessage))
                            ErrorMessage.Add(dataBaseExceptionMessage);
                    }

                }

            }
            else
            {
                //For DataBase Exceptions like 'Foreign Key refrence Errors' etc
                string dataBaseExceptionMessage = baseBusiness.ReadServerErrorMessages(9001, baseBusiness.DatabaseExceptionFileName);
                if (!string.IsNullOrEmpty(dataBaseExceptionMessage))
                    ErrorMessage.Add(dataBaseExceptionMessage);
                //Error
            }
            return ErrorMessage;
        }

        public string GetInoviceDate_InvoiceGroup(int GroupType, int AgentAirlineSNo)
        {
            SqlParameter[] Parameters = { new SqlParameter("@Type", GroupType), 
                                        new SqlParameter("@AgentAirlineSNo", AgentAirlineSNo)
                                        };
            DataSet ds = SqlHelper.ExecuteDataset(ReadConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, "GetInoviceDate_InvoiceGroup", Parameters);
            return CargoFlash.Cargo.Business.Common.CompleteDStoJSON(ds);
        }
    }
}
