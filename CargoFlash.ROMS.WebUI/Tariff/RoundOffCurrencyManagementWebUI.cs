using CargoFlash.Cargo.Model.Tariff;
using CargoFlash.SoftwareFactory.WebUI;
using CargoFlash.SoftwareFactory.WebUI.Adapters;
using CargoFlash.SoftwareFactory.WebUI.Controls;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Web;
using System.Web.UI;

namespace CargoFlash.Cargo.WebUI.Tariff
{
    public class RoundOffCurrencyManagementWebUI : BaseWebUISecureObject
    {

       public RoundOffCurrencyManagementWebUI()
        {
            try
            {
                this.MyModuleID = "Tariff";
                this.MyAppID = "RoundOffCurrency";
                this.MyPrimaryID = "SNo";
            }
            catch (Exception ex)
            {
                ApplicationWebUI applicationWebUI = new ApplicationWebUI();
                applicationWebUI.InsertExceptionIntoDatabase(true, ex, this.GetType());
                ErrorMessage = applicationWebUI.ErrorMessage;
            }

        }

       public StringBuilder CreateWebForm(StringBuilder container)
       {
           StringBuilder strContent = new StringBuilder();
           try
           {
               if (System.Web.HttpContext.Current.Request.QueryString["FormAction"] != null)
               {
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



       private void CreateGrid(StringBuilder Container)
       {
           try
           {
               using (Grid g = new Grid())
               {

                   g.CommandButtonNewText = "Round Off Currency";
                   g.FormCaptionText = "Round Off Currency";
                   g.PrimaryID = this.MyPrimaryID;
                   g.PageName = this.MyPageName;
                   g.ModuleName = this.MyModuleID;
                   g.AppsName = this.MyAppID;

                   g.ServiceModuleName = this.MyModuleID;
                   g.NewURL = MyPageName + "?" + GetWebURLString("New", false);
                   g.Column = new List<GridColumn>();
                   g.Column.Add(new GridColumn { Field = "CountryCode", Title = "Country Code", DataType = GridDataType.String.ToString() });
                   g.Column.Add(new GridColumn { Field = "CurrencyCode", Title = "Currency Code", DataType = GridDataType.String.ToString() });
                   g.Column.Add(new GridColumn { Field = "InDecimal", Title = "In Decimal", DataType = GridDataType.String.ToString() });
                   g.Column.Add(new GridColumn { Field = "InAmount", Title = "In Amount", DataType = GridDataType.String.ToString() });
                   g.Column.Add(new GridColumn { Field = "Basis", Title = "Basis", DataType = GridDataType.String.ToString() });
                   g.InstantiateIn(Container);


               }
           }
           catch (Exception ex)
           {
               ApplicationWebUI applicationWebUI = new ApplicationWebUI();
               applicationWebUI.InsertExceptionIntoDatabase(true, ex, this.GetType());

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
                   htmlFormAdapter.HeadingColumnName = "RoundOffCurrency";
                   switch (DisplayMode)
                   {
                       case DisplayModeReadView:
                            htmlFormAdapter.DisplayMode = DisplayModeType.ReadOnly;
                            htmlFormAdapter.objFormData = GetRecordRoundOffCurrency();
                            //htmlFormAdapter.CommandDeleteURL = MyPageName + "?" + GetWebURLString("Delete", true);
                            //htmlFormAdapter.CommandEditURL = MyPageName + "?" + GetWebURLString("Edit", false);
                            htmlFormAdapter.CommandCancelURL = MyPageName + "?" + GetWebURLString("INDEXVIEW", false);
                            container.Append(htmlFormAdapter.InstantiateIn());
                            container.Append("<div id='divRoundOffCurrency'><span id='spnRoundOffCurrency'><input id='hdnPageType' name='hdnPageType' type='hidden' value='" + this.FormAction.ToString().ToUpper().Trim() + "'/><input id='hdnRoundOffCurrencySNo' name='hdnhdnRoundOffCurrencySNoSlabSNo' type='hidden' value='" + this.MyRecordID + "'/> <input id='hdnFormData' name='hdnFormData' type='hidden' value=''/><input id='hdnPageSize' name='hdnPageSize' type='hidden' value='" + this.FormAction.ToString().ToUpper().Trim() + "'/><table id='tblRoundOffCurrency' style='text-align:center'></table></span></div>");
                            
                            htmlFormAdapter.Childform = strf.ToString();
                           
                            //break;
                           //htmlFormAdapter.DisplayMode = DisplayModeType.ReadOnly;
                           //htmlFormAdapter.objFormData = GetRecordRoundOffCurrency();
                           //htmlFormAdapter.CommandDeleteURL = MyPageName + "?" + GetWebURLString("DELETE", true);
                           //htmlFormAdapter.CommandEditURL = MyPageName + "?" + GetWebURLString("Edit", true);
                           //htmlFormAdapter.CommandDuplicateURL = MyPageName + "?" + GetWebURLString("DUPLICATE", true);
                           //htmlFormAdapter.CommandCancelURL = MyPageName + "?" + GetWebURLString("INDEXVIEW", false);
                           //container.Append(htmlFormAdapter.InstantiateIn());
                           //strf.Append("<div id='divTaxslab'><span id='spnRoundOffCurrency'><input id='hdnPageType' name='hdnPageType' type='hidden' value='" + this.FormAction.ToString().ToUpper().Trim() + "'/><input id='hdnRoundOffCurrencySNo' name='hdnhdnRoundOffCurrencySNoSlabSNo' type='hidden' value='" + this.MyRecordID + "'/> <input id='hdnFormData' name='hdnFormData' type='hidden' value=''/><input id='hdnPageSize' name='hdnPageSize' type='hidden' value='" + this.FormAction.ToString().ToUpper().Trim() + "'/><table id='tblRoundOffCurrency' style='text-align:center'></table></span></div>");
                             //htmlFormAdapter.Childform = strf.ToString();
                           //  container.Append(htmlFormAdapter.InstantiateIn());
                           break;
                       //case DisplayModeDuplicate:
                       //    htmlFormAdapter.DisplayMode = DisplayModeType.New;
                       //    htmlFormAdapter.objFormData = GetRecordRoundOffCurrency();
                       //    htmlFormAdapter.CommandCancelURL = MyPageName + "?" + GetWebURLString("INDEXVIEW", false);
                       //    strf.Append("<div id='divRoundOffCurrency'><span id='spnRoundOffCurrency'><input id='hdnPageType' name='hdnPageType' type='hidden' value='" + this.FormAction.ToString().ToUpper().Trim() + "'/><input id='hdnRoundOffCurrencySNo' name='hdnRoundOffCurrencySlabSNo' type='hidden' value='" + this.MyRecordID + "'/> <input id='hdnFormData' name='hdnFormData' type='hidden' value=''/><input id='hdnPageSize' name='hdnPageSize' type='hidden' value='" + this.FormAction.ToString().ToUpper().Trim() + "'/><table id='tblRoundOffCurrency' style='text-align:center'></table></span></div>");
                       //    htmlFormAdapter.Childform = strf.ToString();
                       //    container.Append(htmlFormAdapter.InstantiateIn());
                       //    break;
                       case DisplayModeEdit:

                           htmlFormAdapter.DisplayMode = DisplayModeType.Edit;
                           htmlFormAdapter.objFormData = GetRecordRoundOffCurrency();
                           htmlFormAdapter.CommandCancelURL = MyPageName + "?" + GetWebURLString("INDEXVIEW", false);
                           strf.Append("<div id='divRoundOffCurrency'><span id='spnRoundOffCurrency'><input id='hdnPageType' name='hdnPageType' type='hidden' value='" + this.FormAction.ToString().ToUpper().Trim() + "'/><input id='hdnRoundOffCurrencySNo' name='hdnRoundOffCurrencySlabSNo' type='hidden' value='" + this.MyRecordID + "'/> <input id='hdnFormData' name='hdnFormData' type='hidden' value=''/><input id='hdnPageSize' name='hdnPageSize' type='hidden' value='" + this.FormAction.ToString().ToUpper().Trim() + "'/><table id='tblRoundOffCurrency' style='text-align:center'></table></span></div>");
                           htmlFormAdapter.Childform = strf.ToString();
                           container.Append(htmlFormAdapter.InstantiateIn());
                           break;
                       case DisplayModeNew:
                           htmlFormAdapter.DisplayMode = DisplayModeType.New;
                           htmlFormAdapter.CommandCancelURL = MyPageName + "?" + GetWebURLString("INDEXVIEW", false);
                           strf.Append("<div id='divRoundOffCurrency'><span id='spnRoundOffCurrency'><input id='hdnPageType' name='hdnPageType' type='hidden' value='" + this.FormAction.ToString().ToUpper().Trim() + "'/><input id='hdnTaxSNo' name='hdnTaxSlabSNo' type='hidden' value='" + this.MyRecordID + "'/> <input id='hdnFormData' name='hdnFormData' type='hidden' value=''/><input id='hdnPageSize' name='hdnPageSize' type='hidden' value='" + this.FormAction.ToString().ToUpper().Trim() + "'/><table id='tblRoundOffCurrency' style='text-align:center'></table></span></div>");
                             htmlFormAdapter.Childform = strf.ToString();
                           container.Append(htmlFormAdapter.InstantiateIn());
                           break;
                       case DisplayModeDelete:
                           htmlFormAdapter.objFormData = GetRecordRoundOffCurrency();
                           htmlFormAdapter.DisplayMode = DisplayModeType.Delete;
                           htmlFormAdapter.CommandCancelURL = MyPageName + "?" + GetWebURLString("INDEXVIEW", false);
                           strf.Append("<div id='divRoundOffCurrency'><span id='spnRoundOffCurrency'><input id='hdnPageType' name='hdnPageType' type='hidden' value='" + this.FormAction.ToString().ToUpper().Trim() + "'/><input id='hdnRoundOffCurrencySNo' name='hdnRoundOffCurrencySlabSNo' type='hidden' value='" + this.MyRecordID + "'/> <input id='hdnFormData' name='hdnFormData' type='hidden' value=''/><input id='hdnPageSize' name='hdnPageSize' type='hidden' value='" + this.FormAction.ToString().ToUpper().Trim() + "'/><table id='tblRoundOffCurrency' style='text-align:center'></table></span></div>");
                           htmlFormAdapter.Childform = strf.ToString();
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
           return container;
       }

       public override void DoPostBack()
       {

           try
           {
               this.OperationMode = "FORMACTION." + this.FormAction.ToString().ToUpper().Trim();
               switch (OperationMode)
               {
                   case DisplayModeSave:
                       SaveRoundOffCurrency();
                       if (string.IsNullOrEmpty(ErrorMessage))
                           System.Web.HttpContext.Current.Response.Redirect(MyPageName + "?" + GetWebURLString("INDEXVIEW", false, 2000), false);
                       break;
                   case DisplayModeSaveAndNew:
                       SaveRoundOffCurrency();
                       if (string.IsNullOrEmpty(ErrorMessage))
                           System.Web.HttpContext.Current.Response.Redirect(MyPageName + "?" + GetWebURLString("NEW", false, 2000), false);
                       break;
                   case DisplayModeUpdate:

                       UpdateRoundOffCurrency(System.Web.HttpContext.Current.Request.QueryString["RecID"]);
                       if (string.IsNullOrEmpty(ErrorMessage))
                           System.Web.HttpContext.Current.Response.Redirect(MyPageName + "?" + GetWebURLString("INDEXVIEW", false, 2001), false);
                       break;

                   case DisplayModeDelete:
                       DeleteRoundOffCurrency(System.Web.HttpContext.Current.Request.QueryString["RecID"]);
                       if (string.IsNullOrEmpty(ErrorMessage))
                           System.Web.HttpContext.Current.Response.Redirect(MyPageName + "?" + GetWebURLString("DELETE", false, 2002), false);
                       break;
               }

           }
           catch (Exception ex)
           {
               ApplicationWebUI applicationWebUI = new ApplicationWebUI();
               applicationWebUI.InsertExceptionIntoDatabase(true, ex, this.GetType());
           }

       }

       private void DeleteRoundOffCurrency(string p)
       {
           try
           {
               List<string> listID = new List<string>();
               listID.Add(p);
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

       private void UpdateRoundOffCurrency(string p)
       {
           try
           {
               System.Web.Script.Serialization.JavaScriptSerializer js = new System.Web.Script.Serialization.JavaScriptSerializer();

               var FormElement = System.Web.HttpContext.Current.Request.Form;

               List<RoundOffCharge> AppendGridData = js.Deserialize<List<RoundOffCharge>>(CargoFlash.Cargo.Business.Common.Base64ToString(FormElement["hdnFormData"]));
               var formData = new RoundOffCurrency
               {
                   SNo = Convert.ToInt32(p),
                   UpdatedBy = ((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).UserSNo,
                   TransData = AppendGridData
               };
               object datalist = (object)formData;
               DataOperationService(DisplayModeUpdate, datalist, MyModuleID);
           }
           catch (Exception ex)
           {
               ApplicationWebUI applicationWebUI = new ApplicationWebUI();
               applicationWebUI.InsertExceptionIntoDatabase(true, ex, this.GetType());

           } 
       }

       private void SaveRoundOffCurrency()
       {
           try
           {
               System.Web.Script.Serialization.JavaScriptSerializer js = new System.Web.Script.Serialization.JavaScriptSerializer();

               var FormElement = System.Web.HttpContext.Current.Request.Form;

               List<RoundOffCharge> AppendGridData = js.Deserialize<List<RoundOffCharge>>(CargoFlash.Cargo.Business.Common.Base64ToString(FormElement["hdnFormData"]));
               var formData = new RoundOffCurrency
               {
                  UpdatedBy = ((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).UserSNo,                 
                   TransData = AppendGridData,
               };
               object datalist = (object)formData;
               DataOperationService(DisplayModeSave, datalist, MyModuleID);
           }
           catch (Exception ex)
           {
               ApplicationWebUI applicationWebUI = new ApplicationWebUI();
               applicationWebUI.InsertExceptionIntoDatabase(true, ex, this.GetType());

           }  
       }
       public object GetRecordRoundOffCurrency()
       {
           object RoundOffCurrency = null;
           try
           {
               if (!string.IsNullOrEmpty(HttpContext.Current.Request.QueryString["RecID"]))
               {
                   RoundOffCurrency RoundOfChargeList = new RoundOffCurrency();
                   object obj = (object)RoundOfChargeList;
                   //retrieve Entity from Database according to the record
                   RoundOffCurrency = DataGetRecordService(HttpContext.Current.Request.QueryString["RecID"], obj, MyModuleID);
                   this.MyRecordID = (HttpContext.Current.Request.QueryString["RecID"]);
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

           } return RoundOffCurrency;
       }
    }
}
