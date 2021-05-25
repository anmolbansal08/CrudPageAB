using System.Runtime.Serialization;
using System;

namespace CargoFlash.Cargo.Model.EDI
{
    [KnownType(typeof(MessageTypeMaster))]
    public class MessageTypeMaster
    {
        public int SNo { get; set; }
        public string MessageType { get; set; }
        public string MessageSubType { get; set; }
        public string MessageMovementType { get; set; }

        public string Text_MessageMovementType { get; set; }
        public string MessageDescription { get; set; }
        public string Version { get; set; }
        public string CreatedBy { get; set; }
        public string UpdatedBy { get; set; }

        public int MessageFormat { get; set; }
        public int FileType { get; set; }

        public string FileNameTemplate { get; set; }

        public string Text_MessageFormat { get; set; }
        public string Text_FileType { get; set; }

    }

    [KnownType(typeof(MessageTypeMasterTrans))]
    public class MessageTypeMasterTrans
    {
        public int MessageTypeVersionTransSNo { get; set; }
        public int MessageTypeMasterSNo { get; set; }
        public string Version { get; set; }
    }
}
