using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace CipoBoltAdmin.Models
{
    public class RendelesFilter
    {
        public string Allapot { get; set; }
        public string Fizetes { get; set; }
        public int? MinMennyiseg { get; set; }
        public int? MaxMennyiseg { get; set; }
        public int? CipoId { get; set; }
        public int? FelhasznaloId { get; set; }
    }
}
