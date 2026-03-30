using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace CipoBoltAdmin.Models
{
    public class CipoFilter
    {
        public string? Nev { get; set; }
        public string? Marka { get; set; }
        public string? Tipus { get; set; }

        public List<int>? Meretek { get; set; }
        public int? MinAr { get; set; }
        public int? MaxAr { get; set; }
    }
}
