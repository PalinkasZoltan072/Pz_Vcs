using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace CipoBoltAdmin.Models
{
    public class Felhasznalo
    {
        public int Id { get; set; }
        public string? Email { get; set; }  // valamiert sirt csak az email miatt így megendejuk neki a nullt de amugy nem lehet ugye a backend nem adja át úgy
        public string Felhasznalonev { get; set; }
        public string Jelszo { get; set; } 
        public string Telepules { get; set; } 
        public int Iranyitoszam { get; set; }
    }
}
