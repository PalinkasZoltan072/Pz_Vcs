using CipoBoltAdmin.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net.Http;
using System.Text;
using System.Text.Json;
using System.Threading.Tasks;
using System.Windows;

namespace CipoBoltAdmin.Services
{
    public class RendelesService
    {
        private HttpClient client = ApiClient.Client;

        private const string URL = "http://localhost:4000/rendelesek";

        // ===== GET =====
        public async Task<List<Rendeles>> GetRendelesekAsync()
        {
            try
            {
                var res = await client.GetAsync(URL);
                res.EnsureSuccessStatusCode();

                var json = await res.Content.ReadAsStringAsync();
                var lista = JsonSerializer.Deserialize<List<Rendeles>>(
                    json,
                    new JsonSerializerOptions { PropertyNameCaseInsensitive = true }
                );

                return lista ?? new List<Rendeles>();
            }
            catch (Exception ex)
            {
                MessageBox.Show("Nem sikerült betölteni a rendeléseket.\n\n" + ex.Message,
                    "Hiba", MessageBoxButton.OK, MessageBoxImage.Error);

                return new List<Rendeles>();
            }
        }

        // ===== PATCH (állapot) =====
        public async Task<bool> UpdateAllapotAsync(int id, string ujAllapot)
        {
            try
            {
                var json = JsonSerializer.Serialize(new { allapot = ujAllapot }); // kisbetű!
                var content = new StringContent(json, Encoding.UTF8, "application/json");

                var req = new HttpRequestMessage(HttpMethod.Patch, $"{URL}/{id}")
                {
                    Content = content
                };

                var res = await client.SendAsync(req);

                if (!res.IsSuccessStatusCode)
                {
                    string err = await res.Content.ReadAsStringAsync();
                    MessageBox.Show($"Hiba!\nHTTP: {(int)res.StatusCode}\n{err}",
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

        // ===== DELETE =====
        public async Task<bool> DeleteRendelesAsync(int id)
        {
            try
            {
                var res = await client.DeleteAsync($"{URL}/{id}");

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
        //filteres 
        public async Task<List<Rendeles>> GetRendelesekFilteredAsync(RendelesFilter filter)
        {
            var p = new List<string>();

            if (!string.IsNullOrWhiteSpace(filter.Allapot))
                p.Add("allapot=" + filter.Allapot);

            if (!string.IsNullOrWhiteSpace(filter.Fizetes))
                p.Add("fizetes=" + filter.Fizetes);

            if (filter.MinMennyiseg.HasValue)
                p.Add("minMennyiseg=" + filter.MinMennyiseg.Value);

            if (filter.MaxMennyiseg.HasValue)
                p.Add("maxMennyiseg=" + filter.MaxMennyiseg.Value);

            if (filter.CipoId.HasValue)
                p.Add("cipoId=" + filter.CipoId.Value);

            if (filter.FelhasznaloId.HasValue)
                p.Add("felhasznaloId=" + filter.FelhasznaloId.Value);

            string url = URL;
            if (p.Count > 0)
                url += "?" + string.Join("&", p);

            var res = await client.GetAsync(url);
            res.EnsureSuccessStatusCode();

            var json = await res.Content.ReadAsStringAsync();
            return JsonSerializer.Deserialize<List<Rendeles>>(json,
                new JsonSerializerOptions { PropertyNameCaseInsensitive = true }) ?? new();
        }

    }
}
