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
using CargoFlash.Cargo.Model.ULD;
using System.Collections;
using System.Web;
namespace CargoFlash.Cargo.WebUI.ULD
{
    #region ULDRepairableItems Class Description
    /*
    *****************************************************************************
    Class Name:		ULDSLAManagementWebUI      
    Purpose:		
    Company:		CargoFlash Infotech Pvt Ltd.
    Author:			Devendra singh
    Created On:		
    Updated By:    
    Updated On:	
    Approved By:    
    Approved On:	
    *****************************************************************************
    */
    #endregion
    public class ULDSLAManagementWebUI : BaseWebUISecureObject
    {

        
            /// <summary>
            /// Set context of the page(form) i.e bind Module ID,App ID
            /// </summary>
            /// <param name="PageContext"></param>
            public ULDSLAManagementWebUI(Page PageContext)
            {
                try
                {
                    if (this.SetCurrentPageContext(PageContext))
                    {
                        this.ErrorNumber = 0;
                        this.ErrorMessage = "";
                    }
                    this.MyPageName = "Default.aspx";
                    this.MyModuleID = "ULD";
                    this.MyAppID = "ULDSLA";
                    this.MyPrimaryID = "SNo";
                }


                catch (Exception ex)
                {
                    ApplicationWebUI applicationWebUI = new ApplicationWebUI();
                    applicationWebUI.InsertExceptionIntoDatabase(true, ex, this.GetType());
                    ErrorMessage = applicationWebUI.ErrorMessage;

                }
            }

            public ULDSLAManagementWebUI()
            {
                try
                {
                    this.MyModuleID = "ULD";
                    this.MyAppID = "ULDSLA";
                    this.MyPrimaryID = "SNo";
                }
                catch (Exception ex)
                {
                    ApplicationWebUI applicationWebUI = new ApplicationWebUI();
                    applicationWebUI.InsertExceptionIntoDatabase(true, ex, this.GetType());
                    ErrorMessage = applicationWebUI.ErrorMessage;
                }

            }

            /// <summary>
            /// Generate form layout
            /// </summary>
            /// <param name="DisplayMode">Identify which operation has to be performed i.e(Read,Write,Update,Delete)</param>
            /// <param name="container">Control Object</param>
            public override void BuildFormView(string DisplayMode, StringBuilder container)
            {
                try
                {
                    using (HtmlFormAdapter htmlFormAdapter = new HtmlFormAdapter(MyModuleID))
                    {
                        htmlFormAdapter.CurrentPage = this.CurrentPageContext;
                        htmlFormAdapter.HeadingColumnName = "Text_CustomerSNo";
                        switch (DisplayMode)
                        {
                            case DisplayModeReadView:
                                htmlFormAdapter.DisplayMode = DisplayModeType.ReadOnly;
                                htmlFormAdapter.objFormData = GetRecordULDSLA();
                                htmlFormAdapter.CommandDeleteURL = MyPageName + "?" + GetWebURLString("DELETE", true);
                                htmlFormAdapter.CommandEditURL = MyPageName + "?" + GetWebURLString("Edit", true);
                                htmlFormAdapter.CommandDuplicateURL = MyPageName + "?" + GetWebURLString("DUPLICATE", true);
                                htmlFormAdapter.CommandCancelURL = MyPageName + "?" + GetWebURLString("INDEXVIEW", false);
                                container.Append(htmlFormAdapter.InstantiateIn());
                               
                                break;
                            case DisplayModeDuplicate:
                                htmlFormAdapter.DisplayMode = DisplayModeType.New;
                                htmlFormAdapter.objFormData = GetRecordULDSLA();
                                htmlFormAdapter.CommandCancelURL = MyPageName + "?" + GetWebURLString("INDEXVIEW", false);
                                container.Append(htmlFormAdapter.InstantiateIn());
                                break;
                            case DisplayModeEdit:
                                htmlFormAdapter.DisplayMode = DisplayModeType.Edit;
                                htmlFormAdapter.objFormData = GetRecordULDSLA();
                                htmlFormAdapter.CommandCancelURL = MyPageName + "?" + GetWebURLString("INDEXVIEW", false);
                                container.Append(htmlFormAdapter.InstantiateIn());
                                break;
                            case DisplayModeNew:
                                htmlFormAdapter.DisplayMode = DisplayModeType.New;
                                htmlFormAdapter.CommandCancelURL = MyPageName + "?" + GetWebURLString("INDEXVIEW", false);
                                container.Append(htmlFormAdapter.InstantiateIn());
                                break;
                            case DisplayModeDelete:
                                htmlFormAdapter.DisplayMode = DisplayModeType.Delete;
                                htmlFormAdapter.CommandCancelURL = MyPageName + "?" + GetWebURLString("INDEXVIEW", false);
                                htmlFormAdapter.objFormData = GetRecordULDSLA();
                                container.Append(htmlFormAdapter.InstantiateIn());
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
            }

            /// <summary>
            /// Generate ULDSLA web page from XML
            /// </summary>
            /// <param name="container"></param>
            public StringBuilder CreateWebForm(StringBuilder container)
            {
                StringBuilder strContent = new StringBuilder();
                try
                {
                    if (System.Web.HttpContext.Current.Request.QueryString["FormAction"] != null)
                    {
                        //Set the display Mode form the URL QuesyString.
                        //this.DisplayMode = "FORMACTION." + System.Web.HttpContext.Current.Request.QueryString["FormAction"].ToString().ToUpper().Trim();
                        this.DisplayMode = "FORMACTION." + this.FormAction.ToString().ToUpper().Trim();
                        //Match the display Mode of the form.
                        switch (this.DisplayMode)
                        {
                            case DisplayModeIndexView:
                                CreateGrid(container);
                                break;
                            case DisplayModeReadView:
                                BuildFormView(this.DisplayMode, container);
                                break;
                            case DisplayModeEdit:
                                BuildFormView(this.DisplayMode, container);
                                break;
                            case DisplayModeDuplicate:
                                BuildFormView(this.DisplayMode, container);
                                break;
                            case DisplayModeNew:
                                BuildFormView(this.DisplayMode, container);
                                break;
                            case DisplayModeDelete:
                                BuildFormView(this.DisplayMode, container);
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

            /// <summary>
            /// Postback Method to GET or POST 
            /// to set Mode/Context of the page
            /// </summary>
            public override void DoPostBack()
            {
                try
                {
                    this.OperationMode = "FORMACTION." + this.FormAction.ToString().ToUpper().Trim();
                    switch (OperationMode)
                    {
                        case DisplayModeSave:
                            SaveULDSLA();
                            if (string.IsNullOrEmpty(ErrorMessage))
                                System.Web.HttpContext.Current.Response.Redirect(MyPageName + "?" + GetWebURLString("INDEXVIEW", false, 2000), false);
                            break;
                        case DisplayModeSaveAndNew:
                            SaveULDSLA();
                            if (string.IsNullOrEmpty(ErrorMessage))
                                System.Web.HttpContext.Current.Response.Redirect(MyPageName + "?" + GetWebURLString("NEW", false, 2000), false);
                            break;
                        case DisplayModeUpdate:
                            UpdateULDSLA(Convert.ToInt32(System.Web.HttpContext.Current.Request.QueryString["RecID"]));
                            if (string.IsNullOrEmpty(ErrorMessage))
                                System.Web.HttpContext.Current.Response.Redirect(MyPageName + "?" + GetWebURLString("INDEXVIEW", false, 2001), false);
                            break;

                        case DisplayModeDelete:
                            DeleteULDSLA(System.Web.HttpContext.Current.Request.QueryString["RecID"]);
                            if (string.IsNullOrEmpty(ErrorMessage))
                                System.Web.HttpContext.Current.Response.Redirect(MyPageName + "?" + GetWebURLString("INDEXVIEW", false, 2002), false);
                            break;
                    }
                }
                catch (Exception ex)
                {
                    ApplicationWebUI applicationWebUI = new ApplicationWebUI();
                    applicationWebUI.InsertExceptionIntoDatabase(true, ex, this.GetType());

                }
            }
            /// <summary>
            /// Generate Grid for the page as per the columns of the entity supplied
            /// </summary>
            /// <param name="Container"></param>
            private void CreateGrid(StringBuilder Container)
            {
                try
                {
                    using (Grid g = new Grid())
                    {
                        g.PrimaryID = this.MyPrimaryID;
                        g.PageName = this.MyPageName;
                        g.ModuleName = this.MyModuleID;
                        g.AppsName = this.MyAppID;
                        g.CommandButtonNewText = "New ULD SLA";
                        g.FormCaptionText = "ULD SLA";
                        g.ServiceModuleName = this.MyModuleID;
                        g.NewURL = MyPageName + "?" + GetWebURLString("New", false);
                        g.Column = new List<GridColumn>();
                        g.Column.Add(new GridColumn { Field = "Vendor", Title = "Vendor", DataType = GridDataType.String.ToString().ToUpper() });
                        g.Column.Add(new GridColumn { Field = "EventName", Title = "Event", DataType = GridDataType.String.ToString().ToUpper() });
                        g.Column.Add(new GridColumn { Field = "BasisName", Title = "Basis", DataType = GridDataType.String.ToString() });
                        g.Column.Add(new GridColumn { Field = "MaintenanceTypeName", Title = "Maintenance Type", DataType = GridDataType.String.ToString() });
                        g.Column.Add(new GridColumn { Field = "CutOffDay", Title = "Cut Off Days", DataType = GridDataType.String.ToString() });
                        g.InstantiateIn(Container);

                    }
                }
                catch (Exception ex)
                {
                    ApplicationWebUI applicationWebUI = new ApplicationWebUI();
                    applicationWebUI.InsertExceptionIntoDatabase(true, ex, this.GetType());

                }
            }

            /// <summary>
            /// Insert new ULDSLA record into the database
            /// Retrieve information from webform and store the same into modal object
            /// call webservice to save that data into the database
            /// </summary>
            private void SaveULDSLA()
            {
                try
                {
                    List<ULDSLA> listULDSLA = new List<ULDSLA>();
                    var FormElement = System.Web.HttpContext.Current.Request.Form;
                    string customerSNo = string.Empty;
                    customerSNo = Convert.ToString(FormElement["CustomerSNo"].ToString());
                    if (!string.IsNullOrEmpty(customerSNo)) 
                        customerSNo = customerSNo.Split('-')[0].ToString();
                    
                    var ULDSLA = new ULDSLA
                    {

                        CustomerSNo = customerSNo,
                        Text_CustomerSNo = Convert.ToString(FormElement["Text_CustomerSNo"].ToString()),
                        EventSNo = Convert.ToString(FormElement["EventSNo"].ToString()),
                        Text_EventSNo = Convert.ToString(FormElement["Text_EventSNo"].ToString()),
                        BasisSNo = Convert.ToString(FormElement["BasisSNo"].ToString()),
                        Text_BasisSNo = Convert.ToString(FormElement["Text_BasisSNo"].ToString()),
                        MaintenanceTypeSNo = Convert.ToString(FormElement["MaintenanceTypeSNo"].ToString()),
                        CutOffDay = Convert.ToString(FormElement["CutOffDay"].ToString()),

                        CreatedBy = ((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).UserSNo.ToString(),
                        UpdatedBy = ((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).UserSNo.ToString(),
                        //ManHrsCost = Convert.ToDecimal(string.IsNullOrEmpty(FormElement["ManHrsCost"]) == true ? "0" : FormElement["ManHrsCost"])
                        

                    };
                    listULDSLA.Add(ULDSLA);
                    object datalist = (object)listULDSLA;
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

            /// <summary>
            /// Update ULDSLA record into the database
            /// Retrieve information from webform and store the same into modal object
            /// call webservice to update that data into the database
            /// </summary>
            /// <param name="RecordID"></param>
            private void UpdateULDSLA(int RecordID)
            {
                try
                {
                    List<ULDSLA> listULDSLA = new List<ULDSLA>();
                    var FormElement = System.Web.HttpContext.Current.Request.Form;
                    string customerSNo = string.Empty;
                    customerSNo = Convert.ToString(FormElement["CustomerSNo"].ToString());
                    if (!string.IsNullOrEmpty(customerSNo))
                        customerSNo = customerSNo.Split('-')[0].ToString();
                    var ULDSLA = new ULDSLA
                    {
                        SNo = Convert.ToInt32(RecordID),
                        CustomerSNo = customerSNo,
                        Text_CustomerSNo = Convert.ToString(FormElement["Text_CustomerSNo"].ToString()),
                        EventSNo = Convert.ToString(FormElement["EventSNo"].ToString()),
                        Text_EventSNo = Convert.ToString(FormElement["Text_EventSNo"].ToString()),
                        BasisSNo = Convert.ToString(FormElement["BasisSNo"].ToString()),
                        MaintenanceTypeSNo = Convert.ToString(FormElement["MaintenanceTypeSNo"].ToString()),
                        CutOffDay = Convert.ToString(FormElement["CutOffDay"].ToString()),

                        CreatedBy = ((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).UserSNo.ToString(),
                        UpdatedBy = ((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).UserSNo.ToString(),
                        ////ManHrsCost = Convert.ToDecimal(string.IsNullOrEmpty(FormElement["ManHrsCost"]) == true ? "0" : FormElement["ManHrsCost"])


                        
                       
                    };

                    listULDSLA.Add(ULDSLA);
                    object datalist = (object)listULDSLA;
                    DataOperationService(DisplayModeUpdate, datalist, MyModuleID);
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

            /// <summary>
            /// Delete ULDSLA record from the database 
            /// call webservice to update that data into the database 
            /// </summary>
            /// <param name="RecordID"></param>
            private void DeleteULDSLA(string RecordID)
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

            /// <summary>
            ///  Get information of individual ULDSLA from database according record id supplied
            /// </summary>
            /// <returns>object type of entity ULDSLA found from database</returns>

            public object GetRecordULDSLA()
            {
                object ULDSLA = null;
                try
                {
                    if (!DisplayMode.ToLower().Contains("new"))
                    {
                        if (!string.IsNullOrEmpty(System.Web.HttpContext.Current.Request.QueryString["RecID"]))
                        {
                            ULDSLA gpList = new ULDSLA();
                            object obj = (object)gpList;
                            ULDSLA = DataGetRecordService(System.Web.HttpContext.Current.Request.QueryString["RecID"], obj, MyModuleID);
                            this.MyRecordID = (System.Web.HttpContext.Current.Request.QueryString["RecID"]);
                        }
                        else
                        {
                            //Error Messgae: Record not found.
                        }

                    }

                }
                catch (Exception ex)
                {
                    ApplicationWebUI applicationWebUI = new ApplicationWebUI();
                    applicationWebUI.InsertExceptionIntoDatabase(true, ex, this.GetType());

                } return ULDSLA;
            }

        }
    }




