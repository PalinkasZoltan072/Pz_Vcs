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
using CipoBoltAdmin.Services;

namespace CipoBoltAdmin
{
    public partial class Login : Window
    {
        private readonly AdminService adminControl = new AdminService();

        public Login()
        {
            InitializeComponent();
        }

        

        private async void BtnLogin_Click(object sender, RoutedEventArgs e)
        {
            string email = TxtEmail.Text.Trim();
            string jelszo = TxtPassword.Password;

            if (string.IsNullOrWhiteSpace(email) ||
                string.IsNullOrWhiteSpace(jelszo))
            {
                MessageBox.Show("Tölts ki minden mezőt!",
                    "Hiba", MessageBoxButton.OK, MessageBoxImage.Warning);
                return;
            }

            bool ok = await adminControl.LoginAsync(email, jelszo);

            if (!ok)
            {
                MessageBox.Show("Hibás email vagy jelszó!",
                    "Hiba", MessageBoxButton.OK, MessageBoxImage.Error);
                return;
            }

            // SIKERES LOGIN → token beállítva ApiClient-ben
            new MainWindow().Show();
            Close();
        }
    }
}
