using CargoFlash.Cargo.Business;
using CargoFlash.Cargo.DataService.Schedule;
using CargoFlash.Cargo.Model.Export.UldTransfer;
using CargoFlash.SoftwareFactory.Data;
using CargoFlash.SoftwareFactory.WebUI;
using CargoFlash.SoftwareFactory.WebUI.Controls;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Configuration;
using System.Data;
using System.Data.SqlClient;
using System.Globalization;
using System.IO;
using System.Linq;
using System.Net;
using System.ServiceModel;
using System.ServiceModel.Activation;
using System.ServiceModel.Web;
using System.Text;
using System.Web;

namespace CargoFlash.Cargo.DataService.Export.UldTransfer
{
    [GlobalErrorHandlerBehaviour(typeof(GlobalErrorHandler))]   [ServiceBehavior(IncludeExceptionDetailInFaults = true)]
    [AspNetCompatibilityRequirements(RequirementsMode = AspNetCompatibilityRequirementsMode.Allowed)]
    public class UldOutService : BaseWebUISecureObject, IUldOutService
    {
        public string GetUldDetails(string id)
        {
            try
            {
                //  List<string> str = new List<string>();
                //SqlParameter[] Parameters = { new SqlParameter("@id", id) };
                //var res = SqlHelper.ExecuteDataset(connectionString, CommandType.Text, "SELECT  IsAvailable,City,uldtype FROM vwULDStock AS VWU WHERE VWU.SNo=@id", Parameters);

                var Lastid = id.Split(',').LastOrDefault();
                for (int i = 0; i < id.Split(',').Length; i++)
                {
                    if (Lastid == "")
                    {
                        var nextid = id.Remove(id.Length - 1, 1);
                        Lastid = nextid.Split(',').LastOrDefault();
                    }
                }

                SqlParameter[] Parameters = { new SqlParameter("@id", Lastid), new SqlParameter("@UserSNo", ((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).UserSNo.ToString()) };
                DataSet ds = SqlHelper.ExecuteDataset(DMLConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, "GetULDDetailsULDOut", Parameters);
                //if (ds != null && ds.Tables.Count > 0)
                //{
                //   // var row = res.Tables[0].Rows[0];
                //    str.Add(Convert.ToInt16(e["IsAvailable"]) == 0 ? "Not Available" : "Available");
                //    str.Add(row["City"].ToString());
                //    str.Add(row["uldtype"].ToString());
                //}
                //return str;
                ds.Dispose();
                return CargoFlash.Cargo.Business.Common.CompleteDStoJSON(ds);
            }
            catch(Exception ex)//
            {
                throw ex;
            }
        }

        public Stream GetPageGrid()
        {
            try
            {

           
            StringBuilder Container = new StringBuilder();
            using (Grid g = new Grid())
            {
                g.PageName = this.MyPageName;
                g.PrimaryID = this.MyPrimaryID;
                g.ModuleName = this.MyModuleID;
                g.AppsName = this.MyAppID;

                g.DataSoruceUrl = "Services/Export/UldTransfer/UldOutService.svc/GetGridData";
                g.NewURL = MyPageName + "?" + GetWebURLString("New", false);
                g.ServiceModuleName = this.MyModuleID;
                g.UserID = this.MyUserID;
                g.DefaultPageSize = 5;
                g.IsProcessPart = false;
                g.IsVirtualScroll = false;
                g.IsDisplayOnly = false;
                //g.IsProcessPart=true
                //  g.IsFormHeader = false;
                g.SuccessGrid = "OnSuccessGrid";
                //g.ProcessName = "";   
                g.FormCaptionText = "ULD Transfer";
                g.Column = new List<GridColumn>();
                g.Column.Add(new GridColumn { Field = "SNo", Title = "SNo", DataType = GridDataType.String.ToString(), IsHidden = true });
                g.Column.Add(new GridColumn { Field = "IsInboundSno", Title = "Process", DataType = GridDataType.String.ToString(), IsHidden = true });
                g.Column.Add(new GridColumn { Field = "Transferby", Title = "Transferby", DataType = GridDataType.String.ToString(), IsHidden = true });
                g.Column.Add(new GridColumn { Field = "IsMsgSent", Title = "IsMsgSent", DataType = GridDataType.String.ToString(), IsHidden = true });
                g.Column.Add(new GridColumn { Field = "IsConsumables", Title = "IsConsumables", DataType = GridDataType.String.ToString(), IsHidden = true });
                g.Column.Add(new GridColumn { Field = "IsMage", Title = "IsMage", DataType = GridDataType.String.ToString(), IsHidden = true });
                //  g.Column.Add(new GridColumn { Field = "ULDStockSNo", Title = "ULDStockSNo", DataType = GridDataType.String.ToString(), IsHidden = true });

                g.Column.Add(new GridColumn { Field = "ULDNumber", Title = "ULD Number", DataType = GridDataType.String.ToString(), Template = "<span title=\"#= ULDNumber #\">#= ULDNumber #</span>" });
                g.Column.Add(new GridColumn { Field = "Text_ULDNumber", Title = "ULD Number SNo", DataType = GridDataType.String.ToString(), IsHidden = true });
                g.Column.Add(new GridColumn { Field = "IssuedTo", Title = "IssuedTo", DataType = GridDataType.String.ToString(), IsHidden = true });

                g.Column.Add(new GridColumn { Field = "ULDCode", Title = "Count of ULD", DataType = GridDataType.String.ToString() });
                g.Column.Add(new GridColumn { Field = "Text_TransferBy", Title = "Transfer By", DataType = GridDataType.String.ToString(), Template = "<span title=\"#= Text_TransferBy #\">#= Text_TransferBy #</span>" });
                g.Column.Add(new GridColumn { Field = "Text_ReceivedBy", Title = "Received By", DataType = GridDataType.String.ToString(), Template = "<span title=\"#= Text_ReceivedBy #\">#= Text_ReceivedBy #</span>" });
                g.Column.Add(new GridColumn { Field = "IssuedDateTime", Title = "Issued Date", DataType = GridDataType.DateTime.ToString(), Template = "# if( IssuedDateTime==null) {# # } else {# #= kendo.toString(new Date(data.IssuedDateTime.getTime() + data.IssuedDateTime.getTimezoneOffset()*60000),\"" + UIDateTimeFormat.UIDateFormatString + " " + UIDateTimeFormat.UITimeFormatString + "\") # #}#" });
                g.Column.Add(new GridColumn { Field = "IsInbound", Title = "Process", DataType = GridDataType.String.ToString() });
                g.Column.Add(new GridColumn { Field = "ULDCode", Title = "Consumables", DataType = GridDataType.String.ToString(), Template = "<input type=\"button\" onclick=\"HighLightGridButton(this,event);BindGridData(#= SNo #,#= Transferby#,#=IsMsgSent#,this)\"  class=\"incompleteprocess\" value=\"C\" /> ", Sortable = "false", Filterable = "false" });
                //g.Column.Add(new GridColumn { Field = "ULDCode", Title = "ESS", DataType = GridDataType.String.ToString(), Template = "<input type=\"button\"  class=\"incompleteprocess\" onclick=\"HighLightGridButton(this,event);BindGridData(#= SNo #,#=IsMsgSent#,#=IsMsgSent#,this)\" value=\"E\" /> ", Sortable = "false", Filterable = "false" });
                g.Column.Add(new GridColumn { Field = "ULDCode", Title = "Upload Image", DataType = GridDataType.String.ToString(), Template = "<input type=\"button\"  class=\"incompleteprocess\" onclick=\"HighLightGridButton(this,event);BindGridData(#= SNo #,#=IsMsgSent#,#=IsMsgSent#,this)\" value=\"U\" /> ", Sortable = "false", Filterable = "false" });
                g.Column.Add(new GridColumn { Field = "ULDCode", Title = "LUC", DataType = GridDataType.String.ToString(), Template = "<input type=\"button\"  class=\"incompleteprocess\" onclick=\"HighLightGridButton(this,event);BindGridData(#= SNo #,#=IsMsgSent#,#=IsMsgSent#,this)\" value=\"L\" /> ", Sortable = "false", Filterable = "false" });

                g.Action = new List<GridAction>();
                g.Action.Add(new GridAction
                {
                    ButtonCaption = "Edit",
                    ClientAction = "GridReadAction",
                    ActionName = "EDIT",
                    AppsName = this.MyAppID,
                    CssClassName = "read",
                    ModuleName = this.MyModuleID
                });
                //g.Action.Add(new GridAction
                //{
                //    ButtonCaption = "Generate UR/UHF",
                //    ClientAction = "GridReadAction",
                //    ActionName = "EDIT",
                //    AppsName = this.MyAppID,
                //    CssClassName = "read",
                //    ModuleName = this.MyModuleID
                //});
                g.InstantiateIn(Container);
                byte[] resultMyForm = Encoding.UTF8.GetBytes(Container.ToString());
                WebOperationContext.Current.OutgoingResponse.ContentType = "text/html";
                return new MemoryStream(resultMyForm);
            }
            }

            catch(Exception ex)//
            {
                throw ex;
            }
        }



        public DataSourceResult GetGridData(int skip, int take, int page, int pageSize, List<SoftwareFactory.Data.GridSort> sort, SoftwareFactory.Data.GridFilter filter)
        {
            try 
            { 
            string sorts = GridSort.ProcessSorting(sort);
            string filters = GridFilter.ProcessFilters<UldOutGird>(filter);
            SqlParameter[] Parameters = { new SqlParameter("@PageNo", page), new SqlParameter("@PageSize", pageSize), new SqlParameter("@WhereCondition", filters.Replace("IssuedDateTime", "IssuedDate")), new SqlParameter("@OrderBy", sorts) };
            DataSet ds = SqlHelper.ExecuteDataset(ReadConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, "SPUldOut_GetGridRecord", Parameters);
            var obj = ds.Tables[0].AsEnumerable().Select(e => new UldOutGird
            {
                SNo = e["SNo"].ToString(),
                ULDNumber = e["ULDNumber"].ToString(),
                Text_ULDNumber = e["ULDNumberSNo"].ToString(),
                ULDCode = e["ULDCode"].ToString(),
                Transferby = e["Transferby"].ToString(),
                Text_TransferBy = e["Text_TransferBy"].ToString(),
                Text_ReceivedBy = e["Text_ReceivedBy"].ToString(),
                IssuedDateTime = Convert.ToDateTime(e["IssuedDateTime"]),
                IsMsgSent = Convert.ToInt16(e["IsMsgSent"]),
                IsConsumables = Convert.ToInt16(e["IsConsumables"]),
                IsMage = Convert.ToInt16(e["IsMage"]),
                IsInbound = e["IsInbound"].ToString(),
                IsInboundSno = e["IsInboundSno"].ToString(),
                IssuedTo = e["IssuedTo"].ToString(),
            });
            ds.Dispose();
            var res = new DataSourceResult { Data = obj.AsQueryable().ToList(), Total = Convert.ToInt32(ds.Tables[1].Rows[0][0].ToString()) };
            return res;
            }


            catch(Exception ex)//
            {
                throw ex;
            }
        }

        public string SaveDetails(List<UldOut> UldOut, List<UldOutType> UldOutType, string Process)
        {

            DataSet ds = new DataSet();
            DataTable ULDDamageCondition = CollectionHelper.ConvertTo(UldOutType, "");
            string TabletypeCheck = string.Empty;
            if (UldOutType.Count == 0)
            {
                TabletypeCheck = "0";

            }
            else
            {
                TabletypeCheck = "1";

            }

            string UldType = string.Empty;
            if (ULDDamageCondition.Rows.Count > 0)
            {
                UldType = ULDDamageCondition.Rows[0]["UldType"].ToString();
            }
            else
            {
                UldType = "0";
            }
            var time = UldOut[0].Text_IssuedDate + " " + UldOut[0].Text_IssuedTime.ToString();
            DateTime startdate = DateTime.Parse(time, new CultureInfo("en-us"));
            if (UldType != "" && UldType != "0")
            {
                SqlParameter[] Parameters = { 
                                                   
                                                    new SqlParameter("@ULDDamageCondition", ULDDamageCondition),
                                                    new SqlParameter("@AirlineCode",((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).AirlineSNo),
                                                    new SqlParameter("@CurrentCityCode", ((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).CityCode),
                                                    new SqlParameter("@CreatedBy", ((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).UserSNo),
                                                    new SqlParameter("@CurrentAirportSNo", ((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).AirportSNo),
                                                    new SqlParameter("@PurchaseDate", startdate),
                                                  //  new SqlParameter("@IsActive", 1),                                             
                                                };

                ds = SqlHelper.ExecuteDataset(DMLConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, "SpUldTransferInsertUldStock", Parameters);
                if (ds.Tables.Count > 0)
                    try
                    {

                        string UldSno = ds.Tables[0].Rows[0]["UldID"].ToString();
                      
                        List<string> str = new List<string>();
                        SqlParameter[] ParStock = { 
                                                    new SqlParameter("@TabletypeCheck", TabletypeCheck),
                                                    new SqlParameter("@ULDDamageCondition", ULDDamageCondition),
                                                    new SqlParameter("@ULDStockSNo", UldSno),
                                                    new SqlParameter("@ULDNumber", UldOut[0].Text_ULDNumber),
                                                    new SqlParameter("@ULDCode", UldOut[0].ULDCode),
                                                    new SqlParameter("@IssuedTo", UldOut[0].IssuedTo),
                                                    new SqlParameter("@IssuedDateTime", startdate),
                                                    new SqlParameter("@ReceivedByCitySNo", UldOut[0].ReceivedBy),
                                                    new SqlParameter("@ReceivedByCityCode", UldOut[0].ReceivedByCode),
                                                    new SqlParameter("@TransferPointAirportSNo", UldOut[0].AirportSNo),
                                                    new SqlParameter("@FinalDestinationAirportSNo", UldOut[0].FinalDestination),
                                                    new SqlParameter("@DemurrageSNo", UldOut[0].DemurrageCode),
                                                    new SqlParameter("@ODLNCodeSNo", UldOut[0].ODLNCode),
                                                    new SqlParameter("@IsDamaged", 0),
                                                    new SqlParameter("@DamageCondition", ""),
                                                    new SqlParameter("@Remarks", UldOut[0].Text_Remarks),
                                                    new SqlParameter("@IssuedBy", UldOut[0].UserSNo),
                                                    new SqlParameter("@TransferBy", UldOut[0].TransferBy),
                                                    new SqlParameter("@UpdatedBy", UldOut[0].UserSNo),
                                                    new SqlParameter("@ReceivedUserSno",((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).UserSNo),
                                                    new SqlParameter("@IsInbound", UldOut[0].IsInbound),
                                                    new SqlParameter("@Rentaldays", UldOut[0].Rentaldays),
                                                    new SqlParameter("@LUCInNumber", UldOut[0].LUCInNumber),

                                                };
                        ds = SqlHelper.ExecuteDataset(DMLConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, "spULDTransfer_OutFormOther", ParStock);


                    }
                    catch(Exception ex)//
                    {
                        throw ex;
                    }

            }
            else
            {
                try
                {
                  
                    List<string> str = new List<string>();
                    SqlParameter[] Parameters = { 
                                                    new SqlParameter("@TabletypeCheck", TabletypeCheck),
                                                    new SqlParameter("@ULDDamageCondition", ULDDamageCondition),
                                                    new SqlParameter("@ULDStockSNo", UldOut[0].ULDNumber),
                                                    new SqlParameter("@ULDNumber", UldOut[0].Text_ULDNumber),
                                                    new SqlParameter("@ULDCode", UldOut[0].ULDCode),
                                                    new SqlParameter("@IssuedTo", UldOut[0].IssuedTo),
                                                    new SqlParameter("@IssuedDateTime", startdate),
                                                    new SqlParameter("@ReceivedByCitySNo", UldOut[0].ReceivedBy),
                                                    new SqlParameter("@ReceivedByCityCode", UldOut[0].ReceivedByCode),
                                                    new SqlParameter("@TransferPointAirportSNo", UldOut[0].AirportSNo),
                                                    new SqlParameter("@FinalDestinationAirportSNo", UldOut[0].FinalDestination),
                                                    new SqlParameter("@DemurrageSNo", UldOut[0].DemurrageCode),
                                                    new SqlParameter("@ODLNCodeSNo", UldOut[0].ODLNCode),
                                                    new SqlParameter("@IsDamaged", 0),
                                                    new SqlParameter("@DamageCondition", ""),
                                                    new SqlParameter("@Remarks", UldOut[0].Text_Remarks),
                                                    new SqlParameter("@IssuedBy", UldOut[0].UserSNo),
                                                    new SqlParameter("@TransferBy", UldOut[0].TransferBy),
                                                    new SqlParameter("@UpdatedBy", UldOut[0].UserSNo),
                                                    new SqlParameter("@ReceivedUserSno",((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).UserSNo),
                                                    new SqlParameter("@IsInbound", UldOut[0].IsInbound),
                                                    new SqlParameter("@Rentaldays", UldOut[0].Rentaldays),

                                                };
                    ds = SqlHelper.ExecuteDataset(DMLConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, "spULDTransfer_Out", Parameters);


                }
                catch(Exception ex)//
                {
                    throw ex;
                }
            }
            return ds.Tables[0].Rows[0][0].ToString();
        }
        //public string SaveDetails(UldOut obj, List<UldOutType> UldOutType)
        //{
        //    try
        //    {
        //        var time = obj.Text_IssuedDate + " " + obj.Text_IssuedTime.ToString();
        //        DateTime startdate = DateTime.Parse(time, new CultureInfo("en-us"));
        //        List<string> str = new List<string>();
        //        SqlParameter[] Parameters = { 
        //                                        new SqlParameter("@ULDStockSNo", obj.ULDNumber),
        //                                        new SqlParameter("@ULDNumber", obj.Text_ULDNumber),
        //                                        new SqlParameter("@ULDCode", obj.ULDCode),
        //                                        new SqlParameter("@IssuedTo", obj.IssuedTo),
        //                                        new SqlParameter("@IssuedDateTime", startdate),
        //                                        new SqlParameter("@ReceivedByCitySNo", obj.ReceivedBy),
        //                                        new SqlParameter("@ReceivedByCityCode", obj.ReceivedByCode),
        //                                        new SqlParameter("@TransferPointAirportSNo", obj.AirportSNo),
        //                                        new SqlParameter("@FinalDestinationAirportSNo", obj.FinalDestination),
        //                                        new SqlParameter("@DemurrageSNo", obj.DemurrageCode),
        //                                        new SqlParameter("@ODLNCodeSNo", obj.ODLNCode),
        //                                        new SqlParameter("@IsDamaged", 0),
        //                                        new SqlParameter("@DamageCondition", ""),
        //                                        new SqlParameter("@Remarks", obj.Text_Remarks),
        //                                        new SqlParameter("@IssuedBy", obj.UserSNo),
        //                                        new SqlParameter("@TransferBy", obj.TransferBy),
        //                                        new SqlParameter("@UpdatedBy", obj.UserSNo),
        //                                        new SqlParameter("@ReceivedUserSno",((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).UserSNo),

        //                                    };
        //        DataSet ds = SqlHelper.ExecuteDataset(connectionString, CommandType.StoredProcedure, "spULDTransfer_Out", Parameters);

        //        return ds.Tables[0].Rows[0][0].ToString();

        //    }
        //    catch(Exception ex)// (Exception ex)
        //    {
        //        throw ex;
        //    }
        //}

        public string UpdateDetails(List<UldOut> UldOut, List<UldOutType> UldOutType, string Process, string id)
        {
            DataTable ULDDamageCondition = CollectionHelper.ConvertTo(UldOutType, "");
            string TabletypeCheck = string.Empty;
            if (UldOutType.Count == 0)
            {
                TabletypeCheck = "0";

            }
            else
            {
                TabletypeCheck = "1";
            }
            try
            {
                DataSet ds = new DataSet();
                var time = UldOut[0].Text_IssuedDate + " " + UldOut[0].Text_IssuedTime;
                DateTime startdate = DateTime.Parse(time, new CultureInfo("en-us"));
                List<string> str = new List<string>();
                SqlParameter[] Parameters = { 
                                                new SqlParameter("@TabletypeCheck", TabletypeCheck),
                                                new SqlParameter("@ULDDamageCondition", ULDDamageCondition),
                                                new SqlParameter("@SNo", id),
                                                new SqlParameter("@ULDStockSNo", UldOut[0].ULDNumber),
                                                new SqlParameter("@ULDNumber", UldOut[0].Text_ULDNumber),
                                                //new SqlParameter("@ULDCode", UldOut[0].ULDCode),
                                                new SqlParameter("@IssuedTo", UldOut[0].IssuedTo),
                                                new SqlParameter("@IssuedDateTime", startdate),
                                                new SqlParameter("@ReceivedByCitySNo", UldOut[0].ReceivedBy),
                                                new SqlParameter("@ReceivedByCityCode", UldOut[0].ReceivedByCode),
                                                new SqlParameter("@TransferPointAirportSNo", UldOut[0].AirportSNo),
                                                new SqlParameter("@FinalDestinationAirportSNo", UldOut[0].FinalDestination),
                                                new SqlParameter("@DemurrageSNo", UldOut[0].DemurrageCode),
                                                new SqlParameter("@ODLNCodeSNo", UldOut[0].ODLNCode),
                                                new SqlParameter("@IsDamaged", 0),
                                                new SqlParameter("@DamageCondition", ""),
                                                new SqlParameter("@TransferBy", UldOut[0].TransferBy),
                                                new SqlParameter("@Remarks", UldOut[0].Text_Remarks),
                                                new SqlParameter("@UpdatedBy", ((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).UserSNo.ToString()),
                                                new SqlParameter("@Rentaldays", UldOut[0].Rentaldays),
                                            };
                if (Process == "0")
                {
                    ds = SqlHelper.ExecuteDataset(DMLConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, "spULDTransfer_OutUpdate", Parameters);
                }
                else if (Process == "1")
                {
                    ds = SqlHelper.ExecuteDataset(DMLConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, "spULDTransfer_ReceiveUpdate", Parameters);
                }


                return ds.Tables[0].Rows[0][0].ToString();

            }
            catch(Exception ex)//
            {
                throw ex;
            }
        }


        public UldOut EditData(string id)
        {

            try
            {
                UldOut ob = new UldOut();
                SqlParameter[] Parameters = { 
                                                new SqlParameter("@id", id),
                                            };
                var res = SqlHelper.ExecuteDataset(DMLConnectionString.WebConfigConnectionString, CommandType.Text, "SELECT * from vwULDOutEdit where SNo=@id", Parameters);
                if (res != null && res.Tables[0].Rows.Count > 0)
                {
                    ob = res.Tables[0].AsEnumerable().Select(e => new UldOut
                    {
                        DemurrageCode = Convert.ToInt32(e["DemurrageSNo"]),
                        FinalDestination = Convert.ToInt32(e["FinalDestinationAirportSNo"]),
                        IssuedTo = Convert.ToInt32(e["IssuedTo"]),
                        ODLNCode = Convert.ToInt32(e["ODLNCodeSNo"]),
                        ReceivedBy = Convert.ToInt32(e["ReceivedBySNo"]),
                        Damaged = Convert.ToBoolean(e["IsDamaged"]),
                        ReceivedByCode = e["ReceivedBy"].ToString(),
                        Text_DamageCondition = e["DamageCondition"].ToString(),
                        Text_DemurrageCode = e["DemurrageCode"].ToString(),
                        Text_FinalDestination = e["FinalDestination"].ToString(),
                        Text_IssuedDate = e["IssuedDate"].ToString().Replace(' ', '-'),
                        Text_IssuedTime = e["IssuedTime1"].ToString(),
                        Text_IssuedTo = e["Text_IssuedTo"].ToString(),
                        Text_ODLNCode = e["ODLNCode"].ToString(),
                        Text_ReceivedBy = e["ReceivedBy"].ToString(),
                        Text_ULDNumber = e["ULDNumber"].ToString(),
                        ULDCode = e["ULDCode"].ToString(),
                        ULDNumber = e["ULDStockSNo"].ToString(),
                        AirportSNo = Convert.ToInt32(e["TransferPointAirportSNo"]),
                        Text_Remarks = e["Remarks"].ToString(),
                        IssuedBy = Convert.ToInt32(e["IssuedBy"]),
                        Text_IssuedBy = e["UserName"].ToString(),
                        TransferBy = Convert.ToInt32(e["TransferBy"]),
                        Text_TransferBy = e["Text_TransferBy"].ToString(),
                        Text_TransferPoint = e["AirportCode"].ToString(),
                        IsAvailable = e["IsAvailable"].ToString(),
                        CurrLocation = e["CurrLocation"].ToString(),
                        IsInboundSno = e["IsInboundSno"].ToString(),
                        Rentaldays = Convert.ToInt32(e["Rentaldays"]),
                        IsMsgSent = Convert.ToInt32(e["IsMsgSent"]),
                        LUCInNumber = e["LUCInNumber"].ToString(),

                    }).FirstOrDefault();
                }
                return ob;

            }
            catch(Exception ex)//
            {
                throw ex;
            }

        }



        public List<string> CreateConsumablesRecord(string strData)
        {
            try 
            
            { 
            
            
            int ret = 0;
            List<string> ErrorMessage = new List<string>();
            BaseBusiness baseBussiness = new BaseBusiness();
            // convert JSON string into datatable
            var dtConsumableRecord = JsonConvert.DeserializeObject<DataTable>(CargoFlash.Cargo.Business.Common.Base64ToString(strData));
            dtConsumableRecord.Columns.Remove("TransferBy");
            dtConsumableRecord.Columns["SNo"].SetOrdinal(0);
            dtConsumableRecord.Columns["ULDTransferSNo"].SetOrdinal(1);
            dtConsumableRecord.Columns["HdnConsumables"].SetOrdinal(2);
            dtConsumableRecord.Columns["Consumables"].SetOrdinal(3);
            dtConsumableRecord.Columns["GrossWt"].SetOrdinal(4);
            dtConsumableRecord.Columns["Stock"].SetOrdinal(5);
            var dtCreateConsumableRecord = (new DataView(dtConsumableRecord, "SNo=0", "SNo", DataViewRowState.CurrentRows)).ToTable();
            var dtUpdateConsumableRecord = (new DataView(dtConsumableRecord, "SNo>0", "SNo", DataViewRowState.CurrentRows)).ToTable();
            SqlParameter param = new SqlParameter();
            param.ParameterName = "@utct";
            param.SqlDbType = System.Data.SqlDbType.Structured;

            // for update existing record
            if (dtUpdateConsumableRecord.Rows.Count > 0)
            {
                param.Value = dtUpdateConsumableRecord;
                SqlParameter[] Parameters = { param, new SqlParameter("@UpdatedBy", ((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).UserSNo.ToString()), new SqlParameter("@CityCode", ((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).CityCode.ToString()) };
                ret = (int)SqlHelper.ExecuteScalar(DMLConnectionString.WebConfigConnectionString, "UpdatedConsumableRecord", Parameters);
            }
            // for create new record
            if (dtCreateConsumableRecord.Rows.Count > 0)
            {
                param.Value = dtCreateConsumableRecord;
                SqlParameter[] Parameters = { param, new SqlParameter("@CreatedBy", ((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).UserSNo.ToString()), new SqlParameter("@CityCode", ((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).CityCode.ToString()) };
                ret = (int)SqlHelper.ExecuteScalar(DMLConnectionString.WebConfigConnectionString, "CreateConsumableULDTransfer", Parameters);
            }
            if (ret > 0)
            {
                if (ret > 1000)
                {
                    string serverErrorMessage = baseBussiness.ReadServerErrorMessages(ret, "LUC");
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

            catch(Exception ex)//
            {
                throw ex;
            }
        }

        public List<string> DeleteConsumablesRecord(string recordID)
        {
            try 
            
            { 
            
            

            int ret = 0;
            List<string> ErrorMessage = new List<string>();
            BaseBusiness baseBussiness = new BaseBusiness();
            SqlParameter[] Parameters = { new SqlParameter("@SNo", recordID) };
            ret = (int)SqlHelper.ExecuteScalar(DMLConnectionString.WebConfigConnectionString, "DeleteConsumableRecord", Parameters);
            if (ret > 0)
            {
                if (ret > 1000)
                {
                    string serverErrorMessage = baseBussiness.ReadServerErrorMessages(ret, "LUC");
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

            catch(Exception ex)//
            {
                throw ex;
            }

        }

        public List<ConsumableOuterGrid> GetConsumableOuterGridProcess(string sno)
        {
            try
            {
                List<ConsumableOuterGrid> lst = new List<ConsumableOuterGrid>();

                SqlParameter[] Parameters = { new SqlParameter("@SNo", sno) };
                DataSet ds = SqlHelper.ExecuteDataset(ReadConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, "Get_ULDTransferConsumablesTrans", Parameters);
                if (ds != null && ds.Tables.Count > 0)
                    lst = ds.Tables[0].AsEnumerable().Select(e => new ConsumableOuterGrid
                    {
                        SNo = e["SNo"].ToString(),
                        ULDTransferSNo = e["ULDTransferSNo"].ToString(),
                        HdnConsumables = e["ConsumableSNo"].ToString(),
                        Consumables = e["ConsumableName"].ToString(),
                        GrossWt = e["Quantity"].ToString()
                    }).ToList();
                return lst;
            }
            catch(Exception ex)//
            {
                throw ex;
            }

        }

        public KeyValuePair<string, List<ConsumableOuterGrid>> GetConsumablesRecord(string recordID, int page, int pageSize, string whereCondition, string sort)
        {
            try 
            
            {
            SqlParameter[] Parameters = { new SqlParameter("@SNo", recordID) };
            DataSet ds = SqlHelper.ExecuteDataset(ReadConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, "Get_ULDTransferConsumablesTrans", Parameters);
            // return resultData.Tables[0].AsEnumerable().ToList();
            var ConsumableOuterGridList = ds.Tables[0].AsEnumerable().Select(e => new ConsumableOuterGrid
            {
                SNo = e["SNo"].ToString(),
                ULDTransferSNo = e["ULDTransferSNo"].ToString(),
                HdnConsumables = e["ConsumableSNo"].ToString(),
                Consumables = e["ConsumableName"].ToString(),
                Text_Consumables = e["ConsumableName"].ToString(),
                GrossWt = e["Quantity"].ToString(),
                Stock = e["Stock"].ToString(),
                TransferBy = e["TransferBy"].ToString(),

            });
            return new KeyValuePair<string, List<ConsumableOuterGrid>>(ds.Tables[1].Rows[0][0].ToString(), ConsumableOuterGridList.AsQueryable().ToList());
             }

            catch(Exception ex)//
            {
                throw ex;
            }
        }

        public string GetULDImageFileName(string ULDSNo)
        {

            try 
            { 
            
            DataSet ds = new DataSet();
            SqlParameter[] Parameters = { new SqlParameter("@ULDSNo", ULDSNo) };
            ds = SqlHelper.ExecuteDataset(ReadConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, "Get_ULDFILENAME", Parameters);

            FlightOpenService fos = new FlightOpenService();
            return fos.DStoJSON(ds);
             }

            catch(Exception ex)//
            {
                throw ex;
            }
        }


        public List<string> CreateESSRecord(string strData)
        {
            try 
            { 
            int ret = 0;
            List<string> ErrorMessage = new List<string>();
            BaseBusiness baseBussiness = new BaseBusiness();
            // convert JSON string into datatable
            var dtESSRecord = JsonConvert.DeserializeObject<DataTable>(strData);
            //DataRow[] dr = dtESSRecord.Select("SecondaryValue=''");
            //dr[0]["SecondaryValue"] = 0;
            foreach (DataRow dr in dtESSRecord.Rows)
            {
                if (dr["SecondaryValue"].ToString() == "")
                {
                    dr["SecondaryValue"] = "0.0";
                }
            }
            dtESSRecord.Columns["SNo"].SetOrdinal(0);
            dtESSRecord.Columns["ULDTransferSNo"].SetOrdinal(1);
            dtESSRecord.Columns["HdnServiceName"].SetOrdinal(2);
            dtESSRecord.Columns["PrimaryValue"].SetOrdinal(3);
            dtESSRecord.Columns["SecondaryValue"].SetOrdinal(4);
            dtESSRecord.Columns["Charges"].SetOrdinal(5);
            dtESSRecord.Columns["Mode"].SetOrdinal(6);
            dtESSRecord.Columns.Remove("ServiceName");
            var dtCreateESSRecord = (new DataView(dtESSRecord, "SNo=0", "SNo", DataViewRowState.CurrentRows)).ToTable();
            var dtUpdateESSRecord = (new DataView(dtESSRecord, "SNo>0", "SNo", DataViewRowState.CurrentRows)).ToTable();
            SqlParameter param = new SqlParameter();
            param.ParameterName = "@utess";
            param.SqlDbType = System.Data.SqlDbType.Structured;
            // for create new record
            if (dtCreateESSRecord.Rows.Count > 0)
            {
                param.Value = dtCreateESSRecord;

                SqlParameter[] Parameters = { param, new SqlParameter("@CreatedBy", ((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).UserSNo.ToString()), new SqlParameter("@CityCode", ((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).CityCode.ToString()) };
                ret = (int)SqlHelper.ExecuteScalar(DMLConnectionString.WebConfigConnectionString, "CreateESSULDTransfer", Parameters);
            }
            // for update existing record
            if (dtUpdateESSRecord.Rows.Count > 0)
            {
                param.Value = dtUpdateESSRecord;
                SqlParameter[] Parameters = { param, new SqlParameter("@UpdatedBy", ((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).UserSNo.ToString()), new SqlParameter("@CityCode", ((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).CityCode.ToString()) };
                ret = (int)SqlHelper.ExecuteScalar(DMLConnectionString.WebConfigConnectionString, "UpdatedESSRecord", Parameters);
            }
            if (ret > 0)
            {
                if (ret > 1000)
                {
                    string serverErrorMessage = baseBussiness.ReadServerErrorMessages(ret, "LUC");
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


            catch(Exception ex)//
            {
                throw ex;
            }
        }

        public List<string> DeleteESSRecord(string recordID)
        {

            try 
            {
            
            int ret = 0;
            List<string> ErrorMessage = new List<string>();
            BaseBusiness baseBussiness = new BaseBusiness();
            SqlParameter[] Parameters = { new SqlParameter("@SNo", recordID) };
            ret = (int)SqlHelper.ExecuteScalar(DMLConnectionString.WebConfigConnectionString, "DeleteESSRecord", Parameters);
            if (ret > 0)
            {
                if (ret > 1000)
                {
                    string serverErrorMessage = baseBussiness.ReadServerErrorMessages(ret, "LUC");
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

            catch(Exception ex)//
            {
                throw ex;
            }
        }

        public List<EssOuterGrid> GetESSOuterGridProcess(string sno)
        {
            try
            {
                List<EssOuterGrid> lst = new List<EssOuterGrid>();

                SqlParameter[] Parameters = { new SqlParameter("@SNo", sno) };
                DataSet ds = SqlHelper.ExecuteDataset(DMLConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, "Get_ULDTransferESSTrans", Parameters);
                if (ds != null && ds.Tables.Count > 0)
                    lst = ds.Tables[0].AsEnumerable().Select(e => new EssOuterGrid
                    {
                        SNo = e["SNo"].ToString(),
                        ULDTransferSNo = e["ULDTransferSNo"].ToString(),
                        HdnServiceName = e["ServiceSNo"].ToString(),
                        ServiceName = e["ChargeName"].ToString(),
                        PrimaryValue = e["PrimaryValue"].ToString(),
                        SecondaryValue = e["SecondaryValue"].ToString() == "0.00" ? "" : e["SecondaryValue"].ToString(),
                        Charges = e["Charges"].ToString(),
                    }).ToList();
                return lst;
            }
            catch(Exception ex)//
            {
                throw ex;
            }

        }

        public KeyValuePair<string, List<EssOuterGrid>> GetESSRecord(string recordID, int page, int pageSize, string whereCondition, string sort)
        {

            try 
            
            {
            SqlParameter[] Parameters = { new SqlParameter("@SNo", recordID) };
            DataSet ds = SqlHelper.ExecuteDataset(DMLConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, "Get_ULDTransferESSTrans", Parameters);
            // return resultData.Tables[0].AsEnumerable().ToList();
            var ConsumableOuterGridList = ds.Tables[0].AsEnumerable().Select(e => new EssOuterGrid
            {
                SNo = e["SNo"].ToString(),
                ULDTransferSNo = e["ULDTransferSNo"].ToString(),
                HdnServiceName = e["ServiceSNo"].ToString(),
                ServiceName = e["ChargeName"].ToString(),
                PrimaryValue = e["PrimaryValue"].ToString(),
                SecondaryValue = e["SecondryValue"].ToString() == "0.00" ? "" : e["SecondryValue"].ToString(),
                Charges = e["Charges"].ToString(),
                Mode = e["Mode"].ToString() == "False" ? "0" : "1",
            });
            return new KeyValuePair<string, List<EssOuterGrid>>(ds.Tables[1].Rows[0][0].ToString(), ConsumableOuterGridList.AsQueryable().ToList());
            }

            catch(Exception ex)//
            {
                throw ex;
            }
        }
        public string GetULDOutESSChargesTotal(int TariffSNo, decimal PrimaryValue, decimal SecondaryValue)
        {
            BaseBusiness baseBusiness = new BaseBusiness();
            List<string> ErrorMessage = new List<string>();
            string ret = "1";
            try
            {
                SqlParameter[] Parameters = {
                                            new SqlParameter("@AwbSNo",0),
                                            new SqlParameter("@CityCode", ((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).CityCode.ToString()),
                                            new SqlParameter("@MovementType", 0),
                                            new SqlParameter("@ShipmentType", "0"),
                                            new SqlParameter("@HAWBSNo", "0"),
                                            new SqlParameter("@PageSize", 99999),
                                            new SqlParameter("@WhereCondition", ""),
                                            new SqlParameter("@ProcessSNo", "0"),
                                            new SqlParameter("@SubProcessSNo", 0),
                                            new SqlParameter("@ArrivedShipmentSNo", 0),
                                            new SqlParameter("@DOSNo", 0),
                                            new SqlParameter("@PDSNo", 0),
                                            new SqlParameter("@RateType", 0),
                                            new SqlParameter("@ChargeType", 0),
                                            new SqlParameter("@TerminalSNo", ((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).TerminalSNo.ToString()),
                                            new SqlParameter("@TariffSNo", TariffSNo),
                                            new SqlParameter("@PrimaryValue", PrimaryValue),
                                            new SqlParameter("@SecondaryValue",SecondaryValue),
                                            new SqlParameter("@TaxReturn", 1)
                                        };
                DataSet ds = new DataSet();
                ds = SqlHelper.ExecuteDataset(ReadConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, "getHandlingChargesIE", Parameters);
                ds.Dispose();

                ret = ds.Tables[0].Rows[0]["ChargeAmount"].ToString();


            }
            catch(Exception ex)//
            {
                throw ex;
            }
            return ret.ToString();



        }

        public string GetUsedULDQuantity(int ConsumablesSNo, int Quantity, int OwnerSNo)
        {
            BaseBusiness baseBusiness = new BaseBusiness();
            List<string> ErrorMessage = new List<string>();
            try
            {
                SqlParameter[] Parameters = {
                                            new SqlParameter("@ConsumablesSNo",ConsumablesSNo),
                                            new SqlParameter("@Quantity", Quantity),
                                            new SqlParameter("@CitySNo", ((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).CitySNo.ToString())                                      
                                        };


                DataSet ds = SqlHelper.ExecuteDataset(DMLConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, "GetUsedULDQuantity", Parameters);
                ds.Dispose();
                return CargoFlash.Cargo.Business.Common.CompleteDStoJSON(ds);

            }
            catch(Exception ex)//
            {
                throw ex;
            }

        }

        public string AddDamageDescription(string ULDNumber)
        {
            BaseBusiness baseBusiness = new BaseBusiness();
            List<string> ErrorMessage = new List<string>();
            try
            {
                SqlParameter[] Parameters = {
                                            new SqlParameter("@ULDNumber",ULDNumber),
                                        };
                DataSet ds = SqlHelper.ExecuteDataset(DMLConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, "SpGetMultipleUldNumber", Parameters);
                ds.Dispose();
                return CargoFlash.Cargo.Business.Common.CompleteDStoJSON(ds);

            }
            catch(Exception ex)//
            {
                throw ex;
            }

        }

        public string UldNumberCheck(string Ocode, string ULDNumber, string ULDType)
        {
            BaseBusiness baseBusiness = new BaseBusiness();
            List<string> ErrorMessage = new List<string>();
            try
            {
                SqlParameter[] Parameters = {
                                            new SqlParameter("@UldNumberCheck",ULDNumber),
                                           new SqlParameter("@UldOcode",Ocode),
                                            new SqlParameter("@ULDType",ULDType),
                                        };
                DataSet ds = SqlHelper.ExecuteDataset(DMLConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, "SpUldNumberCheck", Parameters);
                ds.Dispose();
                return CargoFlash.Cargo.Business.Common.CompleteDStoJSON(ds);

            }
            catch(Exception ex)//
            {
                throw ex;
            }

        }

        public string DupicateCheckUCRUHFNumber(string UCRNumber, string Type)
        {
            try 
            { 
            
            SqlParameter[] Parameters = { new SqlParameter("@CheckLUCINNumberr", UCRNumber) ,};
            DataSet ds = SqlHelper.ExecuteDataset(ReadConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, "CheckLUCINNumberULDOut", Parameters);
            return CargoFlash.Cargo.Business.Common.CompleteDStoJSON(ds);
            }

            catch(Exception ex)//
            {
                throw ex;
            }
        }
    }
}
