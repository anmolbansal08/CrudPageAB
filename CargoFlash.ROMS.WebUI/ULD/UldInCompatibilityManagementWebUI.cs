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
using CargoFlash.Cargo.WebUI;

namespace CargoFlash.Cargo.WebUI.ULD
{
    public class ULDInCompatibilityManagementWebUI : BaseWebUISecureObject
    {


         public object GetULDInCompatibilityRecord()
        {


            object SPHC = null;
          
          
            try
            {
                if (!string.IsNullOrEmpty(System.Web.HttpContext.Current.Request.QueryString["RecID"]))
                {
                    ULDInCompatibility SPHCList = new ULDInCompatibility();
                 
                    object obj = (object)SPHCList;
                 
                    SPHC = DataGetRecordService(System.Web.HttpContext.Current.Request.QueryString["RecID"], obj, this.MyModuleID);
                   
                   
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

            } return SPHC;
           
        }

        //private DataTable GetULDInCompatibilityTransRecord()
        //{
        //    object ULDforwardrateTrans = null;
        //    DataTable dtCreateULDForwardRateTransRecord = null;
        //    if (!string.IsNullOrEmpty(System.Web.HttpContext.Current.Request.QueryString["RecID"]))
        //    {
        //        List<ULDInCompatibilityTrans> ULDforwardTransList = new List<ULDInCompatibilityTrans>();
        //        object obj = (object)ULDforwardTransList;
        //        ULDforwardrateTrans = DataGetRecordService(System.Web.HttpContext.Current.Request.QueryString["RecID"], obj, this.MyModuleID, "ULDInCompatibilityTrans");
        //        // ULDforwardrateTrans = DataGetRecordService(CurrentPageContext.Request.QueryString["RecID"], obj, MyModuleID, MyAppID + "Trans");
        //        dtCreateULDForwardRateTransRecord = BaseWebUISecureObject.ConvertToDataTable((List<ULDInCompatibilityTrans>)ULDforwardrateTrans);
        //        this.MyRecordID = (CurrentPageContext.Request.QueryString["RecID"]);
        //    }
        //    else
        //    {
        //        //Error Messgae: Record not found.
        //    }
        //    return dtCreateULDForwardRateTransRecord;
        //}



        private DataTable GetULDInCompatibilityTransRecord()
        {
            object ULDforwardrateTrans = null;
            DataTable dtCreateULDForwardRateTransRecord = null;
            if ((!string.IsNullOrEmpty(System.Web.HttpContext.Current.Request.QueryString["RecID"])))
            {
                List<ULDInCompatibilityTrans> ULDforwardTransList = new List<ULDInCompatibilityTrans>();
                object obj = (object)ULDforwardTransList;

                ULDforwardrateTrans = DataGetRecordService(System.Web.HttpContext.Current.Request.QueryString["RecID"], obj, this.MyModuleID, "ULDInCompatibilityTrans");
                dtCreateULDForwardRateTransRecord = BaseWebUISecureObject.ConvertToDataTable((List<ULDInCompatibilityTrans>)ULDforwardrateTrans);
                this.MyRecordID = (System.Web.HttpContext.Current.Request.QueryString["RecID"]);
            }
            else
            {
                //Error Messgae: Record not found.
            }
            return dtCreateULDForwardRateTransRecord;
        }

        public ULDInCompatibilityManagementWebUI(Page PageContext)
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
                this.MyAppID = "ULDInCompatibility";
                this.MyPrimaryID = "SNo";
            }
            catch (Exception ex)
            {
                ApplicationWebUI applicationWebUI = new ApplicationWebUI();
                applicationWebUI.InsertExceptionIntoDatabase(true, ex, this.GetType());
                ErrorMessage = applicationWebUI.ErrorMessage;

            }
        }
        public ULDInCompatibilityManagementWebUI()
        {
            try
            {
                this.MyModuleID = "ULD";
                this.MyAppID = "ULDInCompatibility";
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
                    StringBuilder strf = new StringBuilder();
                    htmlFormAdapter.Ischildform = true;
                    htmlFormAdapter.CurrentPage = this.CurrentPageContext;
                    htmlFormAdapter.HeadingColumnName = "Text_SPHC1";
                    switch (DisplayMode)
                    {
                        case DisplayModeReadView:
                            htmlFormAdapter.objFormData = GetULDInCompatibilityRecord();
                            htmlFormAdapter.DisplayMode = DisplayModeType.ReadOnly;
                            htmlFormAdapter.CommandDeleteURL = MyPageName + "?" + GetWebURLString("DELETE", true);
                            htmlFormAdapter.CommandEditURL = MyPageName + "?" + GetWebURLString("Edit", true);
                            htmlFormAdapter.CommandCancelURL = MyPageName + "?" + GetWebURLString("INDEXVIEW", false);
                            htmlFormAdapter.CommandDuplicateURL = MyPageName + "?" + GetWebURLString("DUPLICATE", true);
                            strf.Append(htmlFormAdapter.TransInstantiateWithHeader("ULD", "ULDInCompatibilityTrans", "Read"));
                             htmlFormAdapter.Childform = strf.ToString();
                             container.Append(htmlFormAdapter.InstantiateIn());



                            //container.Append(htmlFormAdapter.InstantiateIn());
                            //htmlFormAdapter.objFormData = null;
                            //htmlFormAdapter.objDataTable = GetULDInCompatibilityTransRecord();
                            //container.Append(htmlFormAdapter.TransInstantiateWithHeader("ULD", "ULDInCompatibilityTrans", "Read"));
                           
                            break;
                        case DisplayModeDuplicate:
                            htmlFormAdapter.objFormData = GetULDInCompatibilityRecord();
                            htmlFormAdapter.DisplayMode = DisplayModeType.New;
                            htmlFormAdapter.CommandCancelURL = MyPageName + "?" + GetWebURLString("INDEXVIEW", false);
                            strf.Append(htmlFormAdapter.TransInstantiateWithHeader("ULD", "ULDInCompatibilityTrans", ValidateOnSubmit: true));
                             htmlFormAdapter.Childform = strf.ToString();
                             container.Append(htmlFormAdapter.InstantiateIn());
                            //container.Append(htmlFormAdapter.InstantiateIn());
                            //htmlFormAdapter.objFormData = null;
                            //container.Append(htmlFormAdapter.TransInstantiateWithHeader("ULD", "ULDInCompatibilityTrans", ValidateOnSubmit: true));
                           
                            break;
                        case DisplayModeEdit:

                            htmlFormAdapter.objFormData = GetULDInCompatibilityRecord();
                            htmlFormAdapter.DisplayMode = DisplayModeType.Edit;
                            htmlFormAdapter.CommandCancelURL = MyPageName + "?" + GetWebURLString("INDEXVIEW", false);
                            strf.Append(htmlFormAdapter.TransInstantiateWithHeader("ULD", "ULDInCompatibilityTrans", ValidateOnSubmit: true));
                            htmlFormAdapter.Childform = strf.ToString();
                            container.Append(htmlFormAdapter.InstantiateIn());
                            //container.Append(htmlFormAdapter.InstantiateIn());
                            //htmlFormAdapter.objFormData = null;
                            //htmlFormAdapter.objDataTable = GetULDInCompatibilityTransRecord();
                            //container.Append(htmlFormAdapter.TransInstantiateWithHeader("ULD", "ULDInCompatibilityTrans", ValidateOnSubmit: true));
                            break;
                        case DisplayModeNew:
                            htmlFormAdapter.DisplayMode = DisplayModeType.New;
                            htmlFormAdapter.CommandCancelURL = MyPageName + "?" + GetWebURLString("INDEXVIEW", false);
                            strf.Append(htmlFormAdapter.TransInstantiateWithHeader("ULD", "ULDInCompatibilityTrans", ValidateOnSubmit: true));
                            htmlFormAdapter.Childform = strf.ToString();
                            container.Append(htmlFormAdapter.InstantiateIn());
                           // container.Append(htmlFormAdapter.InstantiateIn());
                          //  container.Append(htmlFormAdapter.TransInstantiateWithHeader("ULD", "ULDInCompatibilityTrans", ValidateOnSubmit: true));
                            break;
                        case DisplayModeDelete:
                            htmlFormAdapter.objFormData = GetULDInCompatibilityRecord();
                            htmlFormAdapter.DisplayMode = DisplayModeType.Delete;
                            htmlFormAdapter.CommandCancelURL = MyPageName + "?" + GetWebURLString("INDEXVIEW", false);
                             strf.Append(htmlFormAdapter.TransInstantiateWithHeader("ULD", "ULDInCompatibilityTrans", "Read"));
                             htmlFormAdapter.Childform = strf.ToString();
                             container.Append(htmlFormAdapter.InstantiateIn());

                            //container.Append(htmlFormAdapter.InstantiateIn());
                            //htmlFormAdapter.objFormData = null;
                            //htmlFormAdapter.objDataTable = GetULDInCompatibilityTransRecord();
                            //container.Append(htmlFormAdapter.TransInstantiateWithHeader("ULD", "ULDInCompatibilityTrans", "Read"));
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
                    g.CommandButtonNewText = "New ULD SHC Incompatibility";
                    g.FormCaptionText = "ULD SHC Incompatibility";
                    g.PrimaryID = this.MyPrimaryID;
                    g.PageName = this.MyPageName;
                    g.ModuleName = this.MyModuleID;
                    g.AppsName = this.MyAppID;
                    g.ServiceModuleName = this.MyModuleID;
                    g.NewURL = MyPageName + "?" + GetWebURLString("New", false);
                    g.Column = new List<GridColumn>();
                    g.Column.Add(new GridColumn { Field = "UldTypeName", Title = "ULD Type Name", DataType = GridDataType.String.ToString() });
                    g.Column.Add(new GridColumn { Field = "SPHC1", Title = "SHC1", DataType = GridDataType.String.ToString() });
                    g.Column.Add(new GridColumn { Field = "SPHC2", Title = "SHC2", DataType = GridDataType.String.ToString() });
                    g.Column.Add(new GridColumn { Field = "Active", Title = "Active", DataType = GridDataType.String.ToString() });
                    //g.Column.Add(new GridColumn { Field = "CreatedBy", Title = "Created By", DataType = GridDataType.String.ToString() });
                   
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
            //try
            //{

            this.OperationMode = "FORMACTION." + this.FormAction.ToString().ToUpper().Trim();
            switch (OperationMode)
            {
                case DisplayModeSave:
                    SaveSPHC();
                    if (string.IsNullOrEmpty(ErrorMessage))
                        System.Web.HttpContext.Current.Response.Redirect(MyPageName + "?" + GetWebURLString("INDEXVIEW", false, 2000), false);
                    break;
                case DisplayModeSaveAndNew:
                    SaveSPHC();
                    if (string.IsNullOrEmpty(ErrorMessage))
                        System.Web.HttpContext.Current.Response.Redirect(MyPageName + "?" + GetWebURLString("NEW", false, 2000), false);
                    break;
                case DisplayModeUpdate:

                    UpdateSPHC(System.Web.HttpContext.Current.Request.QueryString["RecID"]);
                    if (string.IsNullOrEmpty(ErrorMessage))
                        System.Web.HttpContext.Current.Response.Redirect(MyPageName + "?" + GetWebURLString("INDEXVIEW", false, 2001), false);
                    break;

                case DisplayModeDelete:
                    DeleteULDIncompatibility(System.Web.HttpContext.Current.Request.QueryString["RecID"]);
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
       

      
      

        private void SaveSPHC()
        {
            try
            {
               // List<ULDInCompatibility> listSPHC = new List<ULDInCompatibility>();
               //// String[] Logo = SaveImage();
               // var FormElement = System.Web.HttpContext.Current.Request.Form;
               // //var SPHC = new ULDInCompatibility
               // //{
                    
               // //    //SNo=0,
               // //    //ParentSNo=0,
               // //    //ChargeName=FormElement["ChargeName"].ToUpper(),
                 
                   
               // //    //IsActive = FormElement["IsActive"] == "0",//not null
               // //    //CreatedBy = ((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).UserSNo.ToString(),
               // //    //UpdatedBy = ((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).UserSNo.ToString(),
             


               // //};
               // //listSPHC.Add(SPHC);
               // //object datalist = (object)listSPHC;
               // DataOperationService(DisplayModeSave, datalist, MyModuleID);
            }
            catch (Exception ex)
            {
                ApplicationWebUI applicationWebUI = new ApplicationWebUI();
                applicationWebUI.InsertExceptionIntoDatabase(true, ex, this.GetType());
            }
        }
        private void UpdateSPHC(string RecordID)
        {
            try
            {
               // List<ULDInCompatibility> listSPHC = new List<ULDInCompatibility>();
               //// String[] Logo = SaveImage();
               // var FormElement = System.Web.HttpContext.Current.Request.Form;
               // var SPHC = new ULDInCompatibility
               // { 
               //      //SNo=int.Parse(RecordID),
               //      //ParentSNo = 0,
               //      //ChargeName = FormElement["ChargeName"].ToUpper(),
                  
                    
               //      //IsActive = FormElement["IsActive"] == "0",//not null
               //      //CreatedBy = ((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).UserSNo.ToString(),
               //      //UpdatedBy = ((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).UserSNo.ToString(),
              
                //};
                //listSPHC.Add(SPHC);
                //object datalist = (object)listSPHC;
                //DataOperationService(DisplayModeUpdate, datalist, MyModuleID);
                //{
                //    //ErrorNumer
                //    //Error Message
                //}
            }
            catch (Exception ex)
            {
                ApplicationWebUI applicationWebUI = new ApplicationWebUI();
                applicationWebUI.InsertExceptionIntoDatabase(true, ex, this.GetType());
            }

        }
        private void DeleteULDIncompatibility(string RecordID)
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

