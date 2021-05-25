using System;
using System.Collections.Generic;
using System.Linq;
using System.Runtime.Serialization;
using System.ServiceModel;
using System.ServiceModel.Activation;
using System.Text;
using System.ServiceModel.Web;
using System.Configuration;
using System.Data;
using System.Data.SqlClient;
using CargoFlash.Cargo.Model.ULD;
using CargoFlash.SoftwareFactory.Data;
using CargoFlash.Cargo.Business;
using Newtonsoft.Json;
using System.IO;
using CargoFlash.SoftwareFactory.WebUI.Controls;
using CargoFlash.SoftwareFactory.WebUI;
using CargoFlash.SoftwareFactory.WebUI.Adapters;
using System.Net;

namespace CargoFlash.Cargo.DataService.ULD
{
    [GlobalErrorHandlerBehaviour(typeof(GlobalErrorHandler))]
    [ServiceBehavior(IncludeExceptionDetailInFaults = true)]
    [AspNetCompatibilityRequirements(RequirementsMode = AspNetCompatibilityRequirementsMode.Allowed)]
    public class ULDRepairService : BaseWebUISecureObject, IULDRepairService
    {
        public Stream GetWebForm(string processName, string moduleName, string appName, string formAction, string IsSubModule)
        {
            return BuildWebForm(processName, moduleName, appName, formAction, "", (IsSubModule == "1"));
        }
        public Stream GetGridData(ULDRepairConditionModel model)
        {
            return BuildWebForm(model.processName, model.moduleName, model.appName, "IndexView", ULDNo: model.ULDNo, CreatedOn: model.CreatedOn);
        }
        private Stream BuildWebForm(string processName, string moduleName, string appName, string formAction, string recordID = "", bool IsSubModule = true, string ULDNo = "", string CreatedOn = "")
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
                        case "ULDRepair":
                            if (appName.ToUpper().Trim() == "ULDREPAIR")
                                CreateGrid(myCurrentForm, processName, ULDNo, CreatedOn, isV2: true);
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
        private void CreateGrid(StringBuilder Container, string ProcessName, string ULDNo = "", string CreatedOn = "", bool isV2 = false)
        {
            try
            {
                using (Grid g = new Grid())
                {
                    g.PageName = this.MyPageName;
                    g.PrimaryID = "ULDRepairSNo";
                    g.ModuleName = this.MyModuleID;
                    g.AppsName = this.MyAppID;

                    g.ActionTitle = "Action";
                    g.IsActionRequired = true;
                    g.DataSoruceUrl = "Services/ULD/ULDRepairService.svc/GetULDRepairGridData";
                    g.NewURL = MyPageName + "?" + GetWebURLString("New", false);
                    g.ServiceModuleName = this.MyModuleID;
                    g.UserID = this.MyUserID;
                    g.FormCaptionText = "ULD Repair";
                    g.DefaultPageSize = 5;
                    g.IsDisplayOnly = false;
                    g.IsProcessPart = true;
                    g.IsVirtualScroll = false;
                    g.IsShowGridHeader = false;
                    g.ProcessName = ProcessName;
                    g.SuccessGrid = "checkRepairOrScrap";

                    g.Column = new List<GridColumn>();
                    g.Column.Add(new GridColumn { Field = "TypeOfMaintenanceId", Title = "TypeOfMaintenanceId", DataType = GridDataType.String.ToString(), IsHidden = true, });
                    g.Column.Add(new GridColumn { Field = "VendorId", Title = "VendorId", DataType = GridDataType.String.ToString(), IsHidden = true, });
                    g.Column.Add(new GridColumn { Field = "MUldType", Title = "MUldType", DataType = GridDataType.String.ToString(), IsHidden = true, });
                    g.Column.Add(new GridColumn { Field = "ULDRepairSNo", Title = "ULDRepairSNo", DataType = GridDataType.String.ToString(), IsHidden = true, });
                    g.Column.Add(new GridColumn { Field = "ULDNo", IsLocked = false, Title = "ULD No", DataType = GridDataType.String.ToString(), Width = 60 });
                    g.Column.Add(new GridColumn { Field = "ULDType", IsLocked = false, Title = "ULD Type", DataType = GridDataType.String.ToString(), Width = 60 });
                    g.Column.Add(new GridColumn { Field = "Maintenancetype", IsLocked = false, Title = "Maintenance Type", DataType = GridDataType.String.ToString(), Width = 60 });
                    g.Column.Add(new GridColumn { Field = "Vendor", IsLocked = false, Title = "Vendor", DataType = GridDataType.String.ToString(), Width = 60 });
                    g.Column.Add(new GridColumn { Field = "CreatedBy", IsLocked = false, Title = "Created By", DataType = GridDataType.String.ToString(), Width = 60 });
                    g.Column.Add(new GridColumn { Field = "CreatedOn", Title = "Created On", IsHidden = false, DataType = GridDataType.Date.ToString(), Width = 50, Template = "# if( CreatedOn==null) {# # } else {# #= kendo.toString(new Date(data.CreatedOn.getTime() + data.CreatedOn.getTimezoneOffset()*60000),\"" + UIDateTimeFormat.UIDateFormatString + "\") # #}#" });
                    g.Column.Add(new GridColumn { Field = "RepairOrScrap", Title = "RepairOrScrap", DataType = GridDataType.String.ToString(), IsHidden = true, });
                    g.Column.Add(new GridColumn { Field = "IsQuoted", Title = "IsQuoted", DataType = GridDataType.String.ToString(), IsHidden = true });
                    g.Column.Add(new GridColumn { Field = "IsApproved", Title = "IsApproved", DataType = GridDataType.String.ToString(), IsHidden = true });
                    g.Column.Add(new GridColumn { Field = "IsRepaired", Title = "IsRepaired", DataType = GridDataType.String.ToString(), IsHidden = true });
                    g.Column.Add(new GridColumn { Field = "ProcessStatus", Title = "ProcessStatus", DataType = GridDataType.String.ToString(), IsHidden = true });
                    g.Column.Add(new GridColumn { Field = "IsinvoiceRcvd", Title = "IsinvoiceRcvd", DataType = GridDataType.String.ToString(), IsHidden = true });
                    g.Action = new List<GridAction>();
                    g.Action.Add(new GridAction
                    {
                        ButtonCaption = "Read",
                        ClientAction = "BindEvents",
                        ActionName = "READ",
                        AppsName = ProcessName,
                        CssClassName = "read",
                        ModuleName = "V"
                    });
                    g.Action.Add(new GridAction
                    {
                        ButtonCaption = "Edit",
                        ClientAction = "BindEvents",
                        ActionName = "EDIT",
                        AppsName = ProcessName,
                        CssClassName = "read",
                        ModuleName = "E"
                    });

                    g.ExtraParam = new List<GridExtraParam>();
                    g.ExtraParam.Add(new GridExtraParam { Field = "ULDNo", Value = ULDNo });
                    g.ExtraParam.Add(new GridExtraParam { Field = "CreatedOn", Value = CreatedOn });
                    g.InstantiateIn(Container, isV2);
                }
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }
        public DataSourceResult GetULDRepairGridData(GetULDRepairGridData model, int skip, int take, int page, int pageSize, List<SoftwareFactory.Data.GridSort> sort, SoftwareFactory.Data.GridFilter filter)
        {
            try
            {
                // FlightDate = Convert.ToDateTime(FlightDate, CultureInfo.CurrentCulture).ToString("yyyy/MM/dd");

                string sorts = GridSort.ProcessSorting(sort);
                string ProcName = "";
                if (filter == null)
                {
                    filter = new GridFilter();
                    filter.Logic = "AND";
                    filter.Filters = new List<GridFilter>();
                }
                DataSet ds = new DataSet();
                //if (PageName == "TRANSITFWB")
                //{
                //    ProcName = "GetListTransitFWB";
                //}
                //else
                //{
                ProcName = "GetULDRepairGridData";
                ////}


                string filters = GridFilter.ProcessFilters<ULDRepair>(filter);

                SqlParameter[] Parameters = {
                                            new SqlParameter("@PageNo", page), 
                                            new SqlParameter("@PageSize", pageSize), 
                                            new SqlParameter("@WhereCondition", filters), 
                                            new SqlParameter("@OrderBy", sorts), 
                                            new SqlParameter("@ULDNo", model.ULDNo), 
                                            new SqlParameter("@CreatedOn", model.CreatedOn)
                                        };


                ds = SqlHelper.ExecuteDataset(DMLConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, ProcName, Parameters);

                var wmsBookingList = ds.Tables[0].AsEnumerable().Select(e => new ULDRepair
                {
                    ULDRepairSNo = Convert.ToInt32(e["SNo"]),
                    ULDNo = Convert.ToString(e["ULDNo"]),
                    ULDType = Convert.ToString(e["ULDType"]),
                    Vendor = Convert.ToString(e["Vendor"]),
                    Maintenancetype = Convert.ToString(e["Maintenancetype"]),
                    CreatedBy = Convert.ToString(e["CreatedBy"]),
                    CreatedOn = e["CreatedOn"] == DBNull.Value ? (DateTime?)null : DateTime.SpecifyKind(Convert.ToDateTime(e["CreatedOn"]), DateTimeKind.Utc),
                    RepairOrScrap = Convert.ToString(e["RepairOrScrap"]),
                    IsApproved = Convert.ToString(e["IsApproved"]),
                    IsQuoted = Convert.ToString(e["IsQuoted"]),
                    IsRepaired = Convert.ToString(e["IsRepaired"]),
                    ProcessStatus = Convert.ToString(e["ProcessStatus"]),
                    TypeOfMaintenanceId = Convert.ToString(e["TypeOfMaintenanceId"]),
                    VendorId = Convert.ToString(e["VendorId"]),
                    MUldType = Convert.ToString(e["MUldType"]),
                    IsinvoiceRcvd = Convert.ToString(e["IsinvoiceRcvd"]),
                    TypeOfAdditionalMaintenance = Convert.ToString(e["TypeOfAdditionalMaintenance"])
                    //DailyFlightSNo = Convert.ToInt64(e["DailyFlightSNo"].ToString() == "" ? 0 : e["DailyFlightSNo"]),
                    //AWBNo = e["AWBNo"].ToString(),
                    //SLINo = e["SLINo"].ToString(),
                    //AWBDate = e["AWBDate"] == DBNull.Value ? (DateTime?)null : DateTime.SpecifyKind(Convert.ToDateTime(e["AWBDate"]), DateTimeKind.Utc),
                    //ShipmentOrigin = e["ShipmentOrigin"].ToString(),
                    //ShipmentDestination = e["ShipmentDestination"].ToString(),
                    //Origin = e["Origin"].ToString(),
                    //Destination = e["Destination"].ToString(),
                    //Gross = Convert.ToDecimal(e["Gross"].ToString()),
                    //Volume = Convert.ToDecimal(e["Volume"].ToString() == "" ? "0" : e["Volume"].ToString()),
                    //ChWt = Convert.ToDecimal(e["ChWt"].ToString() == "" ? "0" : e["ChWt"].ToString()),
                    //Pcs = Convert.ToInt32(e["Pcs"].ToString() == "" ? "0" : e["Pcs"].ToString()),
                    //FlightNo = e["FlightNo"].ToString(),
                    //FlightDate = e["FlightDate"] == DBNull.Value ? (DateTime?)null : DateTime.SpecifyKind(Convert.ToDateTime(e["FlightDate"]), DateTimeKind.Utc),
                    //FlightOrigin = e["FlightOrigin"].ToString(),
                    //FlightDestination = e["FlightDestination"].ToString(),
                    //Status = e["Status"].ToString(),
                    //CommodityCode = e["CommodityCode"].ToString(),
                    //ProductName = e["ProductName"].ToString(),
                    //NoOfHouse = e["NoOfHouse"].ToString(),
                    //AccGrWt = Convert.ToDecimal(e["AccGrWt"].ToString()),
                    //AccVolWt = Convert.ToDecimal(e["AccVolWt"].ToString() == "" ? "0" : e["AccVolWt"].ToString()),
                    //AccPcs = Convert.ToInt32(e["AccPcs"].ToString() == "" ? "0" : e["AccPcs"].ToString()),
                    //Shipper = "",
                    //Consignee = "",
                    //HandlingInfo = "",
                    //XRay = "",
                    //Location = "",
                    //Payment = "",
                    //Dimension = "",
                    //Weight = "",
                    //Reservation = "",
                    //HAWB = "",
                    //ShippingBill = "",
                    //Document = "",
                    //IsWarning = Convert.ToBoolean(e["IsWarning"]),
                    //WarningRemarks = e["WarningRemarks"].ToString(),
                    //FBLWt = Convert.ToDecimal(e["FBLWt"].ToString() == "" ? "0" : e["FBLWt"].ToString()),// Added by RH 12-08-15
                    //FWBWt = Convert.ToDecimal(e["FWBWt"].ToString() == "" ? "0" : e["FWBWt"].ToString()),// Added by RH 12-08-15
                    //RCSWt = Convert.ToDecimal(e["RCSWt"].ToString() == "" ? "0" : e["RCSWt"].ToString()),// Added by RH 12-08-15
                    //SPHC = e["SPHC"].ToString()
                });
                //DateTime.ParseExact(e["BookingDate"].ToString(), "yyyy-MM-dd",                                       System.Globalization.CultureInfo.InvariantCulture)
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
        public string CheckContainer(string ULDSNo)
        {
            try
            {
                SqlParameter[] Parameters = { new SqlParameter("@ULDSNo", ULDSNo) };
                DataSet ds = SqlHelper.ExecuteDataset(DMLConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, "CheckContainer", Parameters);
                ds.Dispose();
                return CargoFlash.Cargo.Business.Common.CompleteDStoJSON(ds);
            }
            catch (Exception ex)//(Exception ex)
            {
                throw ex;
            }
        }
        public KeyValuePair<string, List<ULDRepairItem>> GetULDRepairableItem(string recordID, int page, int pageSize, string whereCondition, string sort)
        {
            try
            {
                ULDRepairItem ULDRepairItem = new ULDRepairItem();
                SqlParameter[] Parameters = {
                                           new SqlParameter("@ULDSNo", recordID=="2"?"0":recordID),
                                           new SqlParameter("@UserID", ((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).UserSNo.ToString())
                                        };
                DataSet ds = SqlHelper.ExecuteDataset(DMLConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, "GetULDRepairableItem", Parameters);

                if (ds.Tables[0].Rows.Count != 0)
                {
                    var ULDRepairTransList = ds.Tables[0].AsEnumerable().Select(e => new ULDRepairItem
                    {
                        SNo = 0,
                        Description = "",
                        Condition = "",
                        Remarks = "",
                        ItemName = "",
                        ItemDescription = "",
                    });
                    return new KeyValuePair<string, List<ULDRepairItem>>(ds.Tables[0].Rows[0][0].ToString(), ULDRepairTransList.AsQueryable().ToList());
                }
                var abc = ds.Tables[0].AsEnumerable().Select(e => new ULDRepairItem
                {
                    SNo = Convert.ToInt32(e["SNo"])
                });
                return new KeyValuePair<string, List<ULDRepairItem>>(ds.Tables[0].ToString(), abc.AsQueryable().ToList());
            }
            catch (Exception ex)//(Exception ex)
            {
                throw ex;
            }
        }
        public string SaveULDRepair(string ULDSNo, string Repair, string MaintenanceType, string ULDVendor, string AuthorizedPerson, string AirportSNo, string strData, string TypeOfAdditionalMaintenance)
        {
            DataTable dtCreateULDRepair = new DataTable();
            DataSet ds = new DataSet();

            try
            {

                if (Repair == "1")
                {
                    BaseBusiness baseBusiness = new BaseBusiness();
                    SqlParameter[] param = 
                                        { 
                                            new SqlParameter("@ULDSNo",ULDSNo),
                                            new SqlParameter("@Repair",Repair),                                      
                                            new SqlParameter("@AirportSNo",AirportSNo),                                       
                                            new SqlParameter("@UpdatedBy",((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).UserSNo.ToString()),
                                        };

                    ds = SqlHelper.ExecuteDataset(DMLConnectionString.WebConfigConnectionString, "UldRepairScrap", param);

                }
                else
                {
                    DataTable dt = (DataTable)JsonConvert.DeserializeObject(CargoFlash.Cargo.Business.Common.Base64ToString(strData), (typeof(DataTable)));
                    dtCreateULDRepair.Columns.Add("SNo");
                    dtCreateULDRepair.Columns.Add("Condition");
                    dtCreateULDRepair.Columns.Add("Remarks");
                    foreach (DataRow dr in dt.Rows)
                    {
                        DataRow drRow = dtCreateULDRepair.NewRow();
                        drRow["SNo"] = dr["HdnItemName"];
                        drRow["Condition"] = dr["Condition"];
                        drRow["Remarks"] = dr["Remarks"];
                        dtCreateULDRepair.Rows.Add(drRow);
                    }
                    BaseBusiness baseBusiness = new BaseBusiness();
                    SqlParameter[] param = 
                                        { 
                                            new SqlParameter("@ULDSNo",ULDSNo),
                                            new SqlParameter("@Repair",Repair),
                                            new SqlParameter("@MaintenanceType",MaintenanceType),
                                            new SqlParameter("@ULDVendor",ULDVendor),
                                            new SqlParameter("@AuthorizedPerson",AuthorizedPerson),
                                            new SqlParameter("@AirportSNo",AirportSNo),
                                            new SqlParameter("@ULDRepairTable",dtCreateULDRepair),
                                            new SqlParameter("@UpdatedBy",((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).UserSNo.ToString()),
                                            new SqlParameter("@TypeOfAdditionalMaintenance",TypeOfAdditionalMaintenance)
                                        };

                    ds = SqlHelper.ExecuteDataset(DMLConnectionString.WebConfigConnectionString, "CreateULDRepair", param);
                }

                return ds.Tables[ds.Tables.Count - 1].Rows[0][0].ToString();

            }
            catch (Exception ex)
            {
                throw ex;
            }

        }
        public string GetULDRepairInformation(string ULDRepairSNo, string PageType)
        {
            try
            {
                SqlParameter[] Parameters = { new SqlParameter("@ULDRepairSNo", ULDRepairSNo), new SqlParameter("@PageType", PageType) };
                DataSet ds = SqlHelper.ExecuteDataset(DMLConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, "GetULDRepairInformation", Parameters);
                ds.Dispose();
                return CargoFlash.Cargo.Business.Common.CompleteDStoJSON(ds);
            }
            catch (Exception ex)//(Exception ex)
            {
                throw ex;
            }
        }
        public KeyValuePair<string, List<ULDRepairItem>> GetFetchUldRepairableItem(string recordID, int page, int pageSize, string whereCondition, string sort)
        {
            try
            {
                ULDRepairItem ULDRepairItem = new ULDRepairItem();
                SqlParameter[] Parameters = {
                                           new SqlParameter("@ULDRepairSNo", recordID),
                                           new SqlParameter("@PageType", whereCondition),
                                           new SqlParameter("@UserID", ((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).UserSNo.ToString())
                                        };
                DataSet ds = SqlHelper.ExecuteDataset(DMLConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, "GetFetchUldRepairableItem", Parameters);

                if (ds.Tables[0].Rows.Count != 0)
                {
                    var ULDRepairTransList = ds.Tables[0].AsEnumerable().Select(e => new ULDRepairItem
                    {
                        SNo = Convert.ToInt32(e["SNo"]),
                        ItemName = e["ItemName"].ToString(),
                        Condition = e["Condition"].ToString(),
                        Remarks = e["Remarks"].ToString(),
                        ItemDescription = e["ItemDescription"].ToString(),
                    });
                    return new KeyValuePair<string, List<ULDRepairItem>>(ds.Tables[0].Rows[0][0].ToString(), ULDRepairTransList.AsQueryable().ToList());
                }
                var abc = ds.Tables[0].AsEnumerable().Select(e => new ULDRepairItem
                {
                    SNo = Convert.ToInt32(e["SNo"])
                });
                return new KeyValuePair<string, List<ULDRepairItem>>(ds.Tables[0].ToString(), abc.AsQueryable().ToList());
            }
            catch (Exception ex)//(Exception ex)
            {
                throw ex;
            }
        }
        public string UpdateULDRepair(string ULDSNo, string Repair, string MaintenanceType, string ULDVendor, string AuthorizedPerson, string AirportSNo, string ULDRepairSNo, string strData, string TypeOfAdditionalMaintenance)
        {
            try
            {
                DataTable dtCreateULDRepair = new DataTable();
                DataSet ds = new DataSet();


                DataTable dt = (DataTable)JsonConvert.DeserializeObject(CargoFlash.Cargo.Business.Common.Base64ToString(strData), (typeof(DataTable)));
                dtCreateULDRepair.Columns.Add("SNo");
                dtCreateULDRepair.Columns.Add("Condition");
                dtCreateULDRepair.Columns.Add("Remarks");
                foreach (DataRow dr in dt.Rows)
                {
                    DataRow drRow = dtCreateULDRepair.NewRow();
                    drRow["SNo"] = dr["HdnItemName"]; ;
                    drRow["Condition"] = dr["Condition"];
                    drRow["Remarks"] = dr["Remarks"];
                    dtCreateULDRepair.Rows.Add(drRow);
                }
                BaseBusiness baseBusiness = new BaseBusiness();
                SqlParameter[] param = 
                                        { 
                                            new SqlParameter("@ULDSNo",ULDSNo),
                                            new SqlParameter("@Repair",Repair),
                                            new SqlParameter("@MaintenanceType",MaintenanceType),
                                            new SqlParameter("@ULDVendor",ULDVendor),
                                            new SqlParameter("@AuthorizedPerson",AuthorizedPerson),
                                            new SqlParameter("@AirportSNo",AirportSNo),
                                            new SqlParameter("@ULDRepairSNo",ULDRepairSNo),
                                            new SqlParameter("@ULDRepairTable",dtCreateULDRepair),
                                            new SqlParameter("@UpdatedBy",((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).UserSNo.ToString()),
                                            new SqlParameter("@TypeOfAdditionalMaintenance",TypeOfAdditionalMaintenance)
                                        };

                ds = SqlHelper.ExecuteDataset(DMLConnectionString.WebConfigConnectionString, "UpdateULDRepair", param);
                return ds.Tables[ds.Tables.Count - 1].Rows[0][0].ToString();
            }
            catch (Exception ex)//(Exception ex) 
            {
                throw ex;
            }

        }
        public List<string> DeleteULDRepairableItemQuotation(string recordID)
        {
            try
            {
                int ret = 0;
                List<string> ErrorMessage = new List<string>();
                BaseBusiness baseBussiness = new BaseBusiness();
                SqlParameter[] Parameters = { new SqlParameter("@SNo", recordID) };
                ret = (int)SqlHelper.ExecuteScalar(DMLConnectionString.WebConfigConnectionString, "sp_DeleteULDRepairableItemQuotation", Parameters);
                if (ret > 0)
                {
                    if (ret > 1000)
                    {
                        string serverErrorMessage = baseBussiness.ReadServerErrorMessages(ret, "ULDRepairableItems");
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
        public string UpdateQuoteULDRepair(string MaterialCost, string ManhoursCost, string AirportSNo, string ULDRepairSNo, string AlertMailCostApproval, List<ULDRepairItem> ULDRepairItem, string strData)
        {
            try
            {
                DataSet ds = new DataSet();
                DataTable dtULDRepairItemType = CollectionHelper.ConvertTo(ULDRepairItem, "SNo,Description,Condition,Remarks,ItemName,ItemDescription,IsApproval,AlertEmail");

                BaseBusiness baseBusiness = new BaseBusiness();

                DataTable dt = new DataTable();
                dt.Clear();
                dt.Columns.Add("ULDRepairMaterialSNo");
                dt.Columns.Add("ULDRepairSNo");
                dt.Columns.Add("Qty");
                dt.Columns.Add("MaterialPrice");
                dt.Columns.Add("TotalCost");

                for (int i = 0; i < dtULDRepairItemType.Rows.Count; i++)
                {
                    DataRow dr = dt.NewRow();
                    dr = dtULDRepairItemType.Rows[i];
                    dt.ImportRow(dr);
                }

                    SqlParameter[] param = 
                                        {   new SqlParameter("@ManHoursCost",ManhoursCost),      
                                            new SqlParameter("@AlertMailCostApproval",AlertMailCostApproval),
                                            new SqlParameter("@ULDRepairItemType",dt),
                                            new SqlParameter("@ULDRepairSNo",ULDRepairSNo),
                                            new SqlParameter("@CreatedBy",((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).UserSNo.ToString()),
                                            new SqlParameter("@UpdatedBy",((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).UserSNo.ToString()),
                                        };

                    ds = SqlHelper.ExecuteDataset(DMLConnectionString.WebConfigConnectionString, "ULDRepairQuotationCostApproval", param);
                    dt.Clear();
              
                return ds.Tables[ds.Tables.Count - 1].Rows[0][0].ToString();
            }
            catch (Exception ex)// (Exception ex)
            {
                throw ex;
            }
        }

        public string UpdateApprovedULDRepair(string Approved, string Remarks, string AirportSNo, string ULDRepairSNo,string AlertEmail, List<ULDRepairItem> ULDRepairItem, List<ULDRepairMainCostItem> ULDRepairMainHourItem)
        {
            try
            {
                DataTable dtULDRepairItemType = CollectionHelper.ConvertTo(ULDRepairItem, "SNo,Description,Condition,Remarks,AlertEmail,ItemName,ItemDescription,TotalCost,MaterialPrice,Qty");
                DataTable ULDRepairMainHourItems = CollectionHelper.ConvertTo(ULDRepairMainHourItem, "");
                string FIsApproval = "0";

                for (int A = 0; A < ULDRepairItem.Count; A++)
                {
                    if (ULDRepairItem[A].IsApproval == "1")
                    {
                        FIsApproval = "1";
                    }
                }

                string IsChecked = "0";

                for (int Checked = 0; Checked < ULDRepairMainHourItem.Count; Checked++)
                {
                    if (ULDRepairMainHourItem[Checked].AIsApproval == "1")
                    {
                        IsChecked = "1";
                    }
                }

                DataSet ds = new DataSet();
                BaseBusiness baseBusiness = new BaseBusiness();
                SqlParameter[] param = 
                                        {   new SqlParameter("@IsApproval",FIsApproval), 
                                            new SqlParameter("@Remarks",Remarks),   
                                            new SqlParameter("@AlertEmail",AlertEmail),   
                                            new SqlParameter("@ULDApprovalType",dtULDRepairItemType),                                         
                                            new SqlParameter("@ULDApprovalTypeByManHourCost",ULDRepairMainHourItems),
                                            new SqlParameter("@UpdatedBy",((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).UserSNo.ToString()),
                                        };
                ds = SqlHelper.ExecuteDataset(DMLConnectionString.WebConfigConnectionString, "UpdateApprovedULDRepair", param);
                return CargoFlash.Cargo.Business.Common.CompleteDStoJSON(ds);
            }
            catch (Exception ex)// (Exception ex)
            {
                throw ex;
            }
        }
        public string UpdateReturnULDRepair(string Repaired, string ReturnRemarks, string Serviceable, string AirportSNo, string ULDRepairSNo, string ULDRepairReturnImage, string ULDRepairReturnInvoice, string Invoice, string Date)
        {
            try
            {
                string ISRepaired = string.Empty;
                if (Repaired == "0")
                {
                    ISRepaired = "1";
                }
                else if (Repaired == "1")
                {
                    ISRepaired = "0";
                }
                //if (Serviceable == "0")
                //{
                //    Serviceable = "1";
                //}
                //else if (Serviceable == "1")
                //{
                //    Serviceable = "0";
                //}
                DataSet ds = new DataSet();
                DataTable dtUploader = new DataTable();
                string BaseDirectory = System.Web.HttpContext.Current.Server.MapPath("~/");
                string path = BaseDirectory + "UploadImage\\";

                string UserSNo = ((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).UserSNo.ToString();
                BaseBusiness baseBusiness = new BaseBusiness();
                dtUploader.Columns.Add("ULDRepairSNo");
                dtUploader.Columns.Add("UploadDocument", typeof(byte[]));
                dtUploader.Columns.Add("ULDRepairTypeDownload");
                dtUploader.Columns.Add("ImageName");
                dtUploader.Columns.Add("ImageAttachement");
                DataRow row;

                string[] filePaths = Directory.GetFiles(path, "*.*");
                string a = UserSNo + "_" + ULDRepairSNo + "_" + ULDRepairReturnImage;
                string b = UserSNo + "_" + ULDRepairSNo + "_" + ULDRepairReturnInvoice;
                if (filePaths.Length > 0)
                {
                    for (int i = 0; i < filePaths.Length; i++)
                    {
                        string[] filename = Path.GetFileName(filePaths[i]).Split('_');
                        //int length = filename[0].Length;
                        //string FinalFileName1 = filename[0].Substring(filename[0].Length - 1);
                        if (filename.Length > 3)
                        {
                            string FinalFileName = filename[0] + "_" + filename[1] + "_" + filename[2];
                            if (FinalFileName == a || FinalFileName == b)
                            {
                                var serverPath = filePaths[i];
                                row = dtUploader.NewRow();
                                row["ULDRepairSNo"] = ULDRepairSNo;
                                row["UploadDocument"] = ReadImageFile(serverPath);
                                row["ULDRepairTypeDownload"] = Convert.ToString(filename[2]);
                                row["ImageName"] = Convert.ToString(filename[6]);
                                row["ImageAttachement"] = Convert.ToString(Path.GetFileName(filePaths[i]));
                                dtUploader.Rows.Add(row);
                            }
                        }


                    }
                }

                SqlParameter[] param = 
                                        { 
                                            new SqlParameter("@Repaired",ISRepaired),
                                            new SqlParameter("@ReturnRemarks",ReturnRemarks),
                                            new SqlParameter("@Serviceable",Serviceable),
                                            new SqlParameter("@AirportSNo",AirportSNo),
                                            new SqlParameter("@ULDRepairSNo",ULDRepairSNo),
                                            new SqlParameter("@UpdatedBy",((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).UserSNo.ToString()),
                                            new SqlParameter("@Uploader",dtUploader),
                                            new SqlParameter("@Invoice",Invoice),
                                            new SqlParameter("@Date",Date),
                                        };

                ds = SqlHelper.ExecuteDataset(DMLConnectionString.WebConfigConnectionString, "UpdateReturnULDRepair", param);
                for (int i = 0; i < dtUploader.Rows.Count; i++)
                {
                    string FileName = dtUploader.Rows[i]["ImageAttachement"].ToString();
                    System.IO.File.Delete(Path.GetFullPath(path + FileName));
                }
                return ds.Tables[ds.Tables.Count - 1].Rows[0][0].ToString();
            }
            catch (Exception ex)// (Exception ex)
            {
                throw ex;
            }

        }
        public static byte[] ReadImageFile(string imageLocation)
        {
            byte[] imageData = null;
            FileInfo fileInfo = new FileInfo(imageLocation);
            long imageFileLength = fileInfo.Length;
            FileStream fs = new FileStream(imageLocation, FileMode.Open, FileAccess.Read);
            BinaryReader br = new BinaryReader(fs);
            imageData = br.ReadBytes((int)imageFileLength);
            fs.Dispose();
            br.Dispose();
            return imageData;
        }
        public string GetQuoteHistory(string ULDRepairSNo)
        {
            try
            {
                SqlParameter[] Parameters = { new SqlParameter("@ULDRepairSNo", ULDRepairSNo) };
                DataSet ds = SqlHelper.ExecuteDataset(DMLConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, "GetQuoteHistory", Parameters);
                ds.Dispose();
                return CargoFlash.Cargo.Business.Common.CompleteDStoJSON(ds);
            }
            catch (Exception ex)//(Exception ex)
            {
                throw ex;
            }
        }
        public string GetULDRepairPrintRecord(int ULDRepairSNo)
        {
            try
            {
                SqlParameter[] Parameters = { new SqlParameter("@ULDRepairSNo", ULDRepairSNo), };
                DataSet ds = SqlHelper.ExecuteDataset(DMLConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, "GetULDRepairPrintRecord", Parameters);
                ds.Dispose();
                return CargoFlash.Cargo.Business.Common.CompleteDStoJSON(ds);
            }
            catch (Exception ex)//(Exception ex)
            {
                throw ex;
            }
        }
        public string GetULDRepairVE(string ULDRepairSNo)
        {
            try
            {
                SqlParameter[] Parameters = { new SqlParameter("@ULDRepairSNo", ULDRepairSNo) };
                DataSet ds = SqlHelper.ExecuteDataset(DMLConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, "GetULDRepairVE", Parameters);
                ds.Dispose();
                return CargoFlash.Cargo.Business.Common.CompleteDStoJSON(ds);
            }
            catch (Exception ex)//(Exception ex)
            {
                throw ex;
            }
        }
        public string GetInvoiceCheck(string ULDRepairSNo)
        {
            try
            {
                SqlParameter[] Parameters = { new SqlParameter("@ULDRepairSNo", ULDRepairSNo) };
                DataSet ds = SqlHelper.ExecuteDataset(DMLConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, "GetULDInvoiceCheck", Parameters);
                ds.Dispose();
                return CargoFlash.Cargo.Business.Common.CompleteDStoJSON(ds);
            }
            catch (Exception ex)//(Exception ex)
            {
                throw ex;
            }
        }
        public string GetApproveCheck(string ULDRepairSNo)
        {
            try
            {
                SqlParameter[] Parameters = { new SqlParameter("@ULDRepairSNo", ULDRepairSNo) };
                DataSet ds = SqlHelper.ExecuteDataset(DMLConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, "GetApproveCheck", Parameters);
                ds.Dispose();
                return CargoFlash.Cargo.Business.Common.CompleteDStoJSON(ds);
            }
            catch (Exception ex)//(Exception ex)
            {
                throw ex;
            }
        }
        public string GetDescription(string PartNumber)
        {
            try
            {
                SqlParameter[] Parameters = { new SqlParameter("@PartNumber", PartNumber) };
                DataSet ds = SqlHelper.ExecuteDataset(DMLConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, "GetDescripRepairableItem", Parameters);
                ds.Dispose();
                return CargoFlash.Cargo.Business.Common.CompleteDStoJSON(ds);
            }
            catch (Exception ex)//(Exception ex)
            {
                throw ex;
            }
        }
        public string GetPrice(string PartNumber)
        {
            try
            {
                SqlParameter[] Parameters = { new SqlParameter("@PartNumber", PartNumber) };
                DataSet ds = SqlHelper.ExecuteDataset(DMLConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, "SpUldReapirGetPrice", Parameters);
                ds.Dispose();
                return CargoFlash.Cargo.Business.Common.CompleteDStoJSON(ds);
            }
            catch (Exception ex) { throw ex; }
        }
        public KeyValuePair<string, List<ULDRepairItem>> GetULDRepairableItemQuotation(string recordID, int page, int pageSize, string whereCondition, string sort)
        {
            try
            {
                ULDRepairItem ULDRepairItem = new ULDRepairItem();
                SqlParameter[] Parameters = {                                          
                                           new SqlParameter("@ULDRepairSNo", recordID),                                    
                                        };
                DataSet ds = SqlHelper.ExecuteDataset(DMLConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, "GetULDRepairQuotationApproval", Parameters);
                if (ds.Tables[0].Rows.Count != 0)
                {
                    var ULDRepairTransList = ds.Tables[0].AsEnumerable().Select(e => new ULDRepairItem
                    {
                        SNo = Convert.ToInt32(e["SNo"]),
                        ULDRepairMaterialSNo = e["RepairMaterialSNo"].ToString(),
                        ItemName = e["PartNumber"].ToString(),
                        ItemDescription = e["ItemDescription"].ToString(),
                        Qty = e["Qty"].ToString(),
                        MaterialPrice = e["MaterialPrice"].ToString(),
                        TotalCost = e["TotalCost"].ToString(),
                        IsApproval = e["IsApproval"].ToString(),
                    });
                    return new KeyValuePair<string, List<ULDRepairItem>>(ds.Tables[0].Rows[0][0].ToString(), ULDRepairTransList.AsQueryable().ToList());
                }
                var abc = ds.Tables[0].AsEnumerable().Select(e => new ULDRepairItem
                {
                    SNo = Convert.ToInt32(e["SNo"])
                });
                return new KeyValuePair<string, List<ULDRepairItem>>(ds.Tables[0].ToString(), abc.AsQueryable().ToList());
            }
            catch (Exception ex)//(Exception ex)
            {

                throw ex;
            }
        }
        public KeyValuePair<string, List<ULDRepairItem>> GetFetchUldRepairableItemApproval(string recordID, int page, int pageSize, string whereCondition, string sort)
        {
            try
            {
                ULDRepairItem ULDRepairItem = new ULDRepairItem();
                SqlParameter[] Parameters = {                                          
                                           new SqlParameter("@ULDRepairSNo", recordID),                                    
                                        };
                DataSet ds = SqlHelper.ExecuteDataset(DMLConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, "GetULDRepairQuotationApproval", Parameters);

                if (ds.Tables[0].Rows.Count != 0)
                {
                    var ULDRepairTransList = ds.Tables[0].AsEnumerable().Select(e => new ULDRepairItem
                    {
                        SNo = Convert.ToInt32(e["SNo"]),
                        ItemName = e["PartNumber"].ToString(),
                        ItemDescription = e["ItemDescription"].ToString(),
                        Qty = e["Qty"].ToString(),
                        MaterialPrice = e["MaterialPrice"].ToString(),
                        TotalCost = e["TotalCost"].ToString(),
                        IsApproval = e["IsApproval"].ToString(),
                    });
                    return new KeyValuePair<string, List<ULDRepairItem>>(ds.Tables[0].Rows[0][0].ToString(), ULDRepairTransList.AsQueryable().ToList());
                }
                var abc = ds.Tables[0].AsEnumerable().Select(e => new ULDRepairItem
                {
                    SNo = Convert.ToInt32(e["SNo"])
                });
                return new KeyValuePair<string, List<ULDRepairItem>>(ds.Tables[0].ToString(), abc.AsQueryable().ToList());
            }
            catch (Exception ex)//(Exception ex)
            {
                throw ex;
            }
        }
        //public string GetManHoursCost(string MaintenanceType, string VendorId)
        //{
        //    try
        //    {
        //        SqlParameter[] Parameters = { new SqlParameter("@MaintenanceType", MaintenanceType), new SqlParameter("@VendorId", VendorId) };
        //        DataSet ds = SqlHelper.ExecuteDataset(DMLConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, "SpGetManHoursCost", Parameters);
        //        ds.Dispose();
        //        return CargoFlash.Cargo.Business.Common.CompleteDStoJSON(ds);
        //    }
        //    catch(Exception ex)//(Exception ex)
        //    {
        //        throw ex;
        //    }
        //}
        public string GetManHoursCost(int ULDRepairSNo)
        {
            try
            {
                SqlParameter[] Parameters = { new SqlParameter("@ULDRepairSNo", ULDRepairSNo) };
                DataSet ds = SqlHelper.ExecuteDataset(DMLConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, "SpGetManHoursCost", Parameters);
                ds.Dispose();
                return CargoFlash.Cargo.Business.Common.CompleteDStoJSON(ds);
            }
            catch (Exception ex)//(Exception ex)
            {
                throw ex;
            }
        }
        public string GetULDRepairPrintRecordApproval(string ULDRepairSNo)
        {
            try
            {
                SqlParameter[] Parameters = { new SqlParameter("@ULDRepairSNo", @ULDRepairSNo), };
                DataSet ds = SqlHelper.ExecuteDataset(DMLConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, "GetULDRepairPrintRecordApproval", Parameters);
                ds.Dispose();
                return CargoFlash.Cargo.Business.Common.CompleteDStoJSON(ds);
            }
            catch (Exception ex)//(Exception ex)
            {
                throw ex;
            }
        }
        public string ULDReapirScrapCheck(string ULDRepairSNo)
        {
            try
            {
                SqlParameter[] Parameters = { new SqlParameter("@ULDRepairSNo", ULDRepairSNo), };
                DataSet ds = SqlHelper.ExecuteDataset(DMLConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, "ULDReapirScrapCheck", Parameters);
                ds.Dispose();
                return CargoFlash.Cargo.Business.Common.CompleteDStoJSON(ds);
            }
            catch (Exception ex)//(Exception ex)
            {
                throw ex;
            }
        }
        public string ULDQuoteCheck(string ULDRepairSNo)
        {
            try
            {
                SqlParameter[] Parameters = { new SqlParameter("@ULDRepairSNo", ULDRepairSNo), };
                DataSet ds = SqlHelper.ExecuteDataset(DMLConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, "ULDQuoteCheck", Parameters);
                ds.Dispose();
                return CargoFlash.Cargo.Business.Common.CompleteDStoJSON(ds);
            }
            catch (Exception ex)//(Exception ex)
            {
                throw ex;
            }
        }
        public string InvoiceDateCheck(string Date)
        {
            try
            {
                string[] Spl = Date.Split('@');

                SqlParameter[] Parameters = { new SqlParameter("@Date", Spl[0]), new SqlParameter("@ReSno", Spl[1]), };
                DataSet ds = SqlHelper.ExecuteDataset(DMLConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, "SPULDInvoiceDateCheck", Parameters);
                ds.Dispose();
                return CargoFlash.Cargo.Business.Common.CompleteDStoJSON(ds);
            }
            catch (Exception ex)//(Exception ex)
            {
                throw ex;
            }
        }
        /*--------------Added By Pankaj Kumar Ishwar on 02-11-2017-------------*/
        public string GetMainCostHistory(string ULDRepairSNo)
        {
            try
            {
                SqlParameter[] Parameters = { new SqlParameter("@ULDRepairSNo", ULDRepairSNo) };
                DataSet ds = SqlHelper.ExecuteDataset(DMLConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, "GetMainCostDetails", Parameters);
                ds.Dispose();
                return CargoFlash.Cargo.Business.Common.CompleteDStoJSON(ds);
            }
            catch (Exception ex)//(Exception ex)
            {
                throw ex;
            }
        }
        public KeyValuePair<string, List<ULDRepairMainCost>> GetFetchUldRepairMainCostApproval(string recordID, int page, int pageSize, string whereCondition, string sort)
        {
            try
            {
                ULDRepairMainCost ULDRepairItem = new ULDRepairMainCost();
                SqlParameter[] Parameters = {                                          
                                           new SqlParameter("@ULDRepairSNo", recordID),                                    
                                        };
                DataSet ds = SqlHelper.ExecuteDataset(DMLConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, "GetMainCostDetailsByApproval", Parameters);

                if (ds.Tables[0].Rows.Count != 0)
                {
                    var ULDRepairTransList = ds.Tables[0].AsEnumerable().Select(e => new ULDRepairMainCost
                    {
                        SNo = Convert.ToInt32(e["SNo"]),
                        MainCategory = e["Main Category"].ToString(),
                        MaintenanceType = e["Maintenance Type"].ToString(),
                        ManhourCost = e["Maintenance hour Cost"].ToString(),
                        IsApproval = Convert.ToString(e["IsApproval"]),
                    });
                    return new KeyValuePair<string, List<ULDRepairMainCost>>(ds.Tables[0].Rows[0][0].ToString(), ULDRepairTransList.AsQueryable().ToList());
                }
                var abc = ds.Tables[0].AsEnumerable().Select(e => new ULDRepairMainCost
                {
                    SNo = Convert.ToInt32(e["SNo"])
                });
                return new KeyValuePair<string, List<ULDRepairMainCost>>(ds.Tables[0].ToString(), abc.AsQueryable().ToList());
            }
            catch (Exception ex)//(Exception ex)
            {
                throw ex;
            }
        }
    }
}
