
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net.Http;
using System.Text;
using System.Text.Json;
using System.Threading.Tasks;
using System.Windows;
using szovalwpf.Models;
using CipoBoltAdmin.Models;

namespace CipoBoltAdmin
{
    internal class CipoControl
    {
        private HttpClient client = new HttpClient();
        private const string BASE_URL = "http://localhost:4000/cipok";
        private const string CIPO_URL = BASE_URL + "/";
        // ===== GET =====
        public async Task<List<Cipo>> GetCipokAsync()
        {
            try
            {
                var res = await client.GetAsync(BASE_URL);
                res.EnsureSuccessStatusCode();

                var json = await res.Content.ReadAsStringAsync();
                var lista = JsonSerializer.Deserialize<List<Cipo>>(
                    json,
                    new JsonSerializerOptions { PropertyNameCaseInsensitive = true }
                );

                return lista ?? new List<Cipo>();
            }
            catch (Exception ex)
            {
                MessageBox.Show("Nem sikerült betölteni a cipőket!\n" + ex.Message);
                return new List<Cipo>();
            }
        }

        public async Task<bool> CreateCipoAsync(string nev, string marka, int meret, int ar, string tipus)
        {
            try
            {
                var json = JsonSerializer.Serialize(new
                {
                    nev = nev,
                    marka = marka,
                    meret = meret,
                    ar = ar,
                    tipus = tipus
                });

                var content = new StringContent(json, Encoding.UTF8, "application/json");
                var res = await client.PostAsync(BASE_URL, content);

                if (!res.IsSuccessStatusCode)
                {
                    string err = await res.Content.ReadAsStringAsync();
                    MessageBox.Show($"Nem sikerült létrehozni!\nHTTP: {(int)res.StatusCode}\n{err}",
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

        // ===== PATCH (ár módosítás) =====
        public async Task<bool> UpdateArAsync(int id, int ujAr)
        {
            try
            {
                var json = JsonSerializer.Serialize(new { ar = ujAr });
                var content = new StringContent(json, Encoding.UTF8, "application/json");

                var req = new HttpRequestMessage(HttpMethod.Patch, $"{BASE_URL}/{id}")
                {
                    Content = content
                };

                var res = await client.SendAsync(req);

                if (!res.IsSuccessStatusCode)
                {
                    string err = await res.Content.ReadAsStringAsync();
                    MessageBox.Show($"Nem sikerült módosítani!\nHTTP: {(int)res.StatusCode}\n{err}",
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
        public async Task<bool> DeleteCipoAsync(int id)
        {
            try
            {
                var res = await client.DeleteAsync($"{BASE_URL}/{id}");

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
        // szűrés


        // ✅ EZ AZ ÚJ: FILTERES GET
        public async Task<List<Cipo>> GetCipokFilteredAsync(CipoFilter filter)
        {
            try
            {
                // beszédes név: filter
                var filterParams = new List<string>();

                if (!string.IsNullOrWhiteSpace(filter.Nev))
                    filterParams.Add("nev=" + Uri.EscapeDataString(filter.Nev.Trim()));

                if (!string.IsNullOrWhiteSpace(filter.Marka))
                    filterParams.Add("marka=" + Uri.EscapeDataString(filter.Marka.Trim()));

                if (!string.IsNullOrWhiteSpace(filter.Tipus))
                    filterParams.Add("tipus=" + Uri.EscapeDataString(filter.Tipus.Trim()));

                if (filter.Meret.HasValue)
                    filterParams.Add("meret=" + filter.Meret.Value);

                if (filter.MinAr.HasValue)
                    filterParams.Add("minAr=" + filter.MinAr.Value);

                if (filter.MaxAr.HasValue)
                    filterParams.Add("maxAr=" + filter.MaxAr.Value);

                string url = CIPO_URL;
                if (filterParams.Count > 0)
                    url += "?" + string.Join("&", filterParams);

                var res = await client.GetAsync(url);
                res.EnsureSuccessStatusCode();

                var json = await res.Content.ReadAsStringAsync();
                var lista = JsonSerializer.Deserialize<List<Cipo>>(
                    json,
                    new JsonSerializerOptions { PropertyNameCaseInsensitive = true }
                );

                return lista ?? new List<Cipo>();
            }
            catch (Exception ex)
            {
                MessageBox.Show("Szűrés sikertelen!\n" + ex.Message);
                return new List<Cipo>();
            }
        }
    }
}
