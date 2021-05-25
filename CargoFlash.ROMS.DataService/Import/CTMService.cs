using CargoFlash.Cargo.DataService.Mail;
using CargoFlash.Cargo.Model.Import;
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
using System.ServiceModel;
using System.ServiceModel.Activation;
using System.ServiceModel.Web;
using System.Text;
using CargoFlash.Cargo.Business;
using System.Net;





namespace CargoFlash.Cargo.DataService.Import
{
    [GlobalErrorHandlerBehaviour(typeof(GlobalErrorHandler))]   [ServiceBehavior(IncludeExceptionDetailInFaults = true)]
    [AspNetCompatibilityRequirements(RequirementsMode = AspNetCompatibilityRequirementsMode.Allowed)]
    public class CTMService : BaseWebUISecureObject, ICTMService
    {
        //public Stream GetWebForm(string processName, string moduleName, string appName, string formAction, string IsSubModule)
        //{
        //    return BuildWebForm(processName, moduleName, appName, formAction, "", (IsSubModule == "1"));
        //}

        //public Stream GetGridData(string processName, string moduleName, string appName, string formAction, string IsSubModule, string CitySNo, string FlightNo, string FlightDate)
        //{
        //    return BuildWebForm(processName, moduleName, appName, formAction, "", (IsSubModule == "1"), FlightNo, FlightDate, CitySNo);
        //}

        //private Stream BuildWebForm(string processName, string moduleName, string appName, string formAction, string recordID = "", bool IsSubModule = true, string FlightNo = "0", string FlightDate = "", string CitySNo = "0",int IsBondedWareHouse = 0)
        //{
        //    this.DisplayMode = "FORMACTION." + formAction.ToUpper().Trim();
        //    StringBuilder myCurrentForm = new StringBuilder();
        //    switch (this.DisplayMode)
        //    {
        //        case DisplayModeNew:
        //            using (HtmlFormGenerator htmlFormAdapter = new HtmlFormGenerator(processName))
        //            {
        //                htmlFormAdapter.DisplayMode = DisplayModeType.New;
        //                //myCurrentForm.Append(htmlFormAdapter.InstantiateIn(moduleName, appName, formAction, IsSubModule));
        //            }
        //            break;
        //        case DisplayModeSearch:
        //            using (HtmlFormGenerator htmlFormAdapter = new HtmlFormGenerator(processName))
        //            {
        //                htmlFormAdapter.DisplayMode = DisplayModeType.Search;
        //                myCurrentForm.Append(htmlFormAdapter.InstantiateIn(moduleName, appName, formAction, IsSubModule: IsSubModule));
        //            }
        //            break;
        //        case DisplayModeDuplicate:

        //            break;
        //        case DisplayModeEdit:

        //            break;
        //        case DisplayModeDelete:

        //            break;
        //        case DisplayModeIndexView:
        //            switch (processName)
        //            {
        //                case "CTM":
        //                    //if (appName.ToUpper().Trim() == "CTM")
        //                    CreateGrid(myCurrentForm, processName, CitySNo, FlightNo, FlightDate);
        //                    break;
        //                default:
        //                    break;
        //            }
        //            break;
        //        case DisplayModeReadView:

        //            break;
        //        default:
        //            break;
        //    }
        //    byte[] resultMyForm = Encoding.UTF8.GetBytes(myCurrentForm.ToString());
        //    WebOperationContext.Current.OutgoingResponse.ContentType = "text/html";
        //    return new MemoryStream(resultMyForm);
        //}
        
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

        private Stream BuildWebForm(string processName, string moduleName, string appName, string formAction, string recordID = "", bool IsSubModule = true, int CitySNo = 0, string FlightNo = "", string FlightDate = "", bool IsBondedWareHouse = false)
        {
            //LoggedInCity = (((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"]))).CityCode;
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
                        case "CTM":
                            if (appName.ToUpper().Trim() == "CTM")
                                CreateGrid(myCurrentForm, processName, CitySNo, FlightNo, FlightDate, IsBondedWareHouse,isV2:true);
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
                throw ex;
            }
        }

        public Stream GetGridData(WhereConditionModel model)
        {
            try
            {
                return BuildWebForm(model.processName, model.moduleName, model.appName, "IndexView", CitySNo: model.CitySNo, FlightNo: model.FlightNo, FlightDate: model.FlightDate, IsBondedWareHouse: model.IsBondedWareHouse);
                //return BuildWebForm(processName, moduleName, appName, "IndexView", CitySNo: CitySNo, FlightNo: FlightNo, FlightDate: FlightDate, IsBondedWareHouse: IsBondedWareHouse);
            }
            catch(Exception ex)//
            {
                throw ex;
            }
            }

        private void CreateGrid(StringBuilder Container, string ProcessName, int CitySNo = 0, string FlightNo = "0", string FlightDate = "", bool IsBondedWareHouse = false,bool isV2=false)
        {
            try 
            { 
            using (Grid g = new Grid())
            {
                g.PageName = this.MyPageName;
                g.PrimaryID = this.MyPrimaryID;
                g.ModuleName = this.MyModuleID;
                g.AppsName = this.MyAppID;
                g.DataSoruceUrl = "Services/Import/CTMService.svc/GetCTMGridData";
                g.NewURL = MyPageName + "?" + GetWebURLString("New", false);
                g.ServiceModuleName = this.MyModuleID;
                g.UserID = this.MyUserID;
                g.FormCaptionText = "CTM";
                g.DefaultPageSize = 5;
                g.IsDisplayOnly = true;
                g.IsProcessPart = true;
                g.IsVirtualScroll = false;
                g.IsDisplayOnly = false;
                g.IsActionRequired = false;
                g.IsSortable = true;
                g.IsAllowedFiltering = true;
                g.ProcessName = ProcessName;
                g.IsShowGridHeader = false;
                g.SuccessGrid = "checkCTMProgress";

                g.Column = new List<GridColumn>();
                g.Column.Add(new GridColumn { Field = "AWBSNo", Title = "AWBSNo", DataType = GridDataType.String.ToString(), IsHidden = true, Width = 40 });
                g.Column.Add(new GridColumn { Field = "IsPrint", Title = "IsPrint", DataType = GridDataType.String.ToString(), IsHidden = true, Width = 40 });

                g.Column.Add(new GridColumn { Field = "AWBNo", IsLocked = false, Title = "AWB No", DataType = GridDataType.String.ToString(), Width = 35 });
                g.Column.Add(new GridColumn { Field = "Origin", IsLocked = false, Title = "Origin", DataType = GridDataType.String.ToString(), Width = 40 });
                g.Column.Add(new GridColumn { Field = "Destination", IsLocked = false, Title = "Destination", DataType = GridDataType.String.ToString(), Width = 40 });
                g.Column.Add(new GridColumn { Field = "Pieces", IsLocked = false, Title = "Pieces", DataType = GridDataType.String.ToString(), Width = 35 });
                g.Column.Add(new GridColumn { Field = "GrossWeight", IsLocked = false, Title = "Gross Weight", DataType = GridDataType.String.ToString(), Width = 35 });
                g.Column.Add(new GridColumn { Field = "FlightNo", IsLocked = false, Title = "Flight No.", DataType = GridDataType.String.ToString(), Width = 35 });
                g.Column.Add(new GridColumn { Field = "FlightDate", Title = "Flight Date", Filterable = "true", IsHidden = false, DataType = GridDataType.Date.ToString(), Template = "# if( FlightDate==null) {# # } else {# #= kendo.toString(new Date(data.FlightDate.getTime() + data.FlightDate.getTimezoneOffset()*60000),\"" + UIDateTimeFormat.UIDateFormatString + "\") # #}#", Width = 80 });
                g.Column.Add(new GridColumn { Field = "AWBTYPE", IsLocked = false, Title = "AWB Type", DataType = GridDataType.String.ToString(), Width = 35 });
                g.Column.Add(new GridColumn { Field = "TRANSFERTO", IsLocked = false, Title = "Transfer To", DataType = GridDataType.String.ToString(), Width = 35 });
                g.Column.Add(new GridColumn { Field = "TransferAirportCode", IsLocked = false, Title = "Transfer Station", DataType = GridDataType.String.ToString(), Width = 35 });

                    g.Column.Add(new GridColumn { Field = "SNo", Title = "Print", DataType = GridDataType.String.ToString(), Width = 26, Template = "#if(IsPrint==1){#<input type=\"button\" class=\"incompleteprocess\" style=\"cursor:pointer\" value=\"P\" onclick=\"HighLightGridButton(this,event);PrintAWBWise(#=SNo#)\" />#}else{#<input type=\"button\"  style=\"cursor:pointer\" value=\"P\" onclick=\"HighLightGridButton(this,event);Printalert()\" />#}#", Filterable = "false" });

                //g.Column.Add(new GridColumn { Field = "SNo", Title = "Delete", DataType = GridDataType.String.ToString(), Width = 26, Template = "#if(1==1){#<input type=\"button\" class=\"incompleteprocess\" style=\"cursor:pointer\" value=\"D\" onclick=\"HighLightGridButton(this,event);DeleteCTM(#=SNo#,#=AWBSNo#,this)\" />#}else{#<input type=\"button\"  style=\"cursor:pointer\" value=\"D\" onclick=\"HighLightGridButton(this,event)\" />#}#", Filterable = "false" });
                g.Column.Add(new GridColumn { Field = "SNo", Title = "SNo", DataType = GridDataType.String.ToString(), IsHidden = true });
                g.ExtraParam = new List<GridExtraParam>();
                g.ExtraParam.Add(new GridExtraParam { Field = "CitySNo", Value = CitySNo.ToString() });
                g.ExtraParam.Add(new GridExtraParam { Field = "FlightNo", Value = FlightNo });
                g.ExtraParam.Add(new GridExtraParam { Field = "FlightDate", Value = FlightDate });
                g.ExtraParam.Add(new GridExtraParam { Field = "IsBondedWareHouse", Value = IsBondedWareHouse.ToString() });
                g.InstantiateIn(Container,isV2);

            }
            }
            catch(Exception ex)//
            {
                throw ex;
            }
        }

        public DataSourceResult GetCTMGridData(GetCTMGridData model, int skip, int take, int page, int pageSize, List<SoftwareFactory.Data.GridSort> sort, SoftwareFactory.Data.GridFilter filter)
        {
            try
            { 
            string sorts = GridSort.ProcessSorting(sort);
            string ProcName = "";
            //if (filter == null)
            //{
            //    filter = new GridFilter();
            //    filter.Logic = "AND";
            //    filter.Filters = new List<GridFilter>();
            //}

            DataSet ds = new DataSet();
            string filters = GridFilter.ProcessFilters<CTMRecord>(filter);

            SqlParameter[] Parameters = { 
                                            new SqlParameter("@PageNo", page),
                                            new SqlParameter("@PageSize", pageSize),
                                            new SqlParameter("@WhereCondition", filters),
                                            new SqlParameter("@OrderBy", sorts),
                                            new SqlParameter("@CitySNo", model.CitySNo),
                                            new SqlParameter("@FlightNo", model.FlightNo),
                                            new SqlParameter("@FlightDate", model.FlightDate),
                                            new SqlParameter("@IsBondedWareHouse", model.IsBondedWareHouse),
                                            new SqlParameter("@UserID",  ((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).UserSNo),
                                             new SqlParameter("@AirportCode",  ((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).AirportCode.ToString())
                                        };

            ds = SqlHelper.ExecuteDataset((DMLConnectionString.WebConfigConnectionString), CommandType.StoredProcedure, "spGetCTMDetailsGetList", Parameters);

            var CTMList = ds.Tables[0].AsEnumerable().Select(e => new CTMRecord
            {
                SNo = Convert.ToInt32(e["SNo"]),
                AWBSNo = e["AWBSNo"].ToString(),
                AWBNo = e["AWBNo"].ToString(),
                Origin = e["Origin"].ToString(),
                Destination = e["Destination"].ToString(),
                Pieces = Convert.ToInt32(e["Pieces"]),
                GrossWeight = Convert.ToDecimal(e["GrossWeight"]),
                FlightNo = e["FlightNo"].ToString(),
                FlightDate = e["FlightDate"] == DBNull.Value ? (DateTime?)null : DateTime.SpecifyKind(Convert.ToDateTime(e["FlightDate"]), DateTimeKind.Utc),
                IsPrint = e["ISprint"].ToString(),
                AWBTYPE = e["AWBTYPE"].ToString(),
                TRANSFERTO = e["TransferTo"].ToString(),
                TransferAirportCode=e["TransferAirportCode"].ToString()
            });
            ds.Dispose();
            return new DataSourceResult
            {
                Data = CTMList.AsQueryable().ToList(),
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

        public string GetAWBDetail(string AWBNo, int AWBType)
        {
            try { 
            DataSet ds = new DataSet();
            SqlParameter[] Parameters = { 
                                            new SqlParameter("@AWBNo", AWBNo),
                                              new SqlParameter("@AWBType", AWBType),
                                            new SqlParameter("@UserID",((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).UserSNo),
                                             new SqlParameter("@AirportCode",  ((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).AirportCode.ToString())
                                        };

            ds = SqlHelper.ExecuteDataset((DMLConnectionString.WebConfigConnectionString), CommandType.StoredProcedure, "spGetAWBDetail", Parameters);
            ds.Dispose();

            return CargoFlash.Cargo.Business.Common.CompleteDStoJSON(ds);
            }
            catch(Exception ex)//
            {
                throw ex;
            }
        }
        public string GetCTMDataAWBWise(int SNo)
        {
            try { 
            DataSet ds = new DataSet();
            SqlParameter[] Parameters = { 
                                            new SqlParameter("@SNo", SNo),
                                             
                                            new SqlParameter("@UserID",((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).UserSNo)
                                        };

            ds = SqlHelper.ExecuteDataset((DMLConnectionString.WebConfigConnectionString), CommandType.StoredProcedure, "spGetCTMDataAWBWise", Parameters);
            ds.Dispose();

            return CargoFlash.Cargo.Business.Common.CompleteDStoJSON(ds);
            }
            catch(Exception ex)//
            {
                throw ex;
            }
        }

        public string GetAWBCTMDetail(string AWBNo)
        {
            try
            { 
            DataSet ds = new DataSet();
            SqlParameter[] Parameters = { 
                                            new SqlParameter("@AWBNo", AWBNo),
                                             
                                            new SqlParameter("@UserID",((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).UserSNo),
                                             new SqlParameter("@AirportCode",  ((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).AirportCode.ToString())
                };

            ds = SqlHelper.ExecuteDataset((DMLConnectionString.WebConfigConnectionString), CommandType.StoredProcedure, "spGetAWBCTMDetail", Parameters);
            ds.Dispose();

            return CargoFlash.Cargo.Business.Common.CompleteDStoJSON(ds);
            }
            catch(Exception ex)//
            {
                throw ex;
            }
        }

        public string GetCTMData(int AirlineSNo, string PrintDate)
        {
            try
            { 
            DataSet ds = new DataSet();
            SqlParameter[] Parameters = { 
                                            new SqlParameter("@AirlineSNo", AirlineSNo),
                                              new SqlParameter("@PrintDate", PrintDate),
                                            new SqlParameter("@UserID",((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).UserSNo)
                                        };

            ds = SqlHelper.ExecuteDataset((DMLConnectionString.WebConfigConnectionString), CommandType.StoredProcedure, "spGetCTMData", Parameters);
            ds.Dispose();

            return CargoFlash.Cargo.Business.Common.CompleteDStoJSON(ds);
            }
            catch(Exception ex)//
            {
                throw ex;
            }
        }




        public List<string> SaveCTM(List<CTMInsertRecord> CTMInfo, List<CTMHandlingCharges> dOHandlingCharges, List<AWBInfo> AwbInfo, string DFSno)
        {
            try
            { 
            // validate Business Rule
            DataTable dtCreateCTM = CollectionHelper.ConvertTo(CTMInfo, "TransferType");
            DataTable dtdOHandlingCharges = CollectionHelper.ConvertTo(dOHandlingCharges, "HandlingCharges");
            DataTable dtAwbInfo = CollectionHelper.ConvertTo(AwbInfo, "AwbInfo,BULKULD");

            List<string> ErrorMessage = new List<string>();
            BaseBusiness baseBusiness = new BaseBusiness();
            //if (!baseBusiness.ValidateBaseBusiness("CTM", dtCreateCTM, "SAVE"))
            //{
            //    ErrorMessage = baseBusiness.ErrorMessage;
            //    return ErrorMessage;
            //}
            SqlParameter[] param = 
                                { 
                                   new SqlParameter("@CTMTable",dtCreateCTM),
                                     new SqlParameter("@dOHandlingCharges",dtdOHandlingCharges),
                                     new SqlParameter("@dtAwbInfo",dtAwbInfo),
                                   new SqlParameter("@CreatedBy",((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).UserSNo.ToString()),
                                   new SqlParameter("@UpdatedBy",((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).UserSNo.ToString()),
                                   new SqlParameter("@AirportSno",((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).AirportSNo.ToString()), 
                                   new SqlParameter("@DFSno",DFSno)
                                };

            DataSet ds = SqlHelper.ExecuteDataset(ReadConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, "CreateCTM_MultiWaybill", param);
            ds.Dispose();
            string ret = ds.Tables[1].Rows[0][0].ToString();
            //string ret = (string)SqlHelper.ExecuteScalar(DMLConnectionString.WebConfigConnectionString, "CreateCTM", param).ToString();
            ErrorMessage.Add(ret);
            return ErrorMessage;
            }
            catch(Exception ex)//
            {
                throw ex;
            }
        }

        public string CheckCreditLimit(string BillToSNo, string total)
        {
            try
            { 
            //int ret;
            SqlParameter[] Parameters = { new SqlParameter("@BillToSNo", BillToSNo), new SqlParameter("@total", total) };
            DataSet ds = SqlHelper.ExecuteDataset(ReadConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, "CTMCheckCreditLimit", Parameters);
            return CargoFlash.Cargo.Business.Common.CompleteDStoJSON(ds);
            //ds.Dispose();
            //ret = Convert.ToInt32(ds.Tables[0].Rows[0][0]);
            }
            catch(Exception ex)//
            {
                throw ex;
            }
        }

        public string DeleteCTM(int CTMSno, int AWBSNo, int Type)
        {
            try
            { 
            SqlParameter[] Parameters = { new SqlParameter("@CTMSNo", CTMSno), new SqlParameter("@AWBSNO", AWBSNo), new SqlParameter("@Type", Type) };
            DataSet ds = SqlHelper.ExecuteDataset(ReadConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, "sp_DeleteCTM", Parameters);
            return CargoFlash.Cargo.Business.Common.CompleteDStoJSON(ds);
            }
            catch(Exception ex)//
            {
                throw ex;
            }
        }
    }
}
