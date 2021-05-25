using System.Runtime.Serialization;

namespace CargoFlash.Cargo.Model.Permissions
{
    [KnownType(typeof(UserType))]
    public class UserType
    {
        public int SNo { get; set; }
        public string  UserTypeName { get; set; }
        public string CreatedBy { get; set; }
        public string UpdatedBy { get; set; }
        public bool IsActive { get; set; }
        public string Text_IsActive { get; set; }

    }
}
