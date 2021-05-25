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
using CargoFlash.Cargo.Model;


namespace CargoFlash.SoftwareFactory.WebUI.Adapters
{
    /// <summary>
    /// Displays a Web Form in a table which can be added to ASPX FORM control. Control can generate form in two column pair format, each  column containing the one or many ASP.NET contorls
    /// </summary>
    /// <remarks>Please read CargoFlash.SoftwareFactory.WebUI documentation for more detail</remarks>
    public class HtmlFormAdapter : IDisposable
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
        public bool _IsSearchToolBar = false;
        public bool _IsSearchRequired = false;
        public bool _Ischildform = false;
        public string _Childform = "";

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
        public bool PagePostPack { get; set; }

        public string CommandDeleteURL = "";
        public string CommnadUpdateURL = "";
        public string CommandEditURL = "";
        public string CommandSaveURL = "";
        public string CommandNewURL = "";
        public string CommandCancelURL = "";

        private string _SectionCssClass = "";
        private string _FormCaptionCssClass = "";
        private string _HeadingCssClass = "";
        private string _ToolBarCssClass = "";
        private string _FormFieldLabelCssClass = "";
        private string _FormFieldDataCssClass = "";
        private int _ColumnSpanCount = 4; //Number of Column to span in a row
        private bool _CommandCancelVisible = true;//By Default Cancel Button is visible
        private bool _CommandDeleteVisible = true;//By Default Delete Button is visible
        private bool _CommandEditVisible = true;//By Default Edit Button is visible
        private bool _CommandNewVisible = true;//By Default New Button is visible
        private bool _CommandSaveVisible = true;//By Default Save Button is visible
        private bool _CommandUpdateVisible = true;//By Default Update Button is visible
        private string _RecordKeyDataFieldName = "";
        private string _HeadingColumnName = "";
        private string _PageName = "";
        private string _ModuleName = "";
        public List<PageRights> PageRights { get; set; }

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
        public bool Ischildform
        {
            get { return _Ischildform; }
            set { _Ischildform = value; }
        }
        public string Childform
        {
            get { return _Childform; }
            set { _Childform = value; }
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

        private string _AuditLogColumn;
        public string AuditLogColumn
        {
            get { return _AuditLogColumn; }
            set { _AuditLogColumn = value; }
        }
        #endregion

        #region Constructor
        //Default Constructor
        public HtmlFormAdapter()
        {
            //Dictionary<string, ValidateControls> dict = new Dictionary<string, ValidateControls>() { { "0", new ValidateControls { ControlValue = "", ValidationMessage = "" } } };
            Dictionary<string, string> dict = new Dictionary<string, string>();
            RequiredValidationDict = dict;
            if (System.Web.HttpContext.Current.Request.ServerVariables["REQUEST_METHOD"] == "POST")
                this.PagePostPack = true;

        }
        //Parameterized Constructor
        public HtmlFormAdapter(string moduleName)
        {
            //Dictionary<string, ValidateControls> dict = new Dictionary<string, ValidateControls>() { { "0", new ValidateControls { ControlValue = "", ValidationMessage = "" } } };
            Dictionary<string, string> dict = new Dictionary<string, string>();
            RequiredValidationDict = dict;
            this.ModuleName = moduleName;
            if (System.Web.HttpContext.Current.Request.ServerVariables["REQUEST_METHOD"] == "POST")
                this.PagePostPack = true;
        }
        #endregion

        #region Distructor
        //Default Distructor
        ~HtmlFormAdapter()
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
            this.ColumnSpanCount = 4; //Number of Column to span in a row
            this.CommandCancelVisible = true;//By Default Cancel Button is visible
            this.CommandDeleteVisible = true;//By Default Delete Button is visible
            this.CommandEditVisible = true;//By Default Edit Button is visible
            this.CommandNewVisible = true;//By Default New Button is visible
            this.CommandSaveVisible = true;//By Default Save Button is visible
            this.CommandUpdateVisible = true;//By Default Update Button is visible
            this.RecordKeyDataFieldName = null;
            this.HeadingColumnName = null;
            this.PageName = null;
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

                this.CommandDeleteText = wform.Element("COMMAND_DELETE_TEXT").Value.ToString() == "" ? "Delete" : wform.Element("COMMAND_DELETE_TEXT").Value.ToString();
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
                        if (this.DisplayMode == DisplayModeType.Edit)
                        {
                            this.HeadingText = this.HeadingText + " " + GetBindFieldValue(this.HeadingColumnName);

                        }
                        if (this.DisplayMode == DisplayModeType.Delete)
                            this.HeadingText = this.HeadingText.Replace("Detail", "Delete") + " " + GetBindFieldValue(this.HeadingColumnName);
                        else if (this.DisplayMode == DisplayModeType.ReadOnly)
                            this.HeadingText = this.HeadingText + " " + GetBindFieldValue(this.HeadingColumnName);
                    }
                }
                catch { this.HeadingText = "New"; }

                string MandatoryDiv = "";
                //If Check Require Validation.
                if (this.EnableRequireValidation)
                    MandatoryDiv = "<div class='MandatoryTextCss'><font color='red'>*</font> Mandatory Fields</div>";

                //If Heading Text is specified then set it to Heading.
                if (this.HeadingText.ToString().Length > 0)
                    HtmlFormBuilder.Append("<tr><td class='" + this.HeadingCssClass + "' colspan='" + this.ColumnSpanCount + "'>" + this.HeadingImageUrl + "<span id='__SpanHeader__'>" + this.HeadingText.ToString() + "</span>" + MandatoryDiv + "</td></tr>");
            }

            //**************************************************************************
            //Creating ToolBar Row.       
            //**************************************************************************

            //If Toolbar Visible then set all CommandButton
            if (this.IsSearchToolBar == false)
                if (this.ToolBarVisible == true)
                    this.BuildFormToolBar();


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
            switch (this.DisplayMode)
            {
                case DisplayModeType.ReadOnly:

                    //if EditCommand is visible then add to the toolbar
                    if (this.CommandEditVisible == true && this.PageRights.Where(e => e.PageRight.ToUpper() == "EDIT").Any())
                    {
                        toolbarCommand.Append("<input type='button' value='" + this.CommandEditText + "' onclick=navigateUrl('" + this.CommandEditURL + "');  class='btn btn-info' />");
                        if (this.CommandNewVisible && this.PageRights.Where(e => e.PageRight.ToUpper() == "NEW").Any())
                            toolbarCommand.Append("<input type='button' value='" + this.CommandDuplicateText + "' id='MasterDuplicate'  onclick=navigateUrl('" + this.CommandDuplicateURL + "');  class='btn btn-info' />");

                        //toolbarCommand.Append("<a href='" + this.CommandEditURL + "' class='btn btn-info'>" + this.CommandEditText + "<a/>");
                        //toolbarCommand.Append("<a href='" + this.CommandDuplicateURL + "' class='btn btn-info'>" + this.CommandDuplicateText + "<a/>");
                    }

                    //if DeleteCommand is visible then add to the toolbar
                    if (this.CommandDeleteVisible == true && this.PageRights.Where(e => e.PageRight.ToUpper() == "DELETE").Any())
                        toolbarCommand.Append("<input type='button' value='" + this.CommandDeleteText + "'  onclick=navigateUrl('" + this.CommandDeleteURL + "');  class='btn btn-danger' />");

                    //toolbarCommand.Append("<a href='" + this.CommandDeleteURL + "' class='btn btn-info'>" + this.CommandDeleteText + "<a/>");

                    break;
                case DisplayModeType.Delete:

                    //if DeleteCommand is visible then add to the toolbar
                    if (this.CommandDeleteVisible == true && this.PageRights.Where(e => e.PageRight.ToUpper() == "DELETE").Any())
                        toolbarCommand.Append("<input type='submit' name='operation' value='" + this.CommandDeleteText + "'  class='btn btn-danger' />");

                    break;
                case DisplayModeType.New:
                    //if SaveCommand is visible then add to the toolbar
                    if (this.CommandSaveVisible == true && this.PageRights.Where(e => e.PageRight.ToUpper() == "NEW").Any())
                    {
                        toolbarCommand.Append("<input type='submit' name='operation' value='" + this.CommandSaveText + "'  class='btn btn-success' />");
                        toolbarCommand.Append("<input type='submit' name='operation' id='MasterSaveAndNew' value='" + this.CommandSaveAndNewText + "'  class='btn btn-success' />");
                    }
                    break;
                case DisplayModeType.Edit:

                    //if UpdateCommand is visible then add to the toolbar
                    if (this.CommandUpdateVisible == true && this.PageRights.Where(e => e.PageRight.ToUpper() == "EDIT").Any())
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
                toolbarCommand.Append("<input type='button' value='" + this.CommandCancelText + "'  onclick=navigateUrl('" + this.CommandCancelURL + "');  class='btn btn-inverse' />");

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
        public StringBuilder InstantiateIn(string TargetModuleName = "", string TargetAppID = "", string TargetFormAction = "", bool ValidateOnSubmit = true)
        {
            string appid = (TargetAppID == "" ? System.Web.HttpContext.Current.Request.QueryString["Apps"].ToString() : TargetAppID);
            this.PageRights = ((CargoFlash.Cargo.Model.UserLogin)HttpContext.Current.Session["UserDetail"]).PageRights.Where(e => e.Apps.ToUpper() == appid.ToUpper()).Select(e => new PageRights { Apps = e.Apps, PageRight = e.PageRight }).ToList();
            // Added By Amit Yadav For auditLog 

            try
            {
                if (System.Web.HttpContext.Current.Request.QueryString["FormAction"].ToString() == "Edit")
                    HttpContext.Current.Session["AuditLogKeyValue"] = "[{key:'" + (string.IsNullOrEmpty(this.HeadingColumnName) ? "HeaderNotDefined" : HeadingColumnName) + "',value:'" + (string.IsNullOrEmpty(this.HeadingColumnName) ? "HeaderNotDefined" : GetBindFieldValue(this.HeadingColumnName)) + "',sno:'" + System.Web.HttpContext.Current.Request.QueryString["RecID"].ToString() + "'}]";
                else
                    HttpContext.Current.Session["AuditLogKeyValue"] = null;
            }
            catch (Exception)
            {
                HttpContext.Current.Session["AuditLogKeyValue"] = null;
            }
            HtmlFormBuilder = new StringBuilder();
            SetHTMLFormAndDefinition(TargetModuleName, TargetAppID, TargetFormAction);
            SetProperty();
            HtmlFormBuilder.Append("<table class='WebFormTable' id='tbl" + TargetAppID + "'" + (ValidateOnSubmit == true ? " ValidateOnSubmit=true" : "") + ">");
            BuildFormHeader();
            BuildFormBody();
            if (this.IsSearchToolBar == true)
                BuildSearchToolBar();
            if (this.Ischildform == true)
            {
                if (!string.IsNullOrEmpty(this.Childform))
                {
                    HtmlFormBuilder.Append("<tr><td colspan=" + this.ColumnSpanCount + ">" + this.Childform + "</td></tr>");
                }
            }
            HtmlFormBuilder.Append("</table>");
            StringBuilder strautlog = new StringBuilder();
            try
            {
                if (System.Web.HttpContext.Current.Request.QueryString["FormAction"].ToString().ToLower() == "new")
                {

                    if (!string.IsNullOrEmpty(this.AuditLogColumn))
                    {
                        strautlog.Append("<input type='hidden' id='htmlkeycolumn' value='" + AuditLogColumn + "' />");
                        strautlog.Append("<input type='hidden' id='htmlkeyvalue' value=''  /><input type='hidden' id='htmlkeysno' value=''  />");

                    }
                    else
                    {
                        strautlog.Append("<input type='hidden' id='htmlkeycolumn' value='" + (string.IsNullOrEmpty(this.HeadingColumnName) ? "" : HeadingColumnName) + "' />");
                        strautlog.Append("<input type='hidden' id='htmlkeyvalue' value=''  /><input type='hidden' id='htmlkeysno' value=''  />");
                    }
                }
                else
                {
                    if (!string.IsNullOrEmpty(this.AuditLogColumn))
                    {
                        strautlog.Append("<input type='hidden' id='htmlkeycolumn' value='" + AuditLogColumn + "'  />");

                        string[] str = this.AuditLogColumn.Split(',');
                        string val = "";
                        string val1 = "";
                        for (int i = 0; i < str.Length; i++)
                        {
                            if (val == "")
                            {
                                val = GetBindFieldValue(str[i]);
                                val1 = str[i];
                            }
                            else
                                val = val + ',' + GetBindFieldValue(str[i]);
                        }
                        strautlog.Append("<input type='hidden' id='htmlkeyvalue' value='" + val + "'  />");

                        string sno = "";
                        //try
                        //{
                        //    sno = Convert.ToInt64(GetBindFieldValue(val1)).ToString();
                        //}
                        //catch
                        //{
                            try
                            {
                                sno = Convert.ToInt64(GetBindFieldValue("SNo")).ToString();
                            }
                            catch { }
                        //}
                        strautlog.Append("<input type='hidden' id='htmlkeysno' value='" + sno + "'  />");
                    }
                    else
                    {
                        strautlog.Append("<input type='hidden' id='htmlkeycolumn' value='" + (string.IsNullOrEmpty(this.HeadingColumnName) ? "" : HeadingColumnName) + "'  />");
                        strautlog.Append("<input type='hidden' id='htmlkeyvalue' value='" + (string.IsNullOrEmpty(this.HeadingColumnName) ? "" : GetBindFieldValue(this.HeadingColumnName)) + "'  />");

                        string sno = "";
                        //try
                        //{
                        //    sno = Convert.ToInt64(GetBindFieldValue(this.HeadingColumnName)).ToString();
                        //}
                        //catch
                        //{
                            try
                            {
                                sno = Convert.ToInt64(GetBindFieldValue("SNo")).ToString();
                            }
                            catch { }
                        //}
                        strautlog.Append("<input type='hidden' id='htmlkeysno' value='" + sno + "'  />");
                    }

                }
            }
            catch { }
            return HtmlFormBuilder.Append(strautlog);
        }
        #endregion

        #region TransInstantiate
        public StringBuilder TransInstantiate(string TransModuleName, string TransName, string TransFormAction = "New", bool IsPopUp = false, bool ValidateOnSubmit = false)
        {
            SetHTMLFormAndDefinition(TransModuleName, TransName, TransFormAction);
            SetProperty();
            StringBuilder HtmlTransBuilder = new StringBuilder();
            string popUpStyle = (IsPopUp == true ? (" style='display:none'") : "");
            HtmlTransBuilder.Append("<br/><div id='divareaTrans_" + (TransModuleName == "" ? "" : (TransModuleName + "_")) + TransName + "'" + (ValidateOnSubmit == true ? " ValidateOnSubmit=true" : "") + popUpStyle + "><input type='hidden' id='valueareaTrans_" + (TransModuleName == "" ? "" : (TransModuleName + "_")) + TransName + "' name='valueareaTrans_" + (TransModuleName == "" ? "" : (TransModuleName + "_")) + TransName + "'/><table class='WebFormTable'>");
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
        public StringBuilder TransInstantiateWithHeader(string TransModuleName, string TransName, string TransFormAction = "New", bool IsPopUp = false, bool ValidateOnSubmit = false)
        {
            SetHTMLFormAndDefinition(TransModuleName, TransName, TransFormAction);
            SetProperty();
            StringBuilder HtmlTransBuilder = new StringBuilder();
            string popUpStyle = (IsPopUp == true ? (" style='display:none'") : "");

            HtmlTransBuilder.Append("<br/><div id='divareaTrans_" + (TransModuleName == "" ? "" : (TransModuleName + "_")) + TransName + "'" + (ValidateOnSubmit == true ? " ValidateOnSubmit=true" : "") + popUpStyle + "><input type='hidden' id='valueareaTrans_" + (TransModuleName == "" ? "" : (TransModuleName + "_")) + TransName + "' name='valueareaTrans_" + (TransModuleName == "" ? "" : (TransModuleName + "_")) + TransName + "'/>");
            if (!IsPopUp)
            {
                HtmlTransBuilder.Append("<table class='WebFormChildTable'>");
                BuildTransHeader(HtmlTransBuilder);
                HtmlTransBuilder.Append("</table>");
            }
            if (this.objDataTable != null && this.objDataTable.Rows.Count > 0)
            {
                HtmlTransBuilder.Append("<table class='WebFormTable'><tr>");
                BuildTransHeaderRow(HtmlTransBuilder, TransName, TransFormAction);
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
                BuildTransHeaderRow(HtmlTransBuilder, TransName, TransFormAction);
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

                if (wformdev.Element("SECTION_NAME").Value.ToString().Trim().Length > 0)
                {
                    if (IsSingleCellControl == false)
                    {
                        if (this.SectionCssClass == "")
                            this.SectionCssClass = this.HeadingCssClass;

                        MyCurrentRow.Append("<tr><td class='" + this.SectionCssClass + "' colspan='" + (this.ColumnSpanCount + 1) + "'>" + wformdev.Element("SECTION_NAME").Value.ToString() + "</td></tr>");
                    }
                }
                //ImageLabelAssemblyName
                switch (wformdev.Element("ASSEMBLY_NAME").Value.ToString())
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
                        MyCurrentCell.Append("<td class='" + wformdev.Element("DATA_CELL_CSSCLASS").Value.ToString() + "' >");
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
        private void BuildTransHeaderRow(StringBuilder HtmlTransBuilder, string TransName, string TransFormAction = "New")
        {
            //Check if Business Data table is assigned
            //If not assigned then raise exception
            if (this.HtmlWebFormDefination == null)
                throw new Exception("NULL HtmlWebFormDefination! HtmlWebFormDefination is required.");

            StringBuilder MyCurrentCell = new StringBuilder();
            StringBuilder MyCurrentRow = new StringBuilder();

            foreach (var wformdev in HtmlWebFormDefination)
            {
                //Check ASSEMBLY_NAME of this row is blank then raise error.
                if (wformdev.Element("ASSEMBLY_NAME").Value.ToString().Trim().Length == 0)
                    throw new Exception("NULL ASSEMBLY_NAME! ASSEMBLY_NAME is required.");

                MyCurrentCell.Append(CreateCellLabel(wformdev));
            }
            string snoColumn = "";
            snoColumn = "<td class=' formtHeaderLabel snowidth' id='transSNo' name='transSNo'>SNo</td>";
            if (TransFormAction.ToUpper() == "EDIT" || TransFormAction.ToUpper() == "NEW")
            {
                MyCurrentRow.Append(snoColumn + MyCurrentCell.ToString() + "<td class='" + this.SectionCssClass + "'>Action</td>");
            }
            else
            {
                MyCurrentRow.Append(snoColumn + MyCurrentCell.ToString());
            }
            HtmlTransBuilder.Append(MyCurrentRow.ToString());
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
                switch (wformdev.Element("ASSEMBLY_NAME").Value.ToString())
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
                        MyCurrentCell.Append("<td class='" + wformdev.Element("DATA_CELL_CSSCLASS").Value.ToString() + "' >");
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
            snoValueColumn = "<td id='tdSNoCol' class=' formtHeaderLabel'>" + (this.objIndex + 1).ToString() + "</td>";
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
            try
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
                foreach (var wformdev in HtmlWebFormDefination)
                {
                    //Check ASSEMBLY_NAME of this row is blank then raise error.
                    if (wformdev.Element("ASSEMBLY_NAME").Value.ToString().Trim().Length == 0)
                        throw new Exception("NULL ASSEMBLY_NAME! ASSEMBLY_NAME is required.");
                    flag = true;
                    IsSingleCellControl = false;

                    ListCellControl = wformdev.Element("DISPLAY_ORDER").Value.ToString().Replace(".00", "").Split('.');
                    if (FirstIndex.Trim() == ListCellControl[0].ToString().Trim())
                    {
                        //&& (((CurrentCellTotal * 2) + int.Parse(ListCellControl[1].ToString().Trim())) % this.ColumnSpanCount >0)
                        if ((((CurrentCellTotal) + int.Parse(ListCellControl[1].ToString().Trim())) % this.ColumnSpanCount == 0))
                            CurrentCellTotal = 1;
                        else
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

                    if (wformdev.Element("SECTION_NAME").Value.ToString().Trim().Length > 0)
                    {
                        if (IsSingleCellControl == false)
                        {


                            if (this.SectionCssClass == "")
                                this.SectionCssClass = this.HeadingCssClass;

                            MyCurrentRow.Append("<tr><td class='" + this.SectionCssClass + "' colspan='" + this.ColumnSpanCount + "'>" + wformdev.Element("SECTION_NAME").Value.ToString() + "</td></tr>");
                        }
                    }
                    //ImageLabelAssemblyName
                    switch (wformdev.Element("ASSEMBLY_NAME").Value.ToString())
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
                                MyCurrentCell.Append(CreateCellLabel(wformdev));


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
                            MyCurrentCell.Append("<td class='" + wformdev.Element("DATA_CELL_CSSCLASS").Value.ToString() + "' >");
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
                    if (CurrentCellTotal == RowLength)
                    {
                        if (this.ColumnSpanCount == 2)
                        {
                            MyCurrentRow.Append("<tr>" + MyCurrentCell.ToString() + "</tr>");
                            MyCurrentCell = new StringBuilder();
                        }
                        else
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
                        i++;

                    }
                }
                if (LayoutCount == 2 && flag == true)
                {
                    MyCurrentRow.Append("<tr>" + MyCurrentCell.ToString() + "</tr>");
                    MyCurrentCell = new StringBuilder();
                }
                this.HtmlFormBuilder.Append(MyCurrentRow.ToString());
            }
            catch (Exception ex)
            {

            }
        }
        #endregion

        #region CreateCellLabel
        private string CreateCellLabel(XElement CurrentRow)
        {
            string toolstr = "";
            string labelText = "";
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
                    else if (CurrentRow.Element("ASSEMBLY_NAME").Value.ToString().ToLower().Contains("password"))
                        toolstr = "Enter " + CurrentRow.Element("LABEL_CELL_TEXT").Value.ToString();
                    else
                        toolstr = "Select " + CurrentRow.Element("LABEL_CELL_TEXT").Value.ToString();
                }
            }
            catch { }



            if (bool.Parse(CurrentRow.Element("VISIBLE").Value.ToString()) == true)


                if (CurrentRow.Element("ENABLE_REQUIREVALIDATION").Value.ToString() != "")
                {
                    if (bool.Parse(CurrentRow.Element("ENABLE_REQUIREVALIDATION").Value.ToString()) == true)
                    {
                        //if (CurrentRow.Element("MultiWebFormDefinition") != null)
                        //    labelText = "<td class='" + CurrentRow.Element("LABEL_CELL_CSSCLASS").Value.ToString() + "' title='" + CurrentRow.Element("TOOLTIP").Value.ToString() + "'  ><font color='red'>*</font> " + CurrentRow.Element("LABEL_CELL_TEXT").Value.ToString() + "</td>";
                        //else
                        labelText = "<td class='" + CurrentRow.Element("LABEL_CELL_CSSCLASS").Value.ToString() + "' title='" + toolstr + "'  ><font color='red'>*</font><span id='spn" + CurrentRow.Element("HTML_CONTROL_ID").Value.ToString() + "'> " + CurrentRow.Element("LABEL_CELL_TEXT").Value.ToString() + "</span></td>";
                    }
                    else
                    {
                        //if (CurrentRow.Element("MultiWebFormDefinition") != null)
                        //    labelText = "<td class='" + CurrentRow.Element("LABEL_CELL_CSSCLASS").Value.ToString() + "' title='" + CurrentRow.Element("TOOLTIP").Value.ToString() + "'  >" + CurrentRow.Element("LABEL_CELL_TEXT").Value.ToString() + "</td>";
                        //else
                        labelText = "<td class='" + CurrentRow.Element("LABEL_CELL_CSSCLASS").Value.ToString() + "' title='" + toolstr + "'  ><span id='spn" + CurrentRow.Element("HTML_CONTROL_ID").Value.ToString() + "'> " + CurrentRow.Element("LABEL_CELL_TEXT").Value.ToString() + "</span></td>";
                    }
                }
                else
                {
                    labelText = "<td class='" + CurrentRow.Element("LABEL_CELL_CSSCLASS").Value.ToString() + "' title='" + toolstr + "'  >" + CurrentRow.Element("LABEL_CELL_TEXT").Value.ToString() + "</td>";
                }
            else
                labelText = "<td class='" + CurrentRow.Element("LABEL_CELL_CSSCLASS").Value.ToString() + "' title='>&nbsp;</td>";

            return labelText;
        }
        #endregion

        #region CreateLabelControl
        private string CreateLabelControl(XElement CurrentRow, bool IsTrans = false, bool IsMultiControl = false)
        {
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
                    if (this.PagePostPack)
                        if (this.DisplayMode.ToString().ToUpper() == "DELETE")
                            controlText = "<input type='hidden' name='" + CurrentRow.Element("HTML_CONTROL_ID").Value.ToString() + "'  id='" + CurrentRow.Element("HTML_CONTROL_ID").Value.ToString() + "'" + (IsTrans == true ? (" recname='" + CurrentRow.Element("DATA_FIELDNAME").Value.ToString() + "'") : "") + " value='" + GetBindFieldValue(CurrentRow.Element("DATA_FIELDNAME").Value.ToString()) + "' /><span style='max-width: 250px;word-wrap: break-word;    display: inline-block;max-height: 50px;overflow: auto;' class='" + CurrentRow.Element("DATA_FIELD_CSSCLASS").Value.ToString() + "'   id='" + CurrentRow.Element("DATA_FIELDNAME").Value.ToString() + "' " + (IsTrans == true ? (" recname='" + CurrentRow.Element("DATA_FIELDNAME").Value.ToString() + "'") : "") + " " + extraAttribute + " >" + GetBindFieldValue(CurrentRow.Element("DATA_FIELDNAME").Value.ToString()) + "</span>";
                        else
                            controlText = "<input type='hidden' name='" + CurrentRow.Element("HTML_CONTROL_ID").Value.ToString() + "'   id='" + CurrentRow.Element("HTML_CONTROL_ID").Value.ToString() + "'" + (IsTrans == true ? (" recname='" + CurrentRow.Element("DATA_FIELDNAME").Value.ToString() + "'") : "") + " value='" + System.Web.HttpContext.Current.Request.Form[CurrentRow.Element("DATA_FIELDNAME").Value.ToString() + (this.objIndex > 0 ? "_" + (this.objIndex - 1).ToString() : "")] + "' /><span class='" + CurrentRow.Element("DATA_FIELD_CSSCLASS").Value.ToString() + "'" + (IsTrans == true ? (" recname='" + CurrentRow.Element("DATA_FIELDNAME").Value.ToString() + "'") : "") + "    id='" + CurrentRow.Element("DATA_FIELDNAME").Value.ToString() + "' " + extraAttribute + "  >" + System.Web.HttpContext.Current.Request.Form[CurrentRow.Element("DATA_FIELDNAME").Value.ToString() + (this.objIndex > 0 ? "_" + (this.objIndex - 1).ToString() : "")] + " </span> ";
                    else
                        controlText = "<input type='hidden' name='" + CurrentRow.Element("HTML_CONTROL_ID").Value.ToString() + "'  id='" + CurrentRow.Element("HTML_CONTROL_ID").Value.ToString() + "'" + (IsTrans == true ? (" recname='" + CurrentRow.Element("DATA_FIELDNAME").Value.ToString() + "'") : "") + " value='" + GetBindFieldValue(CurrentRow.Element("DATA_FIELDNAME").Value.ToString()) + "' /><span style='max-width: 250px;word-wrap: break-word;    display: inline-block;max-height: 50px;overflow: auto;' class='" + CurrentRow.Element("DATA_FIELD_CSSCLASS").Value.ToString() + "'   id='" + CurrentRow.Element("DATA_FIELDNAME").Value.ToString() + "' " + (IsTrans == true ? (" recname='" + CurrentRow.Element("DATA_FIELDNAME").Value.ToString() + "'") : "") + " " + extraAttribute + " >" + GetBindFieldValue(CurrentRow.Element("DATA_FIELDNAME").Value.ToString()) + "</span>";
                }
                else
                    controlText = "&nbsp;";
            }
            return labelText = (IsMultiControl == false ? (@"<td class='" + CurrentRow.Element("DATA_CELL_CSSCLASS").Value.ToString() + "' >" + (isPrefix == false ?
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
                    if (this.PagePostPack)
                        controlText = "<input type='hidden' name='" + CurrentRow.Element("HTML_CONTROL_ID").Value.ToString() + "'  id='" + CurrentRow.Element("HTML_CONTROL_ID").Value.ToString() + "'" + (IsTrans == true ? (" recname='" + CurrentRow.Element("DATA_FIELDNAME").Value.ToString() + "'") : "") + " value='" + System.Web.HttpContext.Current.Request.Form[CurrentRow.Element("DATA_FIELDNAME").Value.ToString() + (this.objIndex > 0 ? "_" + (this.objIndex - 1).ToString() : "")] + "' />";
                    else
                        controlText = "<input type='hidden' name='" + CurrentRow.Element("HTML_CONTROL_ID").Value.ToString() + "'  id='" + CurrentRow.Element("HTML_CONTROL_ID").Value.ToString() + "'" + (IsTrans == true ? (" recname='" + CurrentRow.Element("DATA_FIELDNAME").Value.ToString() + "'") : "") + " value='" + GetBindFieldValue(CurrentRow.Element("DATA_FIELDNAME").Value.ToString()) + "' />";
                }
                else
                    controlText = "&nbsp;";
            }

            return labelText = (IsMultiControl == false ? (@"<td class='" + CurrentRow.Element("DATA_CELL_CSSCLASS").Value.ToString() + "' >" + (isPrefix == false ?
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



                if (CurrentRow.Element("DATA_VALIDATE").Value.ToString().Length > 0)
                    textAttribute = "data-valid='" + CurrentRow.Element("DATA_VALIDATE").Value.ToString() + "' data-valid-msg='" + CurrentRow.Element("REQUIRED_FIELD_MESSAGE").Value.ToString() + "'";

                if (CurrentRow.Element("LABEL_CELL_TEXT").Value.ToString().Length > 0)
                    textAttribute = textAttribute + " colname='" + CurrentRow.Element("LABEL_CELL_TEXT").Value.ToString().ToLower() + "' ";

                if (CurrentRow.Element("TAB_INDEX").Value.ToString() != "")
                    textAttribute = textAttribute + " tabindex=" + Int16.Parse(CurrentRow.Element("TAB_INDEX").Value.ToString()) + " ";

                if (CurrentRow.Element("DATA_FIELDNAME").Value.ToString().Length > 0)
                {
                    if (this.PagePostPack)
                        controlText = "<input type='password'" + textAttribute + " class='" + CurrentRow.Element("DATA_FIELD_CSSCLASS").Value.ToString() + "' name='" + CurrentRow.Element("HTML_CONTROL_ID").Value.ToString() + "'  id='" + CurrentRow.Element("HTML_CONTROL_ID").Value.ToString() + "'" + (IsTrans == true ? (" recname='" + CurrentRow.Element("DATA_FIELDNAME").Value.ToString() + "'") : "") + " value='" + System.Web.HttpContext.Current.Request.Form[CurrentRow.Element("DATA_FIELDNAME").Value.ToString() + (this.objIndex > 0 ? "_" + (this.objIndex - 1).ToString() : "")] + "' />";
                    else
                        controlText = "<input type='password'" + textAttribute + "  class='" + CurrentRow.Element("DATA_FIELD_CSSCLASS").Value.ToString() + "' name='" + CurrentRow.Element("HTML_CONTROL_ID").Value.ToString() + "'  id='" + CurrentRow.Element("HTML_CONTROL_ID").Value.ToString() + "'" + (IsTrans == true ? (" recname='" + CurrentRow.Element("DATA_FIELDNAME").Value.ToString() + "'") : "") + " value='" + GetBindFieldValue(CurrentRow.Element("DATA_FIELDNAME").Value.ToString()) + "' />";
                }
                else
                    controlText = "&nbsp;";
            }
            return labelText = (IsMultiControl == false ? (@"<td class='" + CurrentRow.Element("DATA_CELL_CSSCLASS").Value.ToString() + "' >" + (isPrefix == false ?
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


                if (CurrentRow.Element("DATA_VALIDATE").Value.ToString().Length > 0)
                    textAttribute = "data-valid='" + CurrentRow.Element("DATA_VALIDATE").Value.ToString() + "' data-valid-msg='" + CurrentRow.Element("REQUIRED_FIELD_MESSAGE").Value.ToString() + "'";

                if (CurrentRow.Element("LABEL_CELL_TEXT").Value.ToString().Length > 0)
                    textAttribute = textAttribute + " colname='" + CurrentRow.Element("LABEL_CELL_TEXT").Value.ToString().ToLower() + "' ";

                if (CurrentRow.Element("TAB_INDEX").Value.ToString() != "")
                    textAttribute = textAttribute + " tabindex=" + Int16.Parse(CurrentRow.Element("TAB_INDEX").Value.ToString()) + " ";


                if (CurrentRow.Element("DATA_FIELDNAME").Value.ToString().Length > 0)
                {
                    if (this.PagePostPack)
                        controlText = "<input type='file' class='" + CurrentRow.Element("DATA_FIELD_CSSCLASS").Value.ToString() + "' name='" + CurrentRow.Element("HTML_CONTROL_ID").Value.ToString() + "'  id='" + CurrentRow.Element("HTML_CONTROL_ID").Value.ToString() + "'" + (IsTrans == true ? (" recname='" + CurrentRow.Element("DATA_FIELDNAME").Value.ToString() + "'") : "") + " style='width:" + (CurrentRow.Element("WIDTH").Value.ToString() == "" ? "80" : CurrentRow.Element("WIDTH").Value.ToString()) + "px;' " + textAttribute + "  maxlength='" + CurrentRow.Element("MAXLENGTH").Value.ToString() + "'    value='" + System.Web.HttpContext.Current.Request.Form[CurrentRow.Element("DATA_FIELDNAME").Value.ToString() + (this.objIndex > 0 ? "_" + (this.objIndex - 1).ToString() : "")] + "' />";
                    else
                        controlText = "<input type='file' class='" + CurrentRow.Element("DATA_FIELD_CSSCLASS").Value.ToString() + "' name='" + CurrentRow.Element("HTML_CONTROL_ID").Value.ToString() + "'  id='" + CurrentRow.Element("HTML_CONTROL_ID").Value.ToString() + "'" + (IsTrans == true ? (" recname='" + CurrentRow.Element("DATA_FIELDNAME").Value.ToString() + "'") : "") + " style='width:" + (CurrentRow.Element("WIDTH").Value.ToString() == "" ? "80" : CurrentRow.Element("WIDTH").Value.ToString()) + "px;' " + textAttribute + "  maxlength='" + CurrentRow.Element("MAXLENGTH").Value.ToString() + "' value='" + GetBindFieldValue(CurrentRow.Element("DATA_FIELDNAME").Value.ToString()) + "' />";
                }
                else
                    controlText = "&nbsp;";

                if (CurrentRow.Element("DATA_VALIDATE").Value.ToString().Length > 0 || CurrentRow.Element("ENABLE_REQUIREVALIDATION").Value.ToString().ToLower() == "true")
                {
                    string key = CurrentRow.Element("HTML_CONTROL_ID").Value.ToString();
                    string validationMessage = CurrentRow.Element("REQUIRED_FIELD_MESSAGE").Value.ToString();

                    if (!RequiredValidationDict.ContainsKey(key))
                        RequiredValidationDict.Add(key, validationMessage);

                }
            }

            return labelText = (IsMultiControl == false ? (@"<td class='" + CurrentRow.Element("DATA_CELL_CSSCLASS").Value.ToString() + "' >" + (isPrefix == false ?
                (controlText + spanControl) : (spanControl + "&nbsp;" + controlText)) +
                "</td>") : (isPrefix == false ?
                (controlText + spanControl) : (spanControl + "&nbsp;" + controlText)));

        }
        #endregion

        #region CreateTextBoxControl
        private string CreateTextBoxControl(XElement CurrentRow, bool IsTrans = false, bool IsMultiControl = false)
        {
            string labelText = "";
            string controlText = "";
            string textAttribute = "";
            string spanControl = "";
            bool isPrefix = false;
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


                if (CurrentRow.Element("DATA_VALIDATE").Value.ToString().Length > 0)
                    textAttribute = textAttribute + " data-valid='" + CurrentRow.Element("DATA_VALIDATE").Value.ToString() + "' data-valid-msg='" + CurrentRow.Element("REQUIRED_FIELD_MESSAGE").Value.ToString() + "'";

                if (CurrentRow.Element("TAB_INDEX").Value.ToString() != "")
                    textAttribute = textAttribute + " tabindex=" + Int16.Parse(CurrentRow.Element("TAB_INDEX").Value.ToString()) + " ";

                if (CurrentRow.Element("DATA_FIELDNAME").Value.ToString().Length > 0)
                {
                    if (this.PagePostPack)
                        controlText = "<" + (CurrentRow.Element("MULTILINE").Value.ToUpper() == "YES" ? "textarea" : "input type='text'") + " class='" + CurrentRow.Element("DATA_FIELD_CSSCLASS").Value.ToString() + "' name='" + CurrentRow.Element("HTML_CONTROL_ID").Value.ToString() + "'  id='" + CurrentRow.Element("HTML_CONTROL_ID").Value.ToString() + "'" + (IsTrans == true ? (" recname='" + CurrentRow.Element("DATA_FIELDNAME").Value.ToString() + "'") : "") + " style='width:" + (CurrentRow.Element("WIDTH").Value.ToString() == "" ? "80" : CurrentRow.Element("WIDTH").Value.ToString()) + "px;" + (CurrentRow.Element("HEIGHT").Value.ToString() == "" ? "" : "height:" + CurrentRow.Element("HEIGHT").Value.ToString()) + "px;' " + textAttribute + "  maxlength='" + CurrentRow.Element("MAXLENGTH").Value.ToString() + "'" + (CurrentRow.Element("MULTILINE").Value.ToUpper() == "YES" ? ">" + System.Web.HttpContext.Current.Request.Form[CurrentRow.Element("DATA_FIELDNAME").Value.ToString() + (this.objIndex > 0 ? "_" + (this.objIndex - 1).ToString() : "")] + "</textarea>" : "  value='" + System.Web.HttpContext.Current.Request.Form[CurrentRow.Element("DATA_FIELDNAME").Value.ToString() + (this.objIndex > 0 ? "_" + (this.objIndex - 1).ToString() : "")] + "'/>");
                    else
                        controlText = "<" + (CurrentRow.Element("MULTILINE").Value.ToUpper() == "YES" ? "textarea" : "input type='text'") + " class='" + CurrentRow.Element("DATA_FIELD_CSSCLASS").Value.ToString() + "' name='" + CurrentRow.Element("HTML_CONTROL_ID").Value.ToString() + "'  id='" + CurrentRow.Element("HTML_CONTROL_ID").Value.ToString() + "'" + (IsTrans == true ? (" recname='" + CurrentRow.Element("DATA_FIELDNAME").Value.ToString() + "'") : "") + " style='width:" + (CurrentRow.Element("WIDTH").Value.ToString() == "" ? "80" : CurrentRow.Element("WIDTH").Value.ToString()) + "px;" + (CurrentRow.Element("HEIGHT").Value.ToString() == "" ? "" : "height:" + CurrentRow.Element("HEIGHT").Value.ToString()) + "px;' " + textAttribute + "  maxlength='" + CurrentRow.Element("MAXLENGTH").Value.ToString() + "'" + (CurrentRow.Element("MULTILINE").Value.ToUpper() == "YES" ? ">" + GetBindFieldValue(CurrentRow.Element("DATA_FIELDNAME").Value.ToString()) + "</textarea>" : "  value='" + GetBindFieldValue(CurrentRow.Element("DATA_FIELDNAME").Value.ToString()) + "'/>");
                }
                else
                    controlText = "&nbsp;";

                if (CurrentRow.Element("DATA_VALIDATE").Value.ToString().Length > 0 || CurrentRow.Element("ENABLE_REQUIREVALIDATION").Value.ToString().ToLower() == "true")
                {
                    string key = CurrentRow.Element("HTML_CONTROL_ID").Value.ToString();
                    string validationMessage = CurrentRow.Element("REQUIRED_FIELD_MESSAGE").Value.ToString();

                    if (!RequiredValidationDict.ContainsKey(key))
                        RequiredValidationDict.Add(key, validationMessage);

                }
            }

            return labelText = (IsMultiControl == false ? (@"<td class='" + CurrentRow.Element("DATA_CELL_CSSCLASS").Value.ToString() + "' >" + (isPrefix == false ?
                (controlText + spanControl) : (spanControl + "&nbsp;" + controlText)) +
                "</td>") : (isPrefix == false ?
                (controlText + spanControl) : (spanControl + "&nbsp;" + controlText)));
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
            if (bool.Parse(CurrentRow.Element("VISIBLE").Value.ToString()) == true)
            {
                if (CurrentRow.Element("CONTROL_TOTAL").Value.ToString().Length > 0)
                {
                    spanControl = "&nbsp;<span id='_span" + CurrentRow.Element("HTML_CONTROL_ID").Value.ToString().ToUpper() + "_'></span>";

                    if (CurrentRow.Element("CONTROL_TOTAL").Value.ToString().IndexOf("-") >= 0)
                        isPrefix = true;
                }



                string autocompleteid = "Text_" + CurrentRow.Element("HTML_CONTROL_ID").Value.ToString();
                if (CurrentRow.Element("DATA_VALIDATE").Value.ToString().Length > 0)
                    textAttribute = "data-valid='" + CurrentRow.Element("DATA_VALIDATE").Value.ToString() + "' data-valid-msg='" + CurrentRow.Element("REQUIRED_FIELD_MESSAGE").Value.ToString() + "'";

                if (CurrentRow.Element("LABEL_CELL_TEXT").Value.ToString().Length > 0)
                    textAttribute = textAttribute + " colname='" + CurrentRow.Element("LABEL_CELL_TEXT").Value.ToString().ToLower() + "' ";

                if (CurrentRow.Element("TAB_INDEX").Value.ToString() != "")
                    textAttribute = textAttribute + " tabindex=" + Int16.Parse(CurrentRow.Element("TAB_INDEX").Value.ToString()) + " ";

                textAttribute = textAttribute + " controltype='autocomplete' ";


                if (CurrentRow.Element("DATA_FIELDNAME").Value.ToString().Length > 0)
                {
                    if (this.PagePostPack)
                        controlText = "<input type='hidden' name='" + CurrentRow.Element("HTML_CONTROL_ID").Value.ToString() + "' id='" + CurrentRow.Element("HTML_CONTROL_ID").Value.ToString() + "'" + (IsTrans == true ? (" recname='" + CurrentRow.Element("DATA_FIELDNAME").Value.ToString() + "'") : "") + "  value='" + System.Web.HttpContext.Current.Request.Form[CurrentRow.Element("DATA_FIELDNAME").Value.ToString() + (this.objIndex > 0 ? "_" + (this.objIndex - 1).ToString() : "")] + "' /><input type='text' class='" + CurrentRow.Element("DATA_FIELD_CSSCLASS").Value.ToString() + "' name='" + autocompleteid + "'  id='" + autocompleteid + "' style='width:" + (CurrentRow.Element("WIDTH").Value.ToString() == "" ? "80" : CurrentRow.Element("WIDTH").Value.ToString()) + "px;' " + textAttribute + "  maxlength='" + CurrentRow.Element("MAXLENGTH").Value.ToString() + "'    value='" + System.Web.HttpContext.Current.Request.Form[autocompleteid] + "' />";
                    else
                        controlText = "<input type='hidden' name='" + CurrentRow.Element("HTML_CONTROL_ID").Value.ToString() + "' id='" + CurrentRow.Element("HTML_CONTROL_ID").Value.ToString() + "'" + (IsTrans == true ? (" recname='" + CurrentRow.Element("DATA_FIELDNAME").Value.ToString() + "'") : "") + " value='" + GetBindFieldValue(CurrentRow.Element("DATA_FIELDNAME").Value.ToString()) + "' /><input type='text' class='" + CurrentRow.Element("DATA_FIELD_CSSCLASS").Value.ToString() + "' name='" + autocompleteid + "'  id='" + autocompleteid + "' style='width:" + (CurrentRow.Element("WIDTH").Value.ToString() == "" ? "80" : CurrentRow.Element("WIDTH").Value.ToString()) + "px;' " + textAttribute + "  maxlength='" + CurrentRow.Element("MAXLENGTH").Value.ToString() + "' value='" + GetBindFieldValue(autocompleteid) + "' />";
                }
                else
                    controlText = "&nbsp;";

                if (CurrentRow.Element("DATA_VALIDATE").Value.ToString().Length > 0 || CurrentRow.Element("ENABLE_REQUIREVALIDATION").Value.ToString().ToLower() == "true")
                {
                    string key = CurrentRow.Element("HTML_CONTROL_ID").Value.ToString();
                    string validationMessage = CurrentRow.Element("REQUIRED_FIELD_MESSAGE").Value.ToString();

                    if (!RequiredValidationDict.ContainsKey(key))
                        RequiredValidationDict.Add(key, validationMessage);

                }
            }

            return labelText = (IsMultiControl == false ? (@"<td class='" + CurrentRow.Element("DATA_CELL_CSSCLASS").Value.ToString() + "' >" + (isPrefix == false ?
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

                if (CurrentRow.Element("DATA_VALIDATE").Value.ToString().Length > 0)
                    textAttribute = "data-valid='" + CurrentRow.Element("DATA_VALIDATE").Value.ToString() + "' data-valid-msg='" + CurrentRow.Element("REQUIRED_FIELD_MESSAGE").Value.ToString() + "'";


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
                    if (this.PagePostPack)
                        controlText = "<input type='text' class='" + CurrentRow.Element("DATA_FIELD_CSSCLASS").Value.ToString() + "' name='" + CurrentRow.Element("HTML_CONTROL_ID").Value.ToString() + "'  id='" + CurrentRow.Element("HTML_CONTROL_ID").Value.ToString() + "'" + (IsTrans == true ? (" recname='" + CurrentRow.Element("DATA_FIELDNAME").Value.ToString() + "'") : "") + " style='width:" + (CurrentRow.Element("WIDTH").Value.ToString() == "" ? "90" : CurrentRow.Element("WIDTH").Value.ToString()) + "px;' " + textAttribute + "  maxlength='" + CurrentRow.Element("MAXLENGTH").Value.ToString() + "'    value='" + System.Web.HttpContext.Current.Request.Form[CurrentRow.Element("DATA_FIELDNAME").Value.ToString() + (this.objIndex > 0 ? "_" + (this.objIndex - 1).ToString() : "")] + "' />";
                    else
                        controlText = "<input type='text' class='" + CurrentRow.Element("DATA_FIELD_CSSCLASS").Value.ToString() + "' name='" + CurrentRow.Element("HTML_CONTROL_ID").Value.ToString() + "'  id='" + CurrentRow.Element("HTML_CONTROL_ID").Value.ToString() + "'" + (IsTrans == true ? (" recname='" + CurrentRow.Element("DATA_FIELDNAME").Value.ToString() + "'") : "") + " style='width:" + (CurrentRow.Element("WIDTH").Value.ToString() == "" ? "90" : CurrentRow.Element("WIDTH").Value.ToString()) + "px;' " + textAttribute + "  maxlength='" + CurrentRow.Element("MAXLENGTH").Value.ToString() + "' value='" + GetBindFieldValue(CurrentRow.Element("DATA_FIELDNAME").Value.ToString()) + "' />";
                }
                else
                    controlText = "&nbsp;";

                if (CurrentRow.Element("DATA_VALIDATE").Value.ToString().Length > 0)
                {
                    string key = CurrentRow.Element("HTML_CONTROL_ID").Value.ToString();
                    string validationMessage = CurrentRow.Element("REQUIRED_FIELD_MESSAGE").Value.ToString();

                    if (!RequiredValidationDict.ContainsKey(key))
                        RequiredValidationDict.Add(key, validationMessage);

                }
            }

            return labelText = (IsMultiControl == false ? (@"<td class='" + CurrentRow.Element("DATA_CELL_CSSCLASS").Value.ToString() + "' >" + (isPrefix == false ?
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
                    if (this.PagePostPack)
                        controlText = "<input type='text'" + tabIndex + textAttribute + " class='" + CurrentRow.Element("DATA_FIELD_CSSCLASS").Value.ToString() + "' name='" + CurrentRow.Element("HTML_CONTROL_ID").Value.ToString() + "'  id='" + CurrentRow.Element("HTML_CONTROL_ID").Value.ToString() + "'" + (IsTrans == true ? (" recname='" + CurrentRow.Element("DATA_FIELDNAME").Value.ToString() + "'") : "") + " value='" + System.Web.HttpContext.Current.Request.Form[CurrentRow.Element("DATA_FIELDNAME").Value.ToString() + (this.objIndex > 0 ? "_" + (this.objIndex - 1).ToString() : "")] + "' />";
                    else
                        controlText = "<input type='text'" + tabIndex + textAttribute + "  class='" + CurrentRow.Element("DATA_FIELD_CSSCLASS").Value.ToString() + "' name='" + CurrentRow.Element("HTML_CONTROL_ID").Value.ToString() + "'  id='" + CurrentRow.Element("HTML_CONTROL_ID").Value.ToString() + "'" + (IsTrans == true ? (" recname='" + CurrentRow.Element("DATA_FIELDNAME").Value.ToString() + "'") : "") + " value='" + GetBindFieldValue(CurrentRow.Element("DATA_FIELDNAME").Value.ToString()) + "' />";
                }
                else
                    controlText = "&nbsp;";
            }
            return labelText = (IsMultiControl == false ? (@"<td class='" + CurrentRow.Element("DATA_CELL_CSSCLASS").Value.ToString() + "' >" + (isPrefix == false ?
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
                if (CurrentRow.Element("DATA_VALIDATE").Value.ToString().Length > 0)
                    textAttribute = "data-valid='" + CurrentRow.Element("DATA_VALIDATE").Value.ToString() + (CurrentRow.Element("REQUIRED_FIELD_MESSAGE").Value.ToString() != "" ? ("' data-valid-msg='" + CurrentRow.Element("REQUIRED_FIELD_MESSAGE").Value.ToString() + "'") : "'");


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

                        string check = GetBindFieldValue(CurrentRow.Element("HTML_CONTROL_ID").Value.ToString());
                        if ((check == "True" && Name == "Yes") || (check == "False" && Name == "No"))
                            check = Name;

                        if ((check == "" && Counter == 0) || (check == Name))
                            checkedStatus = "checked='True'";

                        string value = ValArr[Counter].ToString();
                        if (this.PagePostPack)
                            controlText = controlText + "<input type='checkbox'" + tabIndex + " class='" + CurrentRow.Element("DATA_FIELD_CSSCLASS").Value.ToString() + "' name='" + CurrentRow.Element("HTML_CONTROL_ID").Value.ToString() + "'   id='" + CurrentRow.Element("HTML_CONTROL_ID").Value.ToString() + "' validatename='" + CurrentRow.Element("HTML_CONTROL_ID").Value.ToString() + "[]'" + (IsTrans == true ? (" recname='" + CurrentRow.Element("DATA_FIELDNAME").Value.ToString() + "'") : "") + " " + onclickevent + " value='" + value.ToString() + "'" + (Name == nameArr[nameArr.Length - 1] ? textAttribute : "") + "/>" + Name + "";
                        else
                            controlText = controlText + "<input type='checkbox'" + tabIndex + "  class='" + CurrentRow.Element("DATA_FIELD_CSSCLASS").Value.ToString() + "' name='" + CurrentRow.Element("HTML_CONTROL_ID").Value.ToString() + "' " + checkedStatus + "  id='" + CurrentRow.Element("HTML_CONTROL_ID").Value.ToString() + "' validatename='" + CurrentRow.Element("HTML_CONTROL_ID").Value.ToString() + "[]'" + (IsTrans == true ? (" recname='" + CurrentRow.Element("DATA_FIELDNAME").Value.ToString() + "'") : "") + " " + onclickevent + " value='" + value.ToString() + "'" + (Name == nameArr[nameArr.Length - 1] ? textAttribute : "") + "/>" + Name + "";
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
                    if (this.PagePostPack)
                        controlText = controlText + "<input type='checkbox'" + tabIndex + " " + onclickevent + " class='" + CurrentRow.Element("DATA_FIELD_CSSCLASS").Value.ToString() + "' name='" + CurrentRow.Element("HTML_CONTROL_ID").Value.ToString() + "'   id='" + CurrentRow.Element("HTML_CONTROL_ID").Value.ToString() + "' " + textAttribute + " validatename='" + CurrentRow.Element("HTML_CONTROL_ID").Value.ToString() + "[]'" + (IsTrans == true ? (" recname='" + CurrentRow.Element("DATA_FIELDNAME").Value.ToString() + "'") : "") + " />";
                    else
                        controlText = controlText + "<input type='checkbox'" + tabIndex + " " + onclickevent + " class='" + CurrentRow.Element("DATA_FIELD_CSSCLASS").Value.ToString() + "' name='" + CurrentRow.Element("HTML_CONTROL_ID").Value.ToString() + "' " + checkedStatus + "  id='" + CurrentRow.Element("HTML_CONTROL_ID").Value.ToString() + "' " + textAttribute + " validatename='" + CurrentRow.Element("HTML_CONTROL_ID").Value.ToString() + "[]'" + (IsTrans == true ? (" recname='" + CurrentRow.Element("DATA_FIELDNAME").Value.ToString() + "'") : "") + " />";


                }
            }
            return labelText = (IsMultiControl == false ? (@"<td class='" + CurrentRow.Element("DATA_CELL_CSSCLASS").Value.ToString() + "' >" + (isPrefix == false ?
                (controlText + spanControl) : (spanControl + "&nbsp;" + controlText)) +
                "</td>") : (isPrefix == false ?
                (controlText + spanControl) : (spanControl + "&nbsp;" + controlText)));
        }
        #endregion

        #region CreateButttonControl
        private string CreateButttonControl(XElement CurrentRow, bool IsMultiControl = false)
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

                    if (CurrentRow.Element("ONCLICK_HANDLER").Value.ToString().Length > 0)
                    {
                        onclickevent = " onclick='return " + CurrentRow.Element("ONCLICK_HANDLER").Value.ToString() + "' ";
                    }
                    if (this.PagePostPack)
                        controlText = "<input type='button'" + tabIndex + textAttribute + " class='" + CurrentRow.Element("DATA_FIELD_CSSCLASS").Value.ToString() + "' name='" + CurrentRow.Element("HTML_CONTROL_ID").Value.ToString() + "'  id='" + CurrentRow.Element("HTML_CONTROL_ID").Value.ToString() + "' style='width:" + (CurrentRow.Element("WIDTH").Value.ToString() == "" ? "80" : CurrentRow.Element("WIDTH").Value.ToString()) + "px;' value='" + CurrentRow.Element("DATA_FIELDNAME").Value.ToString() + "'" + onclickevent + " " + disable + " />";
                    else
                        controlText = "<input type='button'" + tabIndex + textAttribute + "  class='" + CurrentRow.Element("DATA_FIELD_CSSCLASS").Value.ToString() + "' name='" + CurrentRow.Element("HTML_CONTROL_ID").Value.ToString() + "'  id='" + CurrentRow.Element("HTML_CONTROL_ID").Value.ToString() + "' style='width:" + (CurrentRow.Element("WIDTH").Value.ToString() == "" ? "80" : CurrentRow.Element("WIDTH").Value.ToString()) + "px;' value='" + CurrentRow.Element("DATA_FIELDNAME").Value.ToString() + "'" + onclickevent + " " + disable + " />";
                }
                else
                    controlText = "&nbsp;";
            }
            return labelText = (IsMultiControl == false ? (@"<td class='" + CurrentRow.Element("DATA_CELL_CSSCLASS").Value.ToString() + "' >" + (isPrefix == false ?
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
                    if (CurrentRow.Element("DATA_VALIDATE").Value.ToString().Length > 0)
                        textAttribute = "data-valid='" + CurrentRow.Element("DATA_VALIDATE").Value.ToString() + (CurrentRow.Element("REQUIRED_FIELD_MESSAGE").Value.ToString() != "" ? ("' data-valid-msg='" + CurrentRow.Element("REQUIRED_FIELD_MESSAGE").Value.ToString() + "'") : "'");


                    if (CurrentRow.Element("LABEL_CELL_TEXT").Value.ToString().Length > 0)
                        textAttribute = textAttribute + " colname='" + CurrentRow.Element("LABEL_CELL_TEXT").Value.ToString().ToLower() + "' ";

                    foreach (var Name in nameArr)
                    {
                        string value = ValArr[Counter].ToString();
                        if (checkvalue.Length > 0)
                        {
                            checkedStatus = Array.Exists(checkvalue, element => element == value) ? "checked='True'" : "";
                        }
                        if (this.PagePostPack)
                        {
                            if (System.Web.HttpContext.Current.Request.Form[CurrentRow.Element("HTML_CONTROL_ID").Value.ToString()] != null && System.Web.HttpContext.Current.Request.Form[CurrentRow.Element("HTML_CONTROL_ID").Value.ToString()].ToString().Contains(value.ToString()))
                                controlText = controlText + "<input type='checkbox'" + tabIndex + "  class='" + CurrentRow.Element("DATA_FIELD_CSSCLASS").Value.ToString() + "' name='" + CurrentRow.Element("HTML_CONTROL_ID").Value.ToString() + "'  checked='checked' id='" + CurrentRow.Element("HTML_CONTROL_ID").Value.ToString() + "' validatename='" + CurrentRow.Element("HTML_CONTROL_ID").Value.ToString() + "[]'" + (IsTrans == true ? (" recname='" + CurrentRow.Element("DATA_FIELDNAME").Value.ToString() + "'") : "") + " value='" + value.ToString() + "'" + (Name == nameArr[nameArr.Length - 1] ? textAttribute : "") + "/>" + Name + "";
                            else
                                controlText = controlText + "<input type='checkbox'" + tabIndex + "  class='" + CurrentRow.Element("DATA_FIELD_CSSCLASS").Value.ToString() + "' name='" + CurrentRow.Element("HTML_CONTROL_ID").Value.ToString() + "' " + checkedStatus + " id='" + CurrentRow.Element("HTML_CONTROL_ID").Value.ToString() + "' validatename='" + CurrentRow.Element("HTML_CONTROL_ID").Value.ToString() + "[]'" + (IsTrans == true ? (" recname='" + CurrentRow.Element("DATA_FIELDNAME").Value.ToString() + "'") : "") + " value='" + value.ToString() + "'" + (Name == nameArr[nameArr.Length - 1] ? textAttribute : "") + "/>" + Name + "";
                        }
                        else
                        {
                            if (System.Web.HttpContext.Current.Request.Form[CurrentRow.Element("HTML_CONTROL_ID").Value.ToString()] != null && System.Web.HttpContext.Current.Request.Form[CurrentRow.Element("HTML_CONTROL_ID").Value.ToString()].ToString().Contains(value.ToString()))
                                controlText = controlText + "<input type='checkbox'" + tabIndex + "  class='" + CurrentRow.Element("DATA_FIELD_CSSCLASS").Value.ToString() + "' name='" + CurrentRow.Element("HTML_CONTROL_ID").Value.ToString() + "'  checked='checked' id='" + CurrentRow.Element("HTML_CONTROL_ID").Value.ToString() + "' validatename='" + CurrentRow.Element("HTML_CONTROL_ID").Value.ToString() + "[]'" + (IsTrans == true ? (" recname='" + CurrentRow.Element("DATA_FIELDNAME").Value.ToString() + "'") : "") + " value='" + value.ToString() + "'" + (Name == nameArr[nameArr.Length - 1] ? textAttribute : "") + "/>" + Name + "";
                            else
                                controlText = controlText + "<input type='checkbox'" + tabIndex + "  class='" + CurrentRow.Element("DATA_FIELD_CSSCLASS").Value.ToString() + "' name='" + CurrentRow.Element("HTML_CONTROL_ID").Value.ToString() + "' " + checkedStatus + " id='" + CurrentRow.Element("HTML_CONTROL_ID").Value.ToString() + "' validatename='" + CurrentRow.Element("HTML_CONTROL_ID").Value.ToString() + "[]'" + (IsTrans == true ? (" recname='" + CurrentRow.Element("DATA_FIELDNAME").Value.ToString() + "'") : "") + " value='" + value.ToString() + "'" + (Name == nameArr[nameArr.Length - 1] ? textAttribute : "") + "/>" + Name + "";

                        }
                        Counter++;
                    }
                }
                else
                    controlText = "&nbsp;";

            }
            return labelText = (IsMultiControl == false ? (@"<td class='" + CurrentRow.Element("DATA_CELL_CSSCLASS").Value.ToString() + "' >" + (isPrefix == false ?
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
                // Added By Lpradhan on 5th Jan 2017 for Unit in Aircraft Dimension Matrix
                case "DIMENSIONUNIT":
                    foreach (int b in Enum.GetValues(typeof(DIMENSIONUNIT)))
                        ArrayValueEnum.Add(b);
                    break;
                // End Of Lpradhan

                case "UNIT":
                    foreach (int b in Enum.GetValues(typeof(UNIT)))
                        ArrayValueEnum.Add(b);
                    break;
                case "MEASUREMENTUNIT":
                    foreach (int b in Enum.GetValues(typeof(MEASUREMENTUNIT)))
                        ArrayValueEnum.Add(b);
                    break;
                case "ULDTYPE":
                    foreach (int b in Enum.GetValues(typeof(ULDTYPE)))
                        ArrayValueEnum.Add(b);
                    break;
                case "ULDTYPES":
                    foreach (int b in Enum.GetValues(typeof(ULDTYPES)))
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
                case "AREATYPE":
                    foreach (int b in Enum.GetValues(typeof(AREATYPE)))
                        ArrayValueEnum.Add(b);
                    break;

                case "ACTIVE":
                    foreach (int b in Enum.GetValues(typeof(ACTIVE)))
                        ArrayValueEnum.Add(b);
                    break;
                case "ISSECTOR":
                    foreach (int b in Enum.GetValues(typeof(ISSECTOR)))
                        ArrayValueEnum.Add(b);
                    break;
                case "COMMODITYTYPE":
                    foreach (int b in Enum.GetValues(typeof(COMMODITYTYPE)))
                        ArrayValueEnum.Add(b);
                    break;
                case "SCM":
                    foreach (int b in Enum.GetValues(typeof(SCM)))
                        ArrayValueEnum.Add(b);
                    break;
                case "ISACTIVE":
                    foreach (int b in Enum.GetValues(typeof(ISACTIVE)))
                        ArrayValueEnum.Add(b);
                    break;
                case "OTHERCHARGEAPPLICABLEON":
                    foreach (int b in Enum.GetValues(typeof(OTHERCHARGEAPPLICABLEON)))
                        ArrayValueEnum.Add(b);
                    break;
                case "ApprovedISACTIVE":
                    foreach (int b in Enum.GetValues(typeof(ApprovedISACTIVE)))
                        ArrayValueEnum.Add(b);
                    break;
                case "APPLIEDAT":
                    foreach (int b in Enum.GetValues(typeof(APPLIEDAT)))
                        ArrayValueEnum.Add(b);
                    break;
                case "VERIFIED":
                    foreach (int b in Enum.GetValues(typeof(VERIFIED)))
                        ArrayValueEnum.Add(b);
                    break;
                case "PAYMENTBY":
                    foreach (int b in Enum.GetValues(typeof(PAYMENTBY)))
                        ArrayValueEnum.Add(b);
                    break;
                case "TAXAPPLICABLEON":
                    foreach (int b in Enum.GetValues(typeof(TAXAPPLICABLEON)))
                        ArrayValueEnum.Add(b);
                    break;
                case "DUETYPE":
                    foreach (int b in Enum.GetValues(typeof(DUETYPE)))
                        ArrayValueEnum.Add(b);
                    break;
                case "APPROVED":
                    foreach (int b in Enum.GetValues(typeof(APPROVED)))
                        ArrayValueEnum.Add(b);
                    break;
                case "REVERSAL":
                    foreach (int b in Enum.GetValues(typeof(REVERSAL)))
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
                case "CAMPAIGNTYPE":
                    foreach (int b in Enum.GetValues(typeof(CAMPAIGNTYPE)))
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
                case "FREIGHTTYPENEW":
                    foreach (int b in Enum.GetValues(typeof(FREIGHTTYPENEW)))
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
                case "TARGETTYPE":
                    foreach (int b in Enum.GetValues(typeof(TARGETTYPE)))
                        ArrayValueEnum.Add(b);
                    break;
                case "SCHEDULETYPE":
                    foreach (int b in Enum.GetValues(typeof(SCHEDULETYPE)))
                        ArrayValueEnum.Add(b);
                    break;
                case "SCHEDULETYPEFOROPENFLIGHT":
                    foreach (int b in Enum.GetValues(typeof(SCHEDULETYPEFOROPENFLIGHT)))
                        ArrayValueEnum.Add(b);
                    break;
                case "VALUETYPE":
                    foreach (int b in Enum.GetValues(typeof(VALUETYPE)))
                        ArrayValueEnum.Add(b);
                    break;
                case "AWBTYPE":
                    foreach (int b in Enum.GetValues(typeof(AWBTYPE)))
                        ArrayValueEnum.Add(b);
                    break;
                case "ISAUTOAWB":
                    foreach (int b in Enum.GetValues(typeof(StockAutoAWB)))
                        ArrayValueEnum.Add(b);
                    break;
                case "DUECARRIERTYPE":
                    foreach (int b in Enum.GetValues(typeof(DUECARRIERTYPE)))
                        ArrayValueEnum.Add(b);
                    break;
                case "DUECARRIERFREIGHTTYPE":
                    foreach (int b in Enum.GetValues(typeof(DUECARRIERFREIGHTTYPE)))
                        ArrayValueEnum.Add(b);
                    break;
                case "AIRINECODE":
                    foreach (int b in Enum.GetValues(typeof(AIRINECODE)))
                        ArrayValueEnum.Add(b);
                    break;

                case "CONTACTSTYPE":
                    foreach (int b in Enum.GetValues(typeof(CONTACTSTYPE)))
                        ArrayValueEnum.Add(b);
                    break;
                case "AIRCRAFTBODYTYPE":
                    foreach (int b in Enum.GetValues(typeof(AIRCRAFTBODYTYPE)))
                        ArrayValueEnum.Add(b);
                    break;
                case "AIRCRAFTVOLWTTYPE":
                    foreach (int b in Enum.GetValues(typeof(AIRCRAFTVOLWTTYPE)))
                        ArrayValueEnum.Add(b);
                    break;
                case "AIRCRAFTCARGOCLASIFICATION":
                    foreach (int b in Enum.GetValues(typeof(AIRCRAFTCARGOCLASIFICATION)))
                        ArrayValueEnum.Add(b);
                    break;
                case "AWBQueueManagmentType":
                    foreach (int b in Enum.GetValues(typeof(AWBQueueManagmentType)))
                        ArrayValueEnum.Add(b);
                    break;
                case "SPHC":
                    foreach (int b in Enum.GetValues(typeof(SPHC)))
                        ArrayValueEnum.Add(b);
                    break;

                case "RATETYPE":
                    foreach (int b in Enum.GetValues(typeof(RATETYPE)))
                        ArrayValueEnum.Add(b);
                    break;

                case "WALKINGRATETYPE":
                    foreach (int b in Enum.GetValues(typeof(WALKINGRATETYPE)))
                        ArrayValueEnum.Add(b);
                    break;

                case "WEIGHTTYPE":
                    foreach (int b in Enum.GetValues(typeof(WEIGHTTYPE)))
                        ArrayValueEnum.Add(b);
                    break;
                case "SLABTYPE":
                    foreach (int b in Enum.GetValues(typeof(SLABTYPE)))
                        ArrayValueEnum.Add(b);
                    break;
                case "AIRCRAFTGRWTTYPE":
                    foreach (int b in Enum.GetValues(typeof(AIRCRAFTGRWTTYPE)))
                        ArrayValueEnum.Add(b);
                    break;
                case "BOOKINGTYPE":
                    foreach (int b in Enum.GetValues(typeof(BOOKINGTYPE)))
                        ArrayValueEnum.Add(b);
                    break;
                case "BOOKINGSOURCE":
                    foreach (int b in Enum.GetValues(typeof(BOOKINGSOURCE)))
                        ArrayValueEnum.Add(b);
                    break;
                case "VEHICLETYPE":
                    foreach (int b in Enum.GetValues(typeof(VEHICLETYPE)))
                        ArrayValueEnum.Add(b);
                    break;
                case "SHIFTCRITERIA":
                    foreach (int b in Enum.GetValues(typeof(SHIFTCRITERIA)))
                        ArrayValueEnum.Add(b);
                    break;
                case "SLITYPE":
                    foreach (int b in Enum.GetValues(typeof(SLITYPE)))
                        ArrayValueEnum.Add(b);
                    break;
                case "TARIFFSHIPMENTTYPE":
                    foreach (int b in Enum.GetValues(typeof(TARIFFSHIPMENTTYPE)))
                        ArrayValueEnum.Add(b);
                    break;
                case "APPLICABLEFOR":
                    foreach (int b in Enum.GetValues(typeof(APPLICABLEFOR)))
                        ArrayValueEnum.Add(b);
                    break;
                case "CHARGETO":
                    foreach (int b in Enum.GetValues(typeof(CHARGETO)))
                        ArrayValueEnum.Add(b);
                    break;
                case "ISSUETYPE":
                    foreach (int b in Enum.GetValues(typeof(ISSUETYPE)))
                        ArrayValueEnum.Add(b);

                    break;
                case "OWNERTYPE":
                    foreach (int b in Enum.GetValues(typeof(OWNERTYPE)))
                        ArrayValueEnum.Add(b);

                    break;

                case "BASEDON":
                    foreach (int b in Enum.GetValues(typeof(BASEDON)))
                        ArrayValueEnum.Add(b);
                    break;
                case "TARIFFFOR":
                    foreach (int b in Enum.GetValues(typeof(TARIFFFOR)))
                        ArrayValueEnum.Add(b);
                    break;


                case "TARIFFTYPEVALUE":
                    foreach (int b in Enum.GetValues(typeof(TARIFFTYPEVALUE)))
                        ArrayValueEnum.Add(b);
                    break;

                case "WAREHOUSEFACILITY":
                    foreach (int b in Enum.GetValues(typeof(WAREHOUSEFACILITY)))
                        ArrayValueEnum.Add(b);
                    break;
                case "UPDATETYPE":
                    foreach (int b in Enum.GetValues(typeof(UPDATETYPE)))
                        ArrayValueEnum.Add(b);
                    break;
                case "EMPLOYEETYPE":
                    foreach (int b in Enum.GetValues(typeof(EMPLOYEETYPE)))
                        ArrayValueEnum.Add(b);
                    break;

                case "VENDORTYPE":
                    foreach (int b in Enum.GetValues(typeof(VENDORTYPE)))
                        ArrayValueEnum.Add(b);
                    break;

                case "BASEUNITTYPE":
                    foreach (int b in Enum.GetValues(typeof(BASEUNITTYPE)))
                        ArrayValueEnum.Add(b);
                    break;
                case "RECIPIENTTYPE":
                    foreach (int b in Enum.GetValues(typeof(RECIPIENTTYPE)))
                        ArrayValueEnum.Add(b);
                    break;

                case "MODE":
                    foreach (int b in Enum.GetValues(typeof(MODE)))
                        ArrayValueEnum.Add(b);
                    break;
                case "ISGROUP":
                    foreach (int b in Enum.GetValues(typeof(ISGROUP)))
                        ArrayValueEnum.Add(b);
                    break;

                case "ISIATA":
                    foreach (int b in Enum.GetValues(typeof(ISIATA)))
                        ArrayValueEnum.Add(b);
                    break;
                case "ISSAS":
                    foreach (int b in Enum.GetValues(typeof(ISSAS)))
                        ArrayValueEnum.Add(b);
                    break;
                case "PRIORAPPROVAL":
                    foreach (int b in Enum.GetValues(typeof(PRIORAPPROVAL)))
                        ArrayValueEnum.Add(b);
                    break;
                case "INTERLINE":
                    foreach (int b in Enum.GetValues(typeof(INTERLINE)))
                        ArrayValueEnum.Add(b);
                    break;
                case "USERTYPE":
                    foreach (int b in Enum.GetValues(typeof(USERTYPE)))
                        ArrayValueEnum.Add(b);
                    break;
                case "FOR":
                    foreach (int b in Enum.GetValues(typeof(FOR)))
                        ArrayValueEnum.Add(b);
                    break;
                case "SHC":
                    foreach (int b in Enum.GetValues(typeof(SHC)))
                        ArrayValueEnum.Add(b);
                    break;
                case "SLATYPE":
                    foreach (int b in Enum.GetValues(typeof(SLATYPE)))
                        ArrayValueEnum.Add(b);
                    break;
                case "SLABASIS":
                    foreach (int b in Enum.GetValues(typeof(SLABASIS)))
                        ArrayValueEnum.Add(b);
                    break;
                case "ISUPLOAD":
                    foreach (int b in Enum.GetValues(typeof(ISUPLOAD)))
                        ArrayValueEnum.Add(b);
                    break;
                case "BUILDUPTYPE":
                    foreach (int b in Enum.GetValues(typeof(BUILDUPTYPE)))
                        ArrayValueEnum.Add(b);
                    break;
                case "DOCUMENTTYPE":
                    foreach (int b in Enum.GetValues(typeof(DOCUMENTTYPE)))
                        ArrayValueEnum.Add(b);
                    break;
                case "TYPE":
                    foreach (int b in Enum.GetValues(typeof(TYPE)))
                        ArrayValueEnum.Add(b);
                    break;
                case "RATE_TYPE":
                    foreach (int b in Enum.GetValues(typeof(RATE_TYPE)))
                        ArrayValueEnum.Add(b);
                    break;
                case "CHARGE_TYPE":
                    foreach (int b in Enum.GetValues(typeof(CHARGE_TYPE)))
                        ArrayValueEnum.Add(b);
                    break;
                case "CREDITDEBITNOTETYPE":
                    foreach (int b in Enum.GetValues(typeof(CREDITDEBITNOTETYPE)))
                        ArrayValueEnum.Add(b);
                    break;
                case "CNDNIssueTo":
                    foreach (int b in Enum.GetValues(typeof(CNDNIssueTo)))
                        ArrayValueEnum.Add(b);
                    break;
                case "EXPORTORTRANSIT":
                    foreach (int b in Enum.GetValues(typeof(EXPORTORTRANSIT)))
                        ArrayValueEnum.Add(b);
                    break;
                case "CHARGECATEGORY":
                    foreach (int b in Enum.GetValues(typeof(CHARGECATEGORY)))
                        ArrayValueEnum.Add(b);
                    break;
                case "FREESURCHARGE":
                    foreach (int b in Enum.GetValues(typeof(FREESURCHARGE)))
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
                case "MOVEMENTTYPE":
                    foreach (int b in Enum.GetValues(typeof(MOVEMENTTYPE)))
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

                case "UOM":
                    foreach (int b in Enum.GetValues(typeof(UOM)))
                        ArrayValueEnum.Add(b);
                    break;
                case "EmbargoType":
                    foreach (int b in Enum.GetValues(typeof(EmbargoType)))
                        ArrayValueEnum.Add(b);
                    break;

                case "DEFAULT":
                    foreach (int b in Enum.GetValues(typeof(DEFAULT)))
                        ArrayValueEnum.Add(b);
                    break;

                //Added By Vkumar on 29 Dec 2016 Task # 17
                case "CUSTOMERTYPE":
                    foreach (int b in Enum.GetValues(typeof(CUSTOMERTYPE)))
                        ArrayValueEnum.Add(b);
                    break;
                case "APPLICABLETYPE":
                    foreach (int b in Enum.GetValues(typeof(APPLICABLETYPE)))
                        ArrayValueEnum.Add(b);
                    break;
                case "ACTIVEWITHBOTH":
                    foreach (int b in Enum.GetValues(typeof(ACTIVEWITHBOTH)))
                        ArrayValueEnum.Add(b);
                    break;

                case "COMMISSIONUNIT":
                    foreach (int b in Enum.GetValues(typeof(COMMISSIONUNIT)))
                        ArrayValueEnum.Add(b);
                    break;
                //Added By Pankaj Kumar Ishwar on 27-10-2017
                case "MaintenanceCategory":
                    foreach (int b in Enum.GetValues(typeof(MaintenanceCategory)))
                        ArrayValueEnum.Add(b);
                    break;
                case "DIMENSIONMANDATORYON":
                    foreach (int b in Enum.GetValues(typeof(DIMENSIONMANDATORYON)))
                        ArrayValueEnum.Add(b);
                    break;
                //Added By Pankaj Kumar Ishwar on 08-06-2018
                case "SplitShipmentAllowed":
                    foreach (int b in Enum.GetValues(typeof(SplitShipmentAllowed)))
                        ArrayValueEnum.Add(b);
                    break;
                //Added By Vkumar on 29 Dec 2016 Task # 17 Ends
                //Added By Vkumar on 11 Jan 2017 Task # 55
                case "REGIONTYPE":
                    foreach (int b in Enum.GetValues(typeof(REGIONTYPE)))
                        ArrayValueEnum.Add(b);
                    break;
                //ends
                case "UOV":
                    foreach (int b in Enum.GetValues(typeof(UOV)))
                        ArrayValueEnum.Add(b);
                    break;
                case "APPROVAL":
                    foreach (int b in Enum.GetValues(typeof(APPROVAL)))
                        ArrayValueEnum.Add(b);
                    break;
                case "CODETYPE":
                    foreach (int b in Enum.GetValues(typeof(CODETYPE)))
                        ArrayValueEnum.Add(b);

                    break;
                case "CHARGETYPE":
                    foreach (int b in Enum.GetValues(typeof(CHARGETYPE)))
                        ArrayValueEnum.Add(b);
                    break;
                case "COMMISSIONABLETAXABLE":
                    foreach (int b in Enum.GetValues(typeof(COMMISSIONABLETAXABLE)))
                        ArrayValueEnum.Add(b);
                    break;
                case "ISEXCLUDE":
                    foreach (int b in Enum.GetValues(typeof(ISEXCLUDE)))
                        ArrayValueEnum.Add(b);
                    break;
                case "EXCLUDE":
                    foreach (int b in Enum.GetValues(typeof(EXCLUDE)))
                        ArrayValueEnum.Add(b);
                    break;
                case "CONFIGTYPE":
                    foreach (int b in Enum.GetValues(typeof(CONFIGTYPE)))
                        ArrayValueEnum.Add(b);
                    break;
                case "REQUESTTYPE":
                    foreach (int b in Enum.GetValues(typeof(REQUESTTYPE)))
                        ArrayValueEnum.Add(b);
                    break;
                case "AIRLINECLASSRATE":
                    foreach (int b in Enum.GetValues(typeof(AIRLINECLASSRATE)))
                        ArrayValueEnum.Add(b);
                    break;
                case "REPAIR":
                    foreach (int b in Enum.GetValues(typeof(REPAIR)))
                        ArrayValueEnum.Add(b);
                    break;
                case "MAWBCHARGES":
                    foreach (int b in Enum.GetValues(typeof(MAWBCHARGES)))
                        ArrayValueEnum.Add(b);
                    break;
                case "COMMISSIONCUSTOMERTYPE":
                    foreach (int b in Enum.GetValues(typeof(COMMISSIONCUSTOMERTYPE)))
                        ArrayValueEnum.Add(b);
                    break;
                case "MessageFormat":
                    foreach (int b in Enum.GetValues(typeof(MessageFormat)))
                        ArrayValueEnum.Add(b);
                    break;
                case "FileType":
                    foreach (int b in Enum.GetValues(typeof(FileType)))
                        ArrayValueEnum.Add(b);
                    break;
                
                case "BANNERTYPE":
                    foreach (int b in Enum.GetValues(typeof(BANNERTYPE)))
                        ArrayValueEnum.Add(b);
                    break;

                case "OWNER":
                    foreach (int b in Enum.GetValues(typeof(OWNER)))
                        ArrayValueEnum.Add(b);
                    break;
                case "DRIVERASSOCIATEDBRANCH":
                    foreach (int b in Enum.GetValues(typeof(DRIVERASSOCIATEDBRANCH)))
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
                // Added By Lpradhan on 5th Jan 2017 for Unit in Aircraft Dimension Matrix
                case "DIMENSIONUNIT":
                    ArrayEnum = Enum.GetNames(typeof(DIMENSIONUNIT));
                    break;
                // End Of Lpradhan

                case "UNIT":
                    ArrayEnum = Enum.GetNames(typeof(UNIT));
                    break;
                case "ACCEPTANCEUNIT":
                    ArrayEnum = Enum.GetNames(typeof(ACCEPTANCEUNIT));
                    break;
                case "SLIUNIT":
                    ArrayEnum = Enum.GetNames(typeof(SLIUNIT));
                    break;
                case "MEASUREMENTUNIT":
                    ArrayEnum = Enum.GetNames(typeof(MEASUREMENTUNIT));
                    break;
                case "ULDTYPE":
                    ArrayEnum = Enum.GetNames(typeof(ULDTYPE));
                    break;
                case "ULDTYPES":
                    ArrayEnum = Enum.GetNames(typeof(ULDTYPES));
                    break;
                case "ACTIVE":
                    ArrayEnum = Enum.GetNames(typeof(ACTIVE));
                    break;
                case "ISSECTOR":
                    ArrayEnum = Enum.GetNames(typeof(ISSECTOR));
                    break;
                case "APPLIEDAT":
                    ArrayEnum = Enum.GetNames(typeof(APPLIEDAT));
                    break;
                case "PAYMENTBY":
                    ArrayEnum = Enum.GetNames(typeof(PAYMENTBY));
                    break;
                case "VERIFIED":
                    ArrayEnum = Enum.GetNames(typeof(VERIFIED));
                    break;
                case "TAXAPPLICABLEON":
                    ArrayEnum = Enum.GetNames(typeof(TAXAPPLICABLEON));
                    break;
                case "APPROVED":
                    ArrayEnum = Enum.GetNames(typeof(APPROVED));
                    break;
                case "REVERSAL":
                    ArrayEnum = Enum.GetNames(typeof(REVERSAL));
                    break;
                case "DUETYPE":
                    ArrayEnum = Enum.GetNames(typeof(DUETYPE));
                    break;
                case "COMMODITYTYPE":
                    ArrayEnum = Enum.GetNames(typeof(COMMODITYTYPE));
                    break;
                case "SCM":
                    ArrayEnum = Enum.GetNames(typeof(SCM));
                    break;
                case "AREATYPE":
                    ArrayEnum = Enum.GetNames(typeof(AREATYPE));
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
                case "CAMPAIGNTYPE":
                    ArrayEnum = Enum.GetNames(typeof(CAMPAIGNTYPE));
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
                case "FREIGHTTYPENEW":
                    ArrayEnum = Enum.GetNames(typeof(FREIGHTTYPENEW));
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
                case "SLITYPE":
                    ArrayEnum = Enum.GetNames(typeof(SLITYPE));
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
                case "TARGETTYPE":
                    ArrayEnum = Enum.GetNames(typeof(TARGETTYPE));
                    break;
                case "SCHEDULETYPE":
                    ArrayEnum = Enum.GetNames(typeof(SCHEDULETYPE));
                    break;
                case "SCHEDULETYPEFOROPENFLIGHT":
                    ArrayEnum = Enum.GetNames(typeof(SCHEDULETYPEFOROPENFLIGHT));
                    break;
                case "VALUETYPE":
                    ArrayEnum = Enum.GetNames(typeof(VALUETYPE));
                    break;
                case "AWBTYPE":
                    ArrayEnum = Enum.GetNames(typeof(AWBTYPE));
                    break;
                case "ISAUTOAWB":
                    ArrayEnum = Enum.GetNames(typeof(StockAutoAWB));
                    break;
                case "DUECARRIERTYPE":
                    ArrayEnum = Enum.GetNames(typeof(DUECARRIERTYPE));
                    break;
                case "DUECARRIERFREIGHTTYPE":
                    ArrayEnum = Enum.GetNames(typeof(DUECARRIERFREIGHTTYPE));
                    break;
                case "AIRINECODE":
                    ArrayEnum = Enum.GetNames(typeof(AIRINECODE));
                    break;

                case "CONTACTSTYPE":
                    ArrayEnum = Enum.GetNames(typeof(CONTACTSTYPE));
                    break;
                case "AIRCRAFTBODYTYPE":
                    ArrayEnum = Enum.GetNames(typeof(AIRCRAFTBODYTYPE));
                    break;
                case "AIRCRAFTVOLWTTYPE":
                    ArrayEnum = Enum.GetNames(typeof(AIRCRAFTVOLWTTYPE));
                    break;
                case "AIRCRAFTCARGOCLASIFICATION":
                    ArrayEnum = Enum.GetNames(typeof(AIRCRAFTCARGOCLASIFICATION));
                    break;
                case "AWBQueueManagmentType":
                    ArrayEnum = Enum.GetNames(typeof(AWBQueueManagmentType));
                    break;
                case "SPHC":
                    ArrayEnum = Enum.GetNames(typeof(SPHC));
                    break;
                case "RATETYPE":
                    ArrayEnum = Enum.GetNames(typeof(RATETYPE));
                    break;
                case "WALKINGRATETYPE":
                    ArrayEnum = Enum.GetNames(typeof(WALKINGRATETYPE));
                    break;

                case "WEIGHTTYPE":
                    ArrayEnum = Enum.GetNames(typeof(WEIGHTTYPE));
                    break;
                case "SLABTYPE":
                    ArrayEnum = Enum.GetNames(typeof(SLABTYPE));
                    break;
                case "AIRCRAFTGRWTTYPE":
                    ArrayEnum = Enum.GetNames(typeof(AIRCRAFTGRWTTYPE));
                    break;
                case "BOOKINGTYPE":
                    ArrayEnum = Enum.GetNames(typeof(BOOKINGTYPE));
                    break;
                case "BOOKINGSOURCE":
                    ArrayEnum = Enum.GetNames(typeof(BOOKINGSOURCE));
                    break;
                case "VEHICLETYPE":
                    ArrayEnum = Enum.GetNames(typeof(VEHICLETYPE));
                    break;
                case "SHIFTCRITERIA":
                    ArrayEnum = Enum.GetNames(typeof(SHIFTCRITERIA));
                    break;
                case "TARIFFSHIPMENTTYPE":
                    ArrayEnum = Enum.GetNames(typeof(TARIFFSHIPMENTTYPE));
                    break;
                case "APPLICABLEFOR":
                    ArrayEnum = Enum.GetNames(typeof(APPLICABLEFOR));
                    break;
                case "CHARGETO":
                    ArrayEnum = Enum.GetNames(typeof(CHARGETO));
                    break;
                case "ISSUETYPE":
                    ArrayEnum = Enum.GetNames(typeof(ISSUETYPE));
                    break;
                case "OWNERTYPE":
                    ArrayEnum = Enum.GetNames(typeof(OWNERTYPE));
                    break;

                case "BASEDON":
                    ArrayEnum = Enum.GetNames(typeof(BASEDON));
                    break;
                case "TARIFFFOR":
                    ArrayEnum = Enum.GetNames(typeof(TARIFFFOR));
                    break;

                case "TARIFFTYPEVALUE":
                    ArrayEnum = Enum.GetNames(typeof(TARIFFTYPEVALUE));
                    break;
                case "WAREHOUSEFACILITY":
                    ArrayEnum = Enum.GetNames(typeof(WAREHOUSEFACILITY));
                    break;
                case "UPDATETYPE":
                    ArrayEnum = Enum.GetNames(typeof(UPDATETYPE));
                    break;

                case "EMPLOYEETYPE":
                    ArrayEnum = Enum.GetNames(typeof(EMPLOYEETYPE));
                    break;

                case "VENDORTYPE":
                    ArrayEnum = Enum.GetNames(typeof(VENDORTYPE));
                    break;

                case "BASEUNITTYPE":
                    ArrayEnum = Enum.GetNames(typeof(BASEUNITTYPE));
                    break;
                case "RECIPIENTTYPE":
                    ArrayEnum = Enum.GetNames(typeof(RECIPIENTTYPE));
                    break;

                case "MODE":
                    ArrayEnum = Enum.GetNames(typeof(MODE));
                    break;
                case "ISGROUP":
                    ArrayEnum = Enum.GetNames(typeof(ISGROUP));
                    break;
                case "ISIATA":
                    ArrayEnum = Enum.GetNames(typeof(ISIATA));
                    break;
                case "ISSAS":
                    ArrayEnum = Enum.GetNames(typeof(ISSAS));
                    break;
                case "PRIORAPPROVAL":
                    ArrayEnum = Enum.GetNames(typeof(PRIORAPPROVAL));
                    break;
                case "INTERLINE":
                    ArrayEnum = Enum.GetNames(typeof(INTERLINE));
                    break;
                case "USERTYPE":
                    ArrayEnum = Enum.GetNames(typeof(USERTYPE));
                    break;
                case "FOR":
                    ArrayEnum = Enum.GetNames(typeof(FOR));
                    break;
                case "SHC":
                    ArrayEnum = Enum.GetNames(typeof(SHC));
                    break;
                case "SLATYPE":
                    ArrayEnum = Enum.GetNames(typeof(SLATYPE));
                    break;
                case "SLABASIS":
                    ArrayEnum = Enum.GetNames(typeof(SLABASIS));
                    break;
                case "ISUPLOAD":
                    ArrayEnum = Enum.GetNames(typeof(ISUPLOAD));
                    break;
                case "BUILDUPTYPE":
                    ArrayEnum = Enum.GetNames(typeof(BUILDUPTYPE));
                    break;
                case "DOCUMENTTYPE":
                    ArrayEnum = Enum.GetNames(typeof(DOCUMENTTYPE));
                    break;
                case "TYPE":
                    ArrayEnum = Enum.GetNames(typeof(TYPE));
                    break;
                case "RATE_TYPE":
                    ArrayEnum = Enum.GetNames(typeof(RATE_TYPE));
                    break;
                case "CHARGE_TYPE":
                    ArrayEnum = Enum.GetNames(typeof(CHARGE_TYPE));
                    break;
                case "CREDITDEBITNOTETYPE":
                    ArrayEnum = Enum.GetNames(typeof(CREDITDEBITNOTETYPE));
                    break;
                case "CNDNIssueTo":
                    ArrayEnum = Enum.GetNames(typeof(CNDNIssueTo));
                    break;
                case "EXPORTORTRANSIT":
                    ArrayEnum = Enum.GetNames(typeof(EXPORTORTRANSIT));
                    break;
                case "CHARGECATEGORY":
                    ArrayEnum = Enum.GetNames(typeof(CHARGECATEGORY));
                    break;
                case "FREESURCHARGE":
                    ArrayEnum = Enum.GetNames(typeof(FREESURCHARGE));
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

                case "MOVEMENTTYPE":
                    ArrayEnum = Enum.GetNames(typeof(MOVEMENTTYPE));
                    break;
                case "FLIGHTTYPE":
                    ArrayEnum = Enum.GetNames(typeof(FLIGHTTYPE));
                    break;
                case "ACCOUNTTYPEID":
                    ArrayEnum = Enum.GetNames(typeof(ACCOUNTTYPEID));
                    break;

                case "UOM":
                    ArrayEnum = Enum.GetNames(typeof(UOM));
                    break;
                case "EmbargoType":
                    ArrayEnum = Enum.GetNames(typeof(EmbargoType));
                    break;
                case "DEFAULT":
                    ArrayEnum = Enum.GetNames(typeof(DEFAULT));
                    break;
                //Added By Vkumar on 29 Dec 2016 Task # 17
                case "CUSTOMERTYPE":
                    ArrayEnum = Enum.GetNames(typeof(CUSTOMERTYPE));
                    break;
                case "APPLICABLETYPE":
                    ArrayEnum = Enum.GetNames(typeof(APPLICABLETYPE));
                    break;
                case "ACTIVEWITHBOTH":
                    ArrayEnum = Enum.GetNames(typeof(ACTIVEWITHBOTH));
                    break;


                case "COMMISSIONUNIT":
                    ArrayEnum = Enum.GetNames(typeof(COMMISSIONUNIT));
                    break;
                //Added By Pankaj Kumar Ishwar on 27-10-2017
                case "MaintenanceCategory":
                    ArrayEnum = Enum.GetNames(typeof(MaintenanceCategory));                  
                    break;
                case "DIMENSIONMANDATORYON":
                    ArrayEnum = Enum.GetNames(typeof(DIMENSIONMANDATORYON));
                    break;
                case "SplitShipmentAllowed":
                    ArrayEnum = Enum.GetNames(typeof(SplitShipmentAllowed));
                    break;
                //Added By Vkumar on 29 Dec 2016 Task # 17 Ends
                //Added By Vkumar on 11 Jan 2017 Task # 55
                case "REGIONTYPE":
                    ArrayEnum = Enum.GetNames(typeof(REGIONTYPE));
                    break;
                //ends
                case "UOV":
                    ArrayEnum = Enum.GetNames(typeof(UOV));
                    break;
                case "APPROVAL":
                    ArrayEnum = Enum.GetNames(typeof(APPROVAL));
                    break;
                case "CODETYPE":
                    ArrayEnum = Enum.GetNames(typeof(CODETYPE));
                    break;
                case "CHARGETYPE":
                    ArrayEnum = Enum.GetNames(typeof(CHARGETYPE));
                    break;
                case "OTHERCHARGEAPPLICABLEON":
                    ArrayEnum = Enum.GetNames(typeof(OTHERCHARGEAPPLICABLEON));
                    break;
                case "COMMISSIONABLETAXABLE":
                    ArrayEnum = Enum.GetNames(typeof(COMMISSIONABLETAXABLE));
                    break;
                case "ISEXCLUDE":
                    ArrayEnum = Enum.GetNames(typeof(ISEXCLUDE));
                    break;
                case "EXCLUDE":
                    ArrayEnum = Enum.GetNames(typeof(EXCLUDE));
                    break;
                case "CONFIGTYPE":
                    ArrayEnum = Enum.GetNames(typeof(CONFIGTYPE));
                    break;
                case "REQUESTTYPE":
                    ArrayEnum = Enum.GetNames(typeof(REQUESTTYPE));
                    break;
                case "AIRLINECLASSRATE":
                    ArrayEnum = Enum.GetNames(typeof(AIRLINECLASSRATE));
                    break;
                case "REPAIR":
                    ArrayEnum = Enum.GetNames(typeof(REPAIR));
                    break;
                case "MAWBCHARGES":
                    ArrayEnum = Enum.GetNames(typeof(MAWBCHARGES));
                    break;
                case "COMMISSIONCUSTOMERTYPE":
                    ArrayEnum = Enum.GetNames(typeof(COMMISSIONCUSTOMERTYPE));
                    break;
                case "MessageFormat":
                    ArrayEnum = Enum.GetNames(typeof(MessageFormat));
                    break;
                case "FileType":
                    ArrayEnum = Enum.GetNames(typeof(FileType));
                    break;
                case "BANNERTYPE":
                    ArrayEnum = Enum.GetNames(typeof(BANNERTYPE));
                    break;
                case "OWNER":
                    ArrayEnum = Enum.GetNames(typeof(OWNER));
                    break;
                case "DRIVERASSOCIATEDBRANCH":
                    ArrayEnum = Enum.GetNames(typeof(DRIVERASSOCIATEDBRANCH));
                    break;
            }
            return ArrayEnum;
        }
        #endregion

        #region CreateRadioButtonListControl
        private string CreateRadioButtonListControl(XElement CurrentRow, bool IsTrans = false, bool IsMultiControl = false)
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
                    if (CurrentRow.Element("DATA_VALIDATE").Value.ToString().Length > 0)
                        textAttribute = "data-valid='" + CurrentRow.Element("DATA_VALIDATE").Value.ToString() + (CurrentRow.Element("REQUIRED_FIELD_MESSAGE").Value.ToString() != "" ? ("' data-valid-msg='" + CurrentRow.Element("REQUIRED_FIELD_MESSAGE").Value.ToString() + "'") : "'");
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
                        else if ((check == "True" && Name.ToUpper() == "EXPORT") || (check == "False" && Name.ToUpper() == "IMPORT"))
                        {
                            check = Name;
                        }
                        else if ((check == "True" && Name == "Carrier") || (check == "False" && Name == "Agent"))
                        {
                            check = Name;
                        }
                        else if ((check == "True" && Name == "Wide") || (check == "False" && Name == "Narrow"))
                        {
                            check = Name;
                        }
                        else if ((check == "True" && Name == "SHCGroup") || (check == "False" && Name == "SHC"))
                        {
                            check = Name;
                        }
                        else if ((check == "True" && Name == "OldVehicle") || (check == "False" && Name == "NewVehicle"))
                        {
                            check = Name;
                        }
                        else if ((check == "True" && Name == "Airside") || (check == "False" && Name == "Landside"))
                        {
                            check = Name;
                        }
                        else if ((check == "True" && Name == "Domestic") || (check == "False" && Name == "International"))
                        {
                            check = Name;
                        }
                        else if (check != "" && check == value)
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



                        if (CurrentRow.Element("LABEL_CELL_TEXT").Value.ToString().Length > 0)
                            textAttribute = textAttribute + " colname='" + CurrentRow.Element("LABEL_CELL_TEXT").Value.ToString().ToLower() + "' ";


                        if (this.PagePostPack)
                        {

                            if (System.Web.HttpContext.Current.Request.Form[CurrentRow.Element("HTML_CONTROL_ID").Value.ToString()] != null && System.Web.HttpContext.Current.Request.Form[CurrentRow.Element("HTML_CONTROL_ID").Value.ToString()].ToString().Contains(value.ToString()))
                                controlText = controlText + "<input type='radio'" + tabIndex + " data-radioVal='" + TheName.Replace("_", " ") + "'  class='" + CurrentRow.Element("DATA_FIELD_CSSCLASS").Value.ToString() + "' name='" + CurrentRow.Element("HTML_CONTROL_ID").Value.ToString() + "'  checked='checked' id='" + CurrentRow.Element("HTML_CONTROL_ID").Value.ToString() + "'" + (IsTrans == true ? (" recname='" + CurrentRow.Element("DATA_FIELDNAME").Value.ToString() + "'") : "") + " value='" + value.ToString() + "'" + (Name == nameArr[nameArr.Length - 1] ? textAttribute : "") + " " + onclickevent + "/>" + TheName.Replace("_", " ") + "";
                            else
                                controlText = controlText + "<input type='radio'" + tabIndex + " data-radioVal='" + TheName.Replace("_", " ") + "'  class='" + CurrentRow.Element("DATA_FIELD_CSSCLASS").Value.ToString() + "' name='" + CurrentRow.Element("HTML_CONTROL_ID").Value.ToString() + "'  id='" + CurrentRow.Element("HTML_CONTROL_ID").Value.ToString() + "'" + (IsTrans == true ? (" recname='" + CurrentRow.Element("DATA_FIELDNAME").Value.ToString() + "'") : "") + " value='" + value.ToString() + "'" + (Name == nameArr[nameArr.Length - 1] ? textAttribute : "") + " " + onclickevent + "/>" + TheName.Replace("_", " ") + "";
                        }
                        else
                        {
                            if (System.Web.HttpContext.Current.Request.Form[CurrentRow.Element("HTML_CONTROL_ID").Value.ToString()] != null && System.Web.HttpContext.Current.Request.Form[CurrentRow.Element("HTML_CONTROL_ID").Value.ToString()].ToString().Contains(value.ToString()))
                                controlText = controlText + "<input type='radio'" + tabIndex + " data-radioVal='" + TheName.Replace("_", " ") + "'  class='" + CurrentRow.Element("DATA_FIELD_CSSCLASS").Value.ToString() + "' name='" + CurrentRow.Element("HTML_CONTROL_ID").Value.ToString() + "'  checked='checked' id='" + CurrentRow.Element("HTML_CONTROL_ID").Value.ToString() + "'" + (IsTrans == true ? (" recname='" + CurrentRow.Element("DATA_FIELDNAME").Value.ToString() + "'") : "") + " value='" + value.ToString() + "'" + (Name == nameArr[nameArr.Length - 1] ? textAttribute : "") + " " + onclickevent + "/>" + TheName.Replace("_", " ") + "";
                            else
                                controlText = controlText + " " + "<input type='radio'" + tabIndex + " data-radioVal='" + TheName.Replace("_", " ") + "'  class='" + CurrentRow.Element("DATA_FIELD_CSSCLASS").Value.ToString() + "' name='" + CurrentRow.Element("HTML_CONTROL_ID").Value.ToString() + "' " + b + " id='" + CurrentRow.Element("HTML_CONTROL_ID").Value.ToString() + "'" + (IsTrans == true ? (" recname='" + CurrentRow.Element("DATA_FIELDNAME").Value.ToString() + "'") : "") + " value='" + value.ToString() + "'" + (Name == nameArr[nameArr.Length - 1] ? textAttribute : "") + " " + onclickevent + "/>" + TheName.Replace("_", " ") + "";

                        }
                        Counter++;
                    }
                }
                else
                    controlText = "&nbsp;";
            }
            return labelText = (IsMultiControl == false ? (@"<td class='" + CurrentRow.Element("DATA_CELL_CSSCLASS").Value.ToString() + "' >" + (isPrefix == false ?
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

                string textAttribute = "";
                if (CurrentRow.Element("LABEL_CELL_TEXT").Value.ToString().Length > 0)
                    textAttribute = textAttribute + " colname='" + CurrentRow.Element("LABEL_CELL_TEXT").Value.ToString().ToLower() + "' ";

                if (CurrentRow.Element("TAB_INDEX").Value.ToString() != "")
                    tabIndex = " tabindex=" + Int16.Parse(CurrentRow.Element("TAB_INDEX").Value.ToString()) + " ";

                if (CurrentRow.Element("DATA_FIELDNAME").Value.ToString().Length > 0)
                {
                    if (this.PagePostPack)
                        controlText = "<input type='text'" + tabIndex + textAttribute + "  class='" + CurrentRow.Element("DATA_FIELD_CSSCLASS").Value.ToString() + "' name='" + CurrentRow.Element("HTML_CONTROL_ID").Value.ToString() + "'  id='" + CurrentRow.Element("HTML_CONTROL_ID").Value.ToString() + "'" + (IsTrans == true ? (" recname='" + CurrentRow.Element("DATA_FIELDNAME").Value.ToString() + "'") : "") + " value='" + System.Web.HttpContext.Current.Request.Form[CurrentRow.Element("DATA_FIELDNAME").Value.ToString() + (this.objIndex > 0 ? "_" + (this.objIndex - 1).ToString() : "")] + "'  />";
                    else
                        controlText = "<input type='text'" + tabIndex + textAttribute + "  class='" + CurrentRow.Element("DATA_FIELD_CSSCLASS").Value.ToString() + "' name='" + CurrentRow.Element("HTML_CONTROL_ID").Value.ToString() + "'  id='" + CurrentRow.Element("HTML_CONTROL_ID").Value.ToString() + "'" + (IsTrans == true ? (" recname='" + CurrentRow.Element("DATA_FIELDNAME").Value.ToString() + "'") : "") + " value='" + GetBindFieldValue(CurrentRow.Element("DATA_FIELDNAME").Value.ToString()) + "' />";
                }
                else
                    controlText = "&nbsp;";
            }
            return labelText = (IsMultiControl == false ? (@"<td class='" + CurrentRow.Element("DATA_CELL_CSSCLASS").Value.ToString() + "' >" + (isPrefix == false ?
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
                if (property.PropertyType.FullName == "System.String" || property.PropertyType.FullName == null)
                {
                    return property.GetValue(this.objFormData, null) == null ? "" : property.GetValue(this.objFormData, null).ToString();
                }
                else if (property.GetValue(this.objFormData, null) == null)
                {
                    return "";
                }
                else if (property.GetValue(this.objFormData, null).ToString().Contains(","))
                {
                    return property.GetValue(this.objFormData, null).ToString();
                }
                if (int.TryParse(property.GetValue(this.objFormData, null).ToString(), out intValue))
                {
                    return intValue.ToString();
                }
                if (decimal.TryParse(property.GetValue(this.objFormData, null).ToString(), out decValue))
                {
                    return decValue.ToString();
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
                    if (System.Web.HttpContext.Current.Session["UserDetail"] == null)
                        return "dd-MMM-yyyy";
                    return date.ToString(((CargoFlash.Cargo.Model.UserLogin)System.Web.HttpContext.Current.Session["UserDetail"]).SysSetting["DateFormat"]);
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
            for (int i = 0; i < System.Web.HttpContext.Current.Request.QueryString.Count; i++)
            {
                if (System.Web.HttpContext.Current.Request.QueryString.Keys[i].ToString().ToUpper().Trim() == "FORMACTION")
                    URLValue = FormAction;
                else
                    URLValue = System.Web.HttpContext.Current.Request.QueryString[i].ToString();

                if (string.IsNullOrEmpty(strURL))
                    strURL = System.Web.HttpContext.Current.Request.QueryString.Keys[i].ToString() + "=" + URLValue;
                else
                    strURL = strURL + "&" + System.Web.HttpContext.Current.Request.QueryString.Keys[i].ToString() + "=" + URLValue;

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

                string appid = (TargetAppID == "" ? System.Web.HttpContext.Current.Request.QueryString["Apps"].ToString() : TargetAppID);
                string webformdefinition = (TargetModuleName == "" ? (ModuleName != "" ? ModuleName + "/" : "") : (TargetModuleName + "/")) + "WebFormDefinition" + appid + ".xml";
                string action = "FORMACTION." + (TargetFormAction == "" ? System.Web.HttpContext.Current.Request.QueryString["FormAction"].ToString().ToUpper() : TargetFormAction.ToUpper());
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
                XElement webformDocument = XElement.Load(System.Web.HttpContext.Current.Server.MapPath("./HtmlForm/WebForm.xml"));

                HtmlWebForm =
                    from htmlwebform in webformDocument.Elements("WebForm")
                    where (string)htmlwebform.Element("APP_ID") == appid && (string)htmlwebform.Element("DISPLAYMODE") == action
                    select htmlwebform;

                XElement webformDefinationDocument = XElement.Load(System.Web.HttpContext.Current.Server.MapPath("./HtmlForm/" + webformdefinition + ""));

                foreach (var vv in HtmlWebForm)
                {
                    HtmlWebFormDefination =
                        from htmlwebformdef in webformDefinationDocument.Elements("WebFormDefinition")
                        where (int)htmlwebformdef.Element("FORM_ID") == int.Parse(vv.Element("FORM_ID").Value.ToString())
                        orderby (decimal)htmlwebformdef.Element("DISPLAY_ORDER")
                        select htmlwebformdef;
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

    }
}