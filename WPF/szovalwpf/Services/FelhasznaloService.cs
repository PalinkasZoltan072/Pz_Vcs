using CipoBoltAdmin.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net.Http;
using System.Security.Policy;
using System.Text;
using System.Text.Json;
using System.Threading.Tasks;
using System.Windows;

namespace CipoBoltAdmin.Services
{
    public class FelhasznaloService
        //szűrés kell  és az alapján kellenek Get-ek backendbe ugye specifikusan

        // és így ugye példányosítani fogjuk a xamlekben 
    { // irok egy függvényt ami az apin keresztul eléri az adatok és a modelben lévő osztályokat kihasznalva visszaadja az adatokat
      //using HttpClient client = new HttpClient(); így nem szabad  -> 50nél több adatnál már nem vagyis így rossz nekunk
      // csinalunk itt a control osztalyban egy httpclientet amit egyszer példányosítunk és azt az egy példányt használjuk minden meghívásnál
      // a "TAskos" delete, patcheket.... kiszervezni ide mert az a logika ahol httpclientet hasznalnank

        private HttpClient client = ApiClient.Client;

        private const string URL = "http://localhost:4000/felhasznalok";
        public async Task<List<Felhasznalo>> LoadFelhasznalokAsync()
        {
            try
            {
                //  HTTP GET kérés
                HttpResponseMessage response = await client.GetAsync(URL);

                //  Hibakód esetén exception
                response.EnsureSuccessStatusCode();

                // JSON beolvasása stringbe
                string json = await response.Content.ReadAsStringAsync();

                //  JSON → List<Felhasznalo>
                List<Felhasznalo>? lista =
                    JsonSerializer.Deserialize<List<Felhasznalo>>(
                        json,
                        new JsonSerializerOptions
                        {
                            PropertyNameCaseInsensitive = true
                        });

                //  Null védelem
                return lista ?? new List<Felhasznalo>();
            }
            catch (Exception ex)
            {
                MessageBox.Show(
                    "Nem sikerült lekérni a felhasználókat!\n" + ex.Message,
                    "Hiba",
                    MessageBoxButton.OK,
                    MessageBoxImage.Error);

                return new List<Felhasznalo>();
            }
        }
        public async Task<bool> DeleteFelhasznaloAsync(int id)
        {
            try
            {
                

                string url = $"http://localhost:4000/felhasznalok/{id}";
                var res = await client.DeleteAsync(url);

                if (!res.IsSuccessStatusCode)
                {
                    string err = await res.Content.ReadAsStringAsync();
                    MessageBox.Show($"Nem sikerült törölni!\nHTTP: {(int)res.StatusCode}\n{err}",
                        "Hiba", MessageBoxButton.OK, MessageBoxImage.Error);
                    return false;
                }

                return true;
            }
            catch (Exception ex)
            {
                MessageBox.Show(ex.Message, "Hiba", MessageBoxButton.OK, MessageBoxImage.Error);
                return false;
            }
        }
        public async Task<bool> PatchSingleFieldAsync(int id, string field, string value)
        {
            try
            {
                object body = field switch
                {
                    "Email" => new { email = value },
                    "Felhasználónév" => new { felhasznalonev = value },
                    "Jelszó" => new { jelszo = value },
                    "Település" => new { telepules = value },
                    "Irányítószám" => new { iranyitoszam = int.Parse(value) },
                    _ => null!
                };

                var json = JsonSerializer.Serialize(body);
                var content = new StringContent(json, Encoding.UTF8, "application/json");

                
                var req = new HttpRequestMessage(HttpMethod.Patch,
                    $"http://localhost:4000/felhasznalok/{id}")
                {
                    Content = content
                };

                var res = await client.SendAsync(req);
                return res.IsSuccessStatusCode;
            }
            catch
            {
                MessageBox.Show("Nem sikerült menteni!");
                return false;
            }
        }
        // ez a filteres task
        public async Task<List<Felhasznalo>> GetFelhasznalokFilteredAsync(FelhasznaloFilter filter)
        {
            var filterParams = new List<string>();
             // switchekbe a filtereek
            if (!string.IsNullOrWhiteSpace(filter.Email))
                filterParams.Add("email=" + Uri.EscapeDataString(filter.Email));

            if (!string.IsNullOrWhiteSpace(filter.Felhasznalonev))
                filterParams.Add("felhasznalonev=" + Uri.EscapeDataString(filter.Felhasznalonev));

            if (!string.IsNullOrWhiteSpace(filter.Telepules))
                filterParams.Add("telepules=" + Uri.EscapeDataString(filter.Telepules));

            if (filter.Iranyitoszam.HasValue)
                filterParams.Add("iranyitoszam=" + filter.Iranyitoszam.Value);

            string url = URL;
            if (filterParams.Count > 0)
                url += "?" + string.Join("&", filterParams);

            var res = await client.GetAsync(url);
            res.EnsureSuccessStatusCode();

            var json = await res.Content.ReadAsStringAsync();
            return JsonSerializer.Deserialize<List<Felhasznalo>>(json,
                new JsonSerializerOptions { PropertyNameCaseInsensitive = true }) ?? new();
        }


    }
}
