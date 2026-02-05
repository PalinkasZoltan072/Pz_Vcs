using CipoBoltAdmin.Models.CipoBoltAdmin.Models;
using System;
using CipoBoltAdmin.Views;
using System.Collections.Generic;
using System.Linq;
using System.Net.Http;
using System.Text;
using System.Text.Json;
using System.Threading.Tasks;
using System.Windows;
using System.Windows.Controls;
using System.Windows.Data;
using System.Windows.Documents;
using System.Windows.Input;
using System.Windows.Media;
using System.Windows.Media.Imaging;
using System.Windows.Shapes;

namespace CipoBoltAdmin
{
    public partial class Login : Window
    {
        public Login()
        {
            InitializeComponent();
        }
        private void LnkRegister_Click(object sender, RoutedEventArgs e)
        {
            Regisztracio reg = new Regisztracio();
            reg.Show();
            this.Close();
        }
        private async void BtnLogin_Click(object sender, RoutedEventArgs e)
        {
            string email = TxtEmail.Text.Trim();
            string jelszo = TxtPassword.Password;

            if (string.IsNullOrWhiteSpace(email) || string.IsNullOrWhiteSpace(jelszo))
            {
                MessageBox.Show("Tölts ki minden mezőt!");
                return;
            }

            using HttpClient client = new HttpClient();

            // ADMINOK LEKÉRÉSE
            string url = "http://localhost:4000/adminok";

            var res = await client.GetAsync(url);
            if (!res.IsSuccessStatusCode)
            {
                MessageBox.Show("Nem érhető el a szerver!");
                return;
            }

            var json = await res.Content.ReadAsStringAsync();
            var admins = JsonSerializer.Deserialize<List<Admin>>(json,
                new JsonSerializerOptions { PropertyNameCaseInsensitive = true })
                ?? new List<Admin>();

            //  ELLENŐRZÉS
            var admin = admins.Find(a =>
                a.Email == email &&
                a.Jelszo == jelszo
            );

            if (admin == null)
            {
                MessageBox.Show("Hibás email vagy jelszó!", "Hiba",
                    MessageBoxButton.OK, MessageBoxImage.Error);
                return;
            }

            //  SIKER
            MainWindow mw = new MainWindow();
            mw.Show();
            this.Close();
        }
    }
}
