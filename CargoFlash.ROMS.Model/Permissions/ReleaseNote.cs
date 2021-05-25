using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Runtime.Serialization;
using System.ComponentModel;
using CargoFlash.SoftwareFactory.Data;

namespace CargoFlash.Cargo.Model.Permissions
{
  [KnownType(typeof(ReleaseNote))]
  public class ReleaseNote
    {
        public int SNo { get; set; }
        public string Author { get; set; }
        public int Major { get; set; }
        public int Minor { get; set; }
        public int Build { get; set; }
        public string ReleaseDate { get; set; }
        public string Description { get; set; }
        public string Module { get; set; }
        public string ModuleDescription { get; set; }
        public int TFSId { get; set; }
        public string ModuleOwner { get; set; }
        public string Version { get; set; }
        public int UserSNo { get; set; }
    }

  public class ReleaseNoteRequestModel
  {
      public string Author { get; set; }
      public int Major { get; set; }
      public int Minor { get; set; }
      public int Build { get; set; }
      public string ReleaseDate { get; set; }
      public string Description { get; set; }
  }
}
