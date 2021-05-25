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
using CargoFlash.Cargo.Business;
using System.Web;
using System.Data.SqlClient;
using System.Configuration;
using System.Web.UI.WebControls;

namespace CargoFlash.Cargo.WebUI.Master
{
    public class RateTypePriorityManagementWebUI : BaseWebUISecureObject
    {
        public RateTypePriorityManagementWebUI()
        {
            try
            {
                this.MyModuleID = "Master";
                this.MyAppID = "RateTypePriority";
                this.MyPrimaryID = "SNo";
                this.MyRecordID = (HttpContext.Current.Request.QueryString["RecID"]);
               
            }
            catch (Exception ex)
            {
                ApplicationWebUI applicationWebUI = new ApplicationWebUI();
                applicationWebUI.InsertExceptionIntoDatabase(true, ex, this.GetType());
                ErrorMessage = applicationWebUI.ErrorMessage;
            }
        }
        public RateTypePriorityManagementWebUI(Page PageContext)
        {
            try
            {
                this.MyModuleID = "Master";
                this.MyAppID = "RateTypePriority";
                this.MyPrimaryID = "SNo";
                this.MyPageName = "Default.aspx";
                this.MyRecordID = (HttpContext.Current.Request.QueryString["RecID"]);
            }
            catch (Exception ex)
            {
                ApplicationWebUI applicationWebUI = new ApplicationWebUI();
                applicationWebUI.InsertExceptionIntoDatabase(true, ex, this.GetType());
                ErrorMessage = applicationWebUI.ErrorMessage;

            }
        }


        public StringBuilder CreateDragDropList(StringBuilder container)
        {
            
            StringBuilder strContent = new StringBuilder();
            try
            {
                if (System.Web.HttpContext.Current.Request.QueryString["FormAction"] != null)
                {
                    this.DisplayMode = "FORMACTION." + this.FormAction.ToString().ToUpper().Trim();
                    switch (DisplayMode)
                    {
                        case DisplayModeIndexView:
                            strContent = CreateList(container);
                            break;
                    }
                }
            }
            catch (Exception ex)
            {
            }
            return container;



        }

        public StringBuilder CreateList(StringBuilder BindListContainer)
        {
        
            try
            {




                BindListContainer.Append("<Div id='ccaContainer'></Div>");
            


                    //CargoFlash.Cargo.DataService.Master.RateTypePriorityService service = new CargoFlash.Cargo.DataService.Master.RateTypePriorityService();

                    //var Data = service.BindDatatable();
                    
                    //BindListContainer.Append("<div id='RateTypePriority'><ul id='sortable'>");
                    //for (var i = 0; i < Data.Length; i++)
                    //{
                    //    BindListContainer.Append("<li class='ui-state-default'><span class='ui-icon ui-icon-arrowthick-2-n-s'></span>" + Data[i].RateTypeName + "</li>");
                    //}
                    //BindListContainer.Append("<br></ul>");
                  
                    //BindListContainer.Append("</center>");

              
            }
            catch (Exception ex)
            {
                ApplicationWebUI applicationWebUI = new ApplicationWebUI();
                applicationWebUI.InsertExceptionIntoDatabase(true, ex, this.GetType());

            }
            return BindListContainer;
        }
       
     

        public override void DoPostBack()
        {
            this.OperationMode = "FORMACTION." + this.FormAction.ToString().ToUpper().Trim();
            switch (OperationMode)
            {
                case DisplayModeSave:
                   // SaveRateType();
                    if (string.IsNullOrEmpty(ErrorMessage))
                        System.Web.HttpContext.Current.Response.Redirect(MyPageName + "?" + GetWebURLString("INDEXVIEW", false, 2000), false);
                    break;
                case DisplayModeSaveAndNew:
                   // SaveRateType();
                    if (string.IsNullOrEmpty(ErrorMessage))
                        System.Web.HttpContext.Current.Response.Redirect(MyPageName + "?" + GetWebURLString("NEW", false, 2000), false);
                    break;
                case DisplayModeUpdate:
                   // UpdateRateType(Convert.ToString(System.Web.HttpContext.Current.Request.QueryString["RecID"]));
                    if (string.IsNullOrEmpty(ErrorMessage))
                        System.Web.HttpContext.Current.Response.Redirect(MyPageName + "?" + GetWebURLString("INDEXVIEW", false, 2001), false);

                    break;
                case DisplayModeDelete:
                   // DeleteRateType(Convert.ToString(System.Web.HttpContext.Current.Request.QueryString["RecID"]));
                    if (string.IsNullOrEmpty(ErrorMessage))
                        System.Web.HttpContext.Current.Response.Redirect(MyPageName + "?" + GetWebURLString("INDEXVIEW", false, 2002), false);
                    break;
            }
        }




    }
}
