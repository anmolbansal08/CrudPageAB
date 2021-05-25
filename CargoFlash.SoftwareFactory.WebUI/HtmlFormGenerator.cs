using System;
using System.Data;
using System.Xml;
using System.Xml.Linq;
using System.Web;
using System.ComponentModel;
using System.Web.UI;
using System.Web.SessionState;
using System.IO;
using System.Text;
using System.Web.UI.HtmlControls;
using System.Web.UI.WebControls;
using CargoFlash.SoftwareFactory.WebUI;
using System.Collections.Generic;
using System.Linq;
using System.Collections;


namespace CargoFlash.SoftwareFactory.WebUI.Adapters
{
    /// <summary>
    /// Displays a Web Form in a table which can be added to ASPX FORM control. Control can generate form in two column pair format, each  column containing the one or many ASP.NET contorls
    /// </summary>
    /// <remarks>Please read CargoFlash.SoftwareFactory.WebUI documentation for more detail</remarks>
    public class HtmlFormGenerator : IDisposable
    {


        #region Constant Variables

        //Constant Variable for WebControls from ASP.NET assemblies and CargoFlash WebControls assemblies
        internal const string ImageAssemblyName = "HTML.Image";
        internal const string PasswordAssemblyName = "HTML.Password";
        internal const string ButttonAssemblyName = "HTML.Button";
        internal const string CheckBoxAssemblyName = "HTML.CheckBox";
        internal const string CheckBoxListAssemblyName = "HTML.CheckBoxList";
        internal const string DateCalenderAssemblyName = "HTML.DateCalender";
        internal const string RadioAssemblyName = "HTML.RadioButton";
        internal const string RadioButttonListAssemblyName = "HTML.RadioButtonList";
        internal const string HyperLinkAssemblyName = "HTML.HyperLink";
        internal const string DropDownListAssemblyName = "HTML.DropDownList";
        internal const string TextBoxAssemblyName = "HTML.TextBox";
        internal const string HiddenFieldAssemblyName = "HTML.Hidden";
        internal const string AutoCompleteTextBoxAssemblyName = "HTML.AutoCompleteTextBox";
        internal const string LabelAssemblyName = "HTML.Label";
        internal const string FileUploadAssemblyName = "HTML.FileUpload";
        internal const string MultiControlAssemblyName = "HTML.MultiControl";
        #endregion

        #region Property Variables
        //Property Variables internal object used to build the functionality
        public DataTable objDataTable { get; set; }
        public DataTable objStructureModify { get; set; }
        public bool _IsSearchToolBar = false;
        public bool _IsSearchRequired = false;
        public int objIndex { get; set; }
        public object objFormData { get; set; }
        private Page _CurrentPage = null;
        public IEnumerable<XElement> HtmlWebForm { get; set; }
        public IEnumerable<XElement> HtmlWebFormDefination { get; set; }

        IEnumerable<XElement> ChildHtmlWebFormDefination { get; set; }

        private XmlNode _HtmlFrom = null;
        private XmlNodeList _HtmlFromList = null;
        private DisplayModeType _DisplayMode = DisplayModeType.ReadOnly;
        private StringBuilder HtmlFormBuilder = null;
        private string _HeadingImageUrl = "";
        private string _FormCaptionImageUrl = "";
        private string _HeadingText = "";
        public string _RadioName = "";
        private bool _EnableRequireValidation = false;
        private bool _HeadingVisible = true;//By Default Heading is visible
        private bool _ToolBarVisible = true;//By Default Toolbar is visible    
        private string _FormCaptionText = "";
        private bool _FormCaptionVisible = true; //By Default Form Caption is visible
        private string _CommandDeleteCssClass = "";
        private string _CommnadUpdateCssClass = "";
        private string _CommandEditCssClass = "";
        private string _CommandSaveCssClass = "";
        private string _CommandNewCssClass = "";
        private string _CommandCancelCssClass = "";
        private string _CommandDeleteText = "";
        private string _CommnadUpdateText = "";
        private string _CommandEditText = "";
        private string _CommandSaveText = "";
        private string _CommandNewText = "";
        private string _CommandCancelText = "";
        private string _CustomCommand = "";

        public string CommandDuplicateText { get; set; }
        public string CommandDuplicateURL { get; set; }
        public string CommandDuplicateCssClass { get; set; }

        public string CommandSaveAndNewText { get; set; }
        public string CommandSaveAndNewURL { get; set; }
        public string CommandSaveAndNewCssClass { get; set; }

        public string CommandDeleteURL = "";
        public string CommnadUpdateURL = "";
        public string CommandEditURL = "";
        public string CommandSaveURL = "";
        public string CommandNewURL = "";
        public string CommandCancelURL = "";


        private string _SectionCssClass = "formSection";
        private string _FormCaptionCssClass = "";
        private string _HeadingCssClass = "";
        private string _ToolBarCssClass = "";
        private string _FormFieldLabelCssClass = "";
        private string _FormFieldDataCssClass = "";
        private int _ColumnSpanCount = 8; //Number of Column to span in a row
        private bool _CommandCancelVisible = true;//By Default Cancel Button is visible
        private bool _CommandDeleteVisible = true;//By Default Delete Button is visible
        private bool _CommandEditVisible = true;//By Default Edit Button is visible
        private bool _IsEditAllow = true;//By Default Edit Button is visible
        private bool _IsDeleteAllow = true;//By Default Edit Button is visible
        private bool _CommandNewVisible = true;//By Default New Button is visible
        private bool _CommandSaveVisible = true;//By Default Save Button is visible
        private bool _CommandUpdateVisible = true;//By Default Update Button is visible
        private bool _ShowUpdateCommand = false;//Set property for udate button forcefully
        private string _RecordKeyDataFieldName = "";
        private string _HeadingColumnName = "";
        private string _PageName = "";
        private string _ModuleName = "";
        private string _AppID = "";
        private DataTable _ProcessSetting = null;
        private DataTable _ProcessXMLPage = null;
        private string _LABEL_CSS_CLASS = "";
        private string _DATA_FIELD_CSSCLASS = "";
        private string _DATA_CELL_CSSCLASS = "";
        private string _FORM_ACTION = "";

        private bool _IsSubModule = false;

        public XmlNode HtmlFrom
        {
            get { return _HtmlFrom; }
            set { _HtmlFrom = value; }
        }
        public XmlNodeList HtmlFromList
        {
            get { return _HtmlFromList; }
            set { _HtmlFromList = value; }
        }

        #endregion

        #region Property Defination
        //All Property Defination           
        public bool IsSearchToolBar
        {
            get { return _IsSearchToolBar; }
            set { _IsSearchToolBar = value; }
        }

        public bool IsSearchRequired
        {
            get { return _IsSearchRequired; }
            set { _IsSearchRequired = value; }
        }

        public string RadioName
        {
            get { return _RadioName; }
            set { _RadioName = value; }
        }

        public string HeadingColumnName
        {
            get { return _HeadingColumnName; }
            set { _HeadingColumnName = value; }
        }
        public string CustomCommand
        {
            get { return _CustomCommand; }
            set { _CustomCommand = value; }
        }
        public string SectionCssClass
        {
            get { return _SectionCssClass; }
            set { _SectionCssClass = value; }
        }
        public string PageName
        {
            get { return _PageName; }
            set { _PageName = value; }
        }
        public bool EnableRequireValidation
        {
            get { return _EnableRequireValidation; }
            set { _EnableRequireValidation = value; }
        }

        public Page CurrentPage
        {
            get { return _CurrentPage; }
            set { _CurrentPage = value; }
        }

        public string FormFieldDataCssClass
        {
            get { return _FormFieldDataCssClass; }
            set { _FormFieldDataCssClass = value; }
        }
        public string FormFieldLabelCssClass
        {
            get { return _FormFieldLabelCssClass; }
            set { _FormFieldLabelCssClass = value; }
        }

        public string ToolBarCssClass
        {
            get { return _ToolBarCssClass; }
            set { _ToolBarCssClass = value; }
        }
        public string HeadingCssClass
        {
            get { return _HeadingCssClass; }
            set { _HeadingCssClass = value; }
        }
        public string FormCaptionCssClass
        {
            get { return _FormCaptionCssClass; }
            set { _FormCaptionCssClass = value; }
        }
        public string RecordKeyDataFieldName
        {
            get { return _RecordKeyDataFieldName; }
            set { _RecordKeyDataFieldName = value; }
        }
        public bool CommandUpdateVisible
        {
            get { return _CommandUpdateVisible; }
            set { _CommandUpdateVisible = value; }
        }
        public bool ShowUpdateCommand
        {
            get { return _ShowUpdateCommand; }
            set { _ShowUpdateCommand = value; }
        }
        public bool CommandSaveVisible
        {
            get { return _CommandSaveVisible; }
            set { _CommandSaveVisible = value; }
        }
        public bool CommandNewVisible
        {
            get { return _CommandNewVisible; }
            set { _CommandNewVisible = value; }
        }
        public bool CommandEditVisible
        {
            get { return _CommandEditVisible; }
            set { _CommandEditVisible = value; }
        }
        public bool IsEditAllow
        {
            get { return _IsEditAllow; }
            set { _IsEditAllow = value; }
        }
        public bool IsDeleteAllow
        {
            get { return _IsDeleteAllow; }
            set { _IsDeleteAllow = value; }
        }
        public bool CommandDeleteVisible
        {
            get { return _CommandDeleteVisible; }
            set { _CommandDeleteVisible = value; }
        }
        public bool CommandCancelVisible
        {
            get { return _CommandCancelVisible; }
            set { _CommandCancelVisible = value; }
        }
        public string CommandCancelText
        {
            get { return _CommandCancelText; }
            set { _CommandCancelText = value; }
        }
        public string CommandNewText
        {
            get { return _CommandNewText; }
            set { _CommandNewText = value; }
        }
        public int ColumnSpanCount
        {
            get { return _ColumnSpanCount; }
            set { _ColumnSpanCount = value; }
        }
        public string CommandSaveText
        {
            get { return _CommandSaveText; }
            set { _CommandSaveText = value; }
        }
        public string CommandEditText
        {
            get { return _CommandEditText; }
            set { _CommandEditText = value; }
        }
        public string CommnadUpdateText
        {
            get { return _CommnadUpdateText; }
            set { _CommnadUpdateText = value; }
        }
        public string CommandDeleteText
        {
            get { return _CommandDeleteText; }
            set { _CommandDeleteText = value; }
        }
        public string CommandCancelCssClass
        {
            get { return _CommandCancelCssClass; }
            set { _CommandCancelCssClass = value; }
        }
        public string CommandNewCssClass
        {
            get { return _CommandNewCssClass; }
            set { _CommandNewCssClass = value; }
        }

        public string CommandSaveCssClass
        {
            get { return _CommandSaveCssClass; }
            set { _CommandSaveCssClass = value; }
        }
        public string CommandEditCssClass
        {
            get { return _CommandEditCssClass; }
            set { _CommandEditCssClass = value; }
        }
        public string CommnadUpdateCssClass
        {
            get { return _CommnadUpdateCssClass; }
            set { _CommnadUpdateCssClass = value; }
        }
        public string CommandDeleteCssClass
        {
            get { return _CommandDeleteCssClass; }
            set { _CommandDeleteCssClass = value; }
        }
        public bool FormCaptionVisible
        {
            get { return _FormCaptionVisible; }
            set { _FormCaptionVisible = value; }
        }
        public string FormCaptionImageUrl
        {
            get { return _FormCaptionImageUrl; }
            set { _FormCaptionImageUrl = value; }
        }
        public string FormCaptionText
        {
            get { return _FormCaptionText; }
            set { _FormCaptionText = value; }
        }

        public bool ToolBarVisible
        {
            get { return _ToolBarVisible; }
            set { _ToolBarVisible = value; }
        }
        public bool HeadingVisible
        {
            get { return _HeadingVisible; }
            set { _HeadingVisible = value; }
        }
        public string HeadingText
        {
            get { return _HeadingText; }
            set { _HeadingText = value; }
        }
        public string HeadingImageUrl
        {
            get { return _HeadingImageUrl; }
            set { _HeadingImageUrl = value; }
        }
        public DisplayModeType DisplayMode
        {
            get { return _DisplayMode; }
            set { _DisplayMode = value; }
        }

        public string ModuleName
        {
            get { return _ModuleName; }
            set { _ModuleName = value; }
        }
        private static Dictionary<string, string> requiredValidationArray;
        public static Dictionary<string, string> RequiredValidationDict
        {
            get { return requiredValidationArray; }
            set { requiredValidationArray = value; }
        }

        public string LABEL_CSS_CLASS
        {
            get { return _LABEL_CSS_CLASS; }
            set { _LABEL_CSS_CLASS = value; }
        }

        public string DATA_CELL_CSSCLASS
        {
            get { return _DATA_CELL_CSSCLASS; }
            set { _DATA_CELL_CSSCLASS = value; }
        }

        public string DATA_FIELD_CSSCLASS
        {
            get { return _DATA_FIELD_CSSCLASS; }
            set { _DATA_FIELD_CSSCLASS = value; }
        }

        #endregion

        #region Constructor
        //Default Constructor
        public HtmlFormGenerator()
        {
            //Dictionary<string, ValidateControls> dict = new Dictionary<string, ValidateControls>() { { "0", new ValidateControls { ControlValue = "", ValidationMessage = "" } } };
            Dictionary<string, string> dict = new Dictionary<string, string>();
            RequiredValidationDict = dict;
            if (this._ProcessSetting == null)
                this.GetConfiguration("");
        }
        //Parameterized Constructor
        public HtmlFormGenerator(string moduleName)
        {
            //Dictionary<string, ValidateControls> dict = new Dictionary<string, ValidateControls>() { { "0", new ValidateControls { ControlValue = "", ValidationMessage = "" } } };
            Dictionary<string, string> dict = new Dictionary<string, string>();
            RequiredValidationDict = dict;
            this.ModuleName = moduleName;
            if (this._ProcessSetting == null)
                this.GetConfiguration(moduleName);
        }
        #endregion

        #region Distructor
        //Default Distructor
        ~HtmlFormGenerator()
        {
            if (this != null)
                this.Dispose();
        }
        #endregion

        #region DisposeMethod

        /// <summary>
        /// Dispose all objects of SystemStoredProcedure class
        /// </summary>
        public virtual void Dispose()
        {
            //Cleanup Enviroments object.

            GC.SuppressFinalize(this);
            this.HtmlFrom = null;
            this.HtmlFromList = null;
            this.HeadingImageUrl = null;
            this.FormCaptionImageUrl = "";
            this.HeadingText = null;
            this.EnableRequireValidation = false;
            this.HeadingVisible = false;//By Default Heading is visible
            this.ToolBarVisible = false;//By Default Toolbar is visible    
            this.FormCaptionText = null;
            this.FormCaptionVisible = false; //By Default Form Caption is visible
            this.CommandDeleteCssClass = null;
            this.CommnadUpdateCssClass = null;
            this.CommandEditCssClass = null;
            this.CommandSaveCssClass = null;
            this.CommandNewCssClass = null;
            this.CommandCancelCssClass = null;
            this.CommandDeleteText = null;
            this.CommnadUpdateText = null;
            this.CommandEditText = null;
            this.CommandSaveText = null;
            this.CommandNewText = null;
            this.CommandCancelText = null;
            this.CustomCommand = null;
            this.SectionCssClass = null;
            this.FormCaptionCssClass = null;
            this.HeadingCssClass = null;
            this.ToolBarCssClass = null;
            this.FormFieldLabelCssClass = null;
            this.FormFieldDataCssClass = null;
            this.ColumnSpanCount = 8; //Number of Column to span in a row
            this.CommandCancelVisible = true;//By Default Cancel Button is visible
            this.CommandDeleteVisible = true;//By Default Delete Button is visible
            this.CommandEditVisible = true;//By Default Edit Button is visible
            this.CommandNewVisible = true;//By Default New Button is visible
            this.CommandSaveVisible = true;//By Default Save Button is visible
            this.CommandUpdateVisible = true;//By Default Update Button is visible
            this.ShowUpdateCommand = false;
            this.RecordKeyDataFieldName = null;
            this.HeadingColumnName = null;
            this.PageName = null;
            this.IsEditAllow = true;
            this.IsDeleteAllow = true;
        }

        #endregion

        #region SetProperty
        private void SetProperty()
        {
            //Check for HtmlFrom is assigned null or empty then raise exeception
            if (this.HtmlWebForm == null)
                throw new Exception("NULL HtmlWebForm! HtmlWebForm is required.");

            foreach (var wform in HtmlWebForm)
            {
                try
                {
                    if (String.IsNullOrEmpty(wform.Element("ENABLE_REQUIREVALIDATION").Value.ToString()))
                    {
                        this.EnableRequireValidation = false;
                    }
                    else
                    {
                        this.EnableRequireValidation = bool.Parse(wform.Element("ENABLE_REQUIREVALIDATION").Value.ToString());
                    }
                }
                catch { }
                this.HeadingImageUrl = wform.Element("HEADING_IMAGEURL").Value.ToString();
                this.HeadingText = wform.Element("HEADING_TEXT").Value.ToString();
                this.HeadingVisible = bool.Parse(wform.Element("HEADING_VISIBLE").Value.ToString() == "" ? "false" : wform.Element("HEADING_VISIBLE").Value.ToString());
                this.HeadingCssClass = wform.Element("HEADING_CSSCLASS").Value.ToString();

                this.FormCaptionCssClass = wform.Element("CAPTION_CSSCLASS").Value.ToString();
                this.FormCaptionText = wform.Element("CAPTION_TEXT").Value.ToString();
                this.FormCaptionImageUrl = wform.Element("CAPTION_IMAGEURL").Value.ToString();
                this.FormCaptionVisible = bool.Parse(wform.Element("CAPTION_VISIBLE").Value.ToString() == "" ? "false" : wform.Element("CAPTION_VISIBLE").Value.ToString());

                this.ToolBarVisible = bool.Parse(wform.Element("TOOLBAR_VISIBLE").Value.ToString() == "" ? "false" : wform.Element("TOOLBAR_VISIBLE").Value.ToString());
                this.ToolBarCssClass = wform.Element("TOOLBAR_CSSCLASS").Value.ToString();

                this.CommandDeleteCssClass = wform.Element("COMMAND_DELETE_CSSCLASS").Value.ToString();
                this.CommnadUpdateCssClass = wform.Element("COMMAND_UPDATE_CSSCLASS").Value.ToString();
                this.CommandEditCssClass = wform.Element("COMMAND_EDIT_CSSCLASS").Value.ToString();
                this.CommandSaveCssClass = wform.Element("COMMAND_SAVE_CSSCLASS").Value.ToString();
                this.CommandSaveAndNewCssClass = wform.Element("COMMAND_SAVE_CSSCLASS").Value.ToString();
                this.CommandNewCssClass = wform.Element("COMMAND_NEW_CSSCLASS").Value.ToString();
                this.CommandCancelCssClass = wform.Element("COMMAND_CANCEL_CSSCLASS").Value.ToString();

                this.CommandDeleteText = wform.Element("COMMAND_DELETE_TEXT").Value.ToString() == "" ? (this.FormCaptionText == "Cancel Booking" ? "" : "Delete") : wform.Element("COMMAND_DELETE_TEXT").Value.ToString();
                this.CommnadUpdateText = wform.Element("COMMAND_UPDATE_TEXT").Value.ToString() == "" ? "Update" : wform.Element("COMMAND_UPDATE_TEXT").Value.ToString();
                this.CommandEditText = wform.Element("COMMAND_EDIT_TEXT").Value.ToString() == "" ? "Edit" : wform.Element("COMMAND_EDIT_TEXT").Value.ToString();
                this.CommandSaveText = wform.Element("COMMAND_SAVE_TEXT").Value.ToString() == "" ? "Save" : wform.Element("COMMAND_SAVE_TEXT").Value.ToString();
                this.CommandNewText = wform.Element("COMMAND_NEW_TEXT").Value.ToString() == "" ? "New" : wform.Element("COMMAND_NEW_TEXT").Value.ToString();
                this.CommandCancelText = wform.Element("COMMAND_CANCEL_TEXT").Value.ToString() == "" ? "Cancel" : wform.Element("COMMAND_CANCEL_TEXT").Value.ToString();
                this.CommandDuplicateCssClass = wform.Element("COMMAND_EDIT_TEXT").Value.ToString() == "" ? "Edit" : wform.Element("COMMAND_EDIT_TEXT").Value.ToString();


                if (string.IsNullOrEmpty(this.CommandSaveAndNewText))
                    this.CommandSaveAndNewText = "Save & New";

                if (string.IsNullOrEmpty(this.CommandDuplicateText))
                    this.CommandDuplicateText = "Duplicate";


                this.CommandCancelVisible = bool.Parse(wform.Element("COMMAND_CANCEL_VISIBLE").Value.ToString() == "" ? "false" : wform.Element("COMMAND_CANCEL_VISIBLE").Value.ToString());
                this.CommandDeleteVisible = bool.Parse(wform.Element("COMMAND_DELETE_VISIBLE").Value.ToString() == "" ? "false" : wform.Element("COMMAND_DELETE_VISIBLE").Value.ToString());
                this.CommandEditVisible = bool.Parse(wform.Element("COMMAND_EDIT_VISIBLE").Value.ToString() == "" ? "false" : wform.Element("COMMAND_EDIT_VISIBLE").Value.ToString());
                this.CommandNewVisible = bool.Parse(wform.Element("COMMAND_NEW_VISIBLE").Value.ToString() == "" ? "false" : wform.Element("COMMAND_NEW_VISIBLE").Value.ToString());
                this.CommandSaveVisible = bool.Parse(wform.Element("COMMAND_SAVE_VISIBLE").Value.ToString() == "" ? "false" : wform.Element("COMMAND_SAVE_VISIBLE").Value.ToString());
                this.CommandUpdateVisible = bool.Parse(wform.Element("COMMAND_UPDATE_VISIBLE").Value.ToString() == "" ? "false" : wform.Element("COMMAND_UPDATE_VISIBLE").Value.ToString());

                this.ColumnSpanCount = int.Parse(wform.Element("COLUMN_SPAN").Value.ToString());

                try
                {
                    //this.CustomCommand = wform.Element("CUSTOM_COMMAND").Value.ToString();
                }
                catch { }
                try
                {
                    this.SectionCssClass = wform.Element("SECTION_CSSCLASS").Value.ToString();
                }
                catch { this.SectionCssClass = ""; }
            }
        }
        #endregion

        #region BuildFormHeader
        private void BuildFormHeader()
        {
            //ManishB


            //**************************************************************************
            //Create the caption row.
            //If FormCaption property is visible then set related property.
            //**************************************************************************            
            if (this.FormCaptionVisible == true)
            {
                //If Caption Icon path is specified then set it to caption.
                if (this.FormCaptionImageUrl.ToString().Length > 0)
                    this.FormCaptionImageUrl = "<image src='" + this.FormCaptionImageUrl.ToString() + "' border='none' />&nbsp;";
                else
                    this.FormCaptionImageUrl = "";

                //If Caption Text is specified then set it to caption.
                if (this.FormCaptionText.ToString().Length > 0)
                    HtmlFormBuilder.Append("<tr><td class='" + this.FormCaptionCssClass + "' colspan='" + this.ColumnSpanCount + "'>" + this.FormCaptionImageUrl + this.FormCaptionText.ToString() + "</td></tr>");
            }

            //**************************************************************************
            //Create the Heading row.
            //If Heading property is visible then set related property.
            //**************************************************************************
            StringBuilder headerString = new StringBuilder();
            if (this.HeadingVisible == true)
            {
                //If Heading Icon path is specified then set it to caption.
                if (this.HeadingImageUrl.ToString().Length > 0)
                    this.HeadingImageUrl = "<image src='" + this.HeadingImageUrl.ToString() + "' border='none' />&nbsp;";
                else
                    this.HeadingImageUrl = "";
                try
                {
                    if (this.HeadingColumnName != "")
                    {
                        string hValue = GetBindFieldValue(this.HeadingColumnName);
                        if (this.DisplayMode == DisplayModeType.Edit)
                            this.HeadingText = this.HeadingText + " " + hValue;
                        if (this.DisplayMode == DisplayModeType.Delete)
                            this.HeadingText = (this.HeadingText == "Cancel Booking Detail:" ? this.HeadingText.Replace("Detail", "") : this.HeadingText.Replace("Detail", "Delete")) + " " + hValue;
                        else if (this.DisplayMode == DisplayModeType.ReadOnly)
                            this.HeadingText = this.HeadingText + " " + hValue;

                        //if (this.DisplayMode == DisplayModeType.New)
                        //    HttpContext.Current.Session["HeadingValue"] = "";
                        //else
                        HttpContext.Current.Session["HeadingValue"] = (hValue == "" ? "" : "[" + hValue + "]- ");
                    }
                }
                catch { this.HeadingText = "New"; }

                string MandatoryDiv = "";
                //If Check Require Validation.
                if (this.EnableRequireValidation)
                    MandatoryDiv = "<div class='MandatoryTextCss'><font color='red'>*</font> Mandatory Fields</div>";

                //If Heading Text is specified then set it to Heading.
                if (this.HeadingText.ToString().Length > 0)
                    HtmlFormBuilder.Append("<tr class='persist-header'><th class='" + this.ToolBarCssClass + " k-header k-menu' colspan='" + this.ColumnSpanCount + "'><div class='persist-div'><table class='WebFormTable'><tr><td class='" + this.HeadingCssClass + "' colspan='" + this.ColumnSpanCount + "'>" + this.HeadingImageUrl + "<span id='__SpanHeader__'>" + this.HeadingText.ToString() + "</span>" + MandatoryDiv + "</td></tr>");
                headerString.Append("");
            }

            //**************************************************************************
            //Creating ToolBar Row.       
            //**************************************************************************

            //If Toolbar Visible then set all CommandButton
            if (this.IsSearchToolBar == false)
                if (this.ToolBarVisible == true && !this._IsSubModule)
                    this.BuildFormToolBar();

            //If Heading Text is specified then set it to Heading.
            if (this.HeadingText.ToString().Length > 0)
                HtmlFormBuilder.Append("</table></div></th></tr>");

        }
        #endregion

        #region BuildFormToolBar
        private void BuildFormToolBar()
        {
            //**************************************************************************
            //Creating ToolBar Row.
            //Based on display mode buid the toolbar
            //**************************************************************************
            StringBuilder toolbarCommand = new StringBuilder();
            string BasicPageRights = HttpContext.Current.Session["BasicPageRights"] == null ? "ALL" : HttpContext.Current.Session["BasicPageRights"].ToString();

            switch (this.DisplayMode)
            {
                case DisplayModeType.ReadOnly:

                    //if EditCommand is visible then add to the toolbar
                    if (this.CommandEditVisible == true && this.IsEditAllow == true && (BasicPageRights == "ALL" || BasicPageRights.Contains("EDIT")))
                    {
                        toolbarCommand.Append("<input type='button' value='" + this.CommandEditText + "' onclick=navigateUrl('" + this.CommandEditURL + "');  class='btn btn-info' />");
                        if (this.CommandNewVisible)
                            toolbarCommand.Append("<input type='button' value='" + this.CommandDuplicateText + "' id='MasterDuplicate'  onclick=navigateUrl('" + this.CommandDuplicateURL + "');  class='btn btn-info' />");
                    }

                    //if DeleteCommand is visible then add to the toolbar
                    if (this.CommandDeleteVisible == true && this.IsDeleteAllow == true && (BasicPageRights == "ALL" || BasicPageRights.Contains("DELETE")))
                        toolbarCommand.Append("<input type='button' value='" + this.CommandDeleteText + "'  onclick=navigateUrl('" + this.CommandDeleteURL + "');  class='btn btn-danger' />");

                    //toolbarCommand.Append("<a href='" + this.CommandDeleteURL + "' class='btn btn-info'>" + this.CommandDeleteText + "<a/>");

                    break;
                case DisplayModeType.Delete:

                    //if DeleteCommand is visible then add to the toolbar
                    if (this.CommandDeleteVisible == true && (BasicPageRights == "ALL" || BasicPageRights.Contains("DELETE")))
                        toolbarCommand.Append("<input type='button' value='" + this.CommandDeleteText + "'  class='removepopup btn btn-danger' /><input type='hidden' name='operation' value='" + this.CommandDeleteText + "'/>");
                    break;
                case DisplayModeType.New:
                    //if SaveCommand is visible then add to the toolbar
                    //////////if (!string.IsNullOrEmpty(this.HeadingColumnName) && CurrentPage.Request.Form[this.HeadingColumnName] != null)
                    //////////    HttpContext.Current.Session["HeadingValue"] = "[" + CurrentPage.Request.Form[this.HeadingColumnName].ToUpper() + "] - ";
                    if (this.CommandSaveVisible == true && (BasicPageRights == "ALL" || BasicPageRights.Contains("NEW")))
                    {
                        if (this._IsSubModule)
                            this._CommandSaveText = "Save";
                        toolbarCommand.Append("<input type='submit' name='operation' value='" + this.CommandSaveText + "'  class='btn btn-success btn-xs' />");
                        if (!this._IsSubModule)
                            toolbarCommand.Append("<input type='submit' name='operation' id='MasterSaveAndNew' value='" + this.CommandSaveAndNewText + "'  class='btn btn-success' />");
                    }
                    break;
                case DisplayModeType.Edit:

                    //if UpdateCommand is visible then add to the toolbar
                    if (this.IsEditAllow == true && (this.ShowUpdateCommand == true || this.CommandUpdateVisible == true) && (BasicPageRights == "ALL" || BasicPageRights.Contains("EDIT")))
                        toolbarCommand.Append("<input type='submit' name='operation' value='" + this.CommnadUpdateText + "'  class='btn btn-success' />");

                    break;
                default:
                    break;
            }
            //if CustomCommand is visible then add to the toolbar
            if (this.CustomCommand.ToString().Trim().Length > 0)
                toolbarCommand.Append(this.CustomCommand.ToString());

            //if DeleteCommand is visible then add to the toolbar
            if (this.CommandCancelVisible == true)
            {
                if (this._IsSubModule)
                {
                    this.CommandCancelText = "Cancel";
                    toolbarCommand.Append("  <input type='button' value='" + this.CommandCancelText + "' class='btn btn-warning btn-xs' />");
                }
                else
                    toolbarCommand.Append("<input type='button' value='" + this.CommandCancelText + "'  onclick=navigateUrl('" + this.CommandCancelURL + "');  class='btn btn-inverse' />");
            }
            if (this.DisplayMode == DisplayModeType.Delete)
            {
                toolbarCommand.Append("<div id='divRemovePanel' style='display:none;'><div id='divRemoveRecord' ><div style='text-align: center;'> Are you sure want to delete <b>" + this.HeadingText.Replace("Delete", "") + "</b> ?<br/><input type='submit' name='operation' value='" + this.CommandDeleteText + "'  class='removeop btn btn-danger' /><input type='button' value='No'  class='cancelpopup btn btn-inverse' /></div></div></div>");
            }
            //toolbarCommand.Append("<a href='" + this.CommandCancelURL + "' class='btn btn-warning'>" + this.CommandCancelText + "<a/>");

            HtmlFormBuilder.Append("<tr><td class='" + this.ToolBarCssClass + "' colspan='" + this.ColumnSpanCount + "'>" + toolbarCommand.ToString() + "</td></tr>");
            //**************************************************************************
        }
        #endregion

        #region BuildSearchToolBar
        private void BuildSearchToolBar()
        {
            //**************************************************************************
            //Creating BuildSearchToolBar Row.
            //Based on display mode buid the toolbar
            //**************************************************************************
            StringBuilder toolbarCommand = new StringBuilder();

            if (this.IsSearchRequired)
            {
                toolbarCommand.Append("<a id='btnSearch' href='#' class='buttonlink'>Search<a/>");
                toolbarCommand.Append("<a id='btnReset' href='#' class='buttonlink'>Reset<a/>");
                toolbarCommand.Append("<a id='btnBack' href='#' class='buttonlink'>Back<a/>");
            }
            else
            {
                toolbarCommand.Append("<a id='btnSearch' href='#' class='buttonlink'>Search<a/>");
                toolbarCommand.Append("<a id='btnExportToPDf' href='#' class='buttonlink'>Export To PDF<a/>");
                toolbarCommand.Append("<a id='btnExportToExcel' href='#' class='buttonlink'>Export To Excel<a/>");
                toolbarCommand.Append("<a id='btnCancel' href='#' class='buttonlink'>Cancel<a/>");
            }

            HtmlFormBuilder.Append("<tr><td class='" + this.ToolBarCssClass + "' colspan='" + this.ColumnSpanCount + "'>" + toolbarCommand.ToString() + "</td></tr>");
            //**************************************************************************
        }
        #endregion

        #region InstantiateIn
        public StringBuilder InstantiateIn(string TargetModuleName = "", string TargetAppID = "", string TargetFormAction = "", bool ValidateOnSubmit = true, bool IsSubModule = false, int TotalParentCol = 1)
        {
            this._IsSubModule = IsSubModule;
            HtmlFormBuilder = new StringBuilder();
            SetHTMLFormAndDefinition(TargetModuleName, TargetAppID, TargetFormAction);
            this._FORM_ACTION = TargetFormAction.ToUpper();
            if (!this._IsSubModule)
                SetProperty();

            HtmlFormBuilder.Append("<table class='WebFormHeaderTable persist-area'>");
            BuildFormHeader();
            HtmlFormBuilder.Append("</table>");

            HtmlFormBuilder.Append("<table width='100%' style='border-spacing: 0;' id='tbl" + TargetAppID.ToLower() + "'>");

            StringBuilder MyDivArea = new StringBuilder();
            MyDivArea.Append("<tr><td>");
            if (!this._IsSubModule)
            {
                MyDivArea.Append("<div id='__appTab_ACCEPTANCE__'><ul>");
                bool b = true;
                foreach (DataRow drProcessSetting in _ProcessSetting.Rows)
                {
                    MyDivArea.Append("<li  id='__liTab_ACCEPTANCE_" + drProcessSetting["SubProcessName"].ToString().ToLower() + "__'" + (b == true ? "class='k-state-active'" : "") + ">" + drProcessSetting["SUBPROCESSDISPLAYNAME"].ToString().ToUpper() + "</li>");
                    b = false;
                }
                MyDivArea.Append("</ul>");
            }
            string subprocessname = "";
            string nextprocessname = "";
            int nextprocessid = 0;
            bool match = true;
            bool isSubProcessPopUp = false;
            foreach (DataRow drProcessSetting in this._ProcessSetting.Rows)
            {
                if (subprocessname != "")
                {
                    nextprocessname = drProcessSetting["SubProcessName"].ToString();
                    nextprocessid = int.Parse(drProcessSetting["RowNum"].ToString());
                    break;
                }
                if (drProcessSetting["SubProcessName"].ToString().ToUpper() != TargetAppID.ToUpper())
                    continue;
                subprocessname = drProcessSetting["SubProcessName"].ToString();
                _PageName = drProcessSetting["PageName"].ToString();
                isSubProcessPopUp = Convert.ToBoolean(drProcessSetting["IsPopUpSubProcess"].ToString().ToLower());
            }

            string tblId = "__tbl" + subprocessname.ToLower() + "__";
            string divId = "__div" + subprocessname.ToLower() + "__";
            if (subprocessname != "")
            {
                MyDivArea.Append("<div id='" + divId + "'>");
                DataRow[] drProcessXMLPage = _ProcessXMLPage.Select("SubProcessName = '" + subprocessname + "'");
                foreach (DataRow dr in drProcessXMLPage)
                {
                    StringBuilder HtmlTransBuilder = new StringBuilder();
                    string webformdefinition = (TargetModuleName == "" ? (ModuleName != "" ? ModuleName + "/" : "") : (TargetModuleName + "/")) + "WebFormDefinition" + dr["XMLPAGE"].ToString() + ".xml";

                    XElement webformDefinationDocument = XElement.Load(System.Web.Hosting.HostingEnvironment.ApplicationPhysicalPath.ToString() + "HtmlForm/" + webformdefinition + "");

                    HtmlWebFormDefination =
                        from htmlwebformdef in webformDefinationDocument.Elements("WebFormDefinition")
                        orderby (decimal)htmlwebformdef.Element("DISPLAY_ORDER")
                        select htmlwebformdef;
                    this.ColumnSpanCount = int.Parse(dr["ColumnSpan"].ToString());
                    if (this.ColumnSpanCount == 2)
                    {
                        this._LABEL_CSS_CLASS = "formlabel";
                        this._DATA_FIELD_CSSCLASS = "";
                        this._DATA_CELL_CSSCLASS = "formInputcolumn";
                    }
                    else if (this.ColumnSpanCount == 4)
                    {
                        this._LABEL_CSS_CLASS = "formtwolabel";
                        this._DATA_FIELD_CSSCLASS = "";// HtmlWebFormDefination.Elements("DATA_FIELD_CSSCLASS").ToString();
                        this._DATA_CELL_CSSCLASS = "formtwoInputcolumn";
                    }
                    else if (this.ColumnSpanCount == 6)
                    {
                        this._LABEL_CSS_CLASS = "formthreelabel";
                        this._DATA_FIELD_CSSCLASS = "";
                        this._DATA_CELL_CSSCLASS = "formthreeInputcolumn";
                    }
                    else if (this.ColumnSpanCount == 8)
                    {
                        this._LABEL_CSS_CLASS = "formfourlabel";
                        this._DATA_FIELD_CSSCLASS = "";
                        this._DATA_CELL_CSSCLASS = "formfourInputcolumn";
                    }
                    else if (this.ColumnSpanCount == 16)
                    {
                        this._LABEL_CSS_CLASS = "formeightlabel";
                        this._DATA_FIELD_CSSCLASS = "";
                        this._DATA_CELL_CSSCLASS = "formeightInputcolumn";
                    }
                    if (this._FORM_ACTION == "SEARCH")
                    {
                        this._LABEL_CSS_CLASS = "formlabel";
                        this._DATA_FIELD_CSSCLASS = "";
                        this._DATA_CELL_CSSCLASS = "formSearchInputcolumn";
                    }
                    ValidateOnSubmit = (Convert.ToBoolean(dr["ValidateOnSubmit"].ToString().ToLower()));
                    if (Convert.ToBoolean(dr["IsTransSection"].ToString().ToLower()) == true)
                    {
                        string popUpStyle = (Convert.ToBoolean(dr["IsPopUp"].ToString().ToLower()) == true ? (" style='display:none'") : "");
                        if (isSubProcessPopUp)
                            popUpStyle = " style='display:block'";
                        HtmlTransBuilder.Append("<div id='divareaTrans_" + (TargetModuleName == "" ? (ModuleName != "" ? ModuleName.ToLower() : "") : TargetModuleName.ToLower()) + "_" + dr["XMLPAGE"].ToString().ToLower() + "'" + (ValidateOnSubmit == true ? " ValidateOnSubmit=true" : "") + popUpStyle + " cfi-aria-trans='trans'><input type='hidden' id='valueareaTrans_" + (TargetModuleName == "" ? (ModuleName != "" ? ModuleName.ToLower() : "") : TargetModuleName.ToLower()) + "_" + dr["XMLPAGE"].ToString().ToLower() + "' name='valueareaTrans_" + (TargetModuleName == "" ? (ModuleName != "" ? ModuleName.ToLower() : "") : TargetModuleName.ToLower()) + "_" + dr["XMLPAGE"].ToString().ToLower() + "'/>");
                        HtmlTransBuilder.Append("<table class='WebFormTable'><tr>");
                        BuildTransHeaderRow(HtmlTransBuilder, dr["XMLPAGE"].ToString(), "NEW", SNoColumnName: "SNo");
                        HtmlTransBuilder.Append("</tr><tr " + (popUpStyle == "" ? " data-popup = 'false'" : " data-popup = 'true'") + " id='areaTrans_" + (TargetModuleName == "" ? (ModuleName != "" ? ModuleName.ToLower() : "") : TargetModuleName.ToLower()) + "_" + dr["XMLPAGE"].ToString().ToLower() + "'>");
                        BuildTransDataRow(HtmlTransBuilder, dr["XMLPAGE"].ToString().ToLower(), "NEW");
                        HtmlTransBuilder.Append("</tr></table>");

                        HtmlTransBuilder.Append("</div>");
                        MyDivArea.Append(HtmlTransBuilder);
                    }
                    else
                    {
                        if (this._FORM_ACTION == "SEARCH")
                        {
                            var Name = _PageName == "SLI Details" ? ((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).SysSetting["SLICaption"].ToString() : _PageName;
                            MyDivArea.Append("<table width='100%'><tr><td class='formSection'>" + Name + "</td></tr></table><table cfi-aria-search='search' id='" + tblId + "'>" + MakeSearchBody() + "</table>");
                        }
                        else
                        {
                            if (TotalParentCol == 1)
                                MyDivArea.Append("<table class='WebFormTable'" + (ValidateOnSubmit == true ? " ValidateOnSubmit=true" : "") + " id='" + tblId + "'>" + MakeFormBody() + "</table>");
                            else
                            {
                                string width = int.Parse((100 / TotalParentCol).ToString()).ToString();
                                MyDivArea.Append("<table><tr><td id='__td0__' style='width:" + width + ";'><table class='WebFormTable'" + (ValidateOnSubmit == true ? " ValidateOnSubmit=true" : "") + ">" + MakeFormBody() + "</table>");
                                MyDivArea.Append("</td>");

                                for (int i = 1; i < TotalParentCol; i++)
                                {
                                    MyDivArea.Append("<td id='__td" + i.ToString() + "__' style='width:" + width + ";'></td>");

                                }
                                MyDivArea.Append("</tr></table>");

                            }
                        }
                    }
                }
                MyDivArea.Append("</div>");
            }
            MyDivArea.Append("</div>");
            MyDivArea.Append("</td></tr>");

            HtmlFormBuilder.Append(MyDivArea.ToString());
            if (this.IsSearchToolBar == true)
                BuildSearchToolBar();

            HtmlFormBuilder.Append("</table>");
            HtmlFormBuilder.Append("<table width='100%'>");
            HtmlFormBuilder.Append("<tr><td><div id='divContent'></div></td></tr>");
            HtmlFormBuilder.Append("<tr><td><div id='divAfterContent'></div></td></tr>");
            HtmlFormBuilder.Append("</table>");
            //HtmlFormBuilder.Append("<div style='height:50px;width:100%;'></div><div class='black_overlay' id='divPopUpBackground'></div>");
            HtmlFormBuilder.Append("<div style='width:100%;'></div><div class='black_overlay' id='divPopUpBackground'></div>");
            if (this._FORM_ACTION == "SEARCH")
            {
                HtmlFormBuilder.Append("<script>InstantiateSearchControl('" + tblId + "');preventPost('" + tblId + "');</script>");
            }

            else
            {
                HtmlFormBuilder.Append("<script>InstantiateControl('" + tblId + "');preventPost('" + tblId + "');</script>");
            }
            return HtmlFormBuilder;
        }
        #endregion

        #region InstantiateIn
        public StringBuilder InstantiatePartialIn(string moduleName, string pageName, string colspan, string displayMode, bool IsSubModule = false)
        {
            this._IsSubModule = IsSubModule;
            this._FORM_ACTION = displayMode;
            SetHTMLFormAndDefinition(moduleName, pageName, this._FORM_ACTION);
            if (!this._IsSubModule)
                SetProperty();
            HtmlFormBuilder = new StringBuilder();
            //HtmlFormBuilder.Append("<table class='WebFormHeaderTable persist-area'>");
            //BuildFormHeader();
            //HtmlFormBuilder.Append("</table>");

            StringBuilder MyDivArea = new StringBuilder();
            MyDivArea.Append("<table class='WebFormTable' id='tbl" + moduleName + "_" + pageName + "'>");
            MyDivArea.Append("<tr><td>");

            StringBuilder HtmlTransBuilder = new StringBuilder();
            string webformdefinition = moduleName + "/WebFormDefinition" + pageName + ".xml";
            XElement webformDefinationDocument = XElement.Load(System.Web.Hosting.HostingEnvironment.ApplicationPhysicalPath.ToString() + "HtmlForm/" + webformdefinition + "");
            XElement webformDocument = XElement.Load(System.Web.Hosting.HostingEnvironment.ApplicationPhysicalPath.ToString() + "HtmlForm/WebForm.xml");
            HtmlWebFormDefination =
                from htmlwebformdef in webformDefinationDocument.Elements("WebFormDefinition")
                orderby (decimal)htmlwebformdef.Element("DISPLAY_ORDER")
                select htmlwebformdef;
            this.ColumnSpanCount = Convert.ToInt16(colspan);
            if (this.ColumnSpanCount == 2)
            {
                this._LABEL_CSS_CLASS = "formlabel";
                this._DATA_FIELD_CSSCLASS = "";
                this._DATA_CELL_CSSCLASS = "formInputcolumn";
            }
            else if (this.ColumnSpanCount == 4)
            {
                this._LABEL_CSS_CLASS = "formtwolabel";
                this._DATA_FIELD_CSSCLASS = "";
                this._DATA_CELL_CSSCLASS = "formtwoInputcolumn";
            }
            else if (this.ColumnSpanCount == 6)
            {
                this._LABEL_CSS_CLASS = "formthreelabel";
                this._DATA_FIELD_CSSCLASS = "";
                this._DATA_CELL_CSSCLASS = "formthreeInputcolumn";
            }
            else if (this.ColumnSpanCount == 8)
            {
                this._LABEL_CSS_CLASS = "formfourlabel";
                this._DATA_FIELD_CSSCLASS = "";
                this._DATA_CELL_CSSCLASS = "formfourInputcolumn";
            }
            else if (this.ColumnSpanCount == 16)
            {
                this._LABEL_CSS_CLASS = "formeightlabel";
                this._DATA_FIELD_CSSCLASS = "";
                this._DATA_CELL_CSSCLASS = "formeightInputcolumn";
            }
            MyDivArea.Append("<table width='100%' style='border-spacing: 0;'>" + MakeFormBody() + "</table>");
            MyDivArea.Append("</td></tr></table>");
            HtmlFormBuilder.Append(MyDivArea.ToString());

            return HtmlFormBuilder;
        }
        #endregion



        #region TransInstantiate
        public StringBuilder TransInstantiate(string TransModuleName, string TransName, string TransFormAction = "New", bool IsPopUp = false, bool ValidateOnSubmit = false)
        {

            SetHTMLFormAndDefinition(TransModuleName, TransName, TransFormAction);
            SetProperty();
            StringBuilder HtmlTransBuilder = new StringBuilder();
            string popUpStyle = (IsPopUp == true ? (" style='display:none'") : "");
            HtmlTransBuilder.Append("<div id='divareaTrans_" + (TransModuleName == "" ? "" : (TransModuleName + "_")) + TransName + "'" + (ValidateOnSubmit == true ? " ValidateOnSubmit=true" : "") + popUpStyle + "><input type='hidden' id='valueareaTrans_" + (TransModuleName == "" ? "" : (TransModuleName + "_")) + TransName + "' name='valueareaTrans_" + (TransModuleName == "" ? "" : (TransModuleName + "_")) + TransName + "'/><table class='WebFormTable'>");
            BuildTransHeader(HtmlTransBuilder);
            HtmlTransBuilder.Append("</table>");
            if (this.objDataTable != null && this.objDataTable.Rows.Count > 0)
            {
                for (int i = 0; i < this.objDataTable.Rows.Count; i++)
                {
                    this.objIndex = i;
                    if (i == 0)
                        HtmlTransBuilder.Append("<table class='WebFormTable' id='areaTrans_" + (TransModuleName == "" ? "" : (TransModuleName + "_")) + TransName + "'>");
                    else
                        HtmlTransBuilder.Append("<table class='WebFormTable' id='areaTrans_" + (TransModuleName == "" ? "" : (TransModuleName + "_")) + TransName + "_" + i.ToString() + "'>");
                    BuildTransBody(HtmlTransBuilder, TransName, TransFormAction);
                    HtmlTransBuilder.Append("</table>");
                }
            }
            else
            {
                HtmlTransBuilder.Append("<table class='WebFormTable' id='areaTrans_" + (TransModuleName == "" ? "" : (TransModuleName + "_")) + TransName + "'>");
                BuildTransBody(HtmlTransBuilder, TransName, TransFormAction);
                HtmlTransBuilder.Append("</table>");
            }
            HtmlTransBuilder.Append("</div>");
            return HtmlTransBuilder;
        }
        #endregion

        #region TransInstantiateWithHeader
        public StringBuilder TransInstantiateWithHeader(string TransModuleName, string TransName, string TransFormAction = "New", bool IsPopUp = false, bool ValidateOnSubmit = false, string SNoHeaderText = "SNo")
        {
            SetHTMLFormAndDefinition(TransModuleName, TransName, TransFormAction);
            SetProperty();
            StringBuilder HtmlTransBuilder = new StringBuilder();
            string popUpStyle = (IsPopUp == true ? (" style='display:none'") : "");

            HtmlTransBuilder.Append("<div id='divareaTrans_" + (TransModuleName == "" ? "" : (TransModuleName + "_")) + TransName + "'" + (ValidateOnSubmit == true ? " ValidateOnSubmit=true" : "") + popUpStyle + "><input type='hidden' id='valueareaTrans_" + (TransModuleName == "" ? "" : (TransModuleName + "_")) + TransName + "' name='valueareaTrans_" + (TransModuleName == "" ? "" : (TransModuleName + "_")) + TransName + "'/>");
            if (!IsPopUp)
            {
                HtmlTransBuilder.Append("<table class='WebFormChildTable'>");
                BuildTransHeader(HtmlTransBuilder);
                HtmlTransBuilder.Append("</table>");
            }
            if (this.objDataTable != null && this.objDataTable.Rows.Count > 0)
            {
                HtmlTransBuilder.Append("<table class='WebFormTable'><tr>");
                BuildTransHeaderRow(HtmlTransBuilder, TransName, TransFormAction, SNoColumnName: SNoHeaderText);
                for (int i = 0; i < this.objDataTable.Rows.Count; i++)
                {
                    this.objIndex = i;
                    if (i == 0)
                        HtmlTransBuilder.Append("</tr><tr id='areaTrans_" + (TransModuleName == "" ? "" : (TransModuleName + "_")) + TransName + "'>");
                    else
                        HtmlTransBuilder.Append("</tr><tr id='areaTrans_" + (TransModuleName == "" ? "" : (TransModuleName + "_")) + TransName + "_" + i.ToString() + "'>");
                    BuildTransDataRow(HtmlTransBuilder, TransName, TransFormAction);
                }
                HtmlTransBuilder.Append("</tr></table>");
            }
            else
            {
                HtmlTransBuilder.Append("<table class='WebFormTable'><tr>");
                BuildTransHeaderRow(HtmlTransBuilder, TransName, TransFormAction, SNoColumnName: SNoHeaderText);
                HtmlTransBuilder.Append("</tr><tr id='areaTrans_" + (TransModuleName == "" ? "" : (TransModuleName + "_")) + TransName + "'>");
                BuildTransDataRow(HtmlTransBuilder, TransName, TransFormAction);
                HtmlTransBuilder.Append("</tr></table>");
            }
            HtmlTransBuilder.Append("</div>");
            return HtmlTransBuilder;
        }
        #endregion


        #region BuildTransHeader
        private void BuildTransHeader(StringBuilder HtmlTransBuilder)
        {
            //ManishB


            //**************************************************************************
            //Create the caption row.
            //If FormCaption property is visible then set related property.
            //**************************************************************************            
            if (this.FormCaptionVisible == true)
            {
                //If Caption Icon path is specified then set it to caption.
                if (this.FormCaptionImageUrl.ToString().Length > 0)
                    this.FormCaptionImageUrl = "<image src='" + this.FormCaptionImageUrl.ToString() + "' border='none' />&nbsp;";
                else
                    this.FormCaptionImageUrl = "";

                //If Caption Text is specified then set it to caption.
                if (this.FormCaptionText.ToString().Length > 0)
                    HtmlTransBuilder.Append("<tr><td class='" + this.ToolBarCssClass + "'>" + this.FormCaptionImageUrl + this.FormCaptionText.ToString() + "</td></tr>");
            }
            //this.BuildTransToolBar();
        }
        #endregion

        #region BuildTransToolBar
        private StringBuilder BuildTransToolBar(string TransName, string RowSpan)
        {
            StringBuilder HtmlTransAction = new StringBuilder();
            //**************************************************************************
            //Creating ToolBar Row.
            //Based on display mode buid the toolbar
            //**************************************************************************           

            // Updated by Amit Yadav for chrome 65 issue.
            if (RowSpan == "0")
                HtmlTransAction.Append("<td class='formtransactionrow' id='transAction' name='transAction'><div id='transActionDiv' align='left'></div></td>");
            else
                HtmlTransAction.Append("<td class='formtransactionrow' id='transAction' name='transAction' rowspan='" + RowSpan + "'><div id='transActionDiv' align='left'></div></td>");
            //**************************************************************************
            return HtmlTransAction;
        }
        #endregion

        #region BuildTransBody
        private void BuildTransBody(StringBuilder HtmlTransBuilder, string TransName, string TransFormAction = "New")
        {

            //Check if Business Data table is assigned
            //If not assigned then raise exception
            if (this.HtmlWebFormDefination == null)
                throw new Exception("NULL HtmlWebFormDefination! HtmlWebFormDefination is required.");


            StringBuilder MyCurrentCell = new StringBuilder();
            StringBuilder MyCurrentRow = new StringBuilder();

            int LayoutCount = 1;
            int i = 0;
            String[] ListCellControl = null;
            bool IsSingleCellControl = false;
            string FirstIndex = "";
            int CurrentCellTotal = 0;
            int RowLength = 1;
            bool flag = false;
            bool IsActionAdd = false;
            foreach (var wformdev in HtmlWebFormDefination)
            {
                //Check ASSEMBLY_NAME of this row is blank then raise error.
                if (wformdev.Element("ASSEMBLY_NAME").Value.ToString().Trim().Length == 0)
                    throw new Exception("NULL ASSEMBLY_NAME! ASSEMBLY_NAME is required.");
                flag = true;
                IsSingleCellControl = false;

                ListCellControl = wformdev.Element("DISPLAY_ORDER").Value.ToString().Replace(".00", "").Split('.');
                bool _controlInitiated = true;
                string _assemblyName = "";
                _assemblyName = wformdev.Element("ASSEMBLY_NAME").Value.ToString();
                string SECTION_NAME = wformdev.Element("SECTION_NAME").Value.ToString();

                if (this.objStructureModify != null && this.objStructureModify.Rows.Count > 0)
                {
                    DataRow[] drStructureModify = this.objStructureModify.Select("HTML_CONTROL_ID='" + wformdev.Element("HTML_CONTROL_ID").Value.ToString().Trim() + "'");
                    if (drStructureModify != null && drStructureModify.Length > 0)
                    {
                        if (!string.IsNullOrWhiteSpace(drStructureModify[0]["CONTROL_INITIATED"].ToString()))
                            _controlInitiated = Convert.ToBoolean(drStructureModify[0]["CONTROL_INITIATED"].ToString().ToLower());
                        if (!string.IsNullOrWhiteSpace(drStructureModify[0]["ASSEMBLY_NAME"].ToString()))
                            _assemblyName = drStructureModify[0]["ASSEMBLY_NAME"].ToString();

                        if (!string.IsNullOrWhiteSpace(drStructureModify[0]["SECTION_NAME"].ToString()))
                            SECTION_NAME = drStructureModify[0]["SECTION_NAME"].ToString();
                    }
                }
                if (FirstIndex.Trim() == ListCellControl[0].ToString().Trim())
                {
                    CurrentCellTotal++;
                    IsSingleCellControl = true;
                }
                else
                {
                    FirstIndex = ListCellControl[0].ToString();
                    //if (wformdev.Element("CONTROL_TOTAL").Value.ToString() != "")
                    //    RowLength = int.Parse(wformdev.Element("CONTROL_TOTAL").Value.ToString());
                    //else
                    RowLength = 1;

                    CurrentCellTotal = 1;
                }

                if (SECTION_NAME.Length > 0)
                {
                    if (IsSingleCellControl == false)
                    {
                        if (this.SectionCssClass == "")
                            this.SectionCssClass = this.HeadingCssClass;

                        MyCurrentRow.Append("<tr><td class='" + this.SectionCssClass + "' colspan='" + (this.ColumnSpanCount + 1) + "'>" + SECTION_NAME + "</td></tr>");
                    }
                }
                //ImageLabelAssemblyName
                if (_controlInitiated)
                {
                    #region Control Created
                    switch (_assemblyName)
                    {
                        case HiddenFieldAssemblyName:
                            if (IsSingleCellControl == false)
                                MyCurrentCell.Append(CreateCellLabel(wformdev));

                            if (wformdev.Element("DATA_FIELDNAME").Value.ToString().Trim().Length > 0)
                                MyCurrentCell.Append(CreateHiddenFieldControl(wformdev, true));
                            else
                                MyCurrentCell.Append(CreateLabelControl(wformdev, true));
                            break;


                        case DateCalenderAssemblyName:
                            if (IsSingleCellControl == false)
                                MyCurrentCell.Append(CreateCellLabel(wformdev));

                            if (wformdev.Element("DATA_FIELDNAME").Value.ToString().Trim().Length > 0)
                                MyCurrentCell.Append(CreateDateCalenderControl(wformdev, true));
                            else
                                MyCurrentCell.Append(CreateLabelControl(wformdev, true));

                            break;

                        case RadioButttonListAssemblyName:
                            if (IsSingleCellControl == false)
                                MyCurrentCell.Append(CreateCellLabel(wformdev));

                            if (wformdev.Element("DATA_FIELDNAME").Value.ToString().Trim().Length > 0)
                                MyCurrentCell.Append(CreateRadioButtonListControl(wformdev, true));
                            else
                                MyCurrentCell.Append(CreateLabelControl(wformdev, true));

                            break;
                        case CheckBoxListAssemblyName:
                            if (IsSingleCellControl == false)
                                MyCurrentCell.Append(CreateCellLabel(wformdev));

                            if (wformdev.Element("DATA_FIELDNAME").Value.ToString().Trim().Length > 0)
                                MyCurrentCell.Append(CreateCheckBoxListControl(wformdev, true));
                            else
                                MyCurrentCell.Append(CreateLabelControl(wformdev, true));

                            break;
                        case RadioAssemblyName:
                            if (IsSingleCellControl == false)
                                MyCurrentCell.Append(CreateCellLabel(wformdev));

                            if (wformdev.Element("DATA_FIELDNAME").Value.ToString().Trim().Length > 0)
                                MyCurrentCell.Append(CreateRadioButtonControl(wformdev, true));
                            else
                                MyCurrentCell.Append(CreateLabelControl(wformdev, true));

                            break;
                        case LabelAssemblyName:
                            if (IsSingleCellControl == false)
                                MyCurrentCell.Append(CreateCellLabel(wformdev));

                            if (wformdev.Element("DATA_FIELDNAME").Value.ToString().Trim().Length > 0)
                                MyCurrentCell.Append(CreateLabelControl(wformdev, true));
                            else
                                MyCurrentCell.Append(CreateLabelControl(wformdev, true));

                            break;
                        case TextBoxAssemblyName:
                            if (IsSingleCellControl == false)
                                MyCurrentCell.Append(CreateCellLabel(wformdev));


                            if (wformdev.Element("DATA_FIELDNAME").Value.ToString().Trim().Length > 0)
                                MyCurrentCell.Append(CreateTextBoxControl(wformdev, true));
                            else
                                MyCurrentCell.Append(CreateLabelControl(wformdev, true));

                            break;
                        case FileUploadAssemblyName:
                            if (IsSingleCellControl == false)
                                MyCurrentCell.Append(CreateCellLabel(wformdev));


                            if (wformdev.Element("DATA_FIELDNAME").Value.ToString().Trim().Length > 0)
                                MyCurrentCell.Append(CreateFileUploadControl(wformdev, true));
                            else
                                MyCurrentCell.Append(CreateLabelControl(wformdev, true));

                            break;

                        case AutoCompleteTextBoxAssemblyName:
                            if (IsSingleCellControl == false)
                                MyCurrentCell.Append(CreateCellLabel(wformdev));


                            if (wformdev.Element("DATA_FIELDNAME").Value.ToString().Trim().Length > 0)
                                MyCurrentCell.Append(CreateAutoCompleteTextBoxControl(wformdev, true));
                            else
                                MyCurrentCell.Append(CreateLabelControl(wformdev, true));

                            break;

                        case PasswordAssemblyName:
                            if (IsSingleCellControl == false)
                                MyCurrentCell.Append(CreateCellLabel(wformdev));

                            if (wformdev.Element("DATA_FIELDNAME").Value.ToString().Trim().Length > 0)
                                MyCurrentCell.Append(CreatePasswordControl(wformdev, true));
                            else
                                MyCurrentCell.Append(CreateLabelControl(wformdev, true));

                            break;
                        case CheckBoxAssemblyName:
                            if (IsSingleCellControl == false)
                                MyCurrentCell.Append(CreateCellLabel(wformdev));

                            if (wformdev.Element("DATA_FIELDNAME").Value.ToString().Trim().Length > 0)
                                MyCurrentCell.Append(CreateCheckBoxControl(wformdev, true));
                            else
                                MyCurrentCell.Append(CreateLabelControl(wformdev, true));
                            break;

                        case ButttonAssemblyName:
                            if (IsSingleCellControl == false)
                                MyCurrentCell.Append(CreateCellLabel(wformdev));


                            if (wformdev.Element("DATA_FIELDNAME").Value.ToString().Trim().Length > 0)
                                MyCurrentCell.Append(CreateButttonControl(wformdev));
                            else
                                MyCurrentCell.Append(CreateLabelControl(wformdev, true));
                            break;

                        case DropDownListAssemblyName:
                            if (IsSingleCellControl == false)
                                MyCurrentCell.Append(CreateCellLabel(wformdev));

                            if (wformdev.Element("DATA_FIELDNAME").Value.ToString().Trim().Length > 0)
                                MyCurrentCell.Append(CreateDropDownControl(wformdev, true));
                            else
                                MyCurrentCell.Append(CreateLabelControl(wformdev, true));

                            break;
                        case MultiControlAssemblyName:
                            if (IsSingleCellControl == false)
                                MyCurrentCell.Append(CreateCellLabel(wformdev));
                            MyCurrentCell.Append("<td class='" + this._DATA_CELL_CSSCLASS + "' >");
                            if (wformdev.Element("SKIN_ID").Value.ToString() == "hidecontrol")
                            {
                                MyCurrentCell.Append("<table><tr>");
                            }
                            ChildHtmlWebFormDefination = from htmlwebformdef in wformdev.Elements("MultiWebFormDefinition")
                                                         orderby (decimal)htmlwebformdef.Element("TAB_INDEX")
                                                         select htmlwebformdef;
                            //string[] AssemblyNameArray = wformdev.Element("ASSEMBLY_NAME").Value.ToString().Split(',');
                            foreach (var childformdev in ChildHtmlWebFormDefination)
                            {
                                if (wformdev.Element("SKIN_ID").Value.ToString() == "hidecontrol")
                                {
                                    MyCurrentCell.Append("<td class='" + childformdev.Element("DATA_CELL_CSSCLASS").Value.ToString() + "' >");
                                }


                                switch (childformdev.Element("ASSEMBLY_NAME").Value.ToString())
                                {

                                    case HiddenFieldAssemblyName:
                                        if (childformdev.Element("DATA_FIELDNAME").Value.ToString().Trim().Length > 0)
                                            MyCurrentCell.Append(CreateHiddenFieldControl(childformdev, IsMultiControl: true));
                                        else
                                            MyCurrentCell.Append(CreateLabelControl(childformdev, IsMultiControl: true));
                                        break;


                                    case DateCalenderAssemblyName:
                                        if (childformdev.Element("DATA_FIELDNAME").Value.ToString().Trim().Length > 0)
                                            MyCurrentCell.Append(CreateDateCalenderControl(childformdev, IsMultiControl: true));
                                        else
                                            MyCurrentCell.Append(CreateLabelControl(childformdev, IsMultiControl: true));

                                        break;

                                    case RadioButttonListAssemblyName:
                                        if (childformdev.Element("DATA_FIELDNAME").Value.ToString().Trim().Length > 0)
                                            MyCurrentCell.Append(CreateRadioButtonListControl(childformdev, IsMultiControl: true));
                                        else
                                            MyCurrentCell.Append(CreateLabelControl(childformdev, IsMultiControl: true));

                                        break;
                                    case CheckBoxListAssemblyName:
                                        if (childformdev.Element("DATA_FIELDNAME").Value.ToString().Trim().Length > 0)
                                            MyCurrentCell.Append(CreateCheckBoxListControl(childformdev, IsMultiControl: true));
                                        else
                                            MyCurrentCell.Append(CreateLabelControl(childformdev, IsMultiControl: true));

                                        break;
                                    case RadioAssemblyName:
                                        if (childformdev.Element("DATA_FIELDNAME").Value.ToString().Trim().Length > 0)
                                            MyCurrentCell.Append(CreateRadioButtonControl(childformdev, IsMultiControl: true));
                                        else
                                            MyCurrentCell.Append(CreateLabelControl(childformdev, IsMultiControl: true));

                                        break;
                                    case LabelAssemblyName:
                                        if (childformdev.Element("DATA_FIELDNAME").Value.ToString().Trim().Length > 0)
                                            MyCurrentCell.Append(CreateLabelControl(childformdev, IsMultiControl: true));
                                        else
                                            MyCurrentCell.Append(CreateLabelControl(childformdev, IsMultiControl: true));

                                        break;
                                    case TextBoxAssemblyName:
                                        if (childformdev.Element("DATA_FIELDNAME").Value.ToString().Trim().Length > 0)
                                            MyCurrentCell.Append(CreateTextBoxControl(childformdev, IsMultiControl: true));
                                        else
                                            MyCurrentCell.Append(CreateLabelControl(childformdev, IsMultiControl: true));

                                        break;
                                    case FileUploadAssemblyName:
                                        if (childformdev.Element("DATA_FIELDNAME").Value.ToString().Trim().Length > 0)
                                            MyCurrentCell.Append(CreateFileUploadControl(childformdev, IsMultiControl: true));
                                        else
                                            MyCurrentCell.Append(CreateLabelControl(childformdev, IsMultiControl: true));

                                        break;

                                    case AutoCompleteTextBoxAssemblyName:
                                        if (childformdev.Element("DATA_FIELDNAME").Value.ToString().Trim().Length > 0)
                                            MyCurrentCell.Append(CreateAutoCompleteTextBoxControl(childformdev, IsMultiControl: true));
                                        else
                                            MyCurrentCell.Append(CreateLabelControl(childformdev, IsMultiControl: true));

                                        break;

                                    case PasswordAssemblyName:
                                        if (childformdev.Element("DATA_FIELDNAME").Value.ToString().Trim().Length > 0)
                                            MyCurrentCell.Append(CreatePasswordControl(childformdev, IsMultiControl: true));
                                        else
                                            MyCurrentCell.Append(CreateLabelControl(childformdev, IsMultiControl: true));

                                        break;
                                    case CheckBoxAssemblyName:
                                        if (childformdev.Element("DATA_FIELDNAME").Value.ToString().Trim().Length > 0)
                                            MyCurrentCell.Append(CreateCheckBoxControl(childformdev, IsMultiControl: true));
                                        else
                                            MyCurrentCell.Append(CreateLabelControl(childformdev, IsMultiControl: true));
                                        break;

                                    case ButttonAssemblyName:
                                        if (childformdev.Element("DATA_FIELDNAME").Value.ToString().Trim().Length > 0)
                                            MyCurrentCell.Append(CreateButttonControl(childformdev, IsMultiControl: true));
                                        else
                                            MyCurrentCell.Append(CreateLabelControl(childformdev, IsMultiControl: true));
                                        break;

                                    case DropDownListAssemblyName:
                                        if (childformdev.Element("DATA_FIELDNAME").Value.ToString().Trim().Length > 0)
                                            MyCurrentCell.Append(CreateDropDownControl(childformdev, IsMultiControl: true));
                                        else
                                            MyCurrentCell.Append(CreateLabelControl(childformdev, IsMultiControl: true));

                                        break;

                                    default:
                                        break;
                                }
                                MyCurrentCell.Append("&nbsp;");
                                if (wformdev.Element("SKIN_ID").Value.ToString() == "hidecontrol")
                                {
                                    MyCurrentCell.Append("</td>");
                                }
                            }
                            if (wformdev.Element("SKIN_ID").Value.ToString() == "hidecontrol")
                            {
                                MyCurrentCell.Append("</tr></table></td>");
                            }
                            else
                            {
                                MyCurrentCell.Append("</td>");
                            }
                            break;
                        default:
                            break;
                    }
                    #endregion
                }
                else
                {
                    MyCurrentCell.Append("<td class='" + this._LABEL_CSS_CLASS + "'>&nbsp;</td>");
                    MyCurrentCell.Append("<td class='" + this._LABEL_CSS_CLASS + "'>&nbsp;</td>");
                }

                if (CurrentCellTotal == RowLength)
                {
                    string actionColumn = "";
                    if (!IsActionAdd)
                    {
                        if (TransFormAction.ToUpper() == "NEW" || TransFormAction.ToUpper() == "EDIT")
                        {
                            int rowSpan = ((HtmlWebFormDefination.Count() / (this.ColumnSpanCount / 2)) + (HtmlWebFormDefination.Count() % (this.ColumnSpanCount / 2)));
                            actionColumn = BuildTransToolBar(TransName, rowSpan.ToString()).ToString();
                        }
                    }
                    if (this.ColumnSpanCount == 2)
                    {
                        MyCurrentRow.Append("<tr>" + MyCurrentCell.ToString() + actionColumn + "</tr>");
                        MyCurrentCell = new StringBuilder();
                        IsActionAdd = true;
                    }
                    else
                    {
                        if (LayoutCount == 2)
                        {
                            flag = false;
                            MyCurrentRow.Append("<tr>" + MyCurrentCell.ToString() + actionColumn + "</tr>");
                            MyCurrentCell = new StringBuilder();
                            LayoutCount = 0;
                            IsActionAdd = true;
                        }

                        LayoutCount++;
                    }
                    i++;
                }
            }
            if (LayoutCount == 2 && flag == true)
            {
                MyCurrentRow.Append("<tr>" + MyCurrentCell.ToString() + "</tr>");
                MyCurrentCell = new StringBuilder();
            }
            HtmlTransBuilder.Append(MyCurrentRow.ToString());
        }
        #endregion

        #region BuildTransHeaderRow
        private void BuildTransHeaderRow(StringBuilder HtmlTransBuilder, string TransName, string TransFormAction = "New", string SNoColumnName = "SNo")
        {
            //Check if Business Data table is assigned
            //If not assigned then raise exception
            if (this.HtmlWebFormDefination == null)
                throw new Exception("NULL HtmlWebFormDefination! HtmlWebFormDefination is required.");

            StringBuilder MyCurrentCell = new StringBuilder();
            StringBuilder MyCurrentRow = new StringBuilder();
            StringBuilder MySectionRow = new StringBuilder();
            string transsectionaname = "";
            foreach (var wformdev in HtmlWebFormDefination)
            {
                //Check ASSEMBLY_NAME of this row is blank then raise error.
                if (wformdev.Element("ASSEMBLY_NAME").Value.ToString().Trim().Length == 0)
                    throw new Exception("NULL ASSEMBLY_NAME! ASSEMBLY_NAME is required.");
                if (transsectionaname == "")
                    transsectionaname = wformdev.Element("SECTION_NAME").Value.ToString();
                MyCurrentCell.Append(CreateCellLabeltrans(wformdev));
            }
            string snoColumn = "";
            //AMIT
            if (_PageName == "SLI Details")
            {
                transsectionaname = transsectionaname.Replace("SLI", ((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).SysSetting["SLICaption"].ToString());
            }
            snoColumn = "<td class='formHeaderLabel snowidth' id='transSNo' name='transSNo'>" + SNoColumnName + "</td>";
            if (TransFormAction.ToUpper() == "EDIT" || TransFormAction.ToUpper() == "NEW")
            {
                MyCurrentRow.Append(snoColumn + MyCurrentCell.ToString() + "<td class='formHeaderLabel'>Action</td>");
            }
            else
            {
                MyCurrentRow.Append(snoColumn + MyCurrentCell.ToString());
            }
            if (transsectionaname != "")
            {
                MySectionRow.Append("<tr><th class='formSection' colspan='" + (HtmlWebFormDefination.Count() + 2).ToString() + "'>" + transsectionaname + "</th></tr>");
            }
            HtmlTransBuilder.Append(MySectionRow.ToString() + MyCurrentRow.ToString());
        }
        #endregion

        #region BuildTransDataRow
        private void BuildTransDataRow(StringBuilder HtmlTransBuilder, string TransName, string TransFormAction = "New")
        {

            //Check if Business Data table is assigned
            //If not assigned then raise exception
            if (this.HtmlWebFormDefination == null)
                throw new Exception("NULL HtmlWebFormDefination! HtmlWebFormDefination is required.");


            StringBuilder MyCurrentCell = new StringBuilder();
            StringBuilder MyCurrentRow = new StringBuilder();

            int LayoutCount = 1;
            int i = 0;
            String[] ListCellControl = null;
            bool IsSingleCellControl = false;
            string FirstIndex = "";
            int CurrentCellTotal = 0;
            int RowLength = 1;
            bool flag = false;
            bool IsActionAdd = false;

            foreach (var wformdev in HtmlWebFormDefination)
            {
                //Check ASSEMBLY_NAME of this row is blank then raise error.
                if (wformdev.Element("ASSEMBLY_NAME").Value.ToString().Trim().Length == 0)
                    throw new Exception("NULL ASSEMBLY_NAME! ASSEMBLY_NAME is required.");
                flag = true;
                IsSingleCellControl = false;

                ListCellControl = wformdev.Element("DISPLAY_ORDER").Value.ToString().Replace(".00", "").Split('.');
                bool _controlInitiated = true;
                string _assemblyName = "";
                _assemblyName = wformdev.Element("ASSEMBLY_NAME").Value.ToString();
                string SECTION_NAME = wformdev.Element("SECTION_NAME").Value.ToString();

                if (this.objStructureModify != null && this.objStructureModify.Rows.Count > 0)
                {
                    DataRow[] drStructureModify = this.objStructureModify.Select("HTML_CONTROL_ID='" + wformdev.Element("HTML_CONTROL_ID").Value.ToString().Trim() + "'");
                    if (drStructureModify != null && drStructureModify.Length > 0)
                    {
                        if (!string.IsNullOrWhiteSpace(drStructureModify[0]["CONTROL_INITIATED"].ToString()))
                            _controlInitiated = Convert.ToBoolean(drStructureModify[0]["CONTROL_INITIATED"].ToString().ToLower());
                        if (!string.IsNullOrWhiteSpace(drStructureModify[0]["ASSEMBLY_NAME"].ToString()))
                            _assemblyName = drStructureModify[0]["ASSEMBLY_NAME"].ToString();

                        if (!string.IsNullOrWhiteSpace(drStructureModify[0]["SECTION_NAME"].ToString()))
                            SECTION_NAME = drStructureModify[0]["SECTION_NAME"].ToString();
                    }
                }
                if (FirstIndex.Trim() == ListCellControl[0].ToString().Trim())
                {
                    CurrentCellTotal++;
                    IsSingleCellControl = true;
                }
                else
                {
                    FirstIndex = ListCellControl[0].ToString();
                    //if (wformdev.Element("CONTROL_TOTAL").Value.ToString() != "")
                    //    RowLength = int.Parse(wformdev.Element("CONTROL_TOTAL").Value.ToString());
                    //else
                    RowLength = 1;

                    CurrentCellTotal = 1;
                }

                //ImageLabelAssemblyName
                switch (_assemblyName)
                {
                    case HiddenFieldAssemblyName:
                        if (wformdev.Element("DATA_FIELDNAME").Value.ToString().Trim().Length > 0)
                            MyCurrentCell.Append(CreateHiddenFieldControl(wformdev, true));
                        else
                            MyCurrentCell.Append(CreateLabelControl(wformdev, true));
                        break;


                    case DateCalenderAssemblyName:
                        if (wformdev.Element("DATA_FIELDNAME").Value.ToString().Trim().Length > 0)
                            MyCurrentCell.Append(CreateDateCalenderControl(wformdev, true));
                        else
                            MyCurrentCell.Append(CreateLabelControl(wformdev, true));

                        break;

                    case RadioButttonListAssemblyName:
                        if (wformdev.Element("DATA_FIELDNAME").Value.ToString().Trim().Length > 0)
                            MyCurrentCell.Append(CreateRadioButtonListControl(wformdev, true));
                        else
                            MyCurrentCell.Append(CreateLabelControl(wformdev, true));

                        break;
                    case CheckBoxListAssemblyName:
                        if (wformdev.Element("DATA_FIELDNAME").Value.ToString().Trim().Length > 0)
                            MyCurrentCell.Append(CreateCheckBoxListControl(wformdev, true));
                        else
                            MyCurrentCell.Append(CreateLabelControl(wformdev, true));

                        break;
                    case RadioAssemblyName:
                        if (wformdev.Element("DATA_FIELDNAME").Value.ToString().Trim().Length > 0)
                            MyCurrentCell.Append(CreateRadioButtonControl(wformdev, true));
                        else
                            MyCurrentCell.Append(CreateLabelControl(wformdev, true));

                        break;
                    case LabelAssemblyName:
                        if (wformdev.Element("DATA_FIELDNAME").Value.ToString().Trim().Length > 0)
                            MyCurrentCell.Append(CreateLabelControl(wformdev, true));
                        else
                            MyCurrentCell.Append(CreateLabelControl(wformdev, true));

                        break;
                    case TextBoxAssemblyName:
                        if (wformdev.Element("DATA_FIELDNAME").Value.ToString().Trim().Length > 0)
                            MyCurrentCell.Append(CreateTextBoxControl(wformdev, true));
                        else
                            MyCurrentCell.Append(CreateLabelControl(wformdev, true));

                        break;
                    case FileUploadAssemblyName:
                        if (wformdev.Element("DATA_FIELDNAME").Value.ToString().Trim().Length > 0)
                            MyCurrentCell.Append(CreateFileUploadControl(wformdev, true));
                        else
                            MyCurrentCell.Append(CreateLabelControl(wformdev, true));

                        break;

                    case AutoCompleteTextBoxAssemblyName:
                        if (wformdev.Element("DATA_FIELDNAME").Value.ToString().Trim().Length > 0)
                            MyCurrentCell.Append(CreateAutoCompleteTextBoxControl(wformdev, true));
                        else
                            MyCurrentCell.Append(CreateLabelControl(wformdev, true));

                        break;

                    case PasswordAssemblyName:
                        if (wformdev.Element("DATA_FIELDNAME").Value.ToString().Trim().Length > 0)
                            MyCurrentCell.Append(CreatePasswordControl(wformdev, true));
                        else
                            MyCurrentCell.Append(CreateLabelControl(wformdev, true));

                        break;
                    case CheckBoxAssemblyName:
                        if (wformdev.Element("DATA_FIELDNAME").Value.ToString().Trim().Length > 0)
                            MyCurrentCell.Append(CreateCheckBoxControl(wformdev, true));
                        else
                            MyCurrentCell.Append(CreateLabelControl(wformdev, true));
                        break;

                    case ButttonAssemblyName:
                        if (wformdev.Element("DATA_FIELDNAME").Value.ToString().Trim().Length > 0)
                            MyCurrentCell.Append(CreateButttonControl(wformdev));
                        else
                            MyCurrentCell.Append(CreateLabelControl(wformdev, true));
                        break;

                    case DropDownListAssemblyName:
                        if (wformdev.Element("DATA_FIELDNAME").Value.ToString().Trim().Length > 0)
                            MyCurrentCell.Append(CreateDropDownControl(wformdev, true));
                        else
                            MyCurrentCell.Append(CreateLabelControl(wformdev, true));

                        break;

                    case MultiControlAssemblyName:
                        MyCurrentCell.Append("<td class='" + this._DATA_CELL_CSSCLASS + "' >");
                        if (wformdev.Element("SKIN_ID").Value.ToString() == "hidecontrol")
                        {
                            MyCurrentCell.Append("<table><tr>");
                        }
                        ChildHtmlWebFormDefination = from htmlwebformdef in wformdev.Elements("MultiWebFormDefinition")
                                                     orderby (decimal)htmlwebformdef.Element("TAB_INDEX")
                                                     select htmlwebformdef;
                        //string[] AssemblyNameArray = wformdev.Element("ASSEMBLY_NAME").Value.ToString().Split(',');
                        foreach (var childformdev in ChildHtmlWebFormDefination)
                        {
                            if (wformdev.Element("SKIN_ID").Value.ToString() == "hidecontrol")
                            {
                                MyCurrentCell.Append("<td class='" + childformdev.Element("DATA_CELL_CSSCLASS").Value.ToString() + "' >");
                            }


                            switch (childformdev.Element("ASSEMBLY_NAME").Value.ToString())
                            {

                                case HiddenFieldAssemblyName:
                                    if (childformdev.Element("DATA_FIELDNAME").Value.ToString().Trim().Length > 0)
                                        MyCurrentCell.Append(CreateHiddenFieldControl(childformdev, IsMultiControl: true));
                                    else
                                        MyCurrentCell.Append(CreateLabelControl(childformdev, IsMultiControl: true));
                                    break;


                                case DateCalenderAssemblyName:
                                    if (childformdev.Element("DATA_FIELDNAME").Value.ToString().Trim().Length > 0)
                                        MyCurrentCell.Append(CreateDateCalenderControl(childformdev, IsMultiControl: true));
                                    else
                                        MyCurrentCell.Append(CreateLabelControl(childformdev, IsMultiControl: true));

                                    break;

                                case RadioButttonListAssemblyName:
                                    if (childformdev.Element("DATA_FIELDNAME").Value.ToString().Trim().Length > 0)
                                        MyCurrentCell.Append(CreateRadioButtonListControl(childformdev, IsMultiControl: true));
                                    else
                                        MyCurrentCell.Append(CreateLabelControl(childformdev, IsMultiControl: true));

                                    break;
                                case CheckBoxListAssemblyName:
                                    if (childformdev.Element("DATA_FIELDNAME").Value.ToString().Trim().Length > 0)
                                        MyCurrentCell.Append(CreateCheckBoxListControl(childformdev, IsMultiControl: true));
                                    else
                                        MyCurrentCell.Append(CreateLabelControl(childformdev, IsMultiControl: true));

                                    break;
                                case RadioAssemblyName:
                                    if (childformdev.Element("DATA_FIELDNAME").Value.ToString().Trim().Length > 0)
                                        MyCurrentCell.Append(CreateRadioButtonControl(childformdev, IsMultiControl: true));
                                    else
                                        MyCurrentCell.Append(CreateLabelControl(childformdev, IsMultiControl: true));

                                    break;
                                case LabelAssemblyName:
                                    if (childformdev.Element("DATA_FIELDNAME").Value.ToString().Trim().Length > 0)
                                        MyCurrentCell.Append(CreateLabelControl(childformdev, IsMultiControl: true));
                                    else
                                        MyCurrentCell.Append(CreateLabelControl(childformdev, IsMultiControl: true));

                                    break;
                                case TextBoxAssemblyName:
                                    if (childformdev.Element("DATA_FIELDNAME").Value.ToString().Trim().Length > 0)
                                        MyCurrentCell.Append(CreateTextBoxControl(childformdev, IsMultiControl: true));
                                    else
                                        MyCurrentCell.Append(CreateLabelControl(childformdev, IsMultiControl: true));

                                    break;
                                case FileUploadAssemblyName:
                                    if (childformdev.Element("DATA_FIELDNAME").Value.ToString().Trim().Length > 0)
                                        MyCurrentCell.Append(CreateFileUploadControl(childformdev, IsMultiControl: true));
                                    else
                                        MyCurrentCell.Append(CreateLabelControl(childformdev, IsMultiControl: true));

                                    break;

                                case AutoCompleteTextBoxAssemblyName:
                                    if (childformdev.Element("DATA_FIELDNAME").Value.ToString().Trim().Length > 0)
                                        MyCurrentCell.Append(CreateAutoCompleteTextBoxControl(childformdev, IsMultiControl: true));
                                    else
                                        MyCurrentCell.Append(CreateLabelControl(childformdev, IsMultiControl: true));

                                    break;

                                case PasswordAssemblyName:
                                    if (childformdev.Element("DATA_FIELDNAME").Value.ToString().Trim().Length > 0)
                                        MyCurrentCell.Append(CreatePasswordControl(childformdev, IsMultiControl: true));
                                    else
                                        MyCurrentCell.Append(CreateLabelControl(childformdev, IsMultiControl: true));

                                    break;
                                case CheckBoxAssemblyName:
                                    if (childformdev.Element("DATA_FIELDNAME").Value.ToString().Trim().Length > 0)
                                        MyCurrentCell.Append(CreateCheckBoxControl(childformdev, IsMultiControl: true));
                                    else
                                        MyCurrentCell.Append(CreateLabelControl(childformdev, IsMultiControl: true));
                                    break;

                                case ButttonAssemblyName:
                                    if (childformdev.Element("DATA_FIELDNAME").Value.ToString().Trim().Length > 0)
                                        MyCurrentCell.Append(CreateButttonControl(childformdev, IsMultiControl: true));
                                    else
                                        MyCurrentCell.Append(CreateLabelControl(childformdev, IsMultiControl: true));
                                    break;

                                case DropDownListAssemblyName:
                                    if (childformdev.Element("DATA_FIELDNAME").Value.ToString().Trim().Length > 0)
                                        MyCurrentCell.Append(CreateDropDownControl(childformdev, IsMultiControl: true));
                                    else
                                        MyCurrentCell.Append(CreateLabelControl(childformdev, IsMultiControl: true));

                                    break;

                                default:
                                    break;
                            }
                            MyCurrentCell.Append("&nbsp;");
                            if (wformdev.Element("SKIN_ID").Value.ToString() == "hidecontrol")
                            {
                                MyCurrentCell.Append("</td>");
                            }
                        }
                        if (wformdev.Element("SKIN_ID").Value.ToString() == "hidecontrol")
                        {
                            MyCurrentCell.Append("</tr></table></td>");
                        }
                        else
                        {
                            MyCurrentCell.Append("</td>");
                        }
                        break;
                    default:
                        break;
                }
            }

            string snoValueColumn = "";
            snoValueColumn = "<td id='tdSNoCol' class='formSNo'>" + (this.objIndex + 1).ToString() + "</td>";
            if (TransFormAction.ToUpper() == "EDIT" || TransFormAction.ToUpper() == "NEW")
            {
                string actionColumn = "";
                actionColumn = BuildTransToolBar(TransName, "0").ToString();
                MyCurrentRow.Append(snoValueColumn + MyCurrentCell.ToString() + actionColumn);
            }
            else
            {
                MyCurrentRow.Append(snoValueColumn + MyCurrentCell.ToString());
            }
            HtmlTransBuilder.Append(MyCurrentRow.ToString());
        }
        #endregion

        #region BuildFormBody
        private void BuildFormBody()
        {
            //Check if Business Data table is assigned
            //If not assigned then raise exception
            if (this.HtmlWebFormDefination == null)
                throw new Exception("NULL HtmlWebFormDefination! HtmlWebFormDefination is required.");


            StringBuilder MyCurrentCell = new StringBuilder();
            StringBuilder MyCurrentRow = new StringBuilder();
            StringBuilder MyDivArea = new StringBuilder();

            int LayoutCount = 1;
            int CreatedControlCount = 0;
            int i = 0;
            String[] ListCellControl = null;
            bool IsSingleCellControl = false;
            string FirstIndex = "";
            int CurrentCellTotal = 0;
            int RowLength = 1;
            bool flag = false;
            bool prevTab = false;
            bool tabInitiated = true;

            foreach (var wformdev in HtmlWebFormDefination)
            {
                //Check ASSEMBLY_NAME of this row is blank then raise error.
                if (wformdev.Element("ASSEMBLY_NAME").Value.ToString().Trim().Length == 0)
                    throw new Exception("NULL ASSEMBLY_NAME! ASSEMBLY_NAME is required.");
                flag = true;
                IsSingleCellControl = false;

                ListCellControl = wformdev.Element("DISPLAY_ORDER").Value.ToString().Replace(".00", "").Split('.');

                #region CONTROL INITIATED

                bool _controlInitiated = true;
                bool _sectionInitiated = true;
                bool _tabInitiated = true;
                string _assemblyName = "";
                _assemblyName = wformdev.Element("ASSEMBLY_NAME").Value.ToString();
                string SECTION_NAME = wformdev.Element("SECTION_NAME").Value.ToString();
                string SECTION_ID = "";
                try
                {
                    SECTION_ID = wformdev.Element("SECTION_ID").Value.ToString();
                }
                catch
                {
                    SECTION_ID = "";
                }
                string TAB_ID = "";
                try
                {
                    TAB_ID = wformdev.Element("TAB_ID").Value.ToString();
                }
                catch
                {
                    TAB_ID = "";
                }
                string TAB_NAME = "";
                try
                {
                    TAB_NAME = wformdev.Element("TAB_NAME").Value.ToString();
                }
                catch
                {
                    TAB_NAME = "";
                }
                if (this.objStructureModify != null && this.objStructureModify.Rows.Count > 0)
                {
                    DataRow[] drStructureModify = this.objStructureModify.Select("HTML_CONTROL_ID='" + wformdev.Element("HTML_CONTROL_ID").Value.ToString().Trim() + "'");
                    if (drStructureModify != null && drStructureModify.Length > 0)
                    {
                        if (!string.IsNullOrWhiteSpace(drStructureModify[0]["CONTROL_INITIATED"].ToString()))
                            _controlInitiated = Convert.ToBoolean(drStructureModify[0]["CONTROL_INITIATED"].ToString().ToLower());
                        if (!string.IsNullOrWhiteSpace(drStructureModify[0]["ASSEMBLY_NAME"].ToString()))
                            _assemblyName = drStructureModify[0]["ASSEMBLY_NAME"].ToString();
                        if (!string.IsNullOrWhiteSpace(drStructureModify[0]["SECTION_NAME"].ToString()))
                            SECTION_NAME = drStructureModify[0]["SECTION_NAME"].ToString();
                        if (!string.IsNullOrWhiteSpace(drStructureModify[0]["SECTION_ID"].ToString()))
                            SECTION_ID = drStructureModify[0]["SECTION_ID"].ToString();
                        if (!string.IsNullOrWhiteSpace(drStructureModify[0]["SECTION_INITIATED"].ToString()))
                            _sectionInitiated = Convert.ToBoolean(drStructureModify[0]["SECTION_INITIATED"].ToString().ToLower());
                        if (!string.IsNullOrWhiteSpace(drStructureModify[0]["TAB_ID"].ToString()))
                            TAB_ID = drStructureModify[0]["TAB_ID"].ToString();
                        if (!string.IsNullOrWhiteSpace(drStructureModify[0]["TAB_NAME"].ToString()))
                            TAB_NAME = drStructureModify[0]["TAB_NAME"].ToString();
                        if (!string.IsNullOrWhiteSpace(drStructureModify[0]["TAB_INITIATED"].ToString()))
                            _tabInitiated = Convert.ToBoolean(drStructureModify[0]["TAB_INITIATED"].ToString().ToLower());
                    }
                }

                #endregion

                if (FirstIndex.Trim() == ListCellControl[0].ToString().Trim())
                {
                    CurrentCellTotal++;
                    IsSingleCellControl = true;
                }
                else
                {
                    FirstIndex = ListCellControl[0].ToString();
                    //if (wformdev.Element("CONTROL_TOTAL").Value.ToString() != "")
                    //    RowLength = int.Parse(wformdev.Element("CONTROL_TOTAL").Value.ToString());
                    //else
                    RowLength = 1;

                    CurrentCellTotal = 1;
                }
                if ((TAB_NAME.Trim().Length > 0 || TAB_ID.Trim().Length > 0) && _tabInitiated == true)
                {
                    if (IsSingleCellControl == false)
                    {
                        if (this.SectionCssClass == "")
                            this.SectionCssClass = this.HeadingCssClass;
                        if (prevTab)
                        {
                            MyCurrentRow.Append("</table></div></div>");
                        }
                        MyCurrentRow.Append("<div " + (TAB_ID != "" ? "id='__tab_" + _AppID + "_" + TAB_ID + "__'" : "") + "><div><table class='WebFormTable'> " + ((SECTION_NAME.Trim().Length > 0) ? "" : ("<tr><td class='" + this.SectionCssClass + "' colspan='" + this.ColumnSpanCount + "' " + (TAB_ID != "" ? "id='__section_" + _AppID + "_" + TAB_ID + "__'" : "") + ">" + TAB_NAME + "</td></tr>")));
                    }
                    if (tabInitiated)
                    {
                        MyDivArea.Append("<div id='__appTab_" + _AppID + "__'><ul>");
                        MyDivArea.Append("<li  id='__liTab_" + _AppID + "_" + TAB_ID + "__' class='k-state-active'>" + TAB_NAME + "</li>");
                        tabInitiated = false;
                    }
                    else
                    {
                        MyDivArea.Append("<li  id='__liTab_" + _AppID + "_" + TAB_ID + "__'>" + TAB_NAME + "</li>");
                    }
                    prevTab = true;
                }
                if (SECTION_NAME.Trim().Length > 0 && _sectionInitiated == true)
                {
                    if (IsSingleCellControl == false)
                    {
                        if (this.SectionCssClass == "")
                            this.SectionCssClass = this.HeadingCssClass;

                        MyCurrentRow.Append("<tr><td class='" + this.SectionCssClass + "' colspan='" + this.ColumnSpanCount + "' " + (SECTION_ID != "" ? "id='__section_" + SECTION_ID + "__'" : "") + ">" + SECTION_NAME + "</td></tr>");
                    }
                }
                //ImageLabelAssemblyName

                if (_controlInitiated)
                {
                    #region Control Created
                    switch (_assemblyName)
                    {
                        case HiddenFieldAssemblyName:
                            if (IsSingleCellControl == false)
                                MyCurrentCell.Append(CreateCellLabel(wformdev));

                            if (wformdev.Element("DATA_FIELDNAME").Value.ToString().Trim().Length > 0)
                                MyCurrentCell.Append(CreateHiddenFieldControl(wformdev));
                            else
                                MyCurrentCell.Append(CreateLabelControl(wformdev));
                            break;


                        case DateCalenderAssemblyName:
                            if (IsSingleCellControl == false)
                                MyCurrentCell.Append(CreateCellLabel(wformdev));

                            if (wformdev.Element("DATA_FIELDNAME").Value.ToString().Trim().Length > 0)
                                MyCurrentCell.Append(CreateDateCalenderControl(wformdev));
                            else
                                MyCurrentCell.Append(CreateLabelControl(wformdev));

                            break;

                        case RadioButttonListAssemblyName:
                            if (IsSingleCellControl == false)
                                MyCurrentCell.Append(CreateCellLabel(wformdev));

                            if (wformdev.Element("DATA_FIELDNAME").Value.ToString().Trim().Length > 0)
                                MyCurrentCell.Append(CreateRadioButtonListControl(wformdev));
                            else
                                MyCurrentCell.Append(CreateLabelControl(wformdev));

                            break;
                        case CheckBoxListAssemblyName:
                            if (IsSingleCellControl == false)
                                MyCurrentCell.Append(CreateCellLabel(wformdev));

                            if (wformdev.Element("DATA_FIELDNAME").Value.ToString().Trim().Length > 0)
                                MyCurrentCell.Append(CreateCheckBoxListControl(wformdev));
                            else
                                MyCurrentCell.Append(CreateLabelControl(wformdev));

                            break;
                        case RadioAssemblyName:
                            if (IsSingleCellControl == false)
                                MyCurrentCell.Append(CreateCellLabel(wformdev));

                            if (wformdev.Element("DATA_FIELDNAME").Value.ToString().Trim().Length > 0)
                                MyCurrentCell.Append(CreateRadioButtonControl(wformdev));
                            else
                                MyCurrentCell.Append(CreateLabelControl(wformdev));

                            break;
                        case LabelAssemblyName:
                            if (IsSingleCellControl == false)
                                MyCurrentCell.Append(CreateCellLabel(wformdev));

                            if (wformdev.Element("DATA_FIELDNAME").Value.ToString().Trim().Length > 0)
                                MyCurrentCell.Append(CreateLabelControl(wformdev));
                            else
                                MyCurrentCell.Append(CreateLabelControl(wformdev));

                            break;
                        case TextBoxAssemblyName:
                            if (IsSingleCellControl == false)
                                MyCurrentCell.Append(CreateCellLabel(wformdev));


                            if (wformdev.Element("DATA_FIELDNAME").Value.ToString().Trim().Length > 0)
                                MyCurrentCell.Append(CreateTextBoxControl(wformdev));
                            else
                                MyCurrentCell.Append(CreateLabelControl(wformdev));

                            break;
                        case FileUploadAssemblyName:
                            if (IsSingleCellControl == false)
                                MyCurrentCell.Append(CreateCellLabel(wformdev));


                            if (wformdev.Element("DATA_FIELDNAME").Value.ToString().Trim().Length > 0)
                                MyCurrentCell.Append(CreateFileUploadControl(wformdev));
                            else
                                MyCurrentCell.Append(CreateLabelControl(wformdev));

                            break;

                        case AutoCompleteTextBoxAssemblyName:
                            if (IsSingleCellControl == false)
                                MyCurrentCell.Append(CreateCellLabel(wformdev));


                            if (wformdev.Element("DATA_FIELDNAME").Value.ToString().Trim().Length > 0)
                                MyCurrentCell.Append(CreateAutoCompleteTextBoxControl(wformdev));
                            else
                                MyCurrentCell.Append(CreateLabelControl(wformdev));

                            break;

                        case PasswordAssemblyName:
                            if (IsSingleCellControl == false)
                                MyCurrentCell.Append(CreateCellLabel(wformdev));

                            if (wformdev.Element("DATA_FIELDNAME").Value.ToString().Trim().Length > 0)
                                MyCurrentCell.Append(CreatePasswordControl(wformdev));
                            else
                                MyCurrentCell.Append(CreateLabelControl(wformdev));

                            break;
                        case CheckBoxAssemblyName:
                            if (IsSingleCellControl == false)
                                MyCurrentCell.Append(CreateCellLabel(wformdev));

                            if (wformdev.Element("DATA_FIELDNAME").Value.ToString().Trim().Length > 0)
                                MyCurrentCell.Append(CreateCheckBoxControl(wformdev));
                            else
                                MyCurrentCell.Append(CreateLabelControl(wformdev));
                            break;

                        case ButttonAssemblyName:
                            if (IsSingleCellControl == false)
                                MyCurrentCell.Append(CreateCellLabel(wformdev, true));


                            if (wformdev.Element("DATA_FIELDNAME").Value.ToString().Trim().Length > 0)
                                MyCurrentCell.Append(CreateButttonControl(wformdev));
                            else
                                MyCurrentCell.Append(CreateLabelControl(wformdev));
                            break;

                        case DropDownListAssemblyName:
                            if (IsSingleCellControl == false)
                                MyCurrentCell.Append(CreateCellLabel(wformdev));

                            if (wformdev.Element("DATA_FIELDNAME").Value.ToString().Trim().Length > 0)
                                MyCurrentCell.Append(CreateDropDownControl(wformdev));
                            else
                                MyCurrentCell.Append(CreateLabelControl(wformdev));

                            break;
                        case MultiControlAssemblyName:
                            if (IsSingleCellControl == false)
                                MyCurrentCell.Append(CreateCellLabel(wformdev));
                            MyCurrentCell.Append("<td class='" + this._DATA_CELL_CSSCLASS + "' >");
                            if (wformdev.Element("SKIN_ID").Value.ToString() == "hidecontrol")
                            {
                                MyCurrentCell.Append("<table class=' '><tr>");
                            }
                            ChildHtmlWebFormDefination = from htmlwebformdef in wformdev.Elements("MultiWebFormDefinition")
                                                         orderby (decimal)htmlwebformdef.Element("TAB_INDEX")
                                                         select htmlwebformdef;
                            //string[] AssemblyNameArray = wformdev.Element("ASSEMBLY_NAME").Value.ToString().Split(',');
                            foreach (var childformdev in ChildHtmlWebFormDefination)
                            {
                                if (wformdev.Element("SKIN_ID").Value.ToString() == "hidecontrol")
                                {
                                    MyCurrentCell.Append("<td class='" + childformdev.Element("DATA_CELL_CSSCLASS").Value.ToString() + "' >");
                                }


                                switch (childformdev.Element("ASSEMBLY_NAME").Value.ToString())
                                {

                                    case HiddenFieldAssemblyName:
                                        if (childformdev.Element("DATA_FIELDNAME").Value.ToString().Trim().Length > 0)
                                            MyCurrentCell.Append(CreateHiddenFieldControl(childformdev, IsMultiControl: true));
                                        else
                                            MyCurrentCell.Append(CreateLabelControl(childformdev, IsMultiControl: true));
                                        break;


                                    case DateCalenderAssemblyName:
                                        if (childformdev.Element("DATA_FIELDNAME").Value.ToString().Trim().Length > 0)
                                            MyCurrentCell.Append(CreateDateCalenderControl(childformdev, IsMultiControl: true));
                                        else
                                            MyCurrentCell.Append(CreateLabelControl(childformdev, IsMultiControl: true));

                                        break;

                                    case RadioButttonListAssemblyName:
                                        if (childformdev.Element("DATA_FIELDNAME").Value.ToString().Trim().Length > 0)
                                            MyCurrentCell.Append(CreateRadioButtonListControl(childformdev, IsMultiControl: true));
                                        else
                                            MyCurrentCell.Append(CreateLabelControl(childformdev, IsMultiControl: true));

                                        break;
                                    case CheckBoxListAssemblyName:
                                        if (childformdev.Element("DATA_FIELDNAME").Value.ToString().Trim().Length > 0)
                                            MyCurrentCell.Append(CreateCheckBoxListControl(childformdev, IsMultiControl: true));
                                        else
                                            MyCurrentCell.Append(CreateLabelControl(childformdev, IsMultiControl: true));

                                        break;
                                    case RadioAssemblyName:
                                        if (childformdev.Element("DATA_FIELDNAME").Value.ToString().Trim().Length > 0)
                                            MyCurrentCell.Append(CreateRadioButtonControl(childformdev, IsMultiControl: true));
                                        else
                                            MyCurrentCell.Append(CreateLabelControl(childformdev, IsMultiControl: true));

                                        break;
                                    case LabelAssemblyName:
                                        if (childformdev.Element("DATA_FIELDNAME").Value.ToString().Trim().Length > 0)
                                            MyCurrentCell.Append(CreateLabelControl(childformdev, IsMultiControl: true));
                                        else
                                            MyCurrentCell.Append(CreateLabelControl(childformdev, IsMultiControl: true));

                                        break;
                                    case TextBoxAssemblyName:
                                        if (childformdev.Element("DATA_FIELDNAME").Value.ToString().Trim().Length > 0)
                                            MyCurrentCell.Append(CreateTextBoxControl(childformdev, IsMultiControl: true));
                                        else
                                            MyCurrentCell.Append(CreateLabelControl(childformdev, IsMultiControl: true));

                                        break;
                                    case FileUploadAssemblyName:
                                        if (childformdev.Element("DATA_FIELDNAME").Value.ToString().Trim().Length > 0)
                                            MyCurrentCell.Append(CreateFileUploadControl(childformdev, IsMultiControl: true));
                                        else
                                            MyCurrentCell.Append(CreateLabelControl(childformdev, IsMultiControl: true));

                                        break;

                                    case AutoCompleteTextBoxAssemblyName:
                                        if (childformdev.Element("DATA_FIELDNAME").Value.ToString().Trim().Length > 0)
                                            MyCurrentCell.Append(CreateAutoCompleteTextBoxControl(childformdev, IsMultiControl: true));
                                        else
                                            MyCurrentCell.Append(CreateLabelControl(childformdev, IsMultiControl: true));

                                        break;

                                    case PasswordAssemblyName:
                                        if (childformdev.Element("DATA_FIELDNAME").Value.ToString().Trim().Length > 0)
                                            MyCurrentCell.Append(CreatePasswordControl(childformdev, IsMultiControl: true));
                                        else
                                            MyCurrentCell.Append(CreateLabelControl(childformdev, IsMultiControl: true));

                                        break;
                                    case CheckBoxAssemblyName:
                                        if (childformdev.Element("DATA_FIELDNAME").Value.ToString().Trim().Length > 0)
                                            MyCurrentCell.Append(CreateCheckBoxControl(childformdev, IsMultiControl: true));
                                        else
                                            MyCurrentCell.Append(CreateLabelControl(childformdev, IsMultiControl: true));
                                        break;

                                    case ButttonAssemblyName:
                                        if (childformdev.Element("DATA_FIELDNAME").Value.ToString().Trim().Length > 0)
                                            MyCurrentCell.Append(CreateButttonControl(childformdev, IsMultiControl: true));
                                        else
                                            MyCurrentCell.Append(CreateLabelControl(childformdev, IsMultiControl: true));
                                        break;

                                    case DropDownListAssemblyName:
                                        if (childformdev.Element("DATA_FIELDNAME").Value.ToString().Trim().Length > 0)
                                            MyCurrentCell.Append(CreateDropDownControl(childformdev, IsMultiControl: true));
                                        else
                                            MyCurrentCell.Append(CreateLabelControl(childformdev, IsMultiControl: true));

                                        break;

                                    default:
                                        break;
                                }
                                MyCurrentCell.Append("&nbsp;");
                                if (wformdev.Element("SKIN_ID").Value.ToString() == "hidecontrol")
                                {
                                    MyCurrentCell.Append("</td>");
                                }
                            }
                            if (wformdev.Element("SKIN_ID").Value.ToString() == "hidecontrol")
                            {
                                MyCurrentCell.Append("</tr></table></td>");
                            }
                            else
                            {
                                MyCurrentCell.Append("</td>");
                            }
                            break;
                        default:
                            break;
                    }
                    #endregion
                    CreatedControlCount++;
                }

                if (CurrentCellTotal == RowLength)
                {
                    if (this.ColumnSpanCount == 2)
                    {
                        if (CreatedControlCount > 0)
                        {
                            MyCurrentRow.Append("<tr>" + MyCurrentCell.ToString() + "</tr>");
                            CreatedControlCount = 0;
                        }
                        MyCurrentCell = new StringBuilder();
                    }
                    else if (this.ColumnSpanCount == 4)
                    {
                        if (LayoutCount == 2)
                        {
                            flag = false;
                            MyCurrentRow.Append("<tr>" + MyCurrentCell.ToString() + "</tr>");
                            MyCurrentCell = new StringBuilder();
                            LayoutCount = 0;
                        }

                        LayoutCount++;
                    }
                    else if (this.ColumnSpanCount == 6)
                    {
                        if (LayoutCount == 3)
                        {
                            flag = false;
                            MyCurrentRow.Append("<tr>" + MyCurrentCell.ToString() + "</tr>");
                            MyCurrentCell = new StringBuilder();
                            LayoutCount = 0;
                        }

                        LayoutCount++;
                    }
                    else
                    {
                        if (LayoutCount == 4)
                        {
                            flag = false;
                            MyCurrentRow.Append("<tr>" + MyCurrentCell.ToString() + "</tr>");
                            MyCurrentCell = new StringBuilder();
                            LayoutCount = 0;
                        }

                        LayoutCount++;
                    }
                    i++;
                }
            }
            if (LayoutCount == 2 && flag == true)
            {
                MyCurrentRow.Append("<tr>" + MyCurrentCell.ToString() + "</tr>");
                MyCurrentCell = new StringBuilder();
            }
            if (MyDivArea.ToString() != "")
            {
                this.HtmlFormBuilder.Append("<tr><td> " + MyDivArea.ToString() + "</ul>" + MyCurrentRow.ToString() + "</table></div></div></div></td></tr>");
            }
            else
                this.HtmlFormBuilder.Append(MyCurrentRow.ToString());
        }
        #endregion


        #region MakeFormBody
        private string MakeFormBody()
        {
            //Check if Business Data table is assigned
            //If not assigned then raise exception
            if (this.HtmlWebFormDefination == null)
                throw new Exception("NULL HtmlWebFormDefination! HtmlWebFormDefination is required.");


            StringBuilder MyCurrentCell = new StringBuilder();
            StringBuilder MyCurrentRow = new StringBuilder();
            StringBuilder MyDivArea = new StringBuilder();

            int LayoutCount = 1;
            int CreatedControlCount = 0;
            int i = 0;
            String[] ListCellControl = null;
            bool IsSingleCellControl = false;
            string FirstIndex = "";
            int CurrentCellTotal = 0;
            int RowLength = 1;
            bool flag = false;
            bool prevTab = false;
            bool tabInitiated = true;

            foreach (var wformdev in HtmlWebFormDefination)
            {
                //Check ASSEMBLY_NAME of this row is blank then raise error.
                if (wformdev.Element("ASSEMBLY_NAME").Value.ToString().Trim().Length == 0)
                    throw new Exception("NULL ASSEMBLY_NAME! ASSEMBLY_NAME is required.");
                flag = true;
                IsSingleCellControl = false;

                ListCellControl = wformdev.Element("DISPLAY_ORDER").Value.ToString().Replace(".00", "").Split('.');

                #region CONTROL INITIATED

                bool _controlInitiated = true;
                bool _sectionInitiated = true;
                bool _tabInitiated = true;
                string _assemblyName = "";
                _assemblyName = wformdev.Element("ASSEMBLY_NAME").Value.ToString();
                string SECTION_NAME = wformdev.Element("SECTION_NAME").Value.ToString();
                string SECTION_ID = "";
                try
                {
                    SECTION_ID = wformdev.Element("SECTION_ID").Value.ToString();
                }
                catch
                {
                    SECTION_ID = "";
                }
                string TAB_ID = "";
                try
                {
                    TAB_ID = wformdev.Element("TAB_ID").Value.ToString();
                }
                catch
                {
                    TAB_ID = "";
                }
                string TAB_NAME = "";
                try
                {
                    TAB_NAME = wformdev.Element("TAB_NAME").Value.ToString();
                }
                catch
                {
                    TAB_NAME = "";
                }
                if (this.objStructureModify != null && this.objStructureModify.Rows.Count > 0)
                {
                    DataRow[] drStructureModify = this.objStructureModify.Select("HTML_CONTROL_ID='" + wformdev.Element("HTML_CONTROL_ID").Value.ToString().Trim() + "'");
                    if (drStructureModify != null && drStructureModify.Length > 0)
                    {
                        if (!string.IsNullOrWhiteSpace(drStructureModify[0]["CONTROL_INITIATED"].ToString()))
                            _controlInitiated = Convert.ToBoolean(drStructureModify[0]["CONTROL_INITIATED"].ToString().ToLower());
                        if (!string.IsNullOrWhiteSpace(drStructureModify[0]["ASSEMBLY_NAME"].ToString()))
                            _assemblyName = drStructureModify[0]["ASSEMBLY_NAME"].ToString();
                        if (!string.IsNullOrWhiteSpace(drStructureModify[0]["SECTION_NAME"].ToString()))
                            SECTION_NAME = drStructureModify[0]["SECTION_NAME"].ToString();
                        if (!string.IsNullOrWhiteSpace(drStructureModify[0]["SECTION_ID"].ToString()))
                            SECTION_ID = drStructureModify[0]["SECTION_ID"].ToString();
                        if (!string.IsNullOrWhiteSpace(drStructureModify[0]["SECTION_INITIATED"].ToString()))
                            _sectionInitiated = Convert.ToBoolean(drStructureModify[0]["SECTION_INITIATED"].ToString().ToLower());
                        if (!string.IsNullOrWhiteSpace(drStructureModify[0]["TAB_ID"].ToString()))
                            TAB_ID = drStructureModify[0]["TAB_ID"].ToString();
                        if (!string.IsNullOrWhiteSpace(drStructureModify[0]["TAB_NAME"].ToString()))
                            TAB_NAME = drStructureModify[0]["TAB_NAME"].ToString();
                        if (!string.IsNullOrWhiteSpace(drStructureModify[0]["TAB_INITIATED"].ToString()))
                            _tabInitiated = Convert.ToBoolean(drStructureModify[0]["TAB_INITIATED"].ToString().ToLower());
                    }
                }

                #endregion

                if (FirstIndex.Trim() == ListCellControl[0].ToString().Trim())
                {
                    CurrentCellTotal++;
                    IsSingleCellControl = true;
                }
                else
                {
                    FirstIndex = ListCellControl[0].ToString();
                    //if (wformdev.Element("CONTROL_TOTAL").Value.ToString() != "")
                    //    RowLength = int.Parse(wformdev.Element("CONTROL_TOTAL").Value.ToString());
                    //else
                    RowLength = 1;

                    CurrentCellTotal = 1;
                }
                if ((TAB_NAME.Trim().Length > 0 || TAB_ID.Trim().Length > 0) && _tabInitiated == true)
                {
                    if (IsSingleCellControl == false)
                    {
                        if (this.SectionCssClass == "")
                            this.SectionCssClass = this.HeadingCssClass;
                        if (prevTab)
                        {
                            MyCurrentRow.Append("</table></div></div>");
                        }
                        MyCurrentRow.Append("<div " + (TAB_ID != "" ? "id='__tab_" + _AppID + "_" + TAB_ID + "__'" : "") + "><div><table class='WebFormTable'> " + ((SECTION_NAME.Trim().Length > 0) ? "" : ("<tr><td class='" + this.SectionCssClass + "' colspan='" + this.ColumnSpanCount + "' " + (TAB_ID != "" ? "id='__section_" + _AppID + "_" + TAB_ID + "__'" : "") + ">" + TAB_NAME + "</td></tr>")));
                    }
                    if (tabInitiated)
                    {
                        MyDivArea.Append("<div id='__appTab_" + _AppID + "__'><ul>");
                        MyDivArea.Append("<li  id='__liTab_" + _AppID + "_" + TAB_ID + "__' class='k-state-active'>" + TAB_NAME + "</li>");
                        tabInitiated = false;
                    }
                    else
                    {
                        MyDivArea.Append("<li  id='__liTab_" + _AppID + "_" + TAB_ID + "__'>" + TAB_NAME + "</li>");
                    }
                    prevTab = true;
                }
                if (SECTION_NAME.Trim().Length > 0 && _sectionInitiated == true)
                {
                    if (IsSingleCellControl == false)
                    {
                        if (this.SectionCssClass == "")
                            this.SectionCssClass = this.HeadingCssClass;

                        MyCurrentRow.Append("<tr><td class='" + this.SectionCssClass + "' colspan='" + this.ColumnSpanCount + "' " + (SECTION_ID != "" ? "id='__section_" + SECTION_ID + "__'" : "") + ">" + SECTION_NAME + "</td></tr>");
                    }
                }
                //ImageLabelAssemblyName

                if (_controlInitiated)
                {
                    #region Control Created
                    switch (_assemblyName)
                    {
                        case HiddenFieldAssemblyName:
                            if (IsSingleCellControl == false)
                                MyCurrentCell.Append(CreateCellLabel(wformdev));

                            if (wformdev.Element("DATA_FIELDNAME").Value.ToString().Trim().Length > 0)
                                MyCurrentCell.Append(CreateHiddenFieldControl(wformdev));
                            else
                                MyCurrentCell.Append(CreateLabelControl(wformdev));
                            break;


                        case DateCalenderAssemblyName:
                            if (IsSingleCellControl == false)
                                MyCurrentCell.Append(CreateCellLabel(wformdev));

                            if (wformdev.Element("DATA_FIELDNAME").Value.ToString().Trim().Length > 0)
                                MyCurrentCell.Append(CreateDateCalenderControl(wformdev));
                            else
                                MyCurrentCell.Append(CreateLabelControl(wformdev));

                            break;

                        case RadioButttonListAssemblyName:
                            if (IsSingleCellControl == false)
                                MyCurrentCell.Append(CreateCellLabel(wformdev));

                            if (wformdev.Element("DATA_FIELDNAME").Value.ToString().Trim().Length > 0)
                                MyCurrentCell.Append(CreateRadioButtonListControl(wformdev));
                            else
                                MyCurrentCell.Append(CreateLabelControl(wformdev));

                            break;
                        case CheckBoxListAssemblyName:
                            if (IsSingleCellControl == false)
                                MyCurrentCell.Append(CreateCellLabel(wformdev));

                            if (wformdev.Element("DATA_FIELDNAME").Value.ToString().Trim().Length > 0)
                                MyCurrentCell.Append(CreateCheckBoxListControl(wformdev));
                            else
                                MyCurrentCell.Append(CreateLabelControl(wformdev));

                            break;
                        case RadioAssemblyName:
                            if (IsSingleCellControl == false)
                                MyCurrentCell.Append(CreateCellLabel(wformdev));

                            if (wformdev.Element("DATA_FIELDNAME").Value.ToString().Trim().Length > 0)
                                MyCurrentCell.Append(CreateRadioButtonControl(wformdev));
                            else
                                MyCurrentCell.Append(CreateLabelControl(wformdev));

                            break;
                        case LabelAssemblyName:
                            if (IsSingleCellControl == false)
                                MyCurrentCell.Append(CreateCellLabel(wformdev, assemblyname: (this.ColumnSpanCount == 16 ? LabelAssemblyName : "")));

                            if (wformdev.Element("DATA_FIELDNAME").Value.ToString().Trim().Length > 0)
                                MyCurrentCell.Append(CreateLabelControl(wformdev, assemblyname: (this.ColumnSpanCount == 16 ? LabelAssemblyName : "")));
                            else
                                MyCurrentCell.Append(CreateLabelControl(wformdev, assemblyname: (this.ColumnSpanCount == 16 ? LabelAssemblyName : "")));

                            break;
                        case TextBoxAssemblyName:
                            if (IsSingleCellControl == false)
                                MyCurrentCell.Append(CreateCellLabel(wformdev));


                            if (wformdev.Element("DATA_FIELDNAME").Value.ToString().Trim().Length > 0)
                                MyCurrentCell.Append(CreateTextBoxControl(wformdev));
                            else
                                MyCurrentCell.Append(CreateLabelControl(wformdev));

                            break;
                        case FileUploadAssemblyName:
                            if (IsSingleCellControl == false)
                                MyCurrentCell.Append(CreateCellLabel(wformdev));


                            if (wformdev.Element("DATA_FIELDNAME").Value.ToString().Trim().Length > 0)
                                MyCurrentCell.Append(CreateFileUploadControl(wformdev));
                            else
                                MyCurrentCell.Append(CreateLabelControl(wformdev));

                            break;

                        case AutoCompleteTextBoxAssemblyName:
                            if (IsSingleCellControl == false)
                                MyCurrentCell.Append(CreateCellLabel(wformdev));


                            if (wformdev.Element("DATA_FIELDNAME").Value.ToString().Trim().Length > 0)
                                MyCurrentCell.Append(CreateAutoCompleteTextBoxControl(wformdev));
                            else
                                MyCurrentCell.Append(CreateLabelControl(wformdev));

                            break;

                        case PasswordAssemblyName:
                            if (IsSingleCellControl == false)
                                MyCurrentCell.Append(CreateCellLabel(wformdev));

                            if (wformdev.Element("DATA_FIELDNAME").Value.ToString().Trim().Length > 0)
                                MyCurrentCell.Append(CreatePasswordControl(wformdev));
                            else
                                MyCurrentCell.Append(CreateLabelControl(wformdev));

                            break;
                        case CheckBoxAssemblyName:
                            if (IsSingleCellControl == false)
                                MyCurrentCell.Append(CreateCellLabel(wformdev));

                            if (wformdev.Element("DATA_FIELDNAME").Value.ToString().Trim().Length > 0)
                                MyCurrentCell.Append(CreateCheckBoxControl(wformdev));
                            else
                                MyCurrentCell.Append(CreateLabelControl(wformdev));
                            break;

                        case ButttonAssemblyName:
                            if (IsSingleCellControl == false)
                                MyCurrentCell.Append(CreateCellLabel(wformdev, true));


                            if (wformdev.Element("DATA_FIELDNAME").Value.ToString().Trim().Length > 0)
                                MyCurrentCell.Append(CreateButttonControl(wformdev, btnCss: wformdev.Element("DATA_FIELD_CSSCLASS").Value.ToString().Trim()));
                            else
                                MyCurrentCell.Append(CreateLabelControl(wformdev));
                            break;

                        case DropDownListAssemblyName:
                            if (IsSingleCellControl == false)
                                MyCurrentCell.Append(CreateCellLabel(wformdev));

                            if (wformdev.Element("DATA_FIELDNAME").Value.ToString().Trim().Length > 0)
                                MyCurrentCell.Append(CreateDropDownControl(wformdev));
                            else
                                MyCurrentCell.Append(CreateLabelControl(wformdev));

                            break;
                        case MultiControlAssemblyName:
                            if (IsSingleCellControl == false)
                                MyCurrentCell.Append(CreateCellLabel(wformdev));
                            MyCurrentCell.Append("<td class='" + this._DATA_CELL_CSSCLASS + "' >");
                            if (wformdev.Element("SKIN_ID").Value.ToString() == "hidecontrol")
                            {
                                MyCurrentCell.Append("<table class=' '><tr>");
                            }
                            ChildHtmlWebFormDefination = from htmlwebformdef in wformdev.Elements("MultiWebFormDefinition")
                                                         orderby (decimal)htmlwebformdef.Element("TAB_INDEX")
                                                         select htmlwebformdef;
                            //string[] AssemblyNameArray = wformdev.Element("ASSEMBLY_NAME").Value.ToString().Split(',');
                            foreach (var childformdev in ChildHtmlWebFormDefination)
                            {
                                if (wformdev.Element("SKIN_ID").Value.ToString() == "hidecontrol")
                                {
                                    MyCurrentCell.Append("<td class='" + childformdev.Element("DATA_CELL_CSSCLASS").Value.ToString() + "' >");
                                }


                                switch (childformdev.Element("ASSEMBLY_NAME").Value.ToString())
                                {

                                    case HiddenFieldAssemblyName:
                                        if (childformdev.Element("DATA_FIELDNAME").Value.ToString().Trim().Length > 0)
                                            MyCurrentCell.Append(CreateHiddenFieldControl(childformdev, IsMultiControl: true));
                                        else
                                            MyCurrentCell.Append(CreateLabelControl(childformdev, IsMultiControl: true));
                                        break;


                                    case DateCalenderAssemblyName:
                                        if (childformdev.Element("DATA_FIELDNAME").Value.ToString().Trim().Length > 0)
                                            MyCurrentCell.Append(CreateDateCalenderControl(childformdev, IsMultiControl: true));
                                        else
                                            MyCurrentCell.Append(CreateLabelControl(childformdev, IsMultiControl: true));

                                        break;

                                    case RadioButttonListAssemblyName:
                                        if (childformdev.Element("DATA_FIELDNAME").Value.ToString().Trim().Length > 0)
                                            MyCurrentCell.Append(CreateRadioButtonListControl(childformdev, IsMultiControl: true));
                                        else
                                            MyCurrentCell.Append(CreateLabelControl(childformdev, IsMultiControl: true));

                                        break;
                                    case CheckBoxListAssemblyName:
                                        if (childformdev.Element("DATA_FIELDNAME").Value.ToString().Trim().Length > 0)
                                            MyCurrentCell.Append(CreateCheckBoxListControl(childformdev, IsMultiControl: true));
                                        else
                                            MyCurrentCell.Append(CreateLabelControl(childformdev, IsMultiControl: true));

                                        break;
                                    case RadioAssemblyName:
                                        if (childformdev.Element("DATA_FIELDNAME").Value.ToString().Trim().Length > 0)
                                            MyCurrentCell.Append(CreateRadioButtonControl(childformdev, IsMultiControl: true));
                                        else
                                            MyCurrentCell.Append(CreateLabelControl(childformdev, IsMultiControl: true));

                                        break;
                                    case LabelAssemblyName:
                                        if (childformdev.Element("DATA_FIELDNAME").Value.ToString().Trim().Length > 0)
                                            MyCurrentCell.Append(CreateLabelControl(childformdev, IsMultiControl: true));
                                        else
                                            MyCurrentCell.Append(CreateLabelControl(childformdev, IsMultiControl: true));

                                        break;
                                    case TextBoxAssemblyName:
                                        if (childformdev.Element("DATA_FIELDNAME").Value.ToString().Trim().Length > 0)
                                            MyCurrentCell.Append(CreateTextBoxControl(childformdev, IsMultiControl: true));
                                        else
                                            MyCurrentCell.Append(CreateLabelControl(childformdev, IsMultiControl: true));

                                        break;
                                    case FileUploadAssemblyName:
                                        if (childformdev.Element("DATA_FIELDNAME").Value.ToString().Trim().Length > 0)
                                            MyCurrentCell.Append(CreateFileUploadControl(childformdev, IsMultiControl: true));
                                        else
                                            MyCurrentCell.Append(CreateLabelControl(childformdev, IsMultiControl: true));

                                        break;

                                    case AutoCompleteTextBoxAssemblyName:
                                        if (childformdev.Element("DATA_FIELDNAME").Value.ToString().Trim().Length > 0)
                                            MyCurrentCell.Append(CreateAutoCompleteTextBoxControl(childformdev, IsMultiControl: true));
                                        else
                                            MyCurrentCell.Append(CreateLabelControl(childformdev, IsMultiControl: true));

                                        break;

                                    case PasswordAssemblyName:
                                        if (childformdev.Element("DATA_FIELDNAME").Value.ToString().Trim().Length > 0)
                                            MyCurrentCell.Append(CreatePasswordControl(childformdev, IsMultiControl: true));
                                        else
                                            MyCurrentCell.Append(CreateLabelControl(childformdev, IsMultiControl: true));

                                        break;
                                    case CheckBoxAssemblyName:
                                        if (childformdev.Element("DATA_FIELDNAME").Value.ToString().Trim().Length > 0)
                                            MyCurrentCell.Append(CreateCheckBoxControl(childformdev, IsMultiControl: true));
                                        else
                                            MyCurrentCell.Append(CreateLabelControl(childformdev, IsMultiControl: true));
                                        break;

                                    case ButttonAssemblyName:
                                        if (childformdev.Element("DATA_FIELDNAME").Value.ToString().Trim().Length > 0)
                                            MyCurrentCell.Append(CreateButttonControl(childformdev, IsMultiControl: true, btnCss: childformdev.Element("DATA_FIELD_CSSCLASS").Value.ToString().Trim()));
                                        //MyCurrentCell.Append(CreateButttonControl(childformdev, IsMultiControl: true));
                                        else
                                            MyCurrentCell.Append(CreateLabelControl(childformdev, IsMultiControl: true));
                                        break;

                                    case DropDownListAssemblyName:
                                        if (childformdev.Element("DATA_FIELDNAME").Value.ToString().Trim().Length > 0)
                                            MyCurrentCell.Append(CreateDropDownControl(childformdev, IsMultiControl: true));
                                        else
                                            MyCurrentCell.Append(CreateLabelControl(childformdev, IsMultiControl: true));

                                        break;

                                    default:
                                        break;
                                }
                                MyCurrentCell.Append("&nbsp;");
                                if (wformdev.Element("SKIN_ID").Value.ToString() == "hidecontrol")
                                {
                                    MyCurrentCell.Append("</td>");
                                }
                            }
                            if (wformdev.Element("SKIN_ID").Value.ToString() == "hidecontrol")
                            {
                                MyCurrentCell.Append("</tr></table></td>");
                            }
                            else
                            {
                                MyCurrentCell.Append("</td>");
                            }
                            break;
                        default:
                            break;
                    }
                    #endregion
                    CreatedControlCount++;
                }

                if (CurrentCellTotal == RowLength)
                {
                    if (this.ColumnSpanCount == 2)
                    {
                        if (CreatedControlCount > 0)
                        {
                            MyCurrentRow.Append("<tr>" + MyCurrentCell.ToString() + "</tr>");
                            CreatedControlCount = 0;
                        }
                        MyCurrentCell = new StringBuilder();
                    }
                    else if (this.ColumnSpanCount == 4)
                    {
                        if (LayoutCount == 2)
                        {
                            flag = false;
                            MyCurrentRow.Append("<tr>" + MyCurrentCell.ToString() + "</tr>");
                            MyCurrentCell = new StringBuilder();
                            LayoutCount = 0;
                        }

                        LayoutCount++;
                    }
                    else if (this.ColumnSpanCount == 6)
                    {
                        if (LayoutCount == 3)
                        {
                            flag = false;
                            MyCurrentRow.Append("<tr>" + MyCurrentCell.ToString() + "</tr>");
                            MyCurrentCell = new StringBuilder();
                            LayoutCount = 0;
                        }

                        LayoutCount++;
                    }
                    else if (this.ColumnSpanCount == 8)
                    {
                        if (LayoutCount == 4)
                        {
                            flag = false;
                            MyCurrentRow.Append("<tr>" + MyCurrentCell.ToString() + "</tr>");
                            MyCurrentCell = new StringBuilder();
                            LayoutCount = 0;
                        }

                        LayoutCount++;
                    }
                    else
                    {
                        if (LayoutCount == 8)
                        {
                            flag = false;
                            MyCurrentRow.Append("<tr>" + MyCurrentCell.ToString() + "</tr>");
                            MyCurrentCell = new StringBuilder();
                            LayoutCount = 0;
                        }

                        LayoutCount++;
                    }
                    i++;
                }
            }
            if (LayoutCount == 2 && flag == true)
            {
                MyCurrentRow.Append("<tr>" + MyCurrentCell.ToString() + "</tr>");
                MyCurrentCell = new StringBuilder();
            }
            if (MyDivArea.ToString() != "")
            {
                return "<tr><td> " + MyDivArea.ToString() + "</ul>" + MyCurrentRow.ToString() + "</table></div></div></div></td></tr>";
            }
            else
                return MyCurrentRow.ToString();
        }
        #endregion

        #region MakeSearchBody
        private string MakeSearchBody()
        {
            //Check if Business Data table is assigned
            //If not assigned then raise exception
            if (this.HtmlWebFormDefination == null)
                throw new Exception("NULL HtmlWebFormDefination! HtmlWebFormDefination is required.");


            StringBuilder MyCurrentCell = new StringBuilder();
            StringBuilder MyCurrentRow = new StringBuilder();
            StringBuilder MyDivArea = new StringBuilder();

            int LayoutCount = 1;
            int CreatedControlCount = 0;
            int i = 0;
            String[] ListCellControl = null;
            bool IsSingleCellControl = false;
            string FirstIndex = "";
            int CurrentCellTotal = 0;
            int RowLength = 1;
            bool flag = false;
            bool prevTab = false;
            bool tabInitiated = true;
            bool _buttonExist = false;

            foreach (var wformdev in HtmlWebFormDefination)
            {
                //Check ASSEMBLY_NAME of this row is blank then raise error.
                if (wformdev.Element("ASSEMBLY_NAME").Value.ToString().Trim().Length == 0)
                    throw new Exception("NULL ASSEMBLY_NAME! ASSEMBLY_NAME is required.");
                flag = true;
                IsSingleCellControl = false;

                ListCellControl = wformdev.Element("DISPLAY_ORDER").Value.ToString().Replace(".00", "").Split('.');

                #region CONTROL INITIATED

                bool _controlInitiated = true;
                bool _sectionInitiated = true;
                bool _tabInitiated = true;
                string _assemblyName = "";
                _assemblyName = wformdev.Element("ASSEMBLY_NAME").Value.ToString();
                string SECTION_NAME = wformdev.Element("SECTION_NAME").Value.ToString();
                string SECTION_ID = "";
                try
                {
                    SECTION_ID = wformdev.Element("SECTION_ID").Value.ToString();
                }
                catch
                {
                    SECTION_ID = "";
                }
                string TAB_ID = "";
                try
                {
                    TAB_ID = wformdev.Element("TAB_ID").Value.ToString();
                }
                catch
                {
                    TAB_ID = "";
                }
                string TAB_NAME = "";
                try
                {
                    TAB_NAME = wformdev.Element("TAB_NAME").Value.ToString();
                }
                catch
                {
                    TAB_NAME = "";
                }
                if (this.objStructureModify != null && this.objStructureModify.Rows.Count > 0)
                {
                    DataRow[] drStructureModify = this.objStructureModify.Select("HTML_CONTROL_ID='" + wformdev.Element("HTML_CONTROL_ID").Value.ToString().Trim() + "'");
                    if (drStructureModify != null && drStructureModify.Length > 0)
                    {
                        if (!string.IsNullOrWhiteSpace(drStructureModify[0]["CONTROL_INITIATED"].ToString()))
                            _controlInitiated = Convert.ToBoolean(drStructureModify[0]["CONTROL_INITIATED"].ToString().ToLower());
                        if (!string.IsNullOrWhiteSpace(drStructureModify[0]["ASSEMBLY_NAME"].ToString()))
                            _assemblyName = drStructureModify[0]["ASSEMBLY_NAME"].ToString();
                        if (!string.IsNullOrWhiteSpace(drStructureModify[0]["SECTION_NAME"].ToString()))
                            SECTION_NAME = drStructureModify[0]["SECTION_NAME"].ToString();
                        if (!string.IsNullOrWhiteSpace(drStructureModify[0]["SECTION_ID"].ToString()))
                            SECTION_ID = drStructureModify[0]["SECTION_ID"].ToString();
                        if (!string.IsNullOrWhiteSpace(drStructureModify[0]["SECTION_INITIATED"].ToString()))
                            _sectionInitiated = Convert.ToBoolean(drStructureModify[0]["SECTION_INITIATED"].ToString().ToLower());
                        if (!string.IsNullOrWhiteSpace(drStructureModify[0]["TAB_ID"].ToString()))
                            TAB_ID = drStructureModify[0]["TAB_ID"].ToString();
                        if (!string.IsNullOrWhiteSpace(drStructureModify[0]["TAB_NAME"].ToString()))
                            TAB_NAME = drStructureModify[0]["TAB_NAME"].ToString();
                        if (!string.IsNullOrWhiteSpace(drStructureModify[0]["TAB_INITIATED"].ToString()))
                            _tabInitiated = Convert.ToBoolean(drStructureModify[0]["TAB_INITIATED"].ToString().ToLower());
                    }
                }

                #endregion

                if (FirstIndex.Trim() == ListCellControl[0].ToString().Trim())
                {
                    CurrentCellTotal++;
                    IsSingleCellControl = true;
                }
                else
                {
                    FirstIndex = ListCellControl[0].ToString();
                    //if (wformdev.Element("CONTROL_TOTAL").Value.ToString() != "")
                    //    RowLength = int.Parse(wformdev.Element("CONTROL_TOTAL").Value.ToString());
                    //else
                    RowLength = 1;

                    CurrentCellTotal = 1;
                }
                if ((TAB_NAME.Trim().Length > 0 || TAB_ID.Trim().Length > 0) && _tabInitiated == true)
                {
                    if (IsSingleCellControl == false)
                    {
                        if (this.SectionCssClass == "")
                            this.SectionCssClass = this.HeadingCssClass;
                        if (prevTab)
                        {
                            MyCurrentRow.Append("</table></div></div>");
                        }
                        MyCurrentRow.Append("<div " + (TAB_ID != "" ? "id='__tab_" + _AppID + "_" + TAB_ID + "__'" : "") + "><div><table class='WebFormTable'> " + ((SECTION_NAME.Trim().Length > 0) ? "" : ("<tr><td class='" + this.SectionCssClass + "' colspan='" + ((HtmlWebFormDefination.ToList().Count * 2) + 2) + "' " + (TAB_ID != "" ? "id='__section_" + _AppID + "_" + TAB_ID + "__'" : "") + ">" + TAB_NAME + "</td></tr>")));
                    }
                    if (tabInitiated)
                    {
                        MyDivArea.Append("<div id='__appTab_" + _AppID + "__'><ul>");
                        MyDivArea.Append("<li  id='__liTab_" + _AppID + "_" + TAB_ID + "__' class='k-state-active'>" + TAB_NAME + "</li>");
                        tabInitiated = false;
                    }
                    else
                    {
                        MyDivArea.Append("<li  id='__liTab_" + _AppID + "_" + TAB_ID + "__'>" + TAB_NAME + "</li>");
                    }
                    prevTab = true;
                }
                if (SECTION_NAME.Trim().Length > 0 && _sectionInitiated == true)
                {
                    if (IsSingleCellControl == false)
                    {
                        if (this.SectionCssClass == "")
                            this.SectionCssClass = this.HeadingCssClass;

                        MyCurrentRow.Append("<tr><td class='" + this.SectionCssClass + "' colspan='" + ((HtmlWebFormDefination.ToList().Count * 2) + 2) + "' " + (SECTION_ID != "" ? "id='__section_" + SECTION_ID + "__'" : "") + ">" + SECTION_NAME + "</td></tr>");
                    }
                }
                //ImageLabelAssemblyName

                if (_controlInitiated)
                {
                    MyCurrentCell.Append("<td>&nbsp;</td>");
                    #region Control Created
                    switch (_assemblyName)
                    {
                        case HiddenFieldAssemblyName:
                            if (wformdev.Element("DATA_FIELDNAME").Value.ToString().Trim().Length > 0)
                                MyCurrentCell.Append(CreateHiddenFieldControl(wformdev));
                            else
                                MyCurrentCell.Append(CreateLabelControl(wformdev));
                            break;


                        case DateCalenderAssemblyName:
                            if (wformdev.Element("DATA_FIELDNAME").Value.ToString().Trim().Length > 0)
                                MyCurrentCell.Append(CreateDateCalenderControl(wformdev));
                            else
                                MyCurrentCell.Append(CreateLabelControl(wformdev));

                            break;

                        case RadioButttonListAssemblyName:
                            if (wformdev.Element("DATA_FIELDNAME").Value.ToString().Trim().Length > 0)
                                MyCurrentCell.Append(CreateRadioButtonListControl(wformdev));
                            else
                                MyCurrentCell.Append(CreateLabelControl(wformdev));

                            break;
                        case CheckBoxListAssemblyName:
                            if (wformdev.Element("DATA_FIELDNAME").Value.ToString().Trim().Length > 0)
                                MyCurrentCell.Append(CreateCheckBoxListControl(wformdev));
                            else
                                MyCurrentCell.Append(CreateLabelControl(wformdev));

                            break;
                        case RadioAssemblyName:
                            if (wformdev.Element("DATA_FIELDNAME").Value.ToString().Trim().Length > 0)
                                MyCurrentCell.Append(CreateRadioButtonControl(wformdev));
                            else
                                MyCurrentCell.Append(CreateLabelControl(wformdev));

                            break;
                        case LabelAssemblyName:
                            if (wformdev.Element("DATA_FIELDNAME").Value.ToString().Trim().Length > 0)
                                MyCurrentCell.Append(CreateLabelControl(wformdev));
                            else
                                MyCurrentCell.Append(CreateLabelControl(wformdev));

                            break;
                        case TextBoxAssemblyName:
                            if (wformdev.Element("DATA_FIELDNAME").Value.ToString().Trim().Length > 0)
                                MyCurrentCell.Append(CreateTextBoxControl(wformdev));
                            else
                                MyCurrentCell.Append(CreateLabelControl(wformdev));

                            break;
                        case FileUploadAssemblyName:
                            if (wformdev.Element("DATA_FIELDNAME").Value.ToString().Trim().Length > 0)
                                MyCurrentCell.Append(CreateFileUploadControl(wformdev));
                            else
                                MyCurrentCell.Append(CreateLabelControl(wformdev));

                            break;

                        case AutoCompleteTextBoxAssemblyName:
                            if (wformdev.Element("DATA_FIELDNAME").Value.ToString().Trim().Length > 0)
                                MyCurrentCell.Append(CreateAutoCompleteTextBoxControl(wformdev));
                            else
                                MyCurrentCell.Append(CreateLabelControl(wformdev));

                            break;

                        case PasswordAssemblyName:
                            if (wformdev.Element("DATA_FIELDNAME").Value.ToString().Trim().Length > 0)
                                MyCurrentCell.Append(CreatePasswordControl(wformdev));
                            else
                                MyCurrentCell.Append(CreateLabelControl(wformdev));

                            break;
                        case CheckBoxAssemblyName:
                            if (wformdev.Element("DATA_FIELDNAME").Value.ToString().Trim().Length > 0)
                                MyCurrentCell.Append(CreateCheckBoxControl(wformdev));
                            else
                                MyCurrentCell.Append(CreateLabelControl(wformdev));
                            break;

                        case ButttonAssemblyName:
                            if (wformdev.Element("DATA_FIELDNAME").Value.ToString().Trim().Length > 0)
                            {
                                MyCurrentCell.Append(CreateButttonControl(wformdev, btnCss: "btn btn-block btn-primary"));
                                _buttonExist = true;
                            }
                            else
                                MyCurrentCell.Append(CreateLabelControl(wformdev));
                            break;

                        case DropDownListAssemblyName:
                            if (wformdev.Element("DATA_FIELDNAME").Value.ToString().Trim().Length > 0)
                                MyCurrentCell.Append(CreateDropDownControl(wformdev));
                            else
                                MyCurrentCell.Append(CreateLabelControl(wformdev));

                            break;
                        default:
                            break;
                    }
                    #endregion
                    CreatedControlCount++;
                }

            }
            if (flag)
            {
                if (!_buttonExist)
                    MyCurrentCell.Append("<td>&nbsp;</td><td><button class='btn btn-block btn-primary' style='margin-top:0px;' id='btnSearch'>Search</button></td><td>&nbsp;</td>");

                MyCurrentRow.Append("<tr>" + MyCurrentCell.ToString() + "</tr>");
                MyCurrentCell = new StringBuilder();
            }
            if (MyDivArea.ToString() != "")
            {
                return "<tr><td> " + MyDivArea.ToString() + "</ul>" + MyCurrentRow.ToString() + "</table></div></div></div></td></tr>";
            }
            else
                return MyCurrentRow.ToString();
        }
        #endregion

        #region CreateCellLabel
        private string CreateCellLabeltrans(XElement CurrentRow)
        {

            string ENABLE_REQUIREVALIDATION = (CurrentRow.Element("ENABLE_REQUIREVALIDATION").Value.ToString());
            string LABEL_CELL_TEXT = CurrentRow.Element("LABEL_CELL_TEXT").Value.ToString();
            string LABEL_CELL_TEXT_CSSClass = "formHeaderLabel";
            string TOOLTIP = CurrentRow.Element("TOOLTIP").Value.ToString();

            if (this.objStructureModify != null && this.objStructureModify.Rows.Count > 0)
            {
                DataRow[] drStructureModify = this.objStructureModify.Select("HTML_CONTROL_ID='" + CurrentRow.Element("HTML_CONTROL_ID").Value.ToString() + "'");
                if (drStructureModify.Length > 0)
                {
                    if (!string.IsNullOrWhiteSpace(drStructureModify[0]["ENABLE_REQUIREVALIDATION"].ToString()))
                        ENABLE_REQUIREVALIDATION = (drStructureModify[0]["ENABLE_REQUIREVALIDATION"].ToString().ToLower());
                    if (!string.IsNullOrWhiteSpace(drStructureModify[0]["LABEL_CELL_TEXT"].ToString()))
                        LABEL_CELL_TEXT = drStructureModify[0]["LABEL_CELL_TEXT"].ToString();
                    if (!string.IsNullOrWhiteSpace(drStructureModify[0]["TOOLTIP"].ToString()))
                        TOOLTIP = drStructureModify[0]["TOOLTIP"].ToString();
                }
            }
            string labelText = "";
            if (_PageName == "SLI Details")
            {
                LABEL_CELL_TEXT = LABEL_CELL_TEXT.Replace("SLI", ((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).SysSetting["SLICaption"].ToString());
            }
            if (bool.Parse(CurrentRow.Element("VISIBLE").Value.ToString()) == true)
                if (ENABLE_REQUIREVALIDATION != "")
                {
                    if (bool.Parse(ENABLE_REQUIREVALIDATION) == true)
                    {

                        labelText = "<td class='" + LABEL_CELL_TEXT_CSSClass + "' title='" + TOOLTIP + "'  ><font color='red'>*</font><span id='spn" + CurrentRow.Element("HTML_CONTROL_ID").Value.ToString() + "'> " + LABEL_CELL_TEXT + "</span></td>";
                    }
                    else
                    {

                        labelText = "<td class='" + LABEL_CELL_TEXT_CSSClass + "' title='" + TOOLTIP + "'  ><span id='spn" + CurrentRow.Element("HTML_CONTROL_ID").Value.ToString() + "'> " + LABEL_CELL_TEXT + "</span></td>";
                    }
                }
                else
                {
                    labelText = "<td class='" + LABEL_CELL_TEXT_CSSClass + "' title='" + TOOLTIP + "'  >" + LABEL_CELL_TEXT + "</td>";
                }
            else
                labelText = "<td class='" + LABEL_CELL_TEXT_CSSClass + "' title='>&nbsp;</td>";

            return labelText;
        }
        #endregion
        #region CreateCellLabel
        private string CreateCellLabel(XElement CurrentRow, bool appnendBlankCell = false, string assemblyname = "")
        {
            string toolstr = "";
            try
            {
                if (CurrentRow.Element("ASSEMBLY_NAME").Value.ToString().ToLower().Contains("label"))
                    toolstr = CurrentRow.Element("LABEL_CELL_TEXT").Value.ToString();
                else
                {
                    if (CurrentRow.Element("ASSEMBLY_NAME").Value.ToString().ToLower().Contains("autocompletetextbox"))
                        toolstr = "Select " + CurrentRow.Element("LABEL_CELL_TEXT").Value.ToString();
                    else if (CurrentRow.Element("ASSEMBLY_NAME").Value.ToString().ToLower().Contains("textbox"))
                        toolstr = "Enter " + CurrentRow.Element("LABEL_CELL_TEXT").Value.ToString();
                    else
                        toolstr = "Select " + CurrentRow.Element("LABEL_CELL_TEXT").Value.ToString();
                }
            }
            catch { }



            if (CurrentRow.Element("DATA_FIELDNAME") != null && CurrentRow.Element("DATA_FIELDNAME").Value.ToString().StartsWith("##"))
                appnendBlankCell = true;
            if (appnendBlankCell)
                return "<td class='" + this._LABEL_CSS_CLASS + "' title=''>&nbsp;</td>";
            string ENABLE_REQUIREVALIDATION = (CurrentRow.Element("ENABLE_REQUIREVALIDATION").Value.ToString());
            string LABEL_CELL_TEXT = CurrentRow.Element("LABEL_CELL_TEXT").Value.ToString();
            string TOOLTIP = toolstr;

            if (this.objStructureModify != null && this.objStructureModify.Rows.Count > 0)
            {
                DataRow[] drStructureModify = this.objStructureModify.Select("HTML_CONTROL_ID='" + CurrentRow.Element("HTML_CONTROL_ID").Value.ToString() + "'");
                if (drStructureModify.Length > 0)
                {
                    if (!string.IsNullOrWhiteSpace(drStructureModify[0]["ENABLE_REQUIREVALIDATION"].ToString()))
                        ENABLE_REQUIREVALIDATION = (drStructureModify[0]["ENABLE_REQUIREVALIDATION"].ToString().ToLower());
                    if (!string.IsNullOrWhiteSpace(drStructureModify[0]["LABEL_CELL_TEXT"].ToString()))
                        LABEL_CELL_TEXT = drStructureModify[0]["LABEL_CELL_TEXT"].ToString();
                    if (!string.IsNullOrWhiteSpace(drStructureModify[0]["TOOLTIP"].ToString()))
                        TOOLTIP = drStructureModify[0]["TOOLTIP"].ToString();
                }
            }
            string labelText = "";
            if (_PageName == "SLI Details")
            {
                LABEL_CELL_TEXT = LABEL_CELL_TEXT.Replace("SLI", ((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).SysSetting["SLICaption"].ToString());
            }
            if (bool.Parse(CurrentRow.Element("VISIBLE").Value.ToString()) == true)
                if (ENABLE_REQUIREVALIDATION != "")
                {
                    if (bool.Parse(ENABLE_REQUIREVALIDATION) == true)
                    {

                        labelText = "<td class='" + this._LABEL_CSS_CLASS + "' title='" + TOOLTIP + "'  ><font color='red'>*</font><span id='spn" + CurrentRow.Element("HTML_CONTROL_ID").Value.ToString() + "'> " + LABEL_CELL_TEXT + "</span>" + (this.ColumnSpanCount == 16 && assemblyname == LabelAssemblyName ? " :- " : "</td>");
                    }
                    else
                    {

                        labelText = "<td class='" + this._LABEL_CSS_CLASS + "' title='" + TOOLTIP + "'  ><font>&nbsp;&nbsp;</font><span id='spn" + CurrentRow.Element("HTML_CONTROL_ID").Value.ToString() + "'> " + LABEL_CELL_TEXT + "</span>" + (this.ColumnSpanCount == 16 && assemblyname == LabelAssemblyName ? " :- " : "</td>");
                    }
                }
                else
                {
                    labelText = "<td class='" + this._LABEL_CSS_CLASS + "' title='" + TOOLTIP + "'  ><font>&nbsp;&nbsp;&nbsp;</font>" + LABEL_CELL_TEXT + "" + (this.ColumnSpanCount == 16 && assemblyname == LabelAssemblyName ? " :- " : "</td>");
                }
            else
                labelText = "<td class='" + this._LABEL_CSS_CLASS + "' title='>&nbsp;&nbsp;&nbsp;" + (this.ColumnSpanCount == 16 && assemblyname == LabelAssemblyName ? " :- " : "</td>");

            return labelText;
        }
        #endregion

        #region CreateLabelControl
        private string CreateLabelControl(XElement CurrentRow, bool IsTrans = false, bool IsMultiControl = false, string assemblyname = "")
        {
            string toolstr = "";
            try
            {
                if (CurrentRow.Element("ASSEMBLY_NAME").Value.ToString().ToLower().Contains("label"))
                    toolstr = CurrentRow.Element("LABEL_CELL_TEXT").Value.ToString();
                else
                {
                    if (CurrentRow.Element("ASSEMBLY_NAME").Value.ToString().ToLower().Contains("autocompletetextbox"))
                        toolstr = "Select " + CurrentRow.Element("LABEL_CELL_TEXT").Value.ToString();
                    else if (CurrentRow.Element("ASSEMBLY_NAME").Value.ToString().ToLower().Contains("textbox"))
                        toolstr = "Enter " + CurrentRow.Element("LABEL_CELL_TEXT").Value.ToString();
                    else
                        toolstr = "Select " + CurrentRow.Element("LABEL_CELL_TEXT").Value.ToString();
                }
            }
            catch { }

            string labelText = "";
            string controlText = "";
            string spanControl = "";
            string extraAttribute = "";
            bool isPrefix = false;
            if (bool.Parse(CurrentRow.Element("VISIBLE").Value.ToString()) == true)
            {

                if (CurrentRow.Element("CONTROL_TOTAL").Value.ToString().Length > 0)
                {
                    spanControl = "&nbsp;<span id='_span" + CurrentRow.Element("HTML_CONTROL_ID").Value.ToString().ToUpper() + "_'></span>";
                    if (CurrentRow.Element("CONTROL_TOTAL").Value.ToString().IndexOf("-") >= 0)
                        isPrefix = true;
                }

                if (CurrentRow.Element("LOOKUP_NAME").Value.ToString().Length > 0)
                    extraAttribute = extraAttribute + " subtype='" + CurrentRow.Element("LOOKUP_NAME").Value.ToString().ToLower() + "' ";

                if (CurrentRow.Element("TEXT_TYPE").Value.ToString().Length > 0)
                    extraAttribute = extraAttribute + " controltype='" + CurrentRow.Element("TEXT_TYPE").Value.ToString().ToLower() + "' ";

                if (CurrentRow.Element("DATA_FIELDNAME").Value.ToString().Length > 0)
                {
                    if (CurrentRow.Element("DATA_FIELDNAME").Value.ToString().StartsWith("##"))
                    {
                        string ctrltype = CurrentRow.Element("DATA_FIELDNAME").Value.ToString().Replace("#", "");
                        if (ctrltype.ToUpper() == "LINK")
                        {
                            controlText = "<a href='javascript:void(0);' id='ahref_" + CurrentRow.Element("HTML_CONTROL_ID").Value.ToString() + "' title='" + toolstr + "'" + (IsTrans == true ? (" recname='Alt" + CurrentRow.Element("HTML_CONTROL_ID").Value.ToString() + "'") : "") + "><span class='" + this._DATA_FIELD_CSSCLASS + "'   id='" + CurrentRow.Element("HTML_CONTROL_ID").Value.ToString() + "'  " + extraAttribute + " " + (IsTrans == true ? (" recname='" + CurrentRow.Element("HTML_CONTROL_ID").Value.ToString() + "'") : "") + ">" + CurrentRow.Element("LABEL_CELL_TEXT").Value.ToString() + "</span></a>";
                        }
                        else
                        {
                            controlText = "<input type='hidden' name='" + CurrentRow.Element("HTML_CONTROL_ID").Value.ToString() + "'  id='" + CurrentRow.Element("HTML_CONTROL_ID").Value.ToString() + "' value='" + CurrentRow.Element("LABEL_CELL_TEXT").Value.ToString() + "' /><span class='" + this._DATA_FIELD_CSSCLASS + "'   id='" + CurrentRow.Element("HTML_CONTROL_ID").Value.ToString() + "'  " + extraAttribute + " >" + CurrentRow.Element("LABEL_CELL_TEXT").Value.ToString() + "</span>";
                        }

                    }
                    else if (false)
                        controlText = "<input type='hidden' name='" + CurrentRow.Element("HTML_CONTROL_ID").Value.ToString() + "'   id='" + CurrentRow.Element("HTML_CONTROL_ID").Value.ToString() + "'" + (IsTrans == true ? (" recname='" + CurrentRow.Element("DATA_FIELDNAME").Value.ToString() + "'") : "") + " value='" + CurrentPage.Request.Form[CurrentRow.Element("DATA_FIELDNAME").Value.ToString() + (this.objIndex > 0 ? "_" + (this.objIndex - 1).ToString() : "")] + "' /><span class='" + this._DATA_FIELD_CSSCLASS + "'" + (IsTrans == true ? (" recname='" + CurrentRow.Element("DATA_FIELDNAME").Value.ToString() + "'") : "") + "    id='" + CurrentRow.Element("HTML_CONTROL_ID").Value.ToString() + " " + extraAttribute + "'  >" + CurrentPage.Request.Form[CurrentRow.Element("DATA_FIELDNAME").Value.ToString() + (this.objIndex > 0 ? "_" + (this.objIndex - 1).ToString() : "")] + " </span> ";
                    else
                        controlText = "<input type='hidden' name='" + CurrentRow.Element("HTML_CONTROL_ID").Value.ToString() + "'  id='" + CurrentRow.Element("HTML_CONTROL_ID").Value.ToString() + "'" + (IsTrans == true ? (" recname='" + CurrentRow.Element("DATA_FIELDNAME").Value.ToString() + "'") : "") + " value='" + GetBindFieldValue(CurrentRow.Element("DATA_FIELDNAME").Value.ToString()) + "' /><span class='" + this._DATA_FIELD_CSSCLASS + "'   id='" + CurrentRow.Element("HTML_CONTROL_ID").Value.ToString() + "' " + (IsTrans == true ? (" recname='" + CurrentRow.Element("DATA_FIELDNAME").Value.ToString() + "'") : "") + " " + extraAttribute + " >" + GetBindFieldValue(CurrentRow.Element("DATA_FIELDNAME").Value.ToString()) + "</span>";
                }
                else
                    controlText = "&nbsp;";
            }
            return labelText = (IsMultiControl == false ? (@"" + (this.ColumnSpanCount == 16 && assemblyname == LabelAssemblyName ? "" : "<td class='" + this._DATA_CELL_CSSCLASS + "' >") + (isPrefix == false ?
                (controlText + spanControl) : (spanControl + "&nbsp;" + controlText)) +
                "</td>") : (isPrefix == false ?
                (controlText + spanControl) : (spanControl + "&nbsp;" + controlText)));
        }
        #endregion

        #region CreateHiddenFieldControl
        private string CreateHiddenFieldControl(XElement CurrentRow, bool IsTrans = false, bool IsMultiControl = false)
        {
            string labelText = "";
            string controlText = "";
            string spanControl = "";
            bool isPrefix = false;
            if (bool.Parse(CurrentRow.Element("VISIBLE").Value.ToString()) == true)
            {
                if (CurrentRow.Element("CONTROL_TOTAL").Value.ToString().Length > 0)
                {
                    spanControl = "&nbsp;<span id='_span" + CurrentRow.Element("HTML_CONTROL_ID").Value.ToString().ToUpper() + "_'/>";
                    if (CurrentRow.Element("CONTROL_TOTAL").Value.ToString().IndexOf("-") >= 0)
                        isPrefix = true;
                }

                if (CurrentRow.Element("DATA_FIELDNAME").Value.ToString().Length > 0)
                {
                    if (false)
                        controlText = "<input type='hidden' name='" + CurrentRow.Element("HTML_CONTROL_ID").Value.ToString() + "'  id='" + CurrentRow.Element("HTML_CONTROL_ID").Value.ToString() + "'" + (IsTrans == true ? (" recname='" + CurrentRow.Element("DATA_FIELDNAME").Value.ToString() + "'") : "") + " value='" + CurrentPage.Request.Form[CurrentRow.Element("DATA_FIELDNAME").Value.ToString() + (this.objIndex > 0 ? "_" + (this.objIndex - 1).ToString() : "")] + "' />";
                    else
                        controlText = "<input type='hidden' name='" + CurrentRow.Element("HTML_CONTROL_ID").Value.ToString() + "'  id='" + CurrentRow.Element("HTML_CONTROL_ID").Value.ToString() + "'" + (IsTrans == true ? (" recname='" + CurrentRow.Element("DATA_FIELDNAME").Value.ToString() + "'") : "") + " value='" + GetBindFieldValue(CurrentRow.Element("DATA_FIELDNAME").Value.ToString()) + "' />";
                }
                else
                    controlText = "&nbsp;";
            }

            return labelText = (IsMultiControl == false ? (@"<td class='" + this._DATA_CELL_CSSCLASS + "' >" + (isPrefix == false ?
                (controlText + spanControl) : (spanControl + "&nbsp;" + controlText)) +
                "</td>") : (isPrefix == false ?
                (controlText + spanControl) : (spanControl + "&nbsp;" + controlText)));
        }
        #endregion

        #region CreatePasswordControl
        private string CreatePasswordControl(XElement CurrentRow, bool IsTrans = false, bool IsMultiControl = false)
        {
            string labelText = "";
            string controlText = "";
            string textAttribute = "";
            string spanControl = "";
            bool isPrefix = false;
            if (bool.Parse(CurrentRow.Element("VISIBLE").Value.ToString()) == true)
            {
                if (CurrentRow.Element("CONTROL_TOTAL").Value.ToString().Length > 0)
                {
                    spanControl = "&nbsp;<span id='_span" + CurrentRow.Element("HTML_CONTROL_ID").Value.ToString().ToUpper() + "_'/>";
                    if (CurrentRow.Element("CONTROL_TOTAL").Value.ToString().IndexOf("-") >= 0)
                        isPrefix = true;
                }

                string validationMessage = CurrentRow.Element("REQUIRED_FIELD_MESSAGE").Value.ToString();
                string ENABLE_REQUIREVALIDATION = CurrentRow.Element("ENABLE_REQUIREVALIDATION").Value.ToString().ToLower();
                if (string.IsNullOrWhiteSpace(validationMessage))
                {
                    validationMessage = CurrentRow.Element("TOOLTIP").Value.ToString();
                }
                if (this.objStructureModify != null && this.objStructureModify.Rows.Count > 0)
                {
                    DataRow[] drStructureModify = this.objStructureModify.Select("HTML_CONTROL_ID='" + CurrentRow.Element("HTML_CONTROL_ID").Value.ToString() + "'");
                    if (drStructureModify.Length > 0)
                    {
                        if (!string.IsNullOrWhiteSpace(drStructureModify[0]["REQUIRED_FIELD_MESSAGE"].ToString()))
                            validationMessage = (drStructureModify[0]["REQUIRED_FIELD_MESSAGE"].ToString());

                        if (!string.IsNullOrWhiteSpace(drStructureModify[0]["ENABLE_REQUIREVALIDATION"].ToString()))
                            ENABLE_REQUIREVALIDATION = (drStructureModify[0]["ENABLE_REQUIREVALIDATION"].ToString().ToLower());
                    }
                }
                if (CurrentRow.Element("DATA_VALIDATE").Value.ToString().Length > 0)
                    textAttribute = "data-valid='" + CurrentRow.Element("DATA_VALIDATE").Value.ToString() + "' data-valid-msg='" + validationMessage + "'";

                if (CurrentRow.Element("LABEL_CELL_TEXT").Value.ToString().Length > 0)
                    textAttribute = textAttribute + " colname='" + CurrentRow.Element("LABEL_CELL_TEXT").Value.ToString().ToLower() + "' ";

                if (CurrentRow.Element("TAB_INDEX").Value.ToString() != "")
                    textAttribute = textAttribute + " tabindex=" + Int16.Parse(CurrentRow.Element("TAB_INDEX").Value.ToString()) + " ";

                if (CurrentRow.Element("DATA_FIELDNAME").Value.ToString().Length > 0)
                {
                    if (false)
                        controlText = "<input type='password'" + textAttribute + " class='" + this._DATA_FIELD_CSSCLASS + "' name='" + CurrentRow.Element("HTML_CONTROL_ID").Value.ToString() + "'  id='" + CurrentRow.Element("HTML_CONTROL_ID").Value.ToString() + "'" + (IsTrans == true ? (" recname='" + CurrentRow.Element("DATA_FIELDNAME").Value.ToString() + "'") : "") + " value='" + CurrentPage.Request.Form[CurrentRow.Element("DATA_FIELDNAME").Value.ToString() + (this.objIndex > 0 ? "_" + (this.objIndex - 1).ToString() : "")] + "' />";
                    else
                        controlText = "<input type='password'" + textAttribute + "  class='" + this._DATA_FIELD_CSSCLASS + "' name='" + CurrentRow.Element("HTML_CONTROL_ID").Value.ToString() + "'  id='" + CurrentRow.Element("HTML_CONTROL_ID").Value.ToString() + "'" + (IsTrans == true ? (" recname='" + CurrentRow.Element("DATA_FIELDNAME").Value.ToString() + "'") : "") + " value='" + GetBindFieldValue(CurrentRow.Element("DATA_FIELDNAME").Value.ToString()) + "' />";
                }
                else
                    controlText = "&nbsp;";
            }
            return labelText = (IsMultiControl == false ? (@"<td class='" + this._DATA_CELL_CSSCLASS + "' >" + (isPrefix == false ?
                (controlText + spanControl) : (spanControl + "&nbsp;" + controlText)) +
                "</td>") : (isPrefix == false ?
                (controlText + spanControl) : (spanControl + "&nbsp;" + controlText)));
        }
        #endregion

        #region CreateFileUploaControl
        private string CreateFileUploadControl(XElement CurrentRow, bool IsTrans = false, bool IsMultiControl = false)
        {
            string labelText = "";
            string controlText = "";
            string textAttribute = "";
            string spanControl = "";
            bool isPrefix = false;
            if (bool.Parse(CurrentRow.Element("VISIBLE").Value.ToString()) == true)
            {
                if (CurrentRow.Element("CONTROL_TOTAL").Value.ToString().Length > 0)
                {
                    spanControl = "&nbsp;<span id='_span" + CurrentRow.Element("HTML_CONTROL_ID").Value.ToString().ToUpper() + "_'/>";
                    if (CurrentRow.Element("CONTROL_TOTAL").Value.ToString().IndexOf("-") >= 0)
                        isPrefix = true;
                }

                string validationMessage = CurrentRow.Element("REQUIRED_FIELD_MESSAGE").Value.ToString();
                string ENABLE_REQUIREVALIDATION = CurrentRow.Element("ENABLE_REQUIREVALIDATION").Value.ToString().ToLower();
                if (string.IsNullOrWhiteSpace(validationMessage))
                {
                    validationMessage = CurrentRow.Element("TOOLTIP").Value.ToString();
                }
                if (this.objStructureModify != null && this.objStructureModify.Rows.Count > 0)
                {
                    DataRow[] drStructureModify = this.objStructureModify.Select("HTML_CONTROL_ID='" + CurrentRow.Element("HTML_CONTROL_ID").Value.ToString() + "'");
                    if (drStructureModify.Length > 0)
                    {
                        if (!string.IsNullOrWhiteSpace(drStructureModify[0]["REQUIRED_FIELD_MESSAGE"].ToString()))
                            validationMessage = (drStructureModify[0]["REQUIRED_FIELD_MESSAGE"].ToString());

                        if (!string.IsNullOrWhiteSpace(drStructureModify[0]["ENABLE_REQUIREVALIDATION"].ToString()))
                            ENABLE_REQUIREVALIDATION = (drStructureModify[0]["ENABLE_REQUIREVALIDATION"].ToString().ToLower());
                    }
                }
                if (CurrentRow.Element("DATA_VALIDATE").Value.ToString().Length > 0)
                    textAttribute = "data-valid='" + CurrentRow.Element("DATA_VALIDATE").Value.ToString() + "' data-valid-msg='" + validationMessage + "'";

                if (CurrentRow.Element("TAB_INDEX").Value.ToString() != "")
                    textAttribute = textAttribute + " tabindex=" + Int16.Parse(CurrentRow.Element("TAB_INDEX").Value.ToString()) + " ";

                if (CurrentRow.Element("LABEL_CELL_TEXT").Value.ToString().Length > 0)
                    textAttribute = textAttribute + " colname='" + CurrentRow.Element("LABEL_CELL_TEXT").Value.ToString().ToLower() + "' ";

                if (CurrentRow.Element("DATA_FIELDNAME").Value.ToString().Length > 0)
                {
                    if (false)
                        controlText = "<div class='upload'> <input type='file'  name='" + CurrentRow.Element("HTML_CONTROL_ID").Value.ToString() + "'  id='" + CurrentRow.Element("HTML_CONTROL_ID").Value.ToString() + "'" + (IsTrans == true ? (" recname='" + CurrentRow.Element("DATA_FIELDNAME").Value.ToString() + "'") : "") + textAttribute + "  maxlength='" + CurrentRow.Element("MAXLENGTH").Value.ToString() + "'    value='" + CurrentPage.Request.Form[CurrentRow.Element("DATA_FIELDNAME").Value.ToString() + (this.objIndex > 0 ? "_" + (this.objIndex - 1).ToString() : "")] + "' /></div>";
                    else
                        controlText = "<div class='upload'> <input type='file'  name='" + CurrentRow.Element("HTML_CONTROL_ID").Value.ToString() + "'  id='" + CurrentRow.Element("HTML_CONTROL_ID").Value.ToString() + "'" + (IsTrans == true ? (" recname='" + CurrentRow.Element("DATA_FIELDNAME").Value.ToString() + "'") : "") + textAttribute + "  maxlength='" + CurrentRow.Element("MAXLENGTH").Value.ToString() + "' value='" + GetBindFieldValue(CurrentRow.Element("DATA_FIELDNAME").Value.ToString()) + "' /></div>";
                }
                else
                    controlText = "&nbsp;";

                if (CurrentRow.Element("DATA_VALIDATE").Value.ToString().Length > 0 || ENABLE_REQUIREVALIDATION == "true")
                {
                    string key = CurrentRow.Element("HTML_CONTROL_ID").Value.ToString();

                    if (!RequiredValidationDict.ContainsKey(key))
                        RequiredValidationDict.Add(key, validationMessage);

                }
            }

            return labelText = (IsMultiControl == false ? (@"<td class='" + this._DATA_CELL_CSSCLASS + "' >" + (isPrefix == false ?
                (controlText + spanControl) : (spanControl + "&nbsp;" + controlText)) +
                "</td>") : (isPrefix == false ?
                (controlText + spanControl) : (spanControl + "&nbsp;" + controlText)));

        }
        #endregion

        #region CreateTextBoxControl
        private string CreateTextBoxControl(XElement CurrentRow, bool IsTrans = false, bool IsMultiControl = false, string assemblyname = "")
        {
            string labelText = "";
            string controlText = "";
            string textAttribute = "";
            string spanControl = "";
            bool isPrefix = false;
            string styleAttribute = "";
            if (this._FORM_ACTION == "SEARCH")
            {
                styleAttribute = "";// "font-family: Verdana; font-size: 12px; position: relative; vertical-align: top; background-color: transparent;";
            }
            string placeholder = "";
            try
            {
                placeholder = CurrentRow.Element("PLACE_HOLDER").Value.ToString();
            }
            catch
            {
                placeholder = "";
            }
            if (_PageName == "SLI Details" && !string.IsNullOrEmpty(placeholder))
            {
                placeholder = placeholder.Replace("SLI", ((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).SysSetting["SLICaption"].ToString());
            }
            if (bool.Parse(CurrentRow.Element("VISIBLE").Value.ToString()) == true)
            {
                if (CurrentRow.Element("TEXT_TYPE").Value.ToString().Length > 0)
                {
                    textAttribute = textAttribute + " controltype='" + CurrentRow.Element("TEXT_TYPE").Value.ToString().ToLower() + "' ";

                    if (CurrentRow.Element("ALLOWCHAR").Value.ToString().Length > 0)
                        textAttribute = textAttribute + " allowchar='" + CurrentRow.Element("ALLOWCHAR").Value.ToString() + "' ";
                }
                else
                    textAttribute = textAttribute + " controltype='default' ";

                if (CurrentRow.Element("LABEL_CELL_TEXT").Value.ToString().Length > 0)
                    textAttribute = textAttribute + " colname='" + CurrentRow.Element("LABEL_CELL_TEXT").Value.ToString().ToLower() + "' ";

                if (CurrentRow.Element("LOOKUP_NAME").Value.ToString().Length > 0)
                    textAttribute = textAttribute + " subtype='" + CurrentRow.Element("LOOKUP_NAME").Value.ToString().ToLower() + "' ";

                if (CurrentRow.Element("SKIN_ID").Value.ToString().Length > 0)
                    textAttribute = textAttribute + " allowround='false' ";

                if (CurrentRow.Element("ONBLUR_HANDLER").Value.ToString().Length > 0)
                    textAttribute = textAttribute + " onblur='" + CurrentRow.Element("ONBLUR_HANDLER").Value.ToString() + "' ";

                if (CurrentRow.Element("CONTROL_TOTAL").Value.ToString().Length > 0)
                {
                    spanControl = "&nbsp;<span id='_span" + CurrentRow.Element("HTML_CONTROL_ID").Value.ToString().ToUpper() + "_'></span>";
                    if (CurrentRow.Element("CONTROL_TOTAL").Value.ToString().IndexOf("-") >= 0)
                        isPrefix = true;
                }

                string validationMessage = CurrentRow.Element("REQUIRED_FIELD_MESSAGE").Value.ToString();
                string ENABLE_REQUIREVALIDATION = CurrentRow.Element("ENABLE_REQUIREVALIDATION").Value.ToString().ToLower();
                if (string.IsNullOrWhiteSpace(validationMessage))
                {
                    validationMessage = CurrentRow.Element("TOOLTIP").Value.ToString();
                }
                if (this.objStructureModify != null && this.objStructureModify.Rows.Count > 0)
                {
                    DataRow[] drStructureModify = this.objStructureModify.Select("HTML_CONTROL_ID='" + CurrentRow.Element("HTML_CONTROL_ID").Value.ToString() + "'");
                    if (drStructureModify.Length > 0)
                    {
                        if (!string.IsNullOrWhiteSpace(drStructureModify[0]["REQUIRED_FIELD_MESSAGE"].ToString()))
                            validationMessage = (drStructureModify[0]["REQUIRED_FIELD_MESSAGE"].ToString());

                        if (!string.IsNullOrWhiteSpace(drStructureModify[0]["ENABLE_REQUIREVALIDATION"].ToString()))
                            ENABLE_REQUIREVALIDATION = (drStructureModify[0]["ENABLE_REQUIREVALIDATION"].ToString().ToLower());
                    }
                }
                if (CurrentRow.Element("DATA_VALIDATE").Value.ToString().Length > 0)
                    textAttribute = textAttribute + " data-valid='" + CurrentRow.Element("DATA_VALIDATE").Value.ToString() + "' data-valid-msg='" + validationMessage + "'";

                if (CurrentRow.Element("TAB_INDEX").Value.ToString() != "")
                    textAttribute = textAttribute + " tabindex=" + Int16.Parse(CurrentRow.Element("TAB_INDEX").Value.ToString()) + " ";

                if (CurrentRow.Element("DATA_FIELDNAME").Value.ToString().Length > 0)
                {
                    if (false)
                        controlText = "<" + (CurrentRow.Element("MULTILINE").Value.ToUpper() == "YES" ? "textarea" : "input type='text'") + " class='" + this._DATA_FIELD_CSSCLASS + "' name='" + CurrentRow.Element("HTML_CONTROL_ID").Value.ToString() + "'  id='" + CurrentRow.Element("HTML_CONTROL_ID").Value.ToString() + "'" + (IsTrans == true ? (" recname='" + CurrentRow.Element("DATA_FIELDNAME").Value.ToString() + "'") : "") + " style='width:" + (CurrentRow.Element("WIDTH").Value.ToString() == "" ? "80" : CurrentRow.Element("WIDTH").Value.ToString()) + "px;" + (CurrentRow.Element("HEIGHT").Value.ToString() == "" ? "" : "height:" + CurrentRow.Element("HEIGHT").Value.ToString()) + "px;' " + textAttribute + "  maxlength='" + CurrentRow.Element("MAXLENGTH").Value.ToString() + "'" + (CurrentRow.Element("MULTILINE").Value.ToUpper() == "YES" ? ">" + CurrentPage.Request.Form[CurrentRow.Element("DATA_FIELDNAME").Value.ToString() + (this.objIndex > 0 ? "_" + (this.objIndex - 1).ToString() : "")] + "</textarea>" : "  value='" + CurrentPage.Request.Form[CurrentRow.Element("DATA_FIELDNAME").Value.ToString() + (this.objIndex > 0 ? "_" + (this.objIndex - 1).ToString() : "")] + "'/>");
                    else
                        controlText = "<" + (CurrentRow.Element("MULTILINE").Value.ToUpper() == "YES" ? "textarea" : "input type='text'") + " class='" + this._DATA_FIELD_CSSCLASS + "' name='" + CurrentRow.Element("HTML_CONTROL_ID").Value.ToString() + "'  id='" + CurrentRow.Element("HTML_CONTROL_ID").Value.ToString() + "'" + (IsTrans == true ? (" recname='" + CurrentRow.Element("DATA_FIELDNAME").Value.ToString() + "'") : "") + " style='width:" + (CurrentRow.Element("WIDTH").Value.ToString() == "" ? "80" : CurrentRow.Element("WIDTH").Value.ToString()) + "px;" + (CurrentRow.Element("HEIGHT").Value.ToString() == "" ? "" : "height:" + CurrentRow.Element("HEIGHT").Value.ToString()) + "px;" + styleAttribute + "' " + textAttribute + "  maxlength='" + CurrentRow.Element("MAXLENGTH").Value.ToString() + "'" + (CurrentRow.Element("MULTILINE").Value.ToUpper() == "YES" ? ">" + GetBindFieldValue(CurrentRow.Element("DATA_FIELDNAME").Value.ToString()) + "</textarea>" : "  value='" + GetBindFieldValue(CurrentRow.Element("DATA_FIELDNAME").Value.ToString()) + "' placeholder='" + placeholder + "'/>");
                }
                else
                    controlText = "&nbsp;";

                if (CurrentRow.Element("DATA_VALIDATE").Value.ToString().Length > 0 || ENABLE_REQUIREVALIDATION == "true")
                {
                    string key = CurrentRow.Element("HTML_CONTROL_ID").Value.ToString();
                    if (!RequiredValidationDict.ContainsKey(key))
                        RequiredValidationDict.Add(key, validationMessage);

                }
            }

            return labelText = (IsMultiControl == false ? ((@"" + (this.ColumnSpanCount == 16 && assemblyname == LabelAssemblyName ? "" : "<td class='" + this._DATA_CELL_CSSCLASS + "' >")) + (isPrefix == false ?
                (controlText + spanControl) : (spanControl + "&nbsp;" + controlText)) +
                "</td>") : "<span>" + (isPrefix == false ?
                (controlText + spanControl) : (spanControl + "&nbsp;" + controlText)) + "</span>");
        }
        #endregion

        #region CreateAutoCompleteTextBoxControl
        private string CreateAutoCompleteTextBoxControl(XElement CurrentRow, bool IsTrans = false, bool IsMultiControl = false)
        {
            string labelText = "";
            string controlText = "";
            string textAttribute = "";
            string spanControl = "";
            bool isPrefix = false;
            string placeholder = "";
            string styleAttribute = "";
            if (this._FORM_ACTION == "SEARCH")
            {
                styleAttribute = (CurrentRow.Element("HEIGHT").Value.ToString() == "" ? "" : "height:" + CurrentRow.Element("HEIGHT").Value.ToString()) + "px;" + "font-family: Verdana; font-size: 12px; position: relative; vertical-align: top; background-color: transparent;";
            }
            try
            {
                placeholder = CurrentRow.Element("PLACE_HOLDER").Value.ToString();
            }
            catch
            {
                placeholder = "";
            }
            if (_PageName == "SLI Details" && !string.IsNullOrEmpty(placeholder))
            {
                placeholder = placeholder.Replace("SLI", ((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).SysSetting["SLICaption"].ToString());
            }
            if (bool.Parse(CurrentRow.Element("VISIBLE").Value.ToString()) == true)
            {
                if (CurrentRow.Element("CONTROL_TOTAL").Value.ToString().Length > 0)
                {
                    spanControl = "&nbsp;<span id='_span" + CurrentRow.Element("HTML_CONTROL_ID").Value.ToString().ToUpper() + "_'></span>";

                    if (CurrentRow.Element("CONTROL_TOTAL").Value.ToString().IndexOf("-") >= 0)
                        isPrefix = true;
                }

                string validationMessage = CurrentRow.Element("REQUIRED_FIELD_MESSAGE").Value.ToString();
                string ENABLE_REQUIREVALIDATION = CurrentRow.Element("ENABLE_REQUIREVALIDATION").Value.ToString().ToLower();
                if (string.IsNullOrWhiteSpace(validationMessage))
                {
                    validationMessage = CurrentRow.Element("TOOLTIP").Value.ToString();
                }
                if (this.objStructureModify != null && this.objStructureModify.Rows.Count > 0)
                {
                    DataRow[] drStructureModify = this.objStructureModify.Select("HTML_CONTROL_ID='" + CurrentRow.Element("HTML_CONTROL_ID").Value.ToString() + "'");
                    if (drStructureModify.Length > 0)
                    {
                        if (!string.IsNullOrWhiteSpace(drStructureModify[0]["REQUIRED_FIELD_MESSAGE"].ToString()))
                            validationMessage = (drStructureModify[0]["REQUIRED_FIELD_MESSAGE"].ToString());

                        if (!string.IsNullOrWhiteSpace(drStructureModify[0]["ENABLE_REQUIREVALIDATION"].ToString()))
                            ENABLE_REQUIREVALIDATION = (drStructureModify[0]["ENABLE_REQUIREVALIDATION"].ToString().ToLower());
                    }
                }
                string autocompleteid = "Text_" + CurrentRow.Element("HTML_CONTROL_ID").Value.ToString();
                if (CurrentRow.Element("DATA_VALIDATE").Value.ToString().Length > 0)
                    textAttribute = "data-valid='" + CurrentRow.Element("DATA_VALIDATE").Value.ToString() + "' data-valid-msg='" + validationMessage + "'";

                if (CurrentRow.Element("TAB_INDEX").Value.ToString() != "")
                    textAttribute = textAttribute + " tabindex=" + Int16.Parse(CurrentRow.Element("TAB_INDEX").Value.ToString()) + " ";

                textAttribute = textAttribute + " controltype='autocomplete' ";

                if (CurrentRow.Element("LABEL_CELL_TEXT").Value.ToString().Length > 0)
                    textAttribute = textAttribute + " colname='" + CurrentRow.Element("LABEL_CELL_TEXT").Value.ToString().ToLower() + "' ";

                if (CurrentRow.Element("DATA_FIELDNAME").Value.ToString().Length > 0)
                {
                    if (false)
                        controlText = "<input type='hidden' name='" + CurrentRow.Element("HTML_CONTROL_ID").Value.ToString() + "' id='" + CurrentRow.Element("HTML_CONTROL_ID").Value.ToString() + "'" + (IsTrans == true ? (" recname='" + CurrentRow.Element("DATA_FIELDNAME").Value.ToString() + "'") : "") + "  value='" + CurrentPage.Request.Form[CurrentRow.Element("DATA_FIELDNAME").Value.ToString() + (this.objIndex > 0 ? "_" + (this.objIndex - 1).ToString() : "")] + "' /><input type='text' class='" + this._DATA_FIELD_CSSCLASS + "' name='" + autocompleteid + "'  id='" + autocompleteid + "' style='width:" + (CurrentRow.Element("WIDTH").Value.ToString() == "" ? "80" : CurrentRow.Element("WIDTH").Value.ToString()) + "px;' " + textAttribute + "  maxlength='" + CurrentRow.Element("MAXLENGTH").Value.ToString() + "'    value='" + CurrentPage.Request.Form[autocompleteid] + "' />";
                    else
                        controlText = "<input type='hidden' name='" + CurrentRow.Element("HTML_CONTROL_ID").Value.ToString() + "' id='" + CurrentRow.Element("HTML_CONTROL_ID").Value.ToString() + "'" + (IsTrans == true ? (" recname='" + CurrentRow.Element("DATA_FIELDNAME").Value.ToString() + "'") : "") + " value='" + GetBindFieldValue(CurrentRow.Element("DATA_FIELDNAME").Value.ToString()) + "' /><input type='text' class='" + this._DATA_FIELD_CSSCLASS + "' name='" + autocompleteid + "'  id='" + autocompleteid + "' " + (IsTrans == true ? (" recname='Text_" + CurrentRow.Element("DATA_FIELDNAME").Value.ToString() + "'") : "") + textAttribute + "  maxlength='" + CurrentRow.Element("MAXLENGTH").Value.ToString() + "' value='" + GetBindFieldValue(autocompleteid) + "' placeholder='" + placeholder + "' />";
                }
                else
                    controlText = "&nbsp;";

                if (CurrentRow.Element("DATA_VALIDATE").Value.ToString().Length > 0 || ENABLE_REQUIREVALIDATION == "true")
                {
                    string key = CurrentRow.Element("HTML_CONTROL_ID").Value.ToString();

                    if (!RequiredValidationDict.ContainsKey(key))
                        RequiredValidationDict.Add(key, validationMessage);

                }
            }

            return labelText = (IsMultiControl == false ? (@"<td class='" + this._DATA_CELL_CSSCLASS + "' >" + (isPrefix == false ?
                (controlText + spanControl) : (spanControl + "&nbsp;" + controlText)) +
                "</td>") : (isPrefix == false ?
                (controlText + spanControl) : (spanControl + "&nbsp;" + controlText)));
        }
        #endregion

        #region CreateDateCalenderControl
        private string CreateDateCalenderControl(XElement CurrentRow, bool IsTrans = false, bool IsMultiControl = false)
        {
            string labelText = "";
            string controlText = "";
            string textAttribute = "";
            string styleAttribute = "";
            if (this._FORM_ACTION == "SEARCH")
            {
                styleAttribute = "";//font-family: Verdana; font-size: 12px; position: relative; vertical-align: top; background-color: transparent;";
            }
            string spanControl = "";
            bool isPrefix = false;
            string placeholder = "";
            try
            {
                placeholder = CurrentRow.Element("PLACE_HOLDER").Value.ToString();
            }
            catch
            {
                placeholder = "";
            }
            if (_PageName == "SLI Details" && !string.IsNullOrEmpty(placeholder))
            {
                placeholder = placeholder.Replace("SLI", ((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).SysSetting["SLICaption"].ToString());
            }
            if (bool.Parse(CurrentRow.Element("VISIBLE").Value.ToString()) == true)
            {
                if (CurrentRow.Element("CONTROL_TOTAL").Value.ToString().Length > 0)
                {
                    spanControl = "&nbsp;<span id='_span" + CurrentRow.Element("HTML_CONTROL_ID").Value.ToString().ToUpper() + "_'></span>";
                    if (CurrentRow.Element("CONTROL_TOTAL").Value.ToString().IndexOf("-") >= 0)
                        isPrefix = true;
                }

                string validationMessage = CurrentRow.Element("REQUIRED_FIELD_MESSAGE").Value.ToString();
                string ENABLE_REQUIREVALIDATION = CurrentRow.Element("ENABLE_REQUIREVALIDATION").Value.ToString().ToLower();
                if (string.IsNullOrWhiteSpace(validationMessage))
                {
                    validationMessage = CurrentRow.Element("TOOLTIP").Value.ToString();
                }
                if (this.objStructureModify != null && this.objStructureModify.Rows.Count > 0)
                {
                    DataRow[] drStructureModify = this.objStructureModify.Select("HTML_CONTROL_ID='" + CurrentRow.Element("HTML_CONTROL_ID").Value.ToString() + "'");
                    if (drStructureModify.Length > 0)
                    {
                        if (!string.IsNullOrWhiteSpace(drStructureModify[0]["REQUIRED_FIELD_MESSAGE"].ToString()))
                            validationMessage = (drStructureModify[0]["REQUIRED_FIELD_MESSAGE"].ToString());

                        if (!string.IsNullOrWhiteSpace(drStructureModify[0]["ENABLE_REQUIREVALIDATION"].ToString()))
                            ENABLE_REQUIREVALIDATION = (drStructureModify[0]["ENABLE_REQUIREVALIDATION"].ToString().ToLower());
                    }
                }
                if (CurrentRow.Element("DATA_VALIDATE").Value.ToString().Length > 0)
                    textAttribute = "data-valid='" + CurrentRow.Element("DATA_VALIDATE").Value.ToString() + "' data-valid-msg='" + validationMessage + "'";

                if (CurrentRow.Element("LABEL_CELL_TEXT").Value.ToString().Length > 0)
                    textAttribute = textAttribute + " colname='" + CurrentRow.Element("LABEL_CELL_TEXT").Value.ToString().ToLower() + "' ";

                if (CurrentRow.Element("TAB_INDEX").Value.ToString() != "")
                    textAttribute = textAttribute + " tabindex=" + Int16.Parse(CurrentRow.Element("TAB_INDEX").Value.ToString()) + " ";

                if (CurrentRow.Element("ONBLUR_HANDLER").Value.ToString() != "")
                    textAttribute = textAttribute + " addonchange=" + CurrentRow.Element("ONBLUR_HANDLER").Value.ToString() + " ";

                textAttribute = textAttribute + "  controltype='datetype' ";

                if (CurrentRow.Element("TEXT_TYPE").Value.ToString().ToUpper() == "RANGE" && CurrentRow.Element("ALLOWCHAR").Value.ToString().IndexOf("!") > 0)
                {
                    string[] strDateControls = CurrentRow.Element("ALLOWCHAR").Value.ToString().Split('!');
                    if (strDateControls.Length == 2)
                    {
                        textAttribute = textAttribute + "  controltype='datetype' startControl='" + strDateControls[0] + "' endControl='" + strDateControls[1] + "' ";
                    }
                }

                if (CurrentRow.Element("DATA_FIELDNAME").Value.ToString().Length > 0)
                {
                    if (false)
                        controlText = "<input type='text' class='" + this._DATA_FIELD_CSSCLASS + "' name='" + CurrentRow.Element("HTML_CONTROL_ID").Value.ToString() + "'  id='" + CurrentRow.Element("HTML_CONTROL_ID").Value.ToString() + "'" + (IsTrans == true ? (" recname='" + CurrentRow.Element("DATA_FIELDNAME").Value.ToString() + "'") : "") + " style='width:" + (CurrentRow.Element("WIDTH").Value.ToString() == "" ? "90" : CurrentRow.Element("WIDTH").Value.ToString()) + "px;' " + textAttribute + "  maxlength='" + CurrentRow.Element("MAXLENGTH").Value.ToString() + "'    value='" + CurrentPage.Request.Form[CurrentRow.Element("DATA_FIELDNAME").Value.ToString() + (this.objIndex > 0 ? "_" + (this.objIndex - 1).ToString() : "")] + "' />";
                    else
                        controlText = "<input type='text' class='" + this._DATA_FIELD_CSSCLASS + "' name='" + CurrentRow.Element("HTML_CONTROL_ID").Value.ToString() + "'  id='" + CurrentRow.Element("HTML_CONTROL_ID").Value.ToString() + "'" + (IsTrans == true ? (" recname='" + CurrentRow.Element("DATA_FIELDNAME").Value.ToString() + "'") : "") + "  style='width:" + (CurrentRow.Element("WIDTH").Value.ToString() == "" ? "80" : CurrentRow.Element("WIDTH").Value.ToString()) + "px;" + styleAttribute + "' " + textAttribute + "  maxlength='" + CurrentRow.Element("MAXLENGTH").Value.ToString() + "' value='" + GetBindFieldValue(CurrentRow.Element("DATA_FIELDNAME").Value.ToString()) + "' placeholder='" + placeholder + "' />";
                }
                else
                    controlText = "&nbsp;";

                if (CurrentRow.Element("DATA_VALIDATE").Value.ToString().Length > 0)
                {
                    string key = CurrentRow.Element("HTML_CONTROL_ID").Value.ToString();
                    if (!RequiredValidationDict.ContainsKey(key))
                        RequiredValidationDict.Add(key, validationMessage);

                }
            }

            return labelText = (IsMultiControl == false ? (@"<td class='" + this._DATA_CELL_CSSCLASS + "' >" + (isPrefix == false ?
                (controlText + spanControl) : (spanControl + "&nbsp;" + controlText)) +
                "</td>") : (isPrefix == false ?
                (controlText + spanControl) : (spanControl + "&nbsp;" + controlText)));
        }
        #endregion

        #region FillRadioButtonListFromEnum
        public static void FillRadioButtonListFromEnum(RadioButtonList rbl, Type enumType, string firstValue, string firstText, bool addAdditionalValueInStarting)
        {
            Array values = Enum.GetValues(enumType);
            if (enumType.Name == "Active")
                Array.Reverse(values);
            foreach (int val in values)
                rbl.Items.Add(new ListItem(Enum.GetName(enumType, val).Replace('_', ' '), val.ToString()));
            if (firstValue != null || firstText != null)
                rbl.Items.Insert(addAdditionalValueInStarting ? 0 : rbl.Items.Count - 1, new ListItem(firstText, firstValue));

            if (values.Length > 0)
                rbl.SelectedIndex = 0;
            if (enumType.Name == "Active")
                rbl.SelectedValue = "0";
        }
        #endregion

        #region CreateDropDownControl
        private string CreateDropDownControl(XElement CurrentRow, bool IsTrans = false, bool IsMultiControl = false)
        {
            string labelText = "";
            string controlText = "";
            string tabIndex = "";
            string spanControl = "";
            bool isPrefix = false;
            if (bool.Parse(CurrentRow.Element("VISIBLE").Value.ToString()) == true)
            {
                if (CurrentRow.Element("CONTROL_TOTAL").Value.ToString().Length > 0)
                {
                    spanControl = "&nbsp;<span id='_span" + CurrentRow.Element("HTML_CONTROL_ID").Value.ToString().ToUpper() + "_'></span>";
                    if (CurrentRow.Element("CONTROL_TOTAL").Value.ToString().IndexOf("-") >= 0)
                        isPrefix = true;
                }

                if (CurrentRow.Element("TAB_INDEX").Value.ToString() != "")
                    tabIndex = " tabindex=" + Int16.Parse(CurrentRow.Element("TAB_INDEX").Value.ToString()) + " ";

                string textAttribute = "";
                if (CurrentRow.Element("LABEL_CELL_TEXT").Value.ToString().Length > 0)
                    textAttribute = textAttribute + " colname='" + CurrentRow.Element("LABEL_CELL_TEXT").Value.ToString().ToLower() + "' ";

                if (CurrentRow.Element("DATA_FIELDNAME").Value.ToString().Length > 0)
                {
                    if (false)
                        controlText = "<input type='text'" + tabIndex + textAttribute + " class='" + this._DATA_FIELD_CSSCLASS + "' name='" + CurrentRow.Element("HTML_CONTROL_ID").Value.ToString() + "'  id='" + CurrentRow.Element("HTML_CONTROL_ID").Value.ToString() + "'" + (IsTrans == true ? (" recname='" + CurrentRow.Element("DATA_FIELDNAME").Value.ToString() + "'") : "") + " value='" + CurrentPage.Request.Form[CurrentRow.Element("DATA_FIELDNAME").Value.ToString() + (this.objIndex > 0 ? "_" + (this.objIndex - 1).ToString() : "")] + "' />";
                    else
                        controlText = "<input type='text'" + tabIndex + textAttribute + "  class='" + this._DATA_FIELD_CSSCLASS + "' name='" + CurrentRow.Element("HTML_CONTROL_ID").Value.ToString() + "'  id='" + CurrentRow.Element("HTML_CONTROL_ID").Value.ToString() + "'" + (IsTrans == true ? (" recname='" + CurrentRow.Element("DATA_FIELDNAME").Value.ToString() + "'") : "") + " value='" + GetBindFieldValue(CurrentRow.Element("DATA_FIELDNAME").Value.ToString()) + "' />";
                }
                else
                    controlText = "&nbsp;";
            }
            return labelText = (IsMultiControl == false ? (@"<td class='" + this._DATA_CELL_CSSCLASS + "' >" + (isPrefix == false ?
                (controlText + spanControl) : (spanControl + "&nbsp;" + controlText)) +
                "</td>") : (isPrefix == false ?
                (controlText + spanControl) : (spanControl + "&nbsp;" + controlText)));
        }
        #endregion

        #region CreateCheckBoxControl
        private string CreateCheckBoxControl(XElement CurrentRow, bool IsTrans = false, bool IsMultiControl = false)
        {


            string EnumType = CurrentRow.Element("TEXT_TYPE").Value.ToString();
            string[] enumt = EnumType.Split('.');
            string labelText = "";
            string controlText = "";
            string tabIndex = "";
            string spanControl = "";
            bool isPrefix = false;

            if (bool.Parse(CurrentRow.Element("VISIBLE").Value.ToString()) == true)
            {
                if (CurrentRow.Element("CONTROL_TOTAL").Value.ToString().Length > 0)
                {
                    spanControl = "&nbsp;<span id='_span" + CurrentRow.Element("HTML_CONTROL_ID").Value.ToString().ToUpper() + "_'></span>";
                    if (CurrentRow.Element("CONTROL_TOTAL").Value.ToString().IndexOf("-") >= 0)
                        isPrefix = true;
                }

                if (CurrentRow.Element("TAB_INDEX").Value.ToString() != "")
                    tabIndex = " tabindex=" + Int16.Parse(CurrentRow.Element("TAB_INDEX").Value.ToString()) + " ";


                string checkedStatus = "";
                string textAttribute = "";
                string validationMessage = CurrentRow.Element("REQUIRED_FIELD_MESSAGE").Value.ToString();
                string ENABLE_REQUIREVALIDATION = CurrentRow.Element("ENABLE_REQUIREVALIDATION").Value.ToString().ToLower();
                if (string.IsNullOrWhiteSpace(validationMessage))
                {
                    validationMessage = CurrentRow.Element("TOOLTIP").Value.ToString();
                }
                if (this.objStructureModify != null && this.objStructureModify.Rows.Count > 0)
                {
                    DataRow[] drStructureModify = this.objStructureModify.Select("HTML_CONTROL_ID='" + CurrentRow.Element("HTML_CONTROL_ID").Value.ToString() + "'");
                    if (drStructureModify.Length > 0)
                    {
                        if (!string.IsNullOrWhiteSpace(drStructureModify[0]["REQUIRED_FIELD_MESSAGE"].ToString()))
                            validationMessage = (drStructureModify[0]["REQUIRED_FIELD_MESSAGE"].ToString());

                        if (!string.IsNullOrWhiteSpace(drStructureModify[0]["ENABLE_REQUIREVALIDATION"].ToString()))
                            ENABLE_REQUIREVALIDATION = (drStructureModify[0]["ENABLE_REQUIREVALIDATION"].ToString().ToLower());
                    }
                }
                if (CurrentRow.Element("DATA_VALIDATE").Value.ToString().Length > 0)
                    textAttribute = "data-valid='" + CurrentRow.Element("DATA_VALIDATE").Value.ToString() + (validationMessage != "" ? ("' data-valid-msg='" + validationMessage + "'") : "'");

                if (CurrentRow.Element("LABEL_CELL_TEXT").Value.ToString().Length > 0)
                    textAttribute = textAttribute + " colname='" + CurrentRow.Element("LABEL_CELL_TEXT").Value.ToString().ToLower() + "' ";

                string onclickevent = "";
                if (CurrentRow.Element("ONCLICK_HANDLER").Value.ToString().Length > 0)
                {
                    onclickevent = " onclick='" + CurrentRow.Element("ONCLICK_HANDLER").Value.ToString() + "' ";
                }
                if (CurrentRow.Element("TEXT_TYPE").Value.ToString().Length > 0)
                {
                    int Counter = 0;

                    string[] nameArr = GetArray(enumt[1].ToString());
                    ArrayList ValArr = GetArrayValue(enumt[1].ToString());

                    foreach (var Name in nameArr)
                    {
                        //string value = Enum.GetValues(typeof(Unit)).GetValue(v).ToString();
                        string check = GetBindFieldValue(CurrentRow.Element("HTML_CONTROL_ID").Value.ToString());
                        if ((check == "True" && Name == "Yes") || (check == "False" && Name == "No"))
                            check = Name;

                        if ((check == "" && Counter == 0) || (check == Name))
                            checkedStatus = "checked='True'";

                        string value = ValArr[Counter].ToString();
                        if (false)
                            controlText = controlText + "<input type='checkbox'" + tabIndex + " class='" + this._DATA_FIELD_CSSCLASS + "' name='" + CurrentRow.Element("HTML_CONTROL_ID").Value.ToString() + "'   id='" + CurrentRow.Element("HTML_CONTROL_ID").Value.ToString() + "' validatename='" + CurrentRow.Element("HTML_CONTROL_ID").Value.ToString() + "[]'" + (IsTrans == true ? (" recname='" + CurrentRow.Element("DATA_FIELDNAME").Value.ToString() + "'") : "") + " " + onclickevent + " value='" + value.ToString() + "'" + (Name == nameArr[nameArr.Length - 1] ? textAttribute : "") + "/>" + Name + "";
                        else
                            controlText = controlText + "<input type='checkbox'" + tabIndex + "  class='" + this._DATA_FIELD_CSSCLASS + "' name='" + CurrentRow.Element("HTML_CONTROL_ID").Value.ToString() + "' " + checkedStatus + "  id='" + CurrentRow.Element("HTML_CONTROL_ID").Value.ToString() + "' validatename='" + CurrentRow.Element("HTML_CONTROL_ID").Value.ToString() + "[]'" + (IsTrans == true ? (" recname='" + CurrentRow.Element("DATA_FIELDNAME").Value.ToString() + "'") : "") + " " + onclickevent + " value='" + value.ToString() + "'" + (Name == nameArr[nameArr.Length - 1] ? textAttribute : "") + "/>" + Name + "";
                        Counter++;
                    }
                }
                else
                {
                    string check = GetBindFieldValue(CurrentRow.Element("HTML_CONTROL_ID").Value.ToString());
                    if (check == "")
                        check = CurrentRow.Element("LOOKUP_NAME").Value.ToString();
                    if (check.ToUpper() == "TRUE")
                        checkedStatus = "checked='True'";
                    if (false)
                        controlText = controlText + "<input type='checkbox'" + tabIndex + " " + onclickevent + " class='" + this._DATA_FIELD_CSSCLASS + "' name='" + CurrentRow.Element("HTML_CONTROL_ID").Value.ToString() + "'   id='" + CurrentRow.Element("HTML_CONTROL_ID").Value.ToString() + "' " + textAttribute + " validatename='" + CurrentRow.Element("HTML_CONTROL_ID").Value.ToString() + "[]'" + (IsTrans == true ? (" recname='" + CurrentRow.Element("DATA_FIELDNAME").Value.ToString() + "'") : "") + " />";
                    else
                        controlText = controlText + "<input type='checkbox'" + tabIndex + " " + onclickevent + "  class='" + this._DATA_FIELD_CSSCLASS + "' name='" + CurrentRow.Element("HTML_CONTROL_ID").Value.ToString() + "' " + checkedStatus + "  id='" + CurrentRow.Element("HTML_CONTROL_ID").Value.ToString() + "' " + textAttribute + " validatename='" + CurrentRow.Element("HTML_CONTROL_ID").Value.ToString() + "[]'" + (IsTrans == true ? (" recname='" + CurrentRow.Element("DATA_FIELDNAME").Value.ToString() + "'") : "") + " />";


                }
            }
            return labelText = (IsMultiControl == false ? (@"<td class='" + this._DATA_CELL_CSSCLASS + "' >" + (isPrefix == false ?
                (controlText + spanControl) : (spanControl + "&nbsp;" + controlText)) +
                "</td>") : (isPrefix == false ?
                (controlText + spanControl) : (spanControl + "&nbsp;" + controlText)));
        }
        #endregion

        #region CreateButttonControl
        private string CreateButttonControl(XElement CurrentRow, bool IsMultiControl = false, string btnCss = "")
        {
            string labelText = "";
            string controlText = "";
            string tabIndex = "";
            string spanControl = "";
            string disable = "";
            bool isPrefix = false;
            if (bool.Parse(CurrentRow.Element("VISIBLE").Value.ToString()) == true)
            {
                if (CurrentRow.Element("CONTROL_TOTAL").Value.ToString().Length > 0)
                {
                    spanControl = "&nbsp;<span id='_span" + CurrentRow.Element("HTML_CONTROL_ID").Value.ToString().ToUpper() + "_'></span>";
                    if (CurrentRow.Element("CONTROL_TOTAL").Value.ToString().IndexOf("-") >= 0)
                        isPrefix = true;
                }

                if (CurrentRow.Element("TAB_INDEX").Value.ToString() != "")
                    tabIndex = " tabindex=" + Int16.Parse(CurrentRow.Element("TAB_INDEX").Value.ToString()) + " ";

                if (bool.Parse(CurrentRow.Element("READONLY").Value.ToString()) == true)
                    disable = " disabled='disabled'";

                string textAttribute = "";
                if (CurrentRow.Element("LABEL_CELL_TEXT").Value.ToString().Length > 0)
                    textAttribute = textAttribute + " colname='" + CurrentRow.Element("LABEL_CELL_TEXT").Value.ToString().ToLower() + "' ";

                if (CurrentRow.Element("DATA_FIELDNAME").Value.ToString().Length > 0)
                {

                    string onclickevent = "";
                    //DATA_FIELD_CSSCLASS
                    if (CurrentRow.Element("ONCLICK_HANDLER").Value.ToString().Length > 0)
                    {
                        onclickevent = " onclick='return " + CurrentRow.Element("ONCLICK_HANDLER").Value.ToString() + "' ";
                    }
                    if (false)
                        controlText = "<input type='button'" + tabIndex + textAttribute + " class='" + (this._DATA_FIELD_CSSCLASS == string.Empty ? CurrentRow.Element("ONCLICK_HANDLER").Value.ToString() : this._DATA_FIELD_CSSCLASS) + "' name='" + CurrentRow.Element("HTML_CONTROL_ID").Value.ToString() + "'  id='" + CurrentRow.Element("HTML_CONTROL_ID").Value.ToString() + "' style='width:" + (CurrentRow.Element("WIDTH").Value.ToString() == "" ? "80" : CurrentRow.Element("WIDTH").Value.ToString()) + "px;' value='" + CurrentRow.Element("LABEL_CELL_TEXT").Value.ToString() + "'" + onclickevent + " " + disable + " />";
                    else
                        controlText = "<input type='button'" + tabIndex + textAttribute + "  class='" + (btnCss != "" ? btnCss : this._DATA_FIELD_CSSCLASS) + "' name='" + CurrentRow.Element("HTML_CONTROL_ID").Value.ToString() + "'  id='" + CurrentRow.Element("HTML_CONTROL_ID").Value.ToString() + "' style='width:" + (CurrentRow.Element("WIDTH").Value.ToString() == "" ? "80" : CurrentRow.Element("WIDTH").Value.ToString()) + "px;' value='" + CurrentRow.Element("LABEL_CELL_TEXT").Value.ToString() + "'" + onclickevent + " " + disable + " />";
                }
                else
                    controlText = "&nbsp;";
            }
            return labelText = (IsMultiControl == false ? (@"<td class='" + this._DATA_CELL_CSSCLASS + "' >" + (isPrefix == false ?
                (controlText + spanControl) : (spanControl + "&nbsp;" + controlText)) +
                "</td>") : (isPrefix == false ?
                (controlText + spanControl) : (spanControl + "&nbsp;" + controlText)));

        }
        #endregion

        #region CreateCheckBoxListControl
        private string CreateCheckBoxListControl(XElement CurrentRow, bool IsTrans = false, bool IsMultiControl = false)
        {
            string EnumType = CurrentRow.Element("TEXT_TYPE").Value.ToString();
            string[] enumt = EnumType.Split('.');
            string labelText = "";
            string controlText = "";
            string tabIndex = "";
            string spanControl = "";
            bool isPrefix = false;
            if (bool.Parse(CurrentRow.Element("VISIBLE").Value.ToString()) == true)
            {
                if (CurrentRow.Element("CONTROL_TOTAL").Value.ToString().Length > 0)
                {
                    spanControl = "&nbsp;<span id='_span" + CurrentRow.Element("HTML_CONTROL_ID").Value.ToString().ToUpper() + "_'></span>";
                    if (CurrentRow.Element("CONTROL_TOTAL").Value.ToString().IndexOf("-") >= 0)
                        isPrefix = true;
                }

                if (CurrentRow.Element("TAB_INDEX").Value.ToString() != "")
                    tabIndex = " tabindex=" + Int16.Parse(CurrentRow.Element("TAB_INDEX").Value.ToString()) + " ";

                if (CurrentRow.Element("TEXT_TYPE").Value.ToString().Length > 0)
                {
                    int Counter = 0;
                    string checkedStatus = "";
                    string[] nameArr = GetArray(enumt[1].ToString());
                    ArrayList ValArr = GetArrayValue(enumt[1].ToString());
                    string check = GetBindFieldValue(CurrentRow.Element("HTML_CONTROL_ID").Value.ToString());
                    string[] checkvalue = check.Split(',');
                    string textAttribute = "";
                    string validationMessage = CurrentRow.Element("REQUIRED_FIELD_MESSAGE").Value.ToString();
                    string ENABLE_REQUIREVALIDATION = CurrentRow.Element("ENABLE_REQUIREVALIDATION").Value.ToString().ToLower();
                    if (string.IsNullOrWhiteSpace(validationMessage))
                    {
                        validationMessage = CurrentRow.Element("TOOLTIP").Value.ToString();
                    }
                    if (this.objStructureModify != null && this.objStructureModify.Rows.Count > 0)
                    {
                        DataRow[] drStructureModify = this.objStructureModify.Select("HTML_CONTROL_ID='" + CurrentRow.Element("HTML_CONTROL_ID").Value.ToString() + "'");
                        if (drStructureModify.Length > 0)
                        {
                            if (!string.IsNullOrWhiteSpace(drStructureModify[0]["REQUIRED_FIELD_MESSAGE"].ToString()))
                                validationMessage = (drStructureModify[0]["REQUIRED_FIELD_MESSAGE"].ToString());

                            if (!string.IsNullOrWhiteSpace(drStructureModify[0]["ENABLE_REQUIREVALIDATION"].ToString()))
                                ENABLE_REQUIREVALIDATION = (drStructureModify[0]["ENABLE_REQUIREVALIDATION"].ToString().ToLower());
                        }
                    }
                    if (CurrentRow.Element("DATA_VALIDATE").Value.ToString().Length > 0)
                        textAttribute = "data-valid='" + CurrentRow.Element("DATA_VALIDATE").Value.ToString() + (validationMessage != "" ? ("' data-valid-msg='" + validationMessage + "'") : "'");

                    
                    if (CurrentRow.Element("LABEL_CELL_TEXT").Value.ToString().Length > 0)
                        textAttribute = textAttribute + " colname='" + CurrentRow.Element("LABEL_CELL_TEXT").Value.ToString().ToLower() + "' ";

                    foreach (var Name in nameArr)
                    {
                        string value = ValArr[Counter].ToString();
                        if (checkvalue.Length > 0)
                        {
                            checkedStatus = Array.Exists(checkvalue, element => element == value) ? "checked='True'" : "";
                        }
                        if (false)
                        {
                            if (System.Web.HttpContext.Current.Request.Form[CurrentRow.Element("HTML_CONTROL_ID").Value.ToString()] != null && System.Web.HttpContext.Current.Request.Form[CurrentRow.Element("HTML_CONTROL_ID").Value.ToString()].ToString().Contains(value.ToString()))
                                controlText = controlText + "<input type='checkbox'" + tabIndex + "  class='" + this._DATA_FIELD_CSSCLASS + "' name='" + CurrentRow.Element("HTML_CONTROL_ID").Value.ToString() + "'  checked='checked' id='" + CurrentRow.Element("HTML_CONTROL_ID").Value.ToString() + "' validatename='" + CurrentRow.Element("HTML_CONTROL_ID").Value.ToString() + "[]'" + (IsTrans == true ? (" recname='" + CurrentRow.Element("DATA_FIELDNAME").Value.ToString() + "'") : "") + " value='" + value.ToString() + "'" + (Name == nameArr[nameArr.Length - 1] ? textAttribute : "") + "/>" + Name + "";
                            else
                                controlText = controlText + "<input type='checkbox'" + tabIndex + "  class='" + this._DATA_FIELD_CSSCLASS + "' name='" + CurrentRow.Element("HTML_CONTROL_ID").Value.ToString() + "' " + checkedStatus + " id='" + CurrentRow.Element("HTML_CONTROL_ID").Value.ToString() + "' validatename='" + CurrentRow.Element("HTML_CONTROL_ID").Value.ToString() + "[]'" + (IsTrans == true ? (" recname='" + CurrentRow.Element("DATA_FIELDNAME").Value.ToString() + "'") : "") + " value='" + value.ToString() + "'" + (Name == nameArr[nameArr.Length - 1] ? textAttribute : "") + "/>" + Name + "";
                        }
                        else
                        {
                            if (System.Web.HttpContext.Current.Request.Form[CurrentRow.Element("HTML_CONTROL_ID").Value.ToString()] != null && System.Web.HttpContext.Current.Request.Form[CurrentRow.Element("HTML_CONTROL_ID").Value.ToString()].ToString().Contains(value.ToString()))
                                controlText = controlText + "<input type='checkbox'" + tabIndex + "  class='" + this._DATA_FIELD_CSSCLASS + "' name='" + CurrentRow.Element("HTML_CONTROL_ID").Value.ToString() + "'  checked='checked' id='" + CurrentRow.Element("HTML_CONTROL_ID").Value.ToString() + "' validatename='" + CurrentRow.Element("HTML_CONTROL_ID").Value.ToString() + "[]'" + (IsTrans == true ? (" recname='" + CurrentRow.Element("DATA_FIELDNAME").Value.ToString() + "'") : "") + " value='" + value.ToString() + "'" + (Name == nameArr[nameArr.Length - 1] ? textAttribute : "") + "/>" + Name + "";
                            else
                                controlText = controlText + "<input type='checkbox'" + tabIndex + "  class='" + this._DATA_FIELD_CSSCLASS + "' name='" + CurrentRow.Element("HTML_CONTROL_ID").Value.ToString() + "' " + checkedStatus + " id='" + CurrentRow.Element("HTML_CONTROL_ID").Value.ToString() + "' validatename='" + CurrentRow.Element("HTML_CONTROL_ID").Value.ToString() + "[]'" + (IsTrans == true ? (" recname='" + CurrentRow.Element("DATA_FIELDNAME").Value.ToString() + "'") : "") + " value='" + value.ToString() + "'" + (Name == nameArr[nameArr.Length - 1] ? textAttribute : "") + "/>" + Name + "";

                        }
                        Counter++;
                    }
                }
                else
                    controlText = "&nbsp;";
            }
            return labelText = (IsMultiControl == false ? (@"<td class='" + this._DATA_CELL_CSSCLASS + "' >" + (isPrefix == false ?
                (controlText + spanControl) : (spanControl + "&nbsp;" + controlText)) +
                "</td>") : (isPrefix == false ?
                (controlText + spanControl) : (spanControl + "&nbsp;" + controlText)));
        }
        #endregion

        #region GetEnumType

        public ArrayList GetArrayValue(string GetEnum)
        {
            ArrayList ArrayValueEnum = new ArrayList();
            switch (GetEnum)
            {
                case "UNIT":
                    foreach (int b in Enum.GetValues(typeof(UNIT)))
                        ArrayValueEnum.Add(b);
                    break;
                case "WMSPAYMENTTYPE":
                    foreach (int b in Enum.GetValues(typeof(WMSPAYMENTTYPE)))
                        ArrayValueEnum.Add(b);
                    break;
                case "DOTYPE":
                    foreach (int b in Enum.GetValues(typeof(DOTYPE)))
                        ArrayValueEnum.Add(b);
                    break;
                case "SCANTYPE":
                    foreach (int b in Enum.GetValues(typeof(SCANTYPE)))
                        ArrayValueEnum.Add(b);
                    break;
                case "SHIPMENTTYPE":
                    foreach (int b in Enum.GetValues(typeof(SHIPMENTTYPE)))
                        ArrayValueEnum.Add(b);
                    break;
                case "ACTIVE":
                    foreach (int b in Enum.GetValues(typeof(ACTIVE)))
                        ArrayValueEnum.Add(b);
                    break;
                case "ISACTIVE":
                    foreach (int b in Enum.GetValues(typeof(ISACTIVE)))
                        ArrayValueEnum.Add(b);
                    break;
                case "ApprovedISACTIVE":
                    foreach (int b in Enum.GetValues(typeof(ApprovedISACTIVE)))
                        ArrayValueEnum.Add(b);
                    break;
                case "TYPEBOOLEAN":
                    foreach (int b in Enum.GetValues(typeof(TYPEBOOLEAN)))
                        ArrayValueEnum.Add(b);
                    break;
                case "LOGINTYPE":
                    foreach (int b in Enum.GetValues(typeof(LOGINTYPE)))
                        ArrayValueEnum.Add(b);
                    break;
                case "DAYS":
                    foreach (int b in Enum.GetValues(typeof(DAYS)))
                        ArrayValueEnum.Add(b);
                    break;
                case "PAYMENTMODE":
                    foreach (int b in Enum.GetValues(typeof(PAYMENTMODE)))
                        ArrayValueEnum.Add(b);
                    break;
                case "PAYMENTTYPE":
                    foreach (int b in Enum.GetValues(typeof(PAYMENTTYPE)))
                        ArrayValueEnum.Add(b);
                    break;
                case "INCENTIVEBASEDON":
                    foreach (int b in Enum.GetValues(typeof(INCENTIVEBASEDON)))
                        ArrayValueEnum.Add(b);
                    break;
                case "FREIGHTTYPE":
                    foreach (int b in Enum.GetValues(typeof(FREIGHTTYPE)))
                        ArrayValueEnum.Add(b);
                    break;
                case "BILLINGONBOOKING":
                    foreach (int b in Enum.GetValues(typeof(BILLINGONBOOKING)))
                        ArrayValueEnum.Add(b);
                    break;
                case "TRANSACTIONTYPE":
                    foreach (int b in Enum.GetValues(typeof(TRANSACTIONTYPE)))
                        ArrayValueEnum.Add(b);
                    break;
                case "STTPTYPE":
                    foreach (int b in Enum.GetValues(typeof(STTPTYPE)))
                        ArrayValueEnum.Add(b);
                    break;
                case "STOTYPE":
                    foreach (int b in Enum.GetValues(typeof(STOTYPE)))
                        ArrayValueEnum.Add(b);
                    break;
                case "PAYMENTREQUESTTYPE":
                    foreach (int b in Enum.GetValues(typeof(PAYMENTREQUESTTYPE)))
                        ArrayValueEnum.Add(b);
                    break;
                case "ADJUSTMENTTO":
                    foreach (int b in Enum.GetValues(typeof(ADJUSTMENTTO)))
                        ArrayValueEnum.Add(b);
                    break;
                case "ADJUSTMENTTYPE":
                    foreach (int b in Enum.GetValues(typeof(ADJUSTMENTTYPE)))
                        ArrayValueEnum.Add(b);
                    break;
                case "SLITYPE":
                    foreach (int b in Enum.GetValues(typeof(SLITYPE)))
                        ArrayValueEnum.Add(b);
                    break;
                case "CREATEACCOUNT":
                    foreach (int b in Enum.GetValues(typeof(CREATEACCOUNT)))
                        ArrayValueEnum.Add(b);
                    break;
                case "ISUPLOAD":
                    foreach (int b in Enum.GetValues(typeof(ISUPLOAD)))
                        ArrayValueEnum.Add(b);
                    break;



                case "XRAYTYPE":
                    foreach (int b in Enum.GetValues(typeof(XRAYTYPE)))
                        ArrayValueEnum.Add(b);
                    break;

                case "AWBLIST":
                    foreach (int b in Enum.GetValues(typeof(AWBLIST)))
                        ArrayValueEnum.Add(b);
                    break;
                case "ISTEAMPERSONNEL":
                    foreach (int b in Enum.GetValues(typeof(ISTEAMPERSONNEL)))
                        ArrayValueEnum.Add(b);
                    break;
                case "DOCUMENTTYPE":
                    foreach (int b in Enum.GetValues(typeof(DOCUMENTTYPE)))
                        ArrayValueEnum.Add(b);
                    break;
                case "AWBXrayType":
                    foreach (int b in Enum.GetValues(typeof(AWBXrayType)))
                        ArrayValueEnum.Add(b);
                    break;
                case "AWBXrayFault":
                    foreach (int b in Enum.GetValues(typeof(AWBXrayFault)))
                        ArrayValueEnum.Add(b);
                    break;
                case "CREDITDEBITNOTETYPE":
                    foreach (int b in Enum.GetValues(typeof(CREDITDEBITNOTETYPE)))
                        ArrayValueEnum.Add(b);
                    break;
                case "EXPORTORTRANSIT":
                    foreach (int b in Enum.GetValues(typeof(EXPORTORTRANSIT)))
                        ArrayValueEnum.Add(b);
                    break;
                case "ISSUETYPE":
                    foreach (int b in Enum.GetValues(typeof(ISSUETYPE)))
                        ArrayValueEnum.Add(b);
                    break;
                case "TRUCKSOURCE":
                    foreach (int b in Enum.GetValues(typeof(TRUCKSOURCE)))
                        ArrayValueEnum.Add(b);
                    break;
                case "SCHEDULETRIP":
                    foreach (int b in Enum.GetValues(typeof(SCHEDULETRIP)))
                        ArrayValueEnum.Add(b);
                    break;
                case "BUILDUPCONSUMABLETYPE":
                    foreach (int b in Enum.GetValues(typeof(BUILDUPCONSUMABLETYPE)))
                        ArrayValueEnum.Add(b);
                    break;
                case "SLIBUILDUPTYPE":
                    foreach (int b in Enum.GetValues(typeof(SLIBUILDUPTYPE)))
                        ArrayValueEnum.Add(b);
                    break;
                case "FLIGHTTYPE":
                    foreach (int b in Enum.GetValues(typeof(FLIGHTTYPE)))
                        ArrayValueEnum.Add(b);
                    break;
                case "ACCOUNTTYPEID":
                    foreach (int b in Enum.GetValues(typeof(ACCOUNTTYPEID)))
                        ArrayValueEnum.Add(b);
                    break;
                case "ACCEPTANCEUNIT":
                    foreach (int b in Enum.GetValues(typeof(ACCEPTANCEUNIT)))
                        ArrayValueEnum.Add(b);
                    break;
                case "SLIUNIT":
                    foreach (int b in Enum.GetValues(typeof(SLIUNIT)))
                        ArrayValueEnum.Add(b);
                    break;
                case "REPAIR":
                    foreach (int b in Enum.GetValues(typeof(REPAIR)))
                        ArrayValueEnum.Add(b);
                    break;
                case "APPROVED":
                    foreach (int b in Enum.GetValues(typeof(APPROVED)))
                        ArrayValueEnum.Add(b);
                    break;
                case "MAWBCHARGES":
                    foreach (int b in Enum.GetValues(typeof(MAWBCHARGES)))
                        ArrayValueEnum.Add(b);
                    break;
                case "TYPE":
                    foreach (int b in Enum.GetValues(typeof(TYPE)))
                        ArrayValueEnum.Add(b);
                    break;
                case "DIMENSIONMANDATORYON":
                    foreach (int b in Enum.GetValues(typeof(DIMENSIONMANDATORYON)))
                        ArrayValueEnum.Add(b);
                    break;
                // ADD ISSUEFREIGHTINVOICE BY UMAR //
                case "ISSUEFREIGHTINVOICE":
                    foreach (int b in Enum.GetValues(typeof(ISSUEFREIGHTINVOICE)))
                        ArrayValueEnum.Add(b);
                    break;

            }
            return ArrayValueEnum;
        }

        public string[] GetArray(string GetEnum)
        {
            string[] ArrayEnum = null;
            switch (GetEnum)
            {
                case "UNIT":
                    ArrayEnum = Enum.GetNames(typeof(UNIT));
                    break;
                case "SLIBUILDUPTYPE":
                    ArrayEnum = Enum.GetNames(typeof(SLIBUILDUPTYPE));
                    break;
                case "XRAYTYPE":
                    ArrayEnum = Enum.GetNames(typeof(XRAYTYPE));
                    break;
                case "WMSPAYMENTTYPE":
                    ArrayEnum = Enum.GetNames(typeof(WMSPAYMENTTYPE));
                    break;
                case "DOTYPE":
                    ArrayEnum = Enum.GetNames(typeof(DOTYPE));
                    break;
                case "SCANTYPE":
                    ArrayEnum = Enum.GetNames(typeof(SCANTYPE));
                    break;
                case "SHIPMENTTYPE":
                    ArrayEnum = Enum.GetNames(typeof(SHIPMENTTYPE));
                    break;
                case "ACTIVE":
                    ArrayEnum = Enum.GetNames(typeof(ACTIVE));
                    break;
                case "ISACTIVE":
                    ArrayEnum = Enum.GetNames(typeof(ISACTIVE));
                    break;
                case "ApprovedISACTIVE":
                    ArrayEnum = Enum.GetNames(typeof(ApprovedISACTIVE));
                    break;
                case "TYPEBOOLEAN":
                    ArrayEnum = Enum.GetNames(typeof(TYPEBOOLEAN));
                    break;
                case "LOGINTYPE":
                    ArrayEnum = Enum.GetNames(typeof(LOGINTYPE));
                    break;
                case "DAYS":
                    ArrayEnum = Enum.GetNames(typeof(DAYS));
                    break;
                case "PAYMENTMODE":
                    ArrayEnum = Enum.GetNames(typeof(PAYMENTMODE));
                    break;
                case "PAYMENTTYPE":
                    ArrayEnum = Enum.GetNames(typeof(PAYMENTTYPE));
                    break;
                case "INCENTIVEBASEDON":
                    ArrayEnum = Enum.GetNames(typeof(INCENTIVEBASEDON));
                    break;
                case "FREIGHTTYPE":
                    ArrayEnum = Enum.GetNames(typeof(FREIGHTTYPE));
                    break;
                case "BILLINGONBOOKING":
                    ArrayEnum = Enum.GetNames(typeof(BILLINGONBOOKING));
                    break;
                case "TRANSACTIONTYPE":
                    ArrayEnum = Enum.GetNames(typeof(TRANSACTIONTYPE));
                    break;
                case "STTPTYPE":
                    ArrayEnum = Enum.GetNames(typeof(STTPTYPE));
                    break;
                case "STOTYPE":
                    ArrayEnum = Enum.GetNames(typeof(STOTYPE));
                    break;
                case "PAYMENTREQUESTTYPE":
                    ArrayEnum = Enum.GetNames(typeof(PAYMENTREQUESTTYPE));
                    break;
                case "ADJUSTMENTTO":
                    ArrayEnum = Enum.GetNames(typeof(ADJUSTMENTTO));
                    break;
                case "ADJUSTMENTTYPE":
                    ArrayEnum = Enum.GetNames(typeof(ADJUSTMENTTYPE));
                    break;
                case "SLITYPE":
                    ArrayEnum = Enum.GetNames(typeof(SLITYPE));
                    break;
                case "CREATEACCOUNT":
                    ArrayEnum = Enum.GetNames(typeof(CREATEACCOUNT));
                    break;
                case "ISUPLOAD":
                    ArrayEnum = Enum.GetNames(typeof(ISUPLOAD));
                    break;
                case "AWBLIST":
                    ArrayEnum = Enum.GetNames(typeof(AWBLIST));
                    break;
                case "ISTEAMPERSONNEL":
                    ArrayEnum = Enum.GetNames(typeof(ISTEAMPERSONNEL));
                    break;
                case "DOCUMENTTYPE":
                    ArrayEnum = Enum.GetNames(typeof(DOCUMENTTYPE));
                    break;
                case "AWBXrayType":
                    ArrayEnum = Enum.GetNames(typeof(AWBXrayType));
                    break;
                case "AWBXrayFault":
                    ArrayEnum = Enum.GetNames(typeof(AWBXrayFault));
                    break;
                case "CREDITDEBITNOTETYPE":
                    ArrayEnum = Enum.GetNames(typeof(CREDITDEBITNOTETYPE));
                    break;
                case "EXPORTORTRANSIT":
                    ArrayEnum = Enum.GetNames(typeof(EXPORTORTRANSIT));
                    break;
                case "ISSUETYPE":
                    ArrayEnum = Enum.GetNames(typeof(ISSUETYPE));
                    break;
                // add by umar ISSUEFREIGHTINVOICE //
                case "ISSUEFREIGHTINVOICE":
                    ArrayEnum = Enum.GetNames(typeof(ISSUEFREIGHTINVOICE));
                    break;
                case "TRUCKSOURCE":
                    ArrayEnum = Enum.GetNames(typeof(TRUCKSOURCE));
                    break;
                case "SCHEDULETRIP":
                    ArrayEnum = Enum.GetNames(typeof(SCHEDULETRIP));
                    break;
                case "BUILDUPCONSUMABLETYPE":
                    ArrayEnum = Enum.GetNames(typeof(BUILDUPCONSUMABLETYPE));
                    break;
                case "FLIGHTTYPE":
                    ArrayEnum = Enum.GetNames(typeof(FLIGHTTYPE));
                    break;
                case "ACCEPTANCEUNIT":
                    ArrayEnum = Enum.GetNames(typeof(ACCEPTANCEUNIT));
                    break;
                case "SLIUNIT":
                    ArrayEnum = Enum.GetNames(typeof(SLIUNIT));
                    break;
                case "REPAIR":
                    ArrayEnum = Enum.GetNames(typeof(REPAIR));
                    break;
                case "APPROVED":
                    ArrayEnum = Enum.GetNames(typeof(APPROVED));
                    break;
                case "MAWBCHARGES":
                    ArrayEnum = Enum.GetNames(typeof(MAWBCHARGES));
                    break;
                case "TYPE":
                    ArrayEnum = Enum.GetNames(typeof(TYPE));
                    break;
                case "DIMENSIONMANDATORYON":
                    ArrayEnum = Enum.GetNames(typeof(DIMENSIONMANDATORYON));
                    break;

            }
            return ArrayEnum;
        }
        #endregion

        #region CreateRadioButtonListControl
        private string CreateRadioButtonListControl(XElement CurrentRow, bool IsTrans = false, bool IsMultiControl = false)
        {
            string EnumType = CurrentRow.Element("TEXT_TYPE").Value.ToString();
            String DisplayName = CurrentRow.Element("LABEL_CELL_TEXT").Value.ToString();
            string[] enumt = EnumType.Split('.');

            string labelText = "";
            string controlText = "";
            string tabIndex = "";
            string spanControl = "";
            bool isPrefix = false;
            if (bool.Parse(CurrentRow.Element("VISIBLE").Value.ToString()) == true)
            {
                if (CurrentRow.Element("CONTROL_TOTAL").Value.ToString().Length > 0)
                {
                    spanControl = "&nbsp;<span id='_span" + CurrentRow.Element("HTML_CONTROL_ID").Value.ToString().ToUpper() + "_'></span>";
                    if (CurrentRow.Element("CONTROL_TOTAL").Value.ToString().IndexOf("-") >= 0)
                        isPrefix = true;
                }

                if (CurrentRow.Element("TAB_INDEX").Value.ToString() != "")
                    tabIndex = " tabindex=" + Int16.Parse(CurrentRow.Element("TAB_INDEX").Value.ToString()) + " ";

                if (CurrentRow.Element("TEXT_TYPE").Value.ToString().Length > 0)
                {

                    string onclickevent = "";
                    if (CurrentRow.Element("ONCLICK_HANDLER").Value.ToString().Length > 0)
                    {
                        onclickevent = " onclick='" + CurrentRow.Element("ONCLICK_HANDLER").Value.ToString() + "' ";
                    }
                    //controlText = controlText + "<input type='hidden' name='" + CurrentRow.Element("HTML_CONTROL_ID").Value.ToString() + "' value='' />";
                    string[] nameArr = GetArray(enumt[1].ToString());
                    ArrayList ValArr = GetArrayValue(enumt[1].ToString());
                    int Counter = 0;
                    string textAttribute = "";
                    string validationMessage = CurrentRow.Element("REQUIRED_FIELD_MESSAGE").Value.ToString();
                    string ENABLE_REQUIREVALIDATION = CurrentRow.Element("ENABLE_REQUIREVALIDATION").Value.ToString().ToLower();
                    if (string.IsNullOrWhiteSpace(validationMessage))
                    {
                        validationMessage = CurrentRow.Element("TOOLTIP").Value.ToString();
                    }
                    if (this.objStructureModify != null && this.objStructureModify.Rows.Count > 0)
                    {
                        DataRow[] drStructureModify = this.objStructureModify.Select("HTML_CONTROL_ID='" + CurrentRow.Element("HTML_CONTROL_ID").Value.ToString() + "'");
                        if (drStructureModify.Length > 0)
                        {
                            if (!string.IsNullOrWhiteSpace(drStructureModify[0]["REQUIRED_FIELD_MESSAGE"].ToString()))
                                validationMessage = (drStructureModify[0]["REQUIRED_FIELD_MESSAGE"].ToString());

                            if (!string.IsNullOrWhiteSpace(drStructureModify[0]["ENABLE_REQUIREVALIDATION"].ToString()))
                                ENABLE_REQUIREVALIDATION = (drStructureModify[0]["ENABLE_REQUIREVALIDATION"].ToString().ToLower());
                        }
                    }
                    if (CurrentRow.Element("DATA_VALIDATE").Value.ToString().Length > 0)
                        textAttribute = "data-valid='" + CurrentRow.Element("DATA_VALIDATE").Value.ToString() + (validationMessage != "" ? ("' data-valid-msg='" + validationMessage + "'") : "'");

                    
                    if (CurrentRow.Element("LABEL_CELL_TEXT").Value.ToString().Length > 0)
                        textAttribute = textAttribute + " colname='" + CurrentRow.Element("LABEL_CELL_TEXT").Value.ToString().ToLower() + "' ";

                    foreach (var Name in nameArr)
                    {
                        string b = "";
                        string value = ValArr[Counter].ToString();
                        string check = GetBindFieldValue(CurrentRow.Element("DATA_FIELDNAME").Value.ToString());
                        if ((check == "True" && Name == "Yes") || (check == "False" && Name == "No"))
                        {
                            check = Name;
                        }
                        else if ((check == "True" && Name == "Revenue") || (check == "False" && Name == "Weight"))
                        {
                            check = Name;
                        }

                        if ((check == "" && Counter == 0) || (check == Name))
                            b = "checked='True'";

                        var TheName = Name;
                        if (Name == "Gr_Wt")
                            TheName = "Gr. Wt.";
                        if (Name == "Ch_Wt")
                            TheName = "Ch. Wt.";
                        if (Name.ToLower() == "agent")
                            TheName = "Forwarder (Agent)";
                        // add by umar ==========
                        if (Name == "Handling")
                            TheName = "Handling Invoice";
                        if (Name == "Freight")
                            TheName = "Freight Invoice";
                        // end ===================
                        if (false)
                        {

                            if (false)
                                controlText = controlText + "<input type='radio'" + tabIndex + " data-radioval='" + TheName.Replace("_", " ") + "'  class='" + this._DATA_FIELD_CSSCLASS + "' name='" + CurrentRow.Element("HTML_CONTROL_ID").Value.ToString() + "'  checked='checked' id='" + CurrentRow.Element("HTML_CONTROL_ID").Value.ToString() + "'" + (IsTrans == true ? (" recname='" + CurrentRow.Element("DATA_FIELDNAME").Value.ToString() + "'") : "") + " value='" + value.ToString() + "'" + (Name == nameArr[nameArr.Length - 1] ? textAttribute : "") + " " + onclickevent + "/>" + TheName.Replace("_", " ") + "";
                            else
                                controlText = controlText + "<input type='radio'" + tabIndex + " data-radioval='" + TheName.Replace("_", " ") + "'  class='" + this._DATA_FIELD_CSSCLASS + "' name='" + CurrentRow.Element("HTML_CONTROL_ID").Value.ToString() + "'  id='" + CurrentRow.Element("HTML_CONTROL_ID").Value.ToString() + "'" + (IsTrans == true ? (" recname='" + CurrentRow.Element("DATA_FIELDNAME").Value.ToString() + "'") : "") + " value='" + value.ToString() + "'" + (Name == nameArr[nameArr.Length - 1] ? textAttribute : "") + " " + onclickevent + "/>" + TheName.Replace("_", " ") + "";
                        }
                        else
                        {
                            if (false)
                                controlText = controlText + "<input type='radio'" + tabIndex + " data-radioval='" + TheName.Replace("_", " ") + "'  class='" + this._DATA_FIELD_CSSCLASS + "' name='" + CurrentRow.Element("HTML_CONTROL_ID").Value.ToString() + "'  checked='checked' id='" + CurrentRow.Element("HTML_CONTROL_ID").Value.ToString() + "'" + (IsTrans == true ? (" recname='" + CurrentRow.Element("DATA_FIELDNAME").Value.ToString() + "'") : "") + " value='" + value.ToString() + "'" + (Name == nameArr[nameArr.Length - 1] ? textAttribute : "") + " " + onclickevent + "/>" + TheName.Replace("_", " ") + "";
                            else
                                controlText = controlText + " " + "<input type='radio'" + tabIndex + " data-radioval='" + TheName.Replace("_", " ") + "'  class='" + this._DATA_FIELD_CSSCLASS + "' name='" + CurrentRow.Element("HTML_CONTROL_ID").Value.ToString() + "' " + b + " id='" + CurrentRow.Element("HTML_CONTROL_ID").Value.ToString() + "'" + (IsTrans == true ? (" recname='" + CurrentRow.Element("DATA_FIELDNAME").Value.ToString() + "'") : "") + " value='" + value.ToString() + "'" + (Name == nameArr[nameArr.Length - 1] ? textAttribute : "") + " " + onclickevent + "/>" + TheName.Replace("_", " ") + "";

                        }
                        Counter++;
                    }
                }
                else
                    controlText = "&nbsp;";
            }
            return labelText = (IsMultiControl == false ? (@"<td class='" + this._DATA_CELL_CSSCLASS + "' >" + (isPrefix == false ?
                (controlText + spanControl) : (spanControl + "&nbsp;" + controlText)) +
                "</td>") : (isPrefix == false ?
                (controlText + spanControl) : (spanControl + "&nbsp;" + controlText)));
        }
        #endregion

        #region CreateRadioButtonControl
        private string CreateRadioButtonControl(XElement CurrentRow, bool IsTrans = false, bool IsMultiControl = false)
        {

            string labelText = "";
            string controlText = "";
            string tabIndex = "";
            string spanControl = "";
            bool isPrefix = false;
            if (bool.Parse(CurrentRow.Element("VISIBLE").Value.ToString()) == true)
            {
                if (CurrentRow.Element("CONTROL_TOTAL").Value.ToString().Length > 0)
                {
                    spanControl = "&nbsp;<span id='_span" + CurrentRow.Element("HTML_CONTROL_ID").Value.ToString().ToUpper() + "_'></span>";
                    if (CurrentRow.Element("CONTROL_TOTAL").Value.ToString().IndexOf("-") >= 0)
                        isPrefix = true;
                }

                if (CurrentRow.Element("TAB_INDEX").Value.ToString() != "")
                    tabIndex = " tabindex=" + Int16.Parse(CurrentRow.Element("TAB_INDEX").Value.ToString()) + " ";

                string textAttribute = "";
                if (CurrentRow.Element("LABEL_CELL_TEXT").Value.ToString().Length > 0)
                    textAttribute = textAttribute + " colname='" + CurrentRow.Element("LABEL_CELL_TEXT").Value.ToString().ToLower() + "' ";

                string onclickevent = "";
                if (CurrentRow.Element("ONCLICK_HANDLER").Value.ToString().Length > 0)
                {
                    onclickevent = " onclick='" + CurrentRow.Element("ONCLICK_HANDLER").Value.ToString() + "' ";
                }

                if (CurrentRow.Element("DATA_FIELDNAME").Value.ToString().Length > 0)
                {
                    if (false)
                        controlText = "<input type='radio'" + tabIndex + textAttribute + " class='" + this._DATA_FIELD_CSSCLASS + "' name='" + CurrentRow.Element("HTML_CONTROL_ID").Value.ToString() + "'  id='" + CurrentRow.Element("HTML_CONTROL_ID").Value.ToString() + "'" + (IsTrans == true ? (" recname='" + CurrentRow.Element("DATA_FIELDNAME").Value.ToString() + "'") : "") + " value='" + CurrentPage.Request.Form[CurrentRow.Element("DATA_FIELDNAME").Value.ToString() + (this.objIndex > 0 ? "_" + (this.objIndex - 1).ToString() : "")] + "' " + onclickevent + "  />";
                    else
                        controlText = "<input type='radio'" + tabIndex + textAttribute + "  class='" + this._DATA_FIELD_CSSCLASS + "' name='" + CurrentRow.Element("HTML_CONTROL_ID").Value.ToString() + "'  id='" + CurrentRow.Element("HTML_CONTROL_ID").Value.ToString() + "'" + (IsTrans == true ? (" recname='" + CurrentRow.Element("DATA_FIELDNAME").Value.ToString() + "'") : "") + " value='" + GetBindFieldValue(CurrentRow.Element("DATA_FIELDNAME").Value.ToString()) + "' " + onclickevent + "/>";
                }
                else
                    controlText = "&nbsp;";
            }
            return labelText = (IsMultiControl == false ? (@"<td class='" + this._DATA_CELL_CSSCLASS + "' >" + (isPrefix == false ?
                (controlText + spanControl) : (spanControl + "&nbsp;" + controlText)) +
                "</td>") : (isPrefix == false ?
                (controlText + spanControl) : (spanControl + "&nbsp;" + controlText)));
        }
        #endregion


        #region GetBindFieldValue
        private string GetBindFieldValue(string BindFieldName)
        {
            if (this.objFormData != null)
            {
                Type type = this.objFormData.GetType();
                System.Reflection.PropertyInfo property = type.GetProperty(BindFieldName);
                DateTime date;
                TimeSpan interval;
                Int32 intValue;
                Decimal decValue;
                if (property == null)
                {
                    return "";
                }
                if (property.GetValue(this.objFormData, null) == null)
                {
                    return "";
                }
                else if (property.GetValue(this.objFormData, null).ToString().Contains(","))
                {
                    return property.GetValue(this.objFormData, null).ToString();
                }
                if (int.TryParse(property.GetValue(this.objFormData, null).ToString(), out intValue))
                {
                    return property.GetValue(this.objFormData, null).ToString();
                    //return intValue.ToString();
                }
                if (decimal.TryParse(property.GetValue(this.objFormData, null).ToString(), out decValue))
                {
                    return property.GetValue(this.objFormData, null).ToString();
                    //return intValue.ToString();
                }
                if (TimeSpan.TryParse(property.GetValue(this.objFormData, null).ToString(), out interval))
                {
                    return (interval.Hours < 10 ? "0" : "") + interval.Hours.ToString() + ":" + (interval.Minutes < 10 ? "0" : "") + interval.Minutes.ToString();
                }
                else if (DateTime.TryParse(property.GetValue(this.objFormData, null).ToString(), out date))
                {
                    string[] str = property.GetValue(this.objFormData, null).ToString().Split('-');
                    if (str.Length > 0 && str.Length == 3 && str[2].IndexOf(":") < 0)
                    {
                        if (str[2].Length > 0)
                        {
                            return property.GetValue(this.objFormData, null).ToString();
                        }
                    }
                    if (date != date.Date)
                    {
                        return date.ToString(UIDateTimeFormat.UIDateFormatString + " " + UIDateTimeFormat.UITimeFormatString);
                    }
                    else
                    {
                        return date.ToString(UIDateTimeFormat.UIDateFormatString);
                    }
                }
                return property.GetValue(this.objFormData, null).ToString();
            }
            else if (this.objIndex != null && this.objDataTable != null && this.objDataTable.Rows.Count > 0)
            {
                return this.objDataTable.Rows[this.objIndex][BindFieldName].ToString();
            }
            else
                return "";
        }
        #endregion

        #region GetURL
        private string GetURL(string FormAction)
        {
            string strURL = "";
            string URLValue = "";
            for (int i = 0; i < this.CurrentPage.Request.QueryString.Count; i++)
            {
                if (this.CurrentPage.Request.QueryString.Keys[i].ToString().ToUpper().Trim() == "FORMACTION")
                    URLValue = FormAction;
                else
                    URLValue = this.CurrentPage.Request.QueryString[i].ToString();

                if (string.IsNullOrEmpty(strURL))
                    strURL = this.CurrentPage.Request.QueryString.Keys[i].ToString() + "=" + URLValue;
                else
                    strURL = strURL + "&" + this.CurrentPage.Request.QueryString.Keys[i].ToString() + "=" + URLValue;

            }
            return strURL;
        }
        #endregion

        #region SetHTMLFormAndDefinition
        /// <summary>
        /// This method used for get the html form
        /// </summary>
        /// <returns></returns>
        private void SetHTMLFormAndDefinition(string TargetModuleName = "", string TargetAppID = "", string TargetFormAction = "")
        {
            try
            {
                string appid = _AppID = TargetAppID;
                string webformdefinition = (TargetModuleName == "" ? (ModuleName != "" ? ModuleName + "/" : "") : (TargetModuleName + "/")) + "WebFormDefinition" + appid + ".xml";
                if (!this._IsSubModule)
                {
                    string action = "FORMACTION." + (TargetFormAction == "" ? CurrentPage.Request.QueryString["FormAction"].ToString().ToUpper() : TargetFormAction.ToUpper());
                    if (action.ToLower().Contains("delete"))
                        action = action.Replace("DELETE", "READ");
                    if (action.ToLower().Contains("verify"))
                        action = action.Replace("VERIFY", "EDIT");
                    if (action.ToLower().Contains("approve"))
                        action = action.Replace("APPROVE", "EDIT");
                    if (action.ToLower().Contains("reverse"))
                        action = action.Replace("REVERSE", "EDIT");
                    if (action.ToLower().Contains("duplicate"))
                        action = action.Replace("DUPLICATE", "NEW");
                    if (action.ToLower().Contains("booking edit"))
                        action = action.Replace("BOOKING EDIT", "EDIT");
                    if (action.ToLower().Contains("booking cancel"))
                        action = action.Replace("BOOKING CANCEL", "READ");
                    if (action.ToLower().Contains("generate pod"))
                        action = action.Replace("GENERATE POD", "EDIT");
                    if (action.ToLower().Contains("transfer"))
                        action = action.Replace("TRANSFER", "READ");
                    if (action.ToLower().Contains("awbcancel"))
                        action = action.Replace("AWBCANCEL", "CANCEL");
                    XElement webformDocument = XElement.Load(System.Web.Hosting.HostingEnvironment.ApplicationPhysicalPath.ToString() + "HtmlForm/WebForm.xml");

                    HtmlWebForm =
                        from htmlwebform in webformDocument.Elements("WebForm")
                        where ((string)htmlwebform.Element("APP_ID")).ToUpper() == appid.ToUpper() && ((string)htmlwebform.Element("DISPLAYMODE")).ToUpper() == action.ToUpper()
                        select htmlwebform;
                    string formId = (HtmlWebForm.Elements("FORM_ID")).ToList()[0].Value;
                    GetWebFormControlDefinition(formId);
                    //(new System.Collections.Generic.Mscorlib_CollectionDebugView<System.Xml.Linq.XElement>(HtmlWebForm.Elements("FORM_ID").ToList())).Items[0].Value
                    XElement webformDefinationDocument = XElement.Load(System.Web.Hosting.HostingEnvironment.ApplicationPhysicalPath.ToString() + "HtmlForm/" + webformdefinition + "");

                    foreach (var vv in HtmlWebForm)
                    {
                        HtmlWebFormDefination =
                            from htmlwebformdef in webformDefinationDocument.Elements("WebFormDefinition")
                            where (int)htmlwebformdef.Element("FORM_ID") == int.Parse(vv.Element("FORM_ID").Value.ToString())
                            orderby (decimal)htmlwebformdef.Element("DISPLAY_ORDER")
                            select htmlwebformdef;
                    }

                }
                //XmlDocument xmldoc = new XmlDocument();
                //xmldoc.Load(CurrentPage.Server.MapPath("./HtmlForm/swbform.xml"));
                //HtmlFrom = xmldoc.SelectSingleNode("//swbform[FORM_ID=168]");
                //string fid = _wform.Element("FORM_ID").Value.ToString();
                //XmlDocument xmldocList = new XmlDocument();

                //xmldocList.Load(CurrentPage.Server.MapPath("./HtmlForm/swbformdef.xml"));

                //HtmlFromList = xmldocList.SelectNodes("//swbformdef[FORM_ID=168]");

            }
            catch (Exception ex)
            {
                string str = ex.Message;
            }
        }//End of method.
        #endregion


        public DataTable dtBindInformation
        { get; set; }

        public void GetWebFormControlDefinition(string formId)
        {
            try
            {
                int FormID = int.Parse(formId);
                int GroupSNo = ((CargoFlash.Cargo.Model.UserLogin)System.Web.HttpContext.Current.Session["UserDetail"]).GroupSNo;
                int UserSNo = ((CargoFlash.Cargo.Model.UserLogin)System.Web.HttpContext.Current.Session["UserDetail"]).UserSNo;
                int CitySNo = ((CargoFlash.Cargo.Model.UserLogin)System.Web.HttpContext.Current.Session["UserDetail"]).CitySNo;
                DataSet ds = WebFormControlDefinition.GetControlDefinition(FormID, GroupSNo, UserSNo, CitySNo);
                if (ds != null && ds.Tables.Count > 0 && ds.Tables[0].Rows.Count > 0)
                    this.objStructureModify = ds.Tables[0];
                else
                    this.objStructureModify = null;
            }
            catch (Exception ex)
            {
                this.objStructureModify = null;
            }
        }

        public void GetConfiguration(string ProcessName)
        {
            try
            {
                DataSet ds = WebFormControlDefinition.GetConfiguration(ProcessName);
                if (ds != null && ds.Tables.Count > 0 && ds.Tables[0].Rows.Count > 0)
                {
                    this._ProcessXMLPage = ds.Tables[ds.Tables.Count - 2];
                    this._ProcessSetting = ds.Tables[ds.Tables.Count - 3];
                    DataTable dtGlobalSetting = ds.Tables[ds.Tables.Count - 4];
                    #region GloablSetting
                    if (dtGlobalSetting != null && dtGlobalSetting.Rows.Count > 0)
                    {
                        DataRow drGlobalSetting = dtGlobalSetting.Rows[0];

                        UIDateTimeFormat.DateFormatString = drGlobalSetting["DateFormat"].ToString();
                        UIDateTimeFormat.UIDateFormatString = drGlobalSetting["UIDateFormat"].ToString();
                        UIDateTimeFormat.UITimeFormatString = drGlobalSetting["UITimeFormat"].ToString();

                        FTPConnection.FTPServer = drGlobalSetting["FTPServer"].ToString();
                        FTPConnection.FTPUserId = drGlobalSetting["FTPUserId"].ToString();
                        FTPConnection.FTPPassword = drGlobalSetting["FTPPassword"].ToString();

                        GlobalSetting.CurrentVersion = drGlobalSetting["CurrentVersion"].ToString();
                        GlobalSetting.eCargoClientURL = drGlobalSetting["eCargoClientURL"].ToString();
                        GlobalSetting.eCargoServiceURL = drGlobalSetting["eCargoServiceURL"].ToString();
                        GlobalSetting.ServiceURL = drGlobalSetting["ServiceURL"].ToString();
                        GlobalSetting.GridServiceURL = drGlobalSetting["GridServiceURL"].ToString();
                        GlobalSetting.SSL = Convert.ToBoolean(drGlobalSetting["SSL"].ToString());
                        GlobalSetting.URLType = drGlobalSetting["URLType"].ToString();
                        GlobalSetting.CommonClientServiceURL = drGlobalSetting["CommonClientServiceURL"].ToString();
                        GlobalSetting.ApplicationMessage = drGlobalSetting["ApplicationMessage"].ToString();
                        GlobalSetting.GrossWtVariance = drGlobalSetting["GrossWtVariance"].ToString();
                        GlobalSetting.WeightRoundLimit = drGlobalSetting["WeightRoundLimit"].ToString();

                    }
                    #endregion
                    HttpContext.Current.Session["_ProcessXMLPage"] = this._ProcessXMLPage;
                    HttpContext.Current.Session["_ProcessSetting"] = ds.Tables[ds.Tables.Count - 1];

                }
                else
                {
                    this._ProcessXMLPage = null;
                    this._ProcessSetting = null;
                    HttpContext.Current.Session["_ProcessXMLPage"] = null;
                    HttpContext.Current.Session["_ProcessSetting"] = null;
                }
            }
            catch (Exception ex)
            {
                this.objStructureModify = null;
                HttpContext.Current.Session["_ProcessXMLPage"] = null;
                HttpContext.Current.Session["_ProcessSetting"] = null;
            }
        }

    }
}