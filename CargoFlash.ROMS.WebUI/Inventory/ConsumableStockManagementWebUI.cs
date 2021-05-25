using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using CargoFlash.SoftwareFactory.WebUI;
using CargoFlash.SoftwareFactory.WebUI.Adapters;
using CargoFlash.SoftwareFactory.WebUI.Controls;
using CargoFlash.Cargo.Model.Inventory;
using System.Collections;
using CargoFlash.Cargo.Business;
using System.Web.UI;
using System.Configuration;
using System.Data;

namespace CargoFlash.Cargo.WebUI.Inventory
{
    public class ConsumableStockManagementWebUI : BaseWebUISecureObject
    {

        string DefaultCityCode;
        public ConsumableStockManagementWebUI()
        {
            try
            {
                this.MyModuleID = "Inventory";
                this.MyAppID = "ConsumableStock";
                this.MyPrimaryID = "SNo";
            }
            catch (Exception ex)
            {
                ApplicationWebUI applicationWebUI = new ApplicationWebUI();
                applicationWebUI.InsertExceptionIntoDatabase(true, ex, this.GetType());
                ErrorMessage = applicationWebUI.ErrorMessage;
            }
        }

        public ConsumableStockManagementWebUI(Page PageContext)
        {
            try
            {
                if (this.SetCurrentPageContext(PageContext))
                {
                    this.ErrorNumber = 0;
                    this.ErrorMessage = "";
                }
                this.MyPageName = "Default.aspx";
                this.MyModuleID = "Inventory";
                this.MyAppID = "ConsumableStock";
                this.MyPrimaryID = "SNo";
            }
            catch (Exception ex)
            {
                ApplicationWebUI applicationWebUI = new ApplicationWebUI();
                applicationWebUI.InsertExceptionIntoDatabase(true, ex, this.GetType());
                ErrorMessage = applicationWebUI.ErrorMessage;
            }
        }

        public object GetRecordConsumableStock()
        {
            object ConsumableStock = null;
            try
            {
                if (!string.IsNullOrEmpty(System.Web.HttpContext.Current.Request.QueryString["RecID"]))
                {
                    ConsumableStock ConsumableStockList = new ConsumableStock();
                    object obj = (object)ConsumableStockList;
                    ConsumableStock = DataGetRecordService(System.Web.HttpContext.Current.Request.QueryString["RecID"], obj, this.MyModuleID);
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

            } return ConsumableStock;
        }
        public StringBuilder BuildFormView(string DisplayMode, StringBuilder container)
        {
            try
            {
                using (HtmlFormAdapter htmlFormAdapter = new HtmlFormAdapter(MyModuleID))
                {
                    htmlFormAdapter.CurrentPage = this.CurrentPageContext;
                    htmlFormAdapter.HeadingColumnName = "Text_ConsumableItem";
                    switch (DisplayMode)
                    {
                        case DisplayModeReadView:
                            htmlFormAdapter.objFormData = GetRecordConsumableStock();
                            htmlFormAdapter.DisplayMode = DisplayModeType.ReadOnly;
                            htmlFormAdapter.CommandDeleteURL = MyPageName + "?" + GetWebURLString("DELETE", true);
                            htmlFormAdapter.CommandEditURL = MyPageName + "?" + GetWebURLString("Edit", true);
                            htmlFormAdapter.CommandCancelURL = MyPageName + "?" + GetWebURLString("INDEXVIEW", false);
                            htmlFormAdapter.CommandDuplicateURL = MyPageName + "?" + GetWebURLString("DUPLICATE", true);
                            container.Append(htmlFormAdapter.InstantiateIn());
                            container.Append(TabView());
                            break;
                        //case DisplayModeDuplicate:
                        //    htmlFormAdapter.objFormData = GetRecordConsumableStock();
                        //    htmlFormAdapter.DisplayMode = DisplayModeType.New;
                        //    htmlFormAdapter.CommandCancelURL = MyPageName + "?" + GetWebURLString("INDEXVIEW", false);
                        //    container.Append(htmlFormAdapter.InstantiateIn());
                        //    break;
                        case DisplayModeEdit:
                            htmlFormAdapter.objFormData = GetRecordConsumableStock();
                            htmlFormAdapter.DisplayMode = DisplayModeType.Edit;
                            htmlFormAdapter.CommandCancelURL = MyPageName + "?" + GetWebURLString("INDEXVIEW", false);
                            container.Append(htmlFormAdapter.InstantiateIn());
                            container.Append(TabUpdate());
                            break;
                        case DisplayModeNew:
                            htmlFormAdapter.DisplayMode = DisplayModeType.New;
                            htmlFormAdapter.objFormData = null;
                            htmlFormAdapter.CommandCancelURL = MyPageName + "?" + GetWebURLString("INDEXVIEW", false);
                            container.Append(htmlFormAdapter.InstantiateIn());
                            container.Append(TabNew());
                            break;
                        case DisplayModeDelete:
                            htmlFormAdapter.objFormData = GetRecordConsumableStock();
                            htmlFormAdapter.DisplayMode = DisplayModeType.Delete;
                            htmlFormAdapter.CommandCancelURL = MyPageName + "?" + GetWebURLString("INDEXVIEW", false);
                            container.Append(htmlFormAdapter.InstantiateIn());
                            container.Append(TabView());
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
                this.DisplayMode = "FORMACTION." + this.FormAction.ToString().ToUpper().Trim();
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
                    g.CommandButtonNewText = "New Inventory Stock";
                    g.FormCaptionText = "Inventory Stock";
                    g.PrimaryID = this.MyPrimaryID;
                    g.PageName = this.MyPageName;
                    g.ModuleName = this.MyModuleID;
                    g.AppsName = this.MyAppID;
                    g.ServiceModuleName = this.MyModuleID;
                    g.SuccessGrid = "ShowEditRead";
                    g.NewURL = MyPageName + "?" + GetWebURLString("New", false);
                    g.Column = new List<GridColumn>();
                    g.Column.Add(new GridColumn { Field = "Item", Title = "Item", DataType = GridDataType.String.ToString() });
                    g.Column.Add(new GridColumn { Field = "NoOfItems", Title = "Batch Count", DataType = GridDataType.String.ToString() });
                    g.Column.Add(new GridColumn { Field = "CityCode", Title = "City Code", DataType = GridDataType.String.ToString() });
                    g.Column.Add(new GridColumn { Field = "AirportName", Title = "Airport Name", DataType = GridDataType.String.ToString() });
                    g.Column.Add(new GridColumn { Field = "Numbered", Title = "Numbered", DataType = GridDataType.String.ToString() });
                    g.Column.Add(new GridColumn { Field = "ConsumablesName", Title = "Equipment Name", DataType = GridDataType.String.ToString() });                
                    g.Column.Add(new GridColumn { Field = "Text_Owner", Title = "Owner", DataType = GridDataType.String.ToString() });
                    g.Column.Add(new GridColumn { Field = "Text_OwnerName", Title = "Owner Name", DataType = GridDataType.String.ToString() });

                    g.Column.Add(new GridColumn { Field = "TareWeight", Title = "Tare Weight", DataType = GridDataType.String.ToString() });

                    g.Column.Add(new GridColumn { Field = "IsActive", Title = "Active", DataType = GridDataType.String.ToString() });
                 
                    g.Action = new List<GridAction>();

                g.Action.Add(new GridAction { ActionName = "EDIT", ButtonCaption = "Edit", AppsName = this.MyAppID, CssClassName = "edit", ModuleName = this.MyModuleID });
                g.Action.Add(new GridAction { ActionName = "READ", ButtonCaption = "Read", AppsName = this.MyAppID, CssClassName = "Read", ModuleName = this.MyModuleID });
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
            try
            {
                this.OperationMode = "FORMACTION." + this.FormAction.ToString().ToUpper().Trim();
                switch (OperationMode)
                {
                    case DisplayModeSave:
                        //SaveIrregularity();
                        if (string.IsNullOrEmpty(ErrorMessage))
                            System.Web.HttpContext.Current.Response.Redirect(MyPageName + "?" + GetWebURLString("INDEXVIEW", false, 2000), false);
                        break;
                    case DisplayModeUpdate:
                        //UpdateIrregularity(System.Web.HttpContext.Current.Request.QueryString["RecID"]);
                       // if (string.IsNullOrEmpty(ErrorMessage))
                            System.Web.HttpContext.Current.Response.Redirect(MyPageName + "?" + GetWebURLString("INDEXVIEW", false, 2001), false);
                        break;
                    case DisplayModeDelete:
                        DeleteConsumableStock(System.Web.HttpContext.Current.Request.QueryString["RecID"]);
                  if (string.IsNullOrEmpty(ErrorMessage))
                            System.Web.HttpContext.Current.Response.Redirect(MyPageName + "?" + GetWebURLString("INDEXVIEW", false, 2002), false);
                        break;
                }
            }
            catch (Exception ex)
            {
                ApplicationWebUI applicationWebUI = new ApplicationWebUI();
                applicationWebUI.InsertExceptionIntoDatabase(true, ex, this.GetType());
                ErrorMessage = applicationWebUI.ErrorMessage;
            }
        }
        private StringBuilder TabNew()
        {

            StringBuilder strBuilder = new StringBuilder();
            // string FormAction = CurrentPageContext.Request.QueryString["FormAction"].ToString().ToUpper().Trim();
            strBuilder.Append(@"          
            <div id='spnUpdateShipmentDetail'><input id='hdnPageSize' name='hdnPageSize' type='hidden' value='10'/><input id='hdnCityCode' name='hdnCityCode' type='hidden' value='" + ((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).CityCode.ToString() + "'/><table class='WebFormTable'>");

            if (FormAction != "READ")
                strBuilder.Append(@"<div></div> <br></br><tr></tr>");
            strBuilder.Append(@"<tr><td><table class='WebFormTable'><tbody>
<tr><td class='formlabel' title='Select City'><font color='red'>*</font><span id='spnCity'> City</span></td><td class='formInputcolumn'><input type='hidden' name='City' id='City' value=''><span class='k-widget k-combobox k-header'><span class='k-dropdown-wrap k-state-default' unselectable='on' style='width: 100px;'><input type='text' class='k-input' name='Text_City' id='Text_City' style='width: 100%; text-transform: uppercase;' data-valid='required' data-valid-msg='City can not be blank' tabindex='1' controltype='autocomplete' maxlength='100' value='' data-role='autocomplete' autocomplete='off'><span class='k-select' unselectable='on'><span class='k-icon k-i-arrow-s' unselectable='on' style='cursor:pointer;'>select</span></span></span></span></td><td class='formlabel' title='Select Airport'><font color='red'>*</font><span id='spnAirport'> Airport</span></td><td class='formInputcolumn'><input type='hidden' name='Airport' id='Airport' value=''><span class='k-widget k-combobox k-header'><span class='k-dropdown-wrap k-state-default' unselectable='on' style='width: 200px;'><input type='text' class='k-input' name='Text_Airport' id='Text_Airport' style='width: 100%; text-transform: uppercase;' data-valid='required' data-valid-msg='Airport can not be blank' tabindex='2' controltype='autocomplete' maxlength='100' value='' data-role='autocomplete' autocomplete='off'><span class='k-select' unselectable='on'><span class='k-icon k-i-arrow-s' unselectable='on' style='cursor:pointer;'>select</span></span></span></span></td></tr>

<tr>
<td class='formlabel' title='Select Office'>
<font color='red'>*</font><span id='spnOffice'> Office</span></td>
<td class='formInputcolumn'><input type='hidden' name='Office' id='Office' value=''><span class='k-widget k-combobox k-header'><span class='k-dropdown-wrap k-state-default' unselectable='on' style='width: 200px;'><input type='text' class='k-input' name='Text_Office' id='Text_Office' style='width: 100%; text-transform: uppercase;' data-valid='required' data-valid-msg='Office can not be blank' tabindex='3' controltype='autocomplete' maxlength='100' value='' data-role='autocomplete' autocomplete='off'><span class='k-select' unselectable='on'><span class='k-icon k-i-arrow-s' unselectable='on' style='cursor:pointer;'>select</span></span></span></span></td>

<td class='formlabel' title='Select Owner'><font color='red'>*</font><span id='spnOwner'> Owner</span></td><td class='formInputcolumn'> <input type='radio' tabindex='4' data-radioval='Agent' class='' name='Owner' checked='True' id='Owner' value='0'>Forwarder(Agent)<input type='radio' tabindex='4' data-radioval='Airline' class='' name='Owner' id='Owner' value='1'>Airline <input type='radio' tabindex='4' data-radioval='Self' class='' name='Owner' id='Owner' value='2' data-valid='required' data-valid-msg='Owner can not be blank'>Self</td>
</tr>

<tr>
<td class='formlabel' title='Select Owner Name'><font color='red'>*</font><span id='spnOwnerName'> Owner Name</span></td><td class='formInputcolumn'><input type='hidden' name='OwnerName' id='OwnerName' value='112'><span class='k-widget k-combobox k-header'><span class='k-dropdown-wrap k-state-default' unselectable='on'><input type='text' class='k-input' name='Text_OwnerName' id='Text_OwnerName' style='width: 100%; text-transform: uppercase;' tabindex='5' controltype='autocomplete' maxlength='100' value='' data-role='autocomplete' autocomplete='off' data-valid='required' data-valid-msg='Enter Agent.'><span class='k-select' unselectable='on'><span class='k-icon k-i-arrow-s' unselectable='on' style='cursor:pointer;'>select</span></span></span></span></td>

<td  title='Consumable Item' class='formlabel'><font color='red'>*</font><span id='spnSlabTitle'> Consumable Item / Equipment</span></td><td class='formInputcolumn'><input name='ConsumableItem' id='ConsumableItem' type='hidden' value=''><span class='k-widget k-combobox k-header'><span class='k-dropdown-wrap k-state-default' style='width: 200px;' unselectable='on'><input name='Text_ConsumableItem' tabindex='6' class='k-input' id='Text_ConsumableItem' style='width: 100%; text-transform: uppercase;' type='text' maxlength='2147483647' value='' data-role='autocomplete' autocomplete='off' controltype='autocomplete' data-valid='required' data-valid-msg='Consumable Item/ Equipment cannot be blank'><span class='k-select' unselectable='on'><span class='k-icon k-i-arrow-s' style='cursor: pointer;' unselectable='on'>select</span></span></span></span></td>
</tr>
<tr>

<td title='Batch Count' class='formlabel'><font color='red'>*</font><span id='spnAirlineName'> Batch Count</span></td><td class='formInputcolumn'><input id='_tempNoOfItem' name='_tempNoOfItem' tabindex='7' autocomplete='off' class='k-formatted-value k-input' type='text' readonly='readonly' style='width: 150px; text-align: right;'><input type='text' class='k-input k-state-default' name='NoOfItem' id='NoOfItem' style='width: 150px; text-align: right; display: none;' controltype='number' data-valid='required' data-valid-msg='Batch Count can not be blank' tabindex='7' maxlength='3' value='' data-role='numerictextbox'></td>
<td title='Tare Weight' class='formlabel'>
<span id='spnTareWeight'>Tare Weight</span>

</td>
<td class='formInputcolumn' >
<input name='_tempTareWeight' tabindex='8' class='k-formatted-value k-input' id='_tempTareWeight' style='width: 150px; text-align: right; display: inline-block;' type='text' readonly='readonly' autocomplete='off'>
<input name='TareWeight' tabindex='8' class='k-input k-state-default' id='TareWeight' style='width: 150px; text-align: right; display: none;' type='text' maxlength='4' value='' data-role='numerictextbox' data-valid-msg='Tare Weight cannot be blank'  controltype='decimal2' readonly='readonly'>
</td>
</tr>
<tr>
<td  title='Consumable Prefix' class='formlabel'><font color='red'>*</font><span id='spnSlabTitle'> Consumable Prefix</span></td><td class='formInputcolumn'><input name='ConsumablePrefix' tabindex='9' class='k-input' id='ConsumablePrefix' style='width: 80px; text-transform: uppercase;' type='text' maxlength='3' value='' data-role='alphabettextbox' controltype='uppercase' data-valid-msg='Consumable Prefix can not be blank or must have minimum 1 Character' data-valid='required'  autocomplete='off'></td><td title='Consumable Type' class='formlabel'><font color='red'>*</font><span id='spnAirlineName'> Consumable Type</span></td>
<td class='formInputcolumn' >
<input name='ConsumableType' tabindex='10' class='k-input' id='ConsumableType' style='width: 80px; text-transform: uppercase;' type='text' maxlength='3' value='' data-role='alphabettextbox' controltype='uppercase' data-valid-msg='Consumable Type can not be blank or must have minimum 1 Character' data-valid='required'  autocomplete='off'></td></tr><tr><td  title='Consumable No.' class='formlabel'><font color='red'>*</font><span id='spnSlabTitle'> Consumable No. Start</span></td><td class='formInputcolumn'><input name='ConsumableNoStart' tabindex='11' class='k-input' id='ConsumableNoStart' style='width: 80px; text-transform: uppercase;' type='text' maxlength='10' value='' data-role='numerictextbox' controltype='number'  data-valid-msg='Consumable No can not be blank or must have minimum 1 Character' data-valid='required' allowchar='0123456789' autocomplete='off'></td><td title='' class='formlabel'></td><td class='formInputcolumn' ></td></tr>
</tr><tr><td  title='' class='formlabel'></td><td class='formInputcolumn'></td><td title='' class='formlabel'></td><td class='formInputcolumn' ></td></tr></tbody></table></td></tr></table><table id='tblItemDetail' width='100%'></table>");
            return strBuilder;
        }
        private StringBuilder TabView()
        {
            string rid = System.Web.HttpContext.Current.Request.QueryString["RecID"].ToString();

            StringBuilder strBuilder = new StringBuilder();
            // string FormAction = CurrentPageContext.Request.QueryString["FormAction"].ToString().ToUpper().Trim();
            strBuilder.Append(@"          
            <div id='spnUpdateShipmentDetail'><input id='hdnPageSize' name='hdnPageSize' type='hidden' value='10'/><input id='hdnCStockSno' name='hdnCStockSno' type='hidden' value='" + rid.Split('-')[0] + "'/><table class='WebFormTable'>");
            if (FormAction.ToUpper() == "DELETE" || FormAction.ToUpper() == "READ")
                strBuilder.Append(@"<div></div> <br></br><tr></tr>");
            strBuilder.Append(@"<tr><td><table class='WebFormTable'><tbody><tr><td  title='Consumable Name' class='formlabel'><span id='spnSlabTitle'>Consumable Name</span></td><td class='formInputcolumn'><span id='ConsumableName'></span></td><td title='Remaining Batch Count' class='formlabel'><span id='spnAirlineName'>Remaining Batch Count</span></td><td class='formInputcolumn'><input name='NoOfItem' id='ConsumableName' type='hidden' value=''><span id='NoOfItem'></span></td></tr><tr><td  title='' class='formlabel'></td><td class='formInputcolumn'></td><td title='' class='formlabel'></td><td class='formInputcolumn' ></td></tr></tbody></table></td></tr></table><table id='tblItemDetail' width='100%'></table>");
            return strBuilder;
        }
        private StringBuilder TabUpdate()
        {

            string rid = System.Web.HttpContext.Current.Request.QueryString["RecID"].ToString();

        

            StringBuilder strBuilder = new StringBuilder();
            // string FormAction = CurrentPageContext.Request.QueryString["FormAction"].ToString().ToUpper().Trim();
            strBuilder.Append(@"          
            <div id='spnUpdateShipmentDetail'><input id='hdnPageSize' name='hdnPageSize' type='hidden' value='10'/><input id='hdnCStockSno' name='hdnCStockSno' type='hidden' value='" + rid.Split('-')[0] + "'/><input id='hdnCStockTransSno' name='hdnCStockTransSno' type='hidden' value='" + rid.Split('-')[1] + "'/><table class='WebFormTable'>");
            if (FormAction.ToUpper() == "EDIT")
                strBuilder.Append(@"<div></div> <br></br><tr></tr>");
            strBuilder.Append(@"<tr><td><table class='WebFormTable'>
<tbody>
<tr>
<td  title='City' class='formlabel'>
<span id='spnSlabTitle'>City</span>
</td>
<td class='formInputcolumn'>
<input name='City' id='City' type='hidden' value=''  tabindex='1'><span id='Text_City'  tabindex='1'></span>
</td>
<td title='Airport' class='formlabel'>
<span id='spnAirlineName'>Airport</span>
</td>
<td class='formInputcolumn'><input name='Airport' id='Airport' type='hidden' value='' tabindex='2'><span id='Text_Airport'></span>
</td>
</tr>


<tr>
<td  title='Office' class='formlabel'>
<span id='spnSlabTitle'>Office</span>
</td>
<td class='formInputcolumn'>
<input name='Office' id='Office' type='hidden' value=''  tabindex='3'><span id='Text_Office'  tabindex='3'></span>
</td>
<td title='Owner' class='formlabel'>
<span id='spnAirlineName'>Owner</span>
</td>
<td class='formInputcolumn'><input name='Owner' id='Owner' type='hidden' value='' tabindex='4'><span id='Text_Owner'></span>
</td>
</tr>



<tr>
<td title='Owner Name' class='formlabel'>
<span id='spnAirlineName'>Owner Name</span>
</td>
<td class='formInputcolumn'><input name='OwnerName' id='OwnerName' type='hidden' value='' tabindex='5'><span id='Text_OwnerName'></span>
</td>

<td  title='Consumable Item' class='formlabel'>
<span id='spnSlabTitle'>Consumable Item / Equipment</span>
</td>
<td class='formInputcolumn'>
<input name='ConsumableItem' id='ConsumableItem' type='hidden' value='' tabindex='6'><span id='Text_ConsumableItem'></span>
</td>

</tr>



<tr>

<td title='Remaining Batch Count' class='formlabel'>
<span id='spnAirlineName'>Remaining Batch Count</span>
</td>
<td class='formInputcolumn'><input name='NoOfItem' id='NoOfItem' type='hidden' value='' tabindex='7'><span id='Text_NoOfItem'></span>
</td>

<td  title='Consumable Name' class='formlabel'>
<span id='spnSlabTitle'>Consumable Name</span>
</td>
<td class='formInputcolumn'>
<input name='ConsumableName' id='ConsumableName' type='hidden' value=''  tabindex='8'><span id='Text_ConsumableName'  tabindex='8'></span>
</td>

</tr>

<tr>
<td title='Tare Weight' class='formlabel'>
<font color='red'>*</font>
<span id='spnTareWeight'>Tare Weight</span>
</td>
<td class='formInputcolumn' >
<input name='_tempTareWeight' tabindex='9' class='k-formatted-value k-input' id='_tempTareWeight' style='width: 150px; text-align: right; display: inline-block;' type='text'  autocomplete='off'>
<input name='TareWeight' tabindex='9' class='k-input k-state-default' id='TareWeight' style='width: 150px; text-align: right; display: none;' type='text' maxlength='4' value='' data-role='numerictextbox' data-valid-msg='Tare Weight cannot be blank' data-valid='required' controltype='decimal2'>
</td>

<td title='Active' class='formlabel'>
<font color='red'>*</font>

<span id='spnIsActive'> Active</span>
</td>

<td class='formInputcolumn'> 
<input name='IsActive' tabindex='10' id='IsActive' type='radio' checked='True' value='1'>Yes <input name='IsActive' tabindex='10' id='IsActive' type='radio' value='0'>No</td>
</tr>

<tr>

<td title='Equipment Nbr/ID' class='formlabel'>
<span id='spnEquipment'>Equipment Nbr/ID</span>

</td>
<td class='formInputcolumn' >
<input type='text' class='k-input' name='EquipmentNbr' id='EquipmentNbr' style='width: 175px; text-transform: uppercase;' controltype='alphanumericupper' data-valid='' data-valid-msg='' tabindex='11' maxlength='20' value='' data-role='alphabettextbox' autocomplete='off'>

</td>
<td title='' class='formlabel'></td>
<td class='formInputcolumn' ></td>
</tr>
</tbody>
</table></td></tr></table><table id='tblItemDetail' width='100%'></table>");
            return strBuilder;
        }
        private void DeleteConsumableStock(string RecordID)
        {
            try
            {
                List<string> listID = new List<string>();
                listID.Add(RecordID);
                listID.Add(MyUserID.ToString());
                object recordID = (object)listID;
                DataOperationService(DisplayModeDelete, recordID, MyModuleID);
            }
            catch (Exception ex)
            {
                ApplicationWebUI applicationWebUI = new ApplicationWebUI();
                applicationWebUI.InsertExceptionIntoDatabase(true, ex, this.GetType());

            }
        }

    }
}
