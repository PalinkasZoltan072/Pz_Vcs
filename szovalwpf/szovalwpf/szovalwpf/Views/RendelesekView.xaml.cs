using CipoBoltAdmin.Models;
using System.Collections.Generic;
using System.Collections.ObjectModel;
using System.Net.Http;
using System.Text;
using System.Text.Json;
using System.Threading.Tasks;
using System.Windows;
using System.Windows.Controls;

namespace CipoBoltAdmin.Views
{
    public partial class RendelesekView : UserControl
    {
        public Rendeles? SelectedRendeles { get; set; }

        public ObservableCollection<Rendeles> Rendelesek { get; set; } = new ObservableCollection<Rendeles>();

        public RendelesekView()
        {
            InitializeComponent();
            DataContext = this;

            _ = LoadRendelesekAsync();
        }

        private async Task LoadRendelesekAsync()
        {
            try
            {
                using HttpClient client = new HttpClient();

                string url = "http://localhost:4000/rendelesek";

                var response = await client.GetAsync(url);
                response.EnsureSuccessStatusCode();

                var json = await response.Content.ReadAsStringAsync();

                var lista = JsonSerializer.Deserialize<List<Rendeles>>(
                    json,
                    new JsonSerializerOptions { PropertyNameCaseInsensitive = true }
                ) ?? new List<Rendeles>();

                Rendelesek.Clear();
                foreach (var r in lista)
                    Rendelesek.Add(r);
            }
            catch (System.Exception ex)
            {
                MessageBox.Show("Nem sikerült betölteni a rendeléseket.\n\n" + ex.Message,
                    "Hiba", MessageBoxButton.OK, MessageBoxImage.Error);
            }
        }

        
        private async void BtnModifyStatus_Click(object sender, RoutedEventArgs e)
        {
            if (SelectedRendeles == null)
            {
                MessageBox.Show("Előbb válassz ki egy rendelést!");
                return;
            }

            if (SelectedRendeles.Allapot != "szállítás alatt")
            {
                MessageBox.Show(
                    "Csak 'szállítás alatt' állapotú rendelés módosítható!",
                    "Nem módosítható",
                    MessageBoxButton.OK,
                    MessageBoxImage.Warning
                );
                return;
            }

            var res = MessageBox.Show(
                "Biztosan kiszállítottra állítod?",
                "Állapot módosítása",
                MessageBoxButton.YesNo,
                MessageBoxImage.Question
            );

            if (res != MessageBoxResult.Yes)
                return;

            bool ok = await PatchRendelesAllapotAsync(
                SelectedRendeles.Id,
                "kiszállítva"
            );

            if (ok)
            {
                MessageBox.Show("Rendelés állapota frissítve!");
                await LoadRendelesekAsync();
            }
        }

        private async Task<bool> PatchRendelesAllapotAsync(int id, string ujAllapot)
        {
            try
            {
                using HttpClient client = new HttpClient();

                var body = new
                {
                    allapot = ujAllapot
                };

                var json = JsonSerializer.Serialize(body);
                var content = new StringContent(json, Encoding.UTF8, "application/json");

                string url = $"http://localhost:4000/rendelesek/{id}";

                var req = new HttpRequestMessage(HttpMethod.Patch, url)
                {
                    Content = content
                };

                var res = await client.SendAsync(req);

                if (!res.IsSuccessStatusCode)
                {
                    string err = await res.Content.ReadAsStringAsync();
                    MessageBox.Show($"Hiba!\nHTTP: {(int)res.StatusCode}\n{err}");
                    return false;
                }

                return true;
            }
            catch (Exception ex)
            {
                MessageBox.Show(ex.Message);
                return false;
            }
        }
        private async void BtnDeleteOrder_Click(object sender, RoutedEventArgs e)
        {
            if (SelectedRendeles == null)
            {
                MessageBox.Show("Előbb válassz ki egy rendelést!", "Hiba",
                    MessageBoxButton.OK, MessageBoxImage.Warning);
                return;
            }

            var res = MessageBox.Show(
                $"Biztos törlöd ezt a rendelést?\n\nRendelés ID: {SelectedRendeles.Id}",
                "Törlés megerősítése",
                MessageBoxButton.YesNo,
                MessageBoxImage.Question);

            if (res != MessageBoxResult.Yes) return;

            bool ok = await DeleteRendelesAsync(SelectedRendeles.Id);

            if (ok)
            {
                MessageBox.Show("Rendelés törölve!", "OK",
                    MessageBoxButton.OK, MessageBoxImage.Information);

                SelectedRendeles = null;
                await LoadRendelesekAsync(); // nálad lehet LoadRendelesekAsync vagy LoadRendelesek
            }
        }

        private async Task<bool> DeleteRendelesAsync(int id)
        {
            try
            {
                using HttpClient client = new HttpClient();

                string url = $"http://localhost:4000/rendelesek/{id}";
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
            catch (System.Exception ex)
            {
                MessageBox.Show(ex.Message, "Hiba", MessageBoxButton.OK, MessageBoxImage.Error);
                return false;
            }
        }




    }
}
