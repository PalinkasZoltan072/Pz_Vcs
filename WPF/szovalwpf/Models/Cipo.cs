using CipoBoltAdmin.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Text.Json.Serialization;
using System.Threading.Tasks;

namespace szovalwpf.Models
{
    public class Cipo
    {
        [JsonPropertyName("id")]
        public int Id { get; set; }

        [JsonPropertyName("nev")]
        public string Nev { get; set; }

        [JsonPropertyName("marka")]
        public string Marka { get; set; }

        [JsonPropertyName("ar")]
        public int Ar { get; set; }

        [JsonPropertyName("tipus")]
        public string Tipus { get; set; }
        public string MeretekText
        {
            get
            {
                if (Meretek == null || Meretek.Count == 0)
                    return "-";

                return string.Join(", ", Meretek.Select(m => m.Meret));
            }
        }
        [JsonPropertyName("Meretek")]
        public List<CipoMeret> Meretek { get; set; }

        [JsonPropertyName("kepek")]
        public List<CipoKep> Kepek { get; set; }
    }
}
