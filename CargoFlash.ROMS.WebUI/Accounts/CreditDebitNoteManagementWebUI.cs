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
using CargoFlash.Cargo.Model.Roster;
using System.Collections;
using System.Web;
using CargoFlash.Cargo.WebUI;
using CargoFlash.Cargo.Model.Accounts;

namespace CargoFlash.Cargo.WebUI.Accounts
{
    public class CreditDebitNoteManagementWebUI : BaseWebUISecureObject
    {
        public object GetRecordCreditDebitNote()
        {
            object DutyArea = null;
            try
            {
                if (!string.IsNullOrEmpty(System.Web.HttpContext.Current.Request.QueryString["RecID"]))
                {
                    DutyArea DutyAreaList = new DutyArea();
                    object obj = (object)DutyAreaList;
                    DutyArea = DataGetRecordService(System.Web.HttpContext.Current.Request.QueryString["RecID"], obj, this.MyModuleID);
                    this.MyRecordID = (System.Web.HttpContext.Current.Request.QueryString["RecID"]);
                }
                else
                {
                    //Error Messgae: Record not found.
                }
            }
            catch (Exception ex)
            {
                ApplicationWebUI applicationWebUI = new ApplicationWebUI();
                applicationWebUI.InsertExceptionIntoDatabase(true, ex, this.GetType());

            } return DutyArea;
        }
        public CreditDebitNoteManagementWebUI(Page PageContext)
        {
            try
            {
                if (this.SetCurrentPageContext(PageContext))
                {
                    this.ErrorNumber = 0;
                    this.ErrorMessage = "";
                }
                this.MyPageName = "Default.aspx";
                this.MyModuleID = "Accounts";
                this.MyAppID = "CreditDebitNote";
                this.MyPrimaryID = "SNo";
            }
            catch (Exception ex)
            {
                ApplicationWebUI applicationWebUI = new ApplicationWebUI();
                applicationWebUI.InsertExceptionIntoDatabase(true, ex, this.GetType());
                ErrorMessage = applicationWebUI.ErrorMessage;
            }
        }
        public CreditDebitNoteManagementWebUI()
        {
            try
            {
                this.MyModuleID = "Accounts";
                this.MyAppID = "CreditDebitNote";
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
                    htmlFormAdapter.HeadingColumnName = "";
                    switch (DisplayMode)
                    {
                        case DisplayModeReadView:
                            //htmlFormAdapter.objFormData = GetRecordDutyArea();
                            htmlFormAdapter.DisplayMode = DisplayModeType.ReadOnly;
                            htmlFormAdapter.CommandDeleteURL = MyPageName + "?" + GetWebURLString("DELETE", true);
                            htmlFormAdapter.CommandEditURL = MyPageName + "?" + GetWebURLString("Edit", true);
                            htmlFormAdapter.CommandCancelURL = MyPageName + "?" + GetWebURLString("INDEXVIEW", false);
                            htmlFormAdapter.CommandDuplicateURL = MyPageName + "?" + GetWebURLString("DUPLICATE", true);
                            container.Append(htmlFormAdapter.InstantiateIn());
                            container.Append("<br><div id='dvInvoiceDetails'></div>");
                            container.Append("<br><br>");
                            container.Append("<div id='divCNList'><span id='spnCNList'><table id='tblCNList' style='text-align:center'></table></span></div>");
                            container.Append("<br><br>");
                            container.Append("<div id='divInvoiceCharges'><span id='spnInvoiceCharges'><input id='hdnActionMode' name='hdnActionMode' type='hidden' value='" + this.FormAction.ToString().ToUpper().Trim() + "'/><input id='hdnInvoiceSNo' name='hdnCNDN_SNo' type='hidden' value='" + this.MyRecordID + "'/><input id='hdnFormData' name='hdnFormData' type='hidden' value=''/><input id='hdnPageSize' name='hdnPageSize' type='hidden' value='" + this.FormAction.ToString().ToUpper().Trim() + "'/><table id='tblInvoiceCharges' style='text-align:center'></table></span></div>");
                         
                            break;
                        case DisplayModeDuplicate:
                            //htmlFormAdapter.objFormData = GetRecordDutyArea();
                            htmlFormAdapter.DisplayMode = DisplayModeType.New;
                            htmlFormAdapter.CommandCancelURL = MyPageName + "?" + GetWebURLString("INDEXVIEW", false);
                            container.Append(htmlFormAdapter.InstantiateIn());
                            break;
                        case DisplayModeEdit:

                            //htmlFormAdapter.objFormData = GetRecordDutyArea();
                            htmlFormAdapter.DisplayMode = DisplayModeType.Edit;
                            htmlFormAdapter.CommandCancelURL = MyPageName + "?" + GetWebURLString("INDEXVIEW", false);
                            container.Append(htmlFormAdapter.InstantiateIn());
                             container.Append("<br><div id='dvInvoiceDetails'></div>");
                            container.Append("<br><br>");
                            container.Append("<div id='divCNList'><span id='spnCNList'><table id='tblCNList' style='text-align:center'></table></span></div>");
                            container.Append("<br><br>");
                            container.Append("<div id='divInvoiceCharges'><span id='spnInvoiceCharges'><input id='hdnActionMode' name='hdnActionMode' type='hidden' value='" + this.FormAction.ToString().ToUpper().Trim() + "'/><input id='hdnInvoiceSNo' name='hdnCNDN_SNo' type='hidden' value='" + this.MyRecordID + "'/><input id='hdnFormData' name='hdnFormData' type='hidden' value=''/><input id='hdnPageSize' name='hdnPageSize' type='hidden' value='" + this.FormAction.ToString().ToUpper().Trim() + "'/><table id='tblInvoiceCharges' style='text-align:center'></table></span></div>");
                         
                            break;
                        case DisplayModeNew:
                            htmlFormAdapter.DisplayMode = DisplayModeType.New;
                            htmlFormAdapter.CommandCancelURL = MyPageName + "?" + GetWebURLString("INDEXVIEW", false);
                            container.Append(htmlFormAdapter.InstantiateIn());
                            container.Append("<br><div id='dvInvoiceDetails'></div>");
                            container.Append("<br><br>");
                            container.Append("<div id='divCNList'><span id='spnCNList'><table id='tblCNList' style='text-align:center'></table></span></div>");
                            container.Append("<br><br>");
                            container.Append("<div id='divInvoiceCharges'><span id='spnInvoiceCharges'><input id='hdnActionMode' name='hdnActionMode' type='hidden' value='" + this.FormAction.ToString().ToUpper().Trim() + "'/><input id='hdnInvoiceSNo' name='hdnCNDN_SNo' type='hidden' value='" + this.MyRecordID + "'/><input id='hdnFormData' name='hdnFormData' type='hidden' value=''/><input id='hdnPageSize' name='hdnPageSize' type='hidden' value='" + this.FormAction.ToString().ToUpper().Trim() + "'/><table id='tblInvoiceCharges' style='text-align:center'></table></span></div>");
                            break;
                        case DisplayModeDelete:
                            //htmlFormAdapter.objFormData = GetRecordDutyArea();
                            htmlFormAdapter.DisplayMode = DisplayModeType.Delete;
                            htmlFormAdapter.CommandCancelURL = MyPageName + "?" + GetWebURLString("INDEXVIEW", false);
                            container.Append(htmlFormAdapter.InstantiateIn());
                            container.Append("<br><div id='dvInvoiceDetails'></div>");
                            container.Append("<br><br>");
                            container.Append("<div id='divCNList'><span id='spnCNList'><table id='tblCNList' style='text-align:center'></table></span></div>");
                            container.Append("<br><br>");
                            container.Append("<div id='divInvoiceCharges'><span id='spnInvoiceCharges'><input id='hdnActionMode' name='hdnActionMode' type='hidden' value='" + this.FormAction.ToString().ToUpper().Trim() + "'/><input id='hdnInvoiceSNo' name='hdnCNDN_SNo' type='hidden' value='" + this.MyRecordID + "'/><input id='hdnFormData' name='hdnFormData' type='hidden' value=''/><input id='hdnPageSize' name='hdnPageSize' type='hidden' value='" + this.FormAction.ToString().ToUpper().Trim() + "'/><table id='tblInvoiceCharges' style='text-align:center'></table></span></div>");
                         
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
        private StringBuilder CreateGrid(StringBuilder Container)
        {
            try
            {
                using (Grid g = new Grid())
                {
                    g.CommandButtonNewText = "New Credit Note";
                    g.FormCaptionText = "Credit Note";
                    g.PrimaryID = this.MyPrimaryID;
                    g.PageName = this.MyPageName;
                    g.ModuleName = this.MyModuleID;
                    g.AppsName = this.MyAppID;
                    g.ServiceModuleName = this.MyModuleID;
                    g.NewURL = MyPageName + "?" + GetWebURLString("New", false);
                    g.Column = new List<GridColumn>();
                    g.Column.Add(new GridColumn { Field = "IssuedName", Title = "Airline/Agent Name", DataType = GridDataType.String.ToString() });
                    g.Column.Add(new GridColumn { Field = "SNo", Title = "SNo", DataType = GridDataType.String.ToString(), IsHidden = true });
                    g.Column.Add(new GridColumn { Field = "IssuedTo", Title = "Issued To", DataType = GridDataType.String.ToString() });
                    g.Column.Add(new GridColumn { Field = "InvoiceNo", Title = "Invoice No", DataType = GridDataType.String.ToString() });
                    g.Column.Add(new GridColumn { Field = "TransactionNo", Title = "Credit Note No.", DataType = GridDataType.String.ToString() });
                    g.Column.Add(new GridColumn { Field = "Amount", Title = "Requested Amount", DataType = GridDataType.String.ToString() });
                    g.Column.Add(new GridColumn { Field = "Status", Title = "Status", DataType = GridDataType.String.ToString() });
                    //g.Column.Add(new GridColumn { Field = "TransactionType", Title = "Type", DataType = GridDataType.String.ToString() });
                    g.Column.Add(new GridColumn { Field = "ApprovedAmount", Title = "Approved Amount", DataType = GridDataType.String.ToString() });
                    // g.Column.Add(new GridColumn { Field = "CreatedOn", Title = "Generated On", DataType = GridDataType.Date.ToString() });
                    g.Column.Add(new GridColumn { Field = "CreatedOn", Title = "Generated On", DataType = GridDataType.DateTime.ToString(), Template = "# if( CreatedOn==null) {# # } else {# #= kendo.toString(new Date(data.CreatedOn.getTime() + data.CreatedOn.getTimezoneOffset()*60000),\"" + UIDateTimeFormat.UIDateFormatString + " " + UIDateTimeFormat.UITimeFormatString + "\") # #}#" });
                    g.Column.Add(new GridColumn { Field = "CreditNoteType", Title = "Credit Note Type", DataType = GridDataType.String.ToString() });
                    g.Column.Add(new GridColumn { Field = "FlightNo", Title = "Print", Template = "# if( TransactionNo==\"\"){} else {#<input type=\"button\" class=\"incompleteprocess\" style=\"cursor:pointer\" value=\"P\" onclick=\"PrintSlip(#=SNo#);\" /># }#", DataType = GridDataType.String.ToString(), Width = 100 });


                    g.InstantiateIn(Container);
                }
            }
            catch (Exception ex)
            {
                ApplicationWebUI applicationWebUI = new ApplicationWebUI();
                applicationWebUI.InsertExceptionIntoDatabase(true, ex, this.GetType());
            }
            return Container;
        }

        public override void DoPostBack()
        {

            this.OperationMode = "FORMACTION." + this.FormAction.ToString().ToUpper().Trim();
            switch (OperationMode)
            {
                case DisplayModeSave:
                    SaveCreditDebitNote();
                    if (string.IsNullOrEmpty(ErrorMessage))
                        System.Web.HttpContext.Current.Response.Redirect(MyPageName + "?" + GetWebURLString("INDEXVIEW", false, 2000), false);
                    break;
                case DisplayModeSaveAndNew:
                    //SaveDutyArea();
                    if (string.IsNullOrEmpty(ErrorMessage))
                        System.Web.HttpContext.Current.Response.Redirect(MyPageName + "?" + GetWebURLString("NEW", false, 2000), false);
                    break;
                case DisplayModeUpdate:

                    UpdateCreditDebitNote(System.Web.HttpContext.Current.Request.QueryString["RecID"]);
                    if (string.IsNullOrEmpty(ErrorMessage))
                        System.Web.HttpContext.Current.Response.Redirect(MyPageName + "?" + GetWebURLString("INDEXVIEW", false, 2001), false);
                    break;

                case DisplayModeDelete:
                    DeleteCreditDebitNote(System.Web.HttpContext.Current.Request.QueryString["RecID"]);
                    if (string.IsNullOrEmpty(ErrorMessage))
                        System.Web.HttpContext.Current.Response.Redirect(MyPageName + "?" + GetWebURLString("INDEXVIEW", false, 2002), false);
                    break;
            }
            //}
            //catch (Exception ex)
            //{
            //    ApplicationWebUI applicationWebUI = new ApplicationWebUI();
            //    applicationWebUI.InsertExceptionIntoDatabase(true, ex, this.GetType());

            //}
        }

        private void SaveCreditDebitNote()
        {
            try
            {
                var FormElement = System.Web.HttpContext.Current.Request.Form;
                System.Web.Script.Serialization.JavaScriptSerializer js = new System.Web.Script.Serialization.JavaScriptSerializer();
                List<CNDNChargesTrans> AppendGridData = js.Deserialize<List<CNDNChargesTrans>>(CargoFlash.Cargo.Business.Common.Base64ToString(FormElement["hdnFormData"]));
                List<CreditDebitNote> listCreditDebitNote = new List<CreditDebitNote>();
                var model = new CreditDebitNote
                {
                    InvoiceSNo = FormElement["InvoiceNo"],
                    CreditNoteType = FormElement["rdCreditNoteFor"] + "_" + FormElement["rdCreditNoteType"],
                    LstCNDNChargesTrans = AppendGridData,
                    CreatedBy = ((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).UserSNo,
                };

                listCreditDebitNote.Add(model);
                object datalist = (object)listCreditDebitNote;
                DataOperationService(DisplayModeSave, datalist, MyModuleID);
            }

            catch (Exception ex)
            {
                ApplicationWebUI applicationWebUI = new ApplicationWebUI();
                applicationWebUI.InsertExceptionIntoDatabase(true, ex, this.GetType());
            }
        }
        private void UpdateCreditDebitNote(string RecordID)
        {
            try
            {
                var FormElement = System.Web.HttpContext.Current.Request.Form;
                System.Web.Script.Serialization.JavaScriptSerializer js = new System.Web.Script.Serialization.JavaScriptSerializer();
                List<CNDNChargesTrans> AppendGridData = js.Deserialize<List<CNDNChargesTrans>>(CargoFlash.Cargo.Business.Common.Base64ToString(FormElement["hdnFormData"]));
                List<CreditDebitNote> listCreditDebitNote = new List<CreditDebitNote>();
                var model = new CreditDebitNote
                {
                    
                    InvoiceSNo = FormElement["InvoiceNo"],
                    CreditNoteType = FormElement["rdCreditNoteFor"] + "_" + FormElement["rdCreditNoteType"],
                    LstCNDNChargesTrans = AppendGridData,
                    CreatedBy = ((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).UserSNo,
                };

                listCreditDebitNote.Add(model);
                object datalist = (object)listCreditDebitNote;
                DataOperationService(DisplayModeUpdate, datalist, MyModuleID);
            }
            catch (Exception ex)
            {
                ApplicationWebUI applicationWebUI = new ApplicationWebUI();
                applicationWebUI.InsertExceptionIntoDatabase(true, ex, this.GetType());
            }

        }


        //private void UpdateDutyArea(string RecordID)
        //{
        //    try
        //    {
        //        List<DutyArea> listDutyArea = new List<DutyArea>();
        //        // String[] Logo = SaveImage();
        //        var FormElement = System.Web.HttpContext.Current.Request.Form;
        //        bool etype;
        //        if (FormElement["IsExport"] == "0")
        //        {
        //            etype = false;
        //        }
        //        else
        //        {
        //            etype = true;
        //        }

        //        var DutyArea = new DutyArea
        //        {
        //            SNo = int.Parse(RecordID),
        //            AreaName = FormElement["AreaName"].ToUpper(),
        //            IsActive = FormElement["IsActive"] == "0",//not null
        //            CreatedOn = DateTime.UtcNow.ToString(),
        //            UpdatedOn = DateTime.UtcNow.ToString(),
        //            CreatedBy = ((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).UserSNo.ToString(),
        //            UpdatedBy = ((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).UserSNo.ToString(),

        //            ColorName = FormElement["ColorName"].ToString(),
        //            TerminalSno = Convert.ToInt32(FormElement["TerminalSno"]),
        //            IsExport = etype,
        //            HashColorCodeSno = Convert.ToInt32(FormElement["HashColorCodeSno"])
        //        };
        //        listDutyArea.Add(DutyArea);
        //        object datalist = (object)listDutyArea;
        //        DataOperationService(DisplayModeUpdate, datalist, MyModuleID);
        //        {
        //            //ErrorNumer
        //            //Error Message
        //        }
        //    }
        //    catch (Exception ex)
        //    {
        //        ApplicationWebUI applicationWebUI = new ApplicationWebUI();
        //        applicationWebUI.InsertExceptionIntoDatabase(true, ex, this.GetType());
        //    }

        //}
        private void DeleteCreditDebitNote(string RecordID)
        {
            try
            {
                List<string> listID = new List<string>();
                listID.Add(RecordID);
                listID.Add(MyUserID.ToString());
                object recordID = (object)listID;
                DataOperationService(DisplayModeDelete, recordID, MyModuleID);
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
    }
}
