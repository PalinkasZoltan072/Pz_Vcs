using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace CipoBoltAdmin.Models
{
    public class Rendeles
    {
        public int Id { get; set; }
        public string Allapot { get; set; } 
        public string Fizetes { get; set; } 
        public int Mennyiseg { get; set; }

        public int Cipo_id { get; set; }
        public int Felhasznalo_id { get; set; }
    }
}
