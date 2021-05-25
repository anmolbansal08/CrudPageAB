using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using CargoFlash.Cargo.Model;
using CargoFlash.Cargo.Business;

namespace CargoFlash.Cargo.Business
{
    public class GroupBusiness:BaseBusiness
    {
        private static int sno;
        public static int GroupSNo { get { return sno; } set { sno = value; } }

        private static int usersno;
        public static int UserSNo { get { return usersno; } set { usersno = value; } }
    }
}
