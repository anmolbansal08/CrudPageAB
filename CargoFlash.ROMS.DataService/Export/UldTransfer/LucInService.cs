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
    public class LucInService : BaseWebUISecureObject, ILucInService
    {
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

                g.DataSoruceUrl = "Services/Export/UldTransfer/LucInService.svc/GetGridData";
                g.NewURL = MyPageName + "?" + GetWebURLString("New", false);
                g.ServiceModuleName = this.MyModuleID;
                g.UserID = this.MyUserID;
                g.DefaultPageSize = 5;
                g.IsProcessPart = false;
                g.IsVirtualScroll = false;
                g.IsDisplayOnly = false;
                //  g.IsFormHeader = false;
                g.SuccessGrid = "OnSuccessGrid";
                g.FormCaptionText = "ULD RETURN";
                g.Column = new List<GridColumn>();
                g.Column.Add(new GridColumn { Field = "SNo", Title = "SNo", DataType = GridDataType.String.ToString(), IsHidden = true });
                g.Column.Add(new GridColumn { Field = "ProcessStatus", Title = "ProcessStatus", DataType = GridDataType.String.ToString(), IsHidden = true });
                //g.Column.Add(new GridColumn { Field = "ULDCode", Title = "ULD Code", DataType = GridDataType.String.ToString() });
                g.Column.Add(new GridColumn { Field = "ULDNumber", Title = "ULD Number", DataType = GridDataType.String.ToString() });
                //g.Column.Add(new GridColumn { Field = "ULDCount", Title = "Count of ULD", DataType = GridDataType.Number.ToString() });
                //g.Column.Add(new GridColumn { Field = "OwnerCode", Title = "Owner Code", DataType = GridDataType.String.ToString() });
                g.Column.Add(new GridColumn { Field = "ULDDate", Title = "Issued Date", DataType = GridDataType.Date.ToString(), Template = "# if( ULDDate==null) {# # } else {# #= kendo.toString(new Date(data.ULDDate.getTime() + data.ULDDate.getTimezoneOffset()*60000),\"" + UIDateTimeFormat.UIDateFormatString + "\") # #}#" });
                g.Column.Add(new GridColumn { Field = "ULDTime", Title = "Issued Time", DataType = GridDataType.String.ToString() });
                g.Column.Add(new GridColumn { Field = "UserName", Title = "Issued By", DataType = GridDataType.String.ToString() });
                g.Column.Add(new GridColumn { Field = "ReceivedByCityCode", Title = "Received By", DataType = GridDataType.String.ToString() });
                g.Column.Add(new GridColumn { Field = "AirportName", Title = "Transfer Point", DataType = GridDataType.String.ToString() });
                g.Column.Add(new GridColumn { Field = "FinalDestination", Title = "Final Destination", DataType = GridDataType.String.ToString() });
                g.Column.Add(new GridColumn { Field = "DAM", Title = "Demurrage Code", DataType = GridDataType.String.ToString(), Width = 60 });
                g.Column.Add(new GridColumn { Field = "UHFReceiptNo", Title = "UHF Receipt No", DataType = GridDataType.String.ToString() });
                g.Column.Add(new GridColumn { Field = "UCRReceiptNo", Title = "UCR Receipt No", DataType = GridDataType.String.ToString() });
                g.Column.Add(new GridColumn { Field = "IsInbound", Title = "Process", DataType = GridDataType.String.ToString() });
                //g.Column.Add(new GridColumn { Field = "SentLUC", Title = "LUC Sent", DataType = GridDataType.String.ToString() });
                g.Column.Add(new GridColumn { Field = "IssuedTo", IsLocked = false, Title = "IssuedTo", DataType = GridDataType.Number.ToString(), IsHidden = true });
                g.Column.Add(new GridColumn { Field = "IsESS", IsLocked = false, Title = "IsESS", DataType = GridDataType.Boolean.ToString(), IsHidden = true });
                g.Column.Add(new GridColumn { Field = "IsPayment", IsLocked = false, Title = "IsPayment", DataType = GridDataType.Boolean.ToString(), IsHidden = true });
                g.Column.Add(new GridColumn { Field = "Credit", IsLocked = false, Title = "Credit", DataType = GridDataType.Boolean.ToString(), IsHidden = true });
                g.Column.Add(new GridColumn { Field = "IsAL", IsLocked = false, Title = "IsAL", DataType = GridDataType.Boolean.ToString(), IsHidden = true });
                g.Column.Add(new GridColumn { Field = "IsUCR", IsLocked = false, Title = "IsUCR", DataType = GridDataType.Boolean.ToString(), IsHidden = true });


                g.Column.Add(new GridColumn { Field = "ULDCode", Title = "Return", DataType = GridDataType.String.ToString(), Template = "<input type=\"button\"  class=\"incompleteprocess\" onclick=\"HighLightGridButton(this,event);BindGridData(#= SNo #,this)\" value=\"R\" title=\"Return\" /> ", Sortable = "false", Filterable = "false" });

                g.Column.Add(new GridColumn { Field = "Ess", Title = "Charges", DataType = GridDataType.String.ToString(), Template = "<input type=\"button\"  class=\"incompleteprocess\" onclick=\"HighLightGridButton(this,event);BindGridData(#= SNo #,this)\" value=\"C\" title=\"Charges\" /> ", Sortable = "false", Filterable = "false" });

                g.Action = new List<GridAction>();
                g.Action.Add(new GridAction
                {
                    ButtonCaption = "Print UCR",
                    ClientAction = "GridReadAction",
                    ActionName = "EDIT",
                    AppsName = this.MyAppID,
                    CssClassName = "read",
                    ModuleName = this.MyModuleID
                });
                g.Action.Add(new GridAction
                {
                    ButtonCaption = "Print UHF",
                    ClientAction = "GridReadActionNew",
                    ActionName = "EDIT",
                    AppsName = this.MyAppID,
                    CssClassName = "read",
                    ModuleName = this.MyModuleID
                });

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
            string filters = GridFilter.ProcessFilters<LUCOutGrid>(filter);
            SqlParameter[] Parameters = { new SqlParameter("@PageNo", page), new SqlParameter("@PageSize", pageSize), new SqlParameter("@WhereCondition", filters), new SqlParameter("@OrderBy", sorts) };
            DataSet ds = SqlHelper.ExecuteDataset(ReadConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, "LUCIN_GetGridRecord", Parameters);
            var obj = ds.Tables[0].AsEnumerable().Select(e => new LUCOutGrid
            {
                SNo = e["SNo"].ToString(),
                ULDNumber = e["ULDNumber"].ToString(),
                ULDCode = e["ULDCode"].ToString(),
                OwnerCode = e["OwnerCode"].ToString(),
                ULDDate = DateTime.SpecifyKind(Convert.ToDateTime(e["ULDDate"]), DateTimeKind.Utc),
                ULDTime = e["ULDTime"].ToString(),
                UserName = e["UserName"].ToString(),
                ReceivedByCityCode = e["ReceivedByCityCode"].ToString().ToUpper(),
                AirportName = e["AirportName"].ToString(),
                FinalDestination = e["FinalDestination"].ToString(),
                DAM = e["DAM"].ToString(),
                UHFReceiptNo = e["UHFReceiptNo"].ToString(),
                UCRReceiptNo = e["UCRReceiptNo"].ToString(),
                SentLUC = e["SentLUC"].ToString(),
                IssuedTo = Convert.ToInt32(e["IssuedTo"]),
                ULDCount = Convert.ToInt32(e["ULDCount"]),
                IsESS = Convert.ToBoolean(e["IsESS"]),
                IsAL = Convert.ToBoolean(e["IsAL"]),
                IsUCR = Convert.ToBoolean(e["IsUCR"]),
                IsPayment = Convert.ToBoolean(e["IsPayment"]),
                ProcessStatus = (e["ProcessStatus"].ToString()),
                IsInbound = (e["IsInbound"].ToString()),
                Credit = Convert.ToBoolean(e["CREDIT"])

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



        public string UCRUHF(string ULDSNo)
        {
            try 
            { 
            DataSet ds = new DataSet();
            SqlParameter[] Parameters = { new SqlParameter("@UTUTSNo", ULDSNo) };
            ds = SqlHelper.ExecuteDataset(ReadConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, "Get_DocumentFILENAME", Parameters);

            FlightOpenService fos = new FlightOpenService();
            return fos.DStoJSON(ds);
            }

            catch(Exception ex)//
            {
                throw ex;
            }
        }
        public string SendLUC(string SNo)
        {
            try 
            {
           
            DataSet ds = new DataSet();
            SqlParameter[] Parameters = { new SqlParameter("@SNo", SNo), new SqlParameter("@UpdatedBy", ((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).UserSNo.ToString()) };
            ds = SqlHelper.ExecuteDataset(ReadConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, "spLUC_SendLUC", Parameters);
            return CargoFlash.Cargo.Business.Common.CompleteDStoJSON(ds);
            }

            catch(Exception ex)//
            {
                throw ex;
            }
        }

        public string SaveDetails(LUCOut obj)
        {
            try 
            { 
            DataSet ds = new DataSet();

            var time = obj.Text_Receiveddate + " " + obj.Text_ReceivedTime;
            DateTime startdate = DateTime.Parse(time, new CultureInfo("en-us"));


            List<string> str = new List<string>();
            SqlParameter[] Parameters = {   new SqlParameter("@SNo", obj.ULD),
                                                new SqlParameter("@ReturnDateTime",startdate),
                                                new SqlParameter("@ReturnBy",1),
                                                new SqlParameter("@ReturnRemarks", obj.Text_Remarks),
                                                new SqlParameter("@ReturnLocationCitySNo", obj.AirportSNo ), 
                                                new SqlParameter("@LUCInNumber", obj.Text_LUCInNumber ),
                                                new SqlParameter("@UpdatedBy", ((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session  ["UserDetail"])).UserSNo.ToString()),
                                                new SqlParameter("@ODLNCodeSNo", obj.ODLNCode), 
                                                new SqlParameter("@ReceivedUserSno", ((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).UserSNo),
                                                new SqlParameter("@IssuedFrom",obj.IssuedFrom.Trim()), 
                                                new SqlParameter("@Process",obj.INPOUTProcessStatus.Trim()),
                                                new SqlParameter("@CurrCity",((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session  ["UserDetail"])).CityCode.ToString()),
                                                new SqlParameter("@AirrPort",((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session  ["UserDetail"])).AirportSNo.ToString()),
                                                new SqlParameter("@ISDamge", obj.ISDamge=="true"?"1":"0"),
                                                new SqlParameter("@DamagedRemarks",obj.DamagedRemarks),
                                              
                                        
                                        };
            ds = SqlHelper.ExecuteDataset(DMLConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, "CreateLucIn", Parameters);
            return ds.Tables[0].Rows[0][0].ToString();
            }


            catch(Exception ex)//
            {
                throw ex;
            }

        }

        public string GetReceipt()
        {
            try
            {
                List<string> str = new List<string>();
                SqlParameter[] Parameters = { new SqlParameter("@SNo", 0), new SqlParameter("@UserSNo", ((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).UserSNo.ToString()) };
                DataSet ds = SqlHelper.ExecuteDataset(ReadConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, "Get_LUCReceipt", Parameters);
                DataColumn newColumn = new DataColumn("AirportCode", typeof(System.String));
                newColumn.DefaultValue = ((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).AirportCode.ToString().ToUpper();
                ds.Tables[0].Columns.Add(newColumn);
                DataColumn NC = new DataColumn("UserName", typeof(System.String));
                NC.DefaultValue = ((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).UserName.ToString().ToUpper();
                ds.Tables[0].Columns.Add(NC);

                FlightOpenService fos = new FlightOpenService();
                return fos.DStoJSON(ds);

            }
            catch(Exception ex)//
            {
                throw ex;
            }
        }



        //public string EditData(string id)
        //{
        //    DataSet ds = new DataSet();
        //    LUC lu = new LUC();
        //    SqlParameter[] Parameters = { new SqlParameter("@SNo", id) };
        //    ds = SqlHelper.ExecuteDataset(ReadConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, "Get_LUCRecord", Parameters);

        //    FlightOpenService fos = new FlightOpenService();
        //    return fos.DStoJSON(ds);

        //}

        public LUCOut EditData(string id)
        {

            try
            {
                LUCOut ob = new LUCOut();
                SqlParameter[] Parameters = { 
                                                new SqlParameter("@id", id),
                                            };
                var res = SqlHelper.ExecuteDataset(DMLConnectionString.WebConfigConnectionString, CommandType.Text, "SELECT * from vwLUCEDIT where SNo=@id", Parameters);
                if (res != null && res.Tables[0].Rows.Count > 0)
                {
                    ob = res.Tables[0].AsEnumerable().Select(e => new LUCOut
                    {
                        Bucr = Convert.ToBoolean(e["IsUCR"]),
                        Buhf = Convert.ToBoolean(e["IsUHF"]),
                        hdnOriginator = e["Originator"].ToString(),
                        Text_Name = e["RepresentativeName"].ToString(),
                        Text_MobileNo = e["MobileNo"].ToString(),
                        Text_IDNumber = e["IDNumber"].ToString()



                    }).FirstOrDefault();
                }
                return ob;

            }
            catch(Exception ex)//
            {
                throw ex;
            }

        }

        public LUCOut UldInfomationIN(string id)
        {

            try
            {
                LUCOut ob = new LUCOut();
                SqlParameter[] Parameters = { 
                                                new SqlParameter("@SNo", id),
                                                new SqlParameter("@AirportCode", ((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).AirportCode.ToString()),
                                            };
                var res = SqlHelper.ExecuteDataset(DMLConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, "spGetLucIn", Parameters);
                if (res != null && res.Tables[0].Rows.Count > 0)
                {
                    ob = res.Tables[0].AsEnumerable().Select(e => new LUCOut
                    {


                        SNo = e["SNo"].ToString(),
                        Text_ULD = e["ULDNumber"].ToString(),


                        Text_IssuedBy = e["IssuedBy"].ToString().ToUpper(),
                        Text_IssuedFrom = e["Issuedfrom"].ToString(),
                        Text_Issuedate = e["ULDDate"].ToString(),
                        Text_Issuetime = e["ULDTime"].ToString(),


                        Text_CityCode = e["ReceivedByCityCode"].ToString(),
                        //Text_DemurrageCode = e["ULDNumber"].ToString(),
                        ODLNCode = Convert.ToInt32(e["ODLNCodeSNo"]),
                        Text_ODLNCode = e["odlndesc"].ToString(),

                        // Text_ReceivedBy = e["UserName"].ToString(),


                        //Text_ReceivedBySNO = Convert.ToInt32(e["ReceivedUserSno"]),
                        Text_ReceivedBy = e["ReceivedUsername"].ToString(),
                        // Currentusersno = ((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).UserSNo,
                        currentuserName = ((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).UserName.ToString().ToUpper(),
                        Text_ReceivedFrom = e["Receivedfrom"].ToString(),
                        Text_Remarks = e["ReturnRemarks"].ToString(),

                        LUCInNumber = e["LUCInNumber"].ToString(),


                        Text_Receiveddate = e["ReceivedDate"].ToString(),

                        Text_ReceivedTime = e["ReceivedTime"].ToString(),
                        UCRReceiptNo = e["UCRReceiptNo"].ToString(),
                        RentalDays = e["RentalDays"].ToString(),
                        UHFReceiptNo = e["UHFReceiptNo"].ToString(),
                        isrDamage = e["isrDamage"].ToString(),
                        isrdamageremarks = e["isrdamageremarks"].ToString(),


                    }).FirstOrDefault();
                }
                return ob;

            }
            catch(Exception ex)//
            {
                throw ex;
            }
        }

        public string GetUldTransferData(string Sno)
        {
            try 
            { 
            SqlParameter[] Parameters = { new SqlParameter("@SNo", Convert.ToInt32(Sno)) };
            DataSet ds = SqlHelper.ExecuteDataset(ReadConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, "GetUldTransferData", Parameters);
            return CargoFlash.Cargo.Business.Common.CompleteDStoJSON(ds);
            }

            catch(Exception ex)//
            {
                throw ex;
            }
        }

        public string GetUCRPrintCount(string Sno)
        {
            try 
            { 
            SqlParameter[] Parameters = { new SqlParameter("@SNo", Convert.ToInt32(Sno)) };
            DataSet ds = SqlHelper.ExecuteDataset(ReadConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, "GetANDUpdateUcrPrint", Parameters);
            return CargoFlash.Cargo.Business.Common.CompleteDStoJSON(ds);
            }

            catch(Exception ex)//
            {
                throw ex;
            }
        }
        public string GetGlobalTime(string AirportCode)
        {
            try 
            { 
            SqlParameter[] Parameters = { new SqlParameter("@AirportCode", AirportCode) };
            DataSet ds = SqlHelper.ExecuteDataset(ReadConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, "Get_GetGlobalTime", Parameters);
            return CargoFlash.Cargo.Business.Common.CompleteDStoJSON(ds);
            }

            catch(Exception ex)//
            {
                throw ex;
            }

        }

        public string CheckLUCINNumber(string LUCINNumber)
        {
            try 
            {
            
            SqlParameter[] Parameters = { new SqlParameter("@CheckLUCINNumber", LUCINNumber) };
            DataSet ds = SqlHelper.ExecuteDataset(ReadConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, "CheckLUCINNumber", Parameters);
            return CargoFlash.Cargo.Business.Common.CompleteDStoJSON(ds);
             }

            catch(Exception ex)//
            {
                throw ex;
            }
        }
    }
}
