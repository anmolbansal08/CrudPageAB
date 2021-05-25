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
using CargoFlash.Cargo.Model.SpaceControl;
using System.Reflection;
using ClosedXML;
using ClosedXML.Excel;
using Microsoft.Office.Interop.Excel;

namespace CargoFlash.Cargo.DataService.SpaceControl
{
    [GlobalErrorHandlerBehaviour(typeof(GlobalErrorHandler))]   [ServiceBehavior(IncludeExceptionDetailInFaults = true)]
    [AspNetCompatibilityRequirements(RequirementsMode = AspNetCompatibilityRequirementsMode.Allowed)]
    public class FreightBookingListService : BaseWebUISecureObject, IFreightBookingListService
    {
        public DataSourceResult GetWMSWaybillGridDataFBL(string OriginCity, string DestinationCity, string FlightNo, string FlightDateSearch, string LoggedInCity, int skip, int take, int page, int pageSize, List<SoftwareFactory.Data.GridSort> sort, SoftwareFactory.Data.GridFilter filter)
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

            ProcName = "GetListFreightBookingList";

            string filters = GridFilter.ProcessFilters<WMSBookingGridDataFBL>(filter);

            SqlParameter[] Parameters = { new SqlParameter("@PageNo", page), new SqlParameter("@PageSize", pageSize), new SqlParameter("@WhereCondition", filters), new SqlParameter("@OrderBy", sorts), new SqlParameter("@OriginCity", OriginCity), new SqlParameter("@DestinationCity", DestinationCity), new SqlParameter("@FlightNo", FlightNo), new SqlParameter("@FlightDateSearch", FlightDateSearch), new SqlParameter("@LoggedInCity", LoggedInCity)/*For Multicity*/ , new SqlParameter("@UserSNo", ((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).UserSNo.ToString()) };

            ds = SqlHelper.ExecuteDataset(DMLConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, ProcName, Parameters);

            var wmsBookingList = ds.Tables[0].AsEnumerable().Select(e => new FreightBookingList
            {
                SNo = Convert.ToInt32(e["SNo"]),
                FlightNo = Convert.ToString(e["FlightNo"].ToString()),
                FlightDate = e["FlightDate"] == DBNull.Value ? (DateTime?)null : DateTime.SpecifyKind(Convert.ToDateTime(e["FlightDate"]), DateTimeKind.Utc),
                //FlightDate = Convert.ToString(e["FlightDate"]),
                FlightOrigin = Convert.ToString(e["FlightOrigin"]),
                FlightDestination = Convert.ToString(e["FlightDestination"]),
                ETD = Convert.ToString(e["ETD"]),
                //ProcessStatus = ",FreightBookingListSendFBL_"+Convert.ToString(e["EnableSENDFBL"]) + ",FreightBookingListPRINTFBL_" + Convert.ToString(e["EnablePRINT"]) + ",FreightBookingListVersion_" + Convert.ToString(e["EnableVERSION"])
               // ProcessStatus = Convert.ToString(e["EnableSENDFBL"]) + ',' + Convert.ToString(e["EnablePRINT"]) + ',' + Convert.ToString(e["EnableVERSION"])
                //EnableSENDFBL = Convert.ToString(e["EnableSENDFBL"]),
                //EnablePRINT = Convert.ToString(e["EnablePRINT"]),
                //EnableVERSION = Convert.ToString(e["EnableVERSION"])
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
        public Stream GetWebForm(string processName, string moduleName, string appName, string formAction, string IsSubModule)
        {
            return BuildWebForm(processName, moduleName, appName, formAction, "", (IsSubModule == "1"));
        }
        public Stream GetGridData(string processName, string moduleName, string appName, string OriginCity, string DestinationCity, string FlightNo, string FlightDate, string LoggedInCity)
        {
            return BuildWebForm(processName, moduleName, appName, "IndexView", OriginCity: OriginCity, DestinationCity: DestinationCity, FlightNo: FlightNo, FlightDate: FlightDate, LoggedInCity: LoggedInCity);
        }
        private Stream BuildWebForm(string processName, string moduleName, string appName, string formAction, string recordID = "", bool IsSubModule = true, string AWBSNo = "", string CheckListTypeSNo = "", string OriginCity = "", string DestinationCity = "", string FlightNo = "", string FlightDate = "", string AWBPrefix = "", string AWBNo = "", string HAWBNo = "", string LoggedInCity = "", string FlightStatus = "", string FlightSNo = "")
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
                        case "FreightBookingList":
                            if (appName.ToUpper().Trim() == "FREIGHTBOOKINGLIST")
                                CreateGrid(myCurrentForm, processName, OriginCity, DestinationCity, FlightNo, FlightDate, LoggedInCity);
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
        private void CreateGrid(StringBuilder Container, string ProcessName, string OriginCity = "", string DestinationCity = "", string FlightNo = "", string FlightDateSearch = "", string LoggedInCity ="")
        {
            using (Grid g = new Grid())
            {
                g.PageName = this.MyPageName;
                g.PrimaryID = this.MyPrimaryID;
                g.ModuleName = this.MyModuleID;
                g.AppsName = this.MyAppID;
                g.IsActionRequired = false;

                g.DataSoruceUrl = "Services/SpaceControl/FreightBookingListService.svc/GetWMSWaybillGridDataFBL";
                g.NewURL = MyPageName + "?" + GetWebURLString("New", false);
                g.ServiceModuleName = this.MyModuleID;
                g.UserID = this.MyUserID;
                g.FormCaptionText = "Freight Booking List";
                g.DefaultPageSize = 5;
                g.IsDisplayOnly = false;
                g.IsProcessPart = true;
                g.IsVirtualScroll = false;
                g.IsShowGridHeader = false;
                g.ProcessName = ProcessName;
                g.IsFormHeader = false;
                g.IsShowGridHeader = false;

                g.Column = new List<GridColumn>();
                g.Column.Add(new GridColumn { Field = "SNo", Title = "SNo", DataType = GridDataType.String.ToString(), IsHidden = true, Width = 90 });
                g.Column.Add(new GridColumn { Field = "FlightNo", IsLocked = false, Title = "Flight No", DataType = GridDataType.String.ToString(), Width = 90 });
                g.Column.Add(new GridColumn { Field = "FlightOrigin", IsLocked = false, Title = "Flight Origin", DataType = GridDataType.String.ToString(), Width = 40 });
                g.Column.Add(new GridColumn { Field = "FlightDestination", IsLocked = false, Title = "Flight Destination", DataType = GridDataType.String.ToString(), Width = 35 });
                g.Column.Add(new GridColumn { Field = "FlightDate", IsLocked = false, Title = "Flight Date", DataType = GridDataType.Date.ToString(), Width = 35 });
                g.Column.Add(new GridColumn { Field = "ETD", IsLocked = false, Title = "ETD/ETA", DataType = GridDataType.String.ToString(), Width = 35 });
                g.Column.Add(new GridColumn { Field = "ProcessStatus", Title = "ProcessStatus", DataType = GridDataType.String.ToString(), IsHidden = true });
                //g.Column.Add(new GridColumn { Field = "EnableSENDFBL", Title = "EnableSENDFBL", DataType = GridDataType.String.ToString(), IsHidden = true });
                //g.Column.Add(new GridColumn { Field = "EnablePRINT", Title = "EnablePRINT", DataType = GridDataType.String.ToString(), IsHidden = true });
                //g.Column.Add(new GridColumn { Field = "EnableVERSION", Title = "EnableVERSION", DataType = GridDataType.String.ToString(), IsHidden = true });
                //g.Column.Add(new GridColumn
                //{
                //    Field = "SNo",
                //    Title = "SEND FBL",
                //    DataType = GridDataType.String.ToString(),
                //    Width = 100,
                //    Template =
                //        "# if( EnableSENDFBL==0) {# # } else {#<input type=\"button\" class=\"incompleteprocess\" style=\"cursor:pointer\" value=\"M\" title=\"SEND FBL\" onclick=\"Scmmessage(this,#=SNo#);\" />&nbsp;&nbsp; #} #"
                //});
                //g.Column.Add(new GridColumn { Field = "AWBDate", Title = "AWB Date", IsHidden = false, DataType = GridDataType.Date.ToString(), Template = "# if( AWBDate==null) {# # } else {# #= kendo.toString(new Date(data.AWBDate.getTime() + data.AWBDate.getTimezoneOffset()*60000),\"" + UIDateTimeFormat.UIDateFormatString + "\") # #}#", Width = 80 });
                //g.Column.Add(new GridColumn { Field = "Pcs", Title = "Pcs", DataType = GridDataType.Number.ToString(), Width = 40 });
                //g.Column.Add(new GridColumn { Field = "ChWt", Title = "Ch. Wt", IsHidden = false, DataType = GridDataType.Number.ToString(), Width = 50, Format = "n" });
                //g.Column.Add(new GridColumn { Field = "FlightNo", Title = "Flt No", IsHidden = false, DataType = GridDataType.String.ToString(), Width = 70 });
                //g.Column.Add(new GridColumn { Field = "FlightDateSearch", Title = "Flt Date", IsHidden = false, DataType = GridDataType.Date.ToString(), Template = "# if( FlightDateSearch==null) {# # } else {# #= kendo.toString(new Date(data.FlightDateSearch.getTime() + data.FlightDateSearch.getTimezoneOffset()*60000),\"" + UIDateTimeFormat.UIDateFormatString + "\") # #}#", Width = 80 });
                g.ExtraParam = new List<GridExtraParam>();
                g.ExtraParam.Add(new GridExtraParam { Field = "OriginCity", Value = OriginCity });
                g.ExtraParam.Add(new GridExtraParam { Field = "DestinationCity", Value = DestinationCity });
                g.ExtraParam.Add(new GridExtraParam { Field = "FlightNo", Value = FlightNo });
                g.ExtraParam.Add(new GridExtraParam { Field = "FlightDateSearch", Value = FlightDateSearch });
                g.ExtraParam.Add(new GridExtraParam { Field = "LoggedInCity", Value = LoggedInCity });
                g.InstantiateIn(Container);
            }
        }
        public string PrintFreightBookingDetails(int DailyFlightSNo, string FlightNo, string FlightOrigin, string FlightDate, string FlightEtd)
        {
            SqlParameter[] Parameters = {
                                         new SqlParameter("@DailyFlightSNo", DailyFlightSNo),
                                         new SqlParameter("@FlightNo", FlightNo) ,
                                         new SqlParameter("@FlightOrigin", FlightOrigin),
                                         new SqlParameter("@FlightDate", FlightDate),
                                         new SqlParameter("@UpdatedBy", ((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).UserSNo)
                                        };
            DataSet ds = SqlHelper.ExecuteDataset(ReadConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, "PrintFreight_BookingDetails", Parameters);
            return CargoFlash.Cargo.Business.Common.CompleteDStoJSON(ds);
        }
        public string SendFreightBookingDetails(int DailyFlightSNo, string FlightNo, string FlightOrigin, string FlightDestination, string FlightDate, string FlightEtd)
        {
            SqlParameter[] Parameters = {
                                         new SqlParameter("@DailyFlightSNo", DailyFlightSNo),
                                         new SqlParameter("@FlightNo", FlightNo) ,
                                         new SqlParameter("@FlightDate", FlightDate),
                                        new SqlParameter("@UpdatedBy", ((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).UserSNo)
                                        };
            DataSet ds = SqlHelper.ExecuteDataset(ReadConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, "SendFreight_BookingDetails", Parameters);
            return CargoFlash.Cargo.Business.Common.CompleteDStoJSON(ds);
        }


        public string SaveFBLShipmentDetails(List<FBLShipmentDetailsList> ShipmentDetails)
        {
            DataSet ds = new DataSet();
            try
            {
                System.Data.DataTable dtShipmentDetails = CollectionHelper.ConvertTo(ShipmentDetails, "");
                SqlParameter paramFBLShipmentDetails = new SqlParameter();
                paramFBLShipmentDetails.ParameterName = "@FBLShipmentDetails";
                paramFBLShipmentDetails.SqlDbType = System.Data.SqlDbType.Structured;
                paramFBLShipmentDetails.Value = dtShipmentDetails;

                SqlParameter[] Parameters = { 
                                              paramFBLShipmentDetails,
                                              new SqlParameter("@UpdatedBy", ((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).UserSNo)
                                            };
                ds = SqlHelper.ExecuteDataset(ReadConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, "SaveFreight_BookingShipmentDetails", Parameters);
                return CargoFlash.Cargo.Business.Common.CompleteDStoJSON(ds);
            }
            catch(Exception ex)// (Exception ex)
            {
                return CargoFlash.Cargo.Business.Common.CompleteDStoJSON(ds);
            }
        }

        public string FreightBookingVersionDetails(int DailyFlightSNo, string FlightNo, string FlightDate, string FlightOrigin, string FlightDestination, int FBLVersion)
        {
            DataSet ds = new DataSet();
            try
            {
                SqlParameter[] Parameters = {
                                         new SqlParameter("@DailyFlightSNo", DailyFlightSNo),
                                         new SqlParameter("@FlightNo", FlightNo) ,
                                         new SqlParameter("@FlightDate", FlightDate),
                                         new SqlParameter("@FlightOrigin", FlightOrigin),
                                         new SqlParameter("@FlightDestination", FlightDestination),
                                         new SqlParameter("@VersionNo", FBLVersion),
                                         new SqlParameter("@UpdatedBy", ((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).UserSNo)
                                        };
                ds = SqlHelper.ExecuteDataset(ReadConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, "FreightBooking_VersionDetails", Parameters);
                return CargoFlash.Cargo.Business.Common.CompleteDStoJSON(ds);
            }
            catch(Exception ex)// (Exception ex)
            {
                return CargoFlash.Cargo.Business.Common.CompleteDStoJSON(ds);
            }
        }


        //public void ExcelShipmentDetails(List<FBLShipmentDetailsList> ExcelShipmentDetails)
        //{
        //    string FlightNo = ExcelShipmentDetails[0].FlightNo;
        //    string FlightDate = ExcelShipmentDetails[0].FlightDate;
        //    System.Data.DataTable dt = new System.Data.DataTable();
        //    dt = ToDataTable(ExcelShipmentDetails);
        //    dt.Columns.Remove("DailyFlightSNo");
        //    DataSet ds = new DataSet();
        //    ds.Merge(dt);
        //    ExportDataSetToExcel(ds);
        //   // return "";
        //}

        //public System.Data.DataTable ToDataTable<T>(List<T> items)
        //{
        //    System.Data.DataTable dataTable = new System.Data.DataTable(typeof(T).Name);
        //    //Get all the properties
        //    PropertyInfo[] Props = typeof(T).GetProperties(BindingFlags.Public | BindingFlags.Instance);
        //    foreach (PropertyInfo prop in Props)
        //    {
        //        dataTable.Columns.Add(prop.Name);
        //    }
        //    foreach (T item in items)
        //    {
        //        var values = new object[Props.Length];
        //        for (int i = 0; i < Props.Length; i++)
        //        {
        //            values[i] = Props[i].GetValue(item, null);
        //        }
        //        dataTable.Rows.Add(values);
        //    }
        //    return dataTable;
        //}

        //private void ExportDataSetToExcel(DataSet ds)
        //{
        //    //Creae an Excel application instance
        //    Microsoft.Office.Interop.Excel.Application excelApp = new Microsoft.Office.Interop.Excel.Application();

        //    //Create an Excel workbook instance and open it from the predefined location
        //    Microsoft.Office.Interop.Excel.Workbook excelWorkBook = excelApp.Workbooks.Add();

        //    foreach (System.Data.DataTable table in ds.Tables)
        //    {
        //        //Add a new worksheet to workbook with the Datatable name
        //        Microsoft.Office.Interop.Excel.Worksheet excelWorkSheet = excelWorkBook.Sheets.Add();
        //        excelWorkSheet.Name = table.TableName;

        //        for (int i = 1; i < table.Columns.Count + 1; i++)
        //        {
        //            excelWorkSheet.Cells[1, i] = table.Columns[i - 1].ColumnName;
        //        }

        //        for (int j = 0; j < table.Rows.Count; j++)
        //        {
        //            for (int k = 0; k < table.Columns.Count; k++)
        //            {
        //                excelWorkSheet.Cells[j + 2, k + 1] = table.Rows[j].ItemArray[k].ToString();
        //            }
        //        }
        //    }

        //    excelWorkBook.Save();
        //    excelWorkBook.Close();
        //    excelApp.Quit();
        //}
        ////public void ConvertDSToExcel_Success(DataTable dt, int mode)
        ////{
        ////    var workbook = ExcelFile.Load("Workbook.xls");

        ////    // Select active worksheet from the file.
        ////    var worksheet = workbook.Worksheets.ActiveWorksheet;

        ////    // Extract the data from the worksheet to newly created DataTable starting at 
        ////    // first row and first column for 10 rows or until the first empty row appears.
        ////    var dataTable = worksheet.CreateDataTable(new CreateDataTableOptions()
        ////        {
        ////            StartRow = 0,
        ////            StartColumn = 0,
        ////            NumberOfRows = 10,
        ////            ExtractDataOptions = ExtractDataOptions.StopAtFirstEmptyRow
        ////        });

        ////    // Change the value of the first cell in the DataTable.
        ////    dataTable.Rows[0][0] = "Hello world!";

        ////    // Insert the data from DataTable to the worksheet starting at cell "A1".
        ////    worksheet.InsertDataTable(dataTable,
        ////        new InsertDataTableOptions("A1") { ColumnHeaders = true });

        ////    // Save the file to XLS format.
        ////    workbook.Save("DataTable.xls");
        ////}
    }
}
