using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Web.UI;
using System.Data;
using System.Net;
using System.IO;
using System.Reflection;
using System.Runtime.Serialization;
using CargoFlash.SoftwareFactory.WebUI;
using CargoFlash.SoftwareFactory.WebUI.Adapters;
using CargoFlash.SoftwareFactory.WebUI.Controls;
using CargoFlash.Cargo.Model.Master;
using System.Collections;
using System.Globalization;
using System.Web;


namespace CargoFlash.Cargo.WebUI.Master
{
    public class BTLManagementWebUI : BaseWebUISecureObject
    {
        public BTLManagementWebUI()
        {
            try
            {
                this.MyModuleID = "Master";
                this.MyAppID = "BTL";
                this.MyPrimaryID = "SNo";
            }
            catch (Exception ex)
            {
                ApplicationWebUI applicationWebUI = new ApplicationWebUI();
                applicationWebUI.InsertExceptionIntoDatabase(true, ex, this.GetType());
                ErrorMessage = applicationWebUI.ErrorMessage;
            }
        }

        public BTLManagementWebUI(Page PageContext)
        {
            try
            {
                if (this.SetCurrentPageContext(PageContext))
                {
                    this.ErrorNumber = 0;
                    this.ErrorMessage = "";
                }
                this.MyPageName = "Default.aspx";
                this.MyModuleID = "Master";
                this.MyAppID = "BTL";
                this.MyPrimaryID = "SNo";
            }
            catch (Exception ex)
            {
                ApplicationWebUI applicationWebUI = new ApplicationWebUI();
                applicationWebUI.InsertExceptionIntoDatabase(true, ex, this.GetType());
                ErrorMessage = applicationWebUI.ErrorMessage;
            }
        }

        public StringBuilder BuildFormView(string DisplayMode, StringBuilder container)
        {
            try
            {
                using (HtmlFormAdapter htmlFormAdapter = new HtmlFormAdapter(MyModuleID))
                {
                    htmlFormAdapter.CurrentPage = this.CurrentPageContext;
                    htmlFormAdapter.HeadingColumnName = "BTLName";
                    switch (DisplayMode)
                    {
                        case DisplayModeReadView:
                            htmlFormAdapter.DisplayMode = DisplayModeType.ReadOnly;
                            //htmlFormAdapter.objFormData = GetRecordBTL();
                            htmlFormAdapter.CommandDeleteURL = MyPageName + "?" + GetWebURLString("DELETE", false);
                            htmlFormAdapter.CommandEditURL = MyPageName + "?" + GetWebURLString("Edit", true);
                            htmlFormAdapter.CommandCancelURL = MyPageName + "?" + GetWebURLString("INDEXVIEW", false);
                            htmlFormAdapter.CommandDuplicateURL = MyPageName + "?" + GetWebURLString("DUPLICATE", true);

                            container.Append(htmlFormAdapter.InstantiateIn());
                            container.Append("<Div id='BTLContainer'></Div>");
                            container.Append("<div id='divBTL'><span id='spnBTL'><input id='hdnPageType' name='hdnPageType' type='hidden' value='" + this.FormAction.ToString().ToUpper().Trim() + "'/><input id='hdnBTLSNo' name='hdnBTLSNo' type='hidden' value='" + this.MyRecordID + "'/><table id='tblBTL' Style='margin-top: 20px;'></table></span></div>");
                            break;

                        case DisplayModeDuplicate:
                            htmlFormAdapter.DisplayMode = DisplayModeType.New;
                            htmlFormAdapter.objFormData = GetRecordBTL();
                            htmlFormAdapter.CommandCancelURL = MyPageName + "?" + GetWebURLString("INDEXVIEW", false);
                            container.Append(htmlFormAdapter.InstantiateIn());
                            break;
                        case DisplayModeEdit:
                            htmlFormAdapter.DisplayMode = DisplayModeType.Edit;
                            htmlFormAdapter.objFormData = GetRecordBTL();
                            htmlFormAdapter.CommandCancelURL = MyPageName + "?" + GetWebURLString("INDEXVIEW", false);
                            container.Append(htmlFormAdapter.InstantiateIn());
                            container.Append("<Div id='BTLContainer'><span id='spnBTLCon'><input id='hdnBTLConSNo' name='hdnBTLConSNo' type='hidden' value='" + this.MyRecordID + "'/></span></Div>");
                            container.Append("<div id='divBTL'><span id='spnBTL'><input id='hdnPageType' name='hdnPageType' type='hidden' value='" + this.FormAction.ToString().ToUpper().Trim() + "'/><input id='hdnBTLSNo' name='hdnBTLSNo' type='hidden' value='" + this.MyRecordID + "'/><table id='tblBTL' Style='margin-top: 20px;'></table></span></div>");
                            break;
                        case DisplayModeNew:
                            htmlFormAdapter.DisplayMode = DisplayModeType.New;
                            htmlFormAdapter.CommandCancelURL = MyPageName + "?" + GetWebURLString("INDEXVIEW", false);
                            container.Append(htmlFormAdapter.InstantiateIn());
                            container.Append("<Div id='BTLContainer'><span id='spnBTLCon'><input id='hdnBTLConSNo' name='hdnBTLConSNo' type='hidden' value='" + this.MyRecordID + "'/></span></Div>");
                            container.Append("<div id='divBTL'><span id='spnBTL'><input id='hdnPageType' name='hdnPageType' type='hidden' value='" + this.FormAction.ToString().ToUpper().Trim() + "'/><input id='hdnBTLSNo' name='hdnBTLSNo' type='hidden' value='" + this.MyRecordID + "'/><table id='tblBTL' Style='margin-top: 20px;'></table></span></div>");
                            break;
                        //case DisplayModeDelete:
                        //    htmlFormAdapter.DisplayMode = DisplayModeType.Delete;
                        //    htmlFormAdapter.objFormData = GetRecordEmbargo();
                        //    htmlFormAdapter.CommandCancelURL = MyPageName + "?" + GetWebURLString("INDEXVIEW", false);
                        //    container.Append(htmlFormAdapter.InstantiateIn());
                        //    break;
                        default:
                            break;
                    }
                }
            }
            catch (Exception ex)
            {
                ApplicationWebUI applicationWebUI = new ApplicationWebUI();
                applicationWebUI.InsertExceptionIntoDatabase(true, ex, this.GetType());
                ErrorMessage = applicationWebUI.ErrorMessage;

            }
            return container;
        }

        public StringBuilder CreateWebForm(StringBuilder container)
        {
            StringBuilder strContent = new StringBuilder();
            try
            {


                // if (System.Web.HttpContext.Current.Request.QueryString["FormAction"] != null)
                {
                    //Set the display Mode form the URL QuesyString.
                    this.DisplayMode = "FORMACTION." + this.FormAction.ToString().ToUpper().Trim();
                    //Match the display Mode of the form.
                    switch (this.DisplayMode)
                    {
                        case DisplayModeIndexView:
                            strContent = CreateGrid(container);
                            break;
                        case DisplayModeDuplicate:
                            strContent = BuildFormView(this.DisplayMode, container);
                            break;
                        case DisplayModeReadView:
                            strContent = BuildFormView(this.DisplayMode, container);
                            break;
                        case DisplayModeEdit:
                            strContent = BuildFormView(this.DisplayMode, container);
                            break;
                        case DisplayModeNew:
                            strContent = BuildFormView(this.DisplayMode, container);
                            break;
                        case DisplayModeDelete:
                            strContent = BuildFormView(this.DisplayMode, container);
                            break;
                        default:
                            break;

                    }

                }
            }
            catch (Exception ex)
            {
                ApplicationWebUI applicationWebUI = new ApplicationWebUI();
                applicationWebUI.InsertExceptionIntoDatabase(true, ex, this.GetType());

            }
            return strContent;
        }
        public override void DoPostBack()
        {
            try
            {
                this.OperationMode = "FORMACTION." + this.FormAction.ToString().ToUpper().Trim();
                switch (OperationMode)
                {
                    case DisplayModeSave:
                        SaveBTL();
                        if (string.IsNullOrEmpty(ErrorMessage))
                            System.Web.HttpContext.Current.Response.Redirect(MyPageName + "?" + GetWebURLString("INDEXVIEW", false, 2000), false);
                        break;
                    //case DisplayModeUpdate:
                    //    UpdateExchangeRateConfiguration(System.Web.HttpContext.Current.Request.QueryString["RecID"]);
                    //    if (string.IsNullOrEmpty(ErrorMessage))
                    //        System.Web.HttpContext.Current.Response.Redirect(MyPageName + "?" + GetWebURLString("INDEXVIEW", false, 2001), false);
                    //    break;
                    //case DisplayModeSaveAndNew:
                    //    SaveExchangeRateConfiguration();
                    //    if (string.IsNullOrEmpty(ErrorMessage))
                    //        System.Web.HttpContext.Current.Response.Redirect(MyPageName + "?" + GetWebURLString("NEW", false, 2000), false);
                    //    //else
                    //    //    return;
                    //    break;

                    //case DisplayModeDelete:
                    //    DeleteExchangeRateConfiguration(System.Web.HttpContext.Current.Request.QueryString["RecID"]);
                    //    if (string.IsNullOrEmpty(ErrorMessage))
                    //        System.Web.HttpContext.Current.Response.Redirect(MyPageName + "?" + GetWebURLString("INDEXVIEW", false, 2002), false);
                    //    break;
                }
            }
            catch (Exception ex)
            {
                ApplicationWebUI applicationWebUI = new ApplicationWebUI();
                applicationWebUI.InsertExceptionIntoDatabase(true, ex, this.GetType());
                ErrorMessage = applicationWebUI.ErrorMessage;

            }
        }

        private StringBuilder CreateGrid(StringBuilder Container)
        {
            try
            {
                using (Grid e = new Grid())
                {
                    e.PageName = this.MyPageName;
                    e.PrimaryID = this.MyPrimaryID;
                    e.ModuleName = this.MyModuleID;
                    e.AppsName = this.MyAppID;
                    e.CommandButtonNewText = "New BTL";
                    e.FormCaptionText = "BTL";
                    e.ServiceModuleName = this.MyModuleID;
                    e.IsShowDelete = false;
                    e.NewURL = MyPageName + "?" + GetWebURLString("New", false);
                    e.Column = new List<GridColumn>();
                    e.Column.Add(new GridColumn { Field = "BTLName", Title = "BTL Name", DataType = GridDataType.String.ToString() });
                    e.Column.Add(new GridColumn { Field = "Text_AirlineSNo", Title = "Airline", DataType = GridDataType.String.ToString() });
                    e.Column.Add(new GridColumn { Field = "ValidFrom", Title = "Valid From", DataType = GridDataType.Date.ToString(), Template = "#= kendo.toString(new Date(data.ValidFrom.getTime() + data.ValidFrom.getTimezoneOffset()*60000),\"" + UIDateTimeFormat.UIDateFormatString + "\") #" });

                    e.Column.Add(new GridColumn { Field = "ValidTo", Title = "Valid To", DataType = GridDataType.Date.ToString(), Template = "#= kendo.toString(new Date(data.ValidTo.getTime() + data.ValidTo.getTimezoneOffset()*60000),\"" + UIDateTimeFormat.UIDateFormatString + "\") #" });
                    e.Column.Add(new GridColumn { Field = "Text_Type", Title = "Type", DataType = GridDataType.String.ToString() });
                    e.Column.Add(new GridColumn { Field = "Text_BTLLevel", Title = "BTL Level", DataType = GridDataType.String.ToString() });
                    e.Column.Add(new GridColumn { Field = "Text_BTLStatus", Title = "BTL Status", DataType = GridDataType.String.ToString()});
                    
                    e.InstantiateIn(Container);
                }
            }
            catch (Exception ex)
            {
                ApplicationWebUI applicationWebUI = new ApplicationWebUI();
                applicationWebUI.InsertExceptionIntoDatabase(true, ex, this.GetType());
                ErrorMessage = applicationWebUI.ErrorMessage;
            }
            return Container;
        }
        private void SaveBTL()
        {
            try
            {
                var days = "";
                List<BTL> listBTL = new List<BTL>();
                List<BTLFlightTrans> BTLFlightTrans = new List<BTLFlightTrans>();
                List<BTLPeriodTrans> BTLPeriodTrans = new List<BTLPeriodTrans>();
                var FormElement = System.Web.HttpContext.Current.Request.Form;
                string[] values = FormElement["tblBTL_rowOrder"].ToString().Split(',');
                //if (Convert.ToInt32(FormElement["BTLLevel"]) == 1)
                //{
                    for (int count = 0; count < Convert.ToInt32(FormElement["tblBTL_rowOrder"].ToString().Split(',').Length); count++)
                    {
                        BTLFlightTrans.Add(new BTLFlightTrans()
                        {
                            SNo = 1,
                            BTLMasterSNo = 1,
                            FlightNo = Convert.ToString(FormElement["tblBTL_HdnFlightSNo_" + values[count]] == "" ? "" : FormElement["tblBTL_HdnFlightSNo_" + values[count]]),
                            NoOfPieces = Convert.ToInt32(FormElement["tblBTL_NoOfPieces_" + values[count]] == "" ? "" : FormElement["tblBTL_NoOfPieces_" + values[count]]),
                            TotalWeight = Convert.ToInt32(FormElement["tblBTL_TotalWeight_" + values[count]] == "" ? "" : FormElement["tblBTL_TotalWeight_" + values[count]]),
                            CommoditySNo = Convert.ToInt32(FormElement["tblBTL_HdnCommoditySNo_" + values[count]] == "" ? "" : FormElement["tblBTL_HdnCommoditySNo_" + values[count]]),
                            SPHCSNo = Convert.ToInt32(FormElement["tblBTL_HdnSHCSNo_" + values[count]] == "" ? "" : FormElement["tblBTL_HdnSHCSNo_" + values[count]])

                        }
                        );
                    }
                //}
                //else
                //{
                    for (int count = 0; count < Convert.ToInt32(FormElement["tblBTL_rowOrder"].ToString().Split(',').Length); count++)
                    {
                        BTLPeriodTrans.Add(new BTLPeriodTrans()
                        {
                            SNo = 1,
                            BTLMasterSNo = 1,
                            NoOfDays = Convert.ToInt32(FormElement["tblBTL_NoOfDays_" + values[count]] == "" ? "" : FormElement["tblBTL_NoOfDays_" + values[count]]),
                            NoOfShipment = Convert.ToInt32(FormElement["tblBTL_NoOfShipment_" + values[count]] == "" ? "" : FormElement["tblBTL_NoOfDays_" + values[count]]),
                            TotalWeight = Convert.ToInt32(FormElement["tblBTL_TotalWeight_" + values[count]] == "" ? "" : FormElement["tblBTL_TotalWeight_" + values[count]]),
                            CommoditySNo = Convert.ToInt32(FormElement["tblBTL_HdnCommoditySNo_" + values[count]] == "" ? "" : FormElement["tblBTL_HdnCommoditySNo_" + values[count]]),
                            SPHCSNo = Convert.ToInt32(FormElement["tblBTL_HdnSHCSNo_" + values[count]] == "" ? "" : FormElement["tblBTL_HdnSHCSNo_" + values[count]])

                        }
                        );
                    }
               // }
                if (FormElement["Day0"] == "8")
                {
                    days = "1,2,3,4,5,6,7";
                }
                else
                {
                    for (int i = 1; i < 8; i++)
                    {
                        if (FormElement["Day" + i] == i.ToString())
                        {
                            days = days + i + ",";
                        }
                    }
                    if (days.Length > 1)
                    {
                        days = days.Substring(0, (days.Length - 1));
                    }
                }
                
                //string TimeofDifference = FormElement["TimeDifference"].Split(new char[] { ')' })[1];
                var BTL = new BTL
                {
                    SNo = 1,
                    BTLName = FormElement["BTLName"],
                    AirlineSNo = int.Parse(FormElement["AirlineSNo"]),
                    Type = int.Parse(FormElement["Type"]),
                    ValidFrom = Convert.ToDateTime(FormElement["ValidFrom"]),
                    ValidTo = Convert.ToDateTime(FormElement["ValidTo"]),
                    DaysOfWeek=days,
                    BTLLevel = int.Parse(FormElement["BTLLevel"]),
                    BTLStatus = int.Parse(FormElement["BTLStatus"]),
                    BTLRemarks = FormElement["BTLRemarks"],
                    AircraftSNo = FormElement["Aircraft"] == "" ? "" : FormElement["Aircraft"],
                    AccountSNo = int.Parse(FormElement["AccountSNo"] == "" ? "" : FormElement["AccountSNo"]),
                    BTLFlightTrans=BTLFlightTrans,
                    BTLPeriodTrans=BTLPeriodTrans,
                    CreatedBy = ((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).UserSNo.ToString(),
                    UpdatedBy = ((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).UserSNo.ToString()

                };
                listBTL.Add(BTL);
                object datalist = (object)listBTL;
                DataOperationService(DisplayModeSave, datalist, MyModuleID);
                {
                    //ErrorNumer
                    //Error Message
                }
            }
            catch (Exception ex)
            {
                ApplicationWebUI applicationWebUI = new ApplicationWebUI();
                applicationWebUI.InsertExceptionIntoDatabase(true, ex, this.GetType());
            }
        
        }
        public object GetRecordBTL()
        {
            object BTL = null;
            try
            {
                if (!DisplayMode.ToLower().Contains("new"))
                {
                    if (!string.IsNullOrEmpty(System.Web.HttpContext.Current.Request.QueryString["RecID"]))
                    {
                        BTL BTLList = new BTL();
                        object obj = (object)BTLList;
                        //retrieve Entity from Database according to the record
                        IDictionary<string, string> qString = new Dictionary<string, string>();
                        qString.Add("UserSNo", ((Model.UserLogin)(HttpContext.Current.Session["UserDetail"])).UserSNo.ToString());
                        BTL = DataGetRecordService(System.Web.HttpContext.Current.Request.QueryString["RecID"], obj, MyModuleID, "", "", qString);
                        this.MyRecordID = (System.Web.HttpContext.Current.Request.QueryString["RecID"]);
                    }
                    else
                    {
                        //Error Message: Record not found.
                    }
                }
            }
            catch (Exception ex)
            {
                ApplicationWebUI applicationWebUI = new ApplicationWebUI();
                applicationWebUI.InsertExceptionIntoDatabase(true, ex, this.GetType());
                ErrorMessage = applicationWebUI.ErrorMessage;
            }

            return BTL;
        }

    }
}
