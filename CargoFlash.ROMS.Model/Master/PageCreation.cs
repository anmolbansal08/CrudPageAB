using System;
using System.Collections.Generic;
using System.Linq;
using System.Runtime.Serialization;
using System.Text;

namespace CargoFlash.Cargo.Model.Master
{
    [KnownType(typeof(PC))]
    public class PC
    {
        public string App_Id { get; set; }
        public string Name { get; set; }
        public string Description { get; set; }
        public string Caption { get; set; }
        public string CurrentHeadingName { get; set; }
        public string ProcessName { get; set; }
        public string SubProcessName { get; set; }
        public string TableName { get; set; }
        public string SectionName { get; set; }


    }

    [KnownType(typeof(PageCreation))]
    public class PageCreation
    {
        public string CurrentHeadingName { get; set; }
        public int SNo { get; set; }
        public string App_Id { get; set; }
        public string Name { get; set; }
        public string Description { get; set; }
        public string Caption { get; set; }
       

        public int CreatedBy { get; set; }
        public int UpdatedBy { get; set; }
        public string TableName { get; set; }
        public string ProcessName { get; set; }
        public string SubProcessName { get; set; }
        
        public int ProcessSno { get; set; }
        public int SubprocessSno { get; set; }
        public string Text_ProcessSno { get; set; }
        public string Text_SubprocessSno { get; set; }
        public string Text_SNo { get; set; }




        public string SectionName { get; set; }


    }
    [KnownType(typeof(PageCreationTables))]
    public class PageCreationTables
    {
        public string ColumnName { get; set; } public string Datatype { get; set; } public string Length { get; set; }
        public int DISPLAY_ORDER { get; set; }
        public string ASSEMBLY_NAME { get; set; }
        public string LABEL_CELL_TEXT { get; set; }
        public string LABEL_CELL_CSSCLASS { get; set; }

        public string DATA_FIELDNAME { get; set; }
        public string DATA_FIELD_CSSCLASS { get; set; }
        public string DATA_CELL_CSSCLASS { get; set; }
        public string ONCLICK_HANDLER { get; set; }
        //public string POSTBACK_URL { get; set; }
        //public string CALLBACK_URL { get; set; }
        //public string SKIN_ID { get; set; }
        public string TOOLTIP { get; set; }
        public bool BTN_USESUBMIT_BEHAVIOUR { get; set; }
        public bool VISIBLE { get; set; }
        public bool READONLY { get; set; }

        public bool ENABLE_VIEWSTATE { get; set; }
        public string MAXLENGTH { get; set; }
        public bool MULTILINE { get; set; }
        public string WIDTH { get; set; }
        public string HEIGHT { get; set; }
        //public string Tab_Id { get; set; }
        //public string Tab_Name { get; set; }
        public string Section_Name { get; set; }
        public string ONKEY_HANDLER { get; set; }
        public string ONBLUR_HANDLER { get; set; }
        public bool ENABLE_REQUIREVALIDATION { get; set; }
        public string REQUIRED_FIELD_MESSAGE { get; set; }
        public string LOOKUP_NAME { get; set; }
        public int TAB_INDEX { get; set; }
        public string XmlFolderName { get; set; }
        public string XmlFileName { get; set; }


    }

}
