using CipoBoltAdmin;
using Microsoft.VisualBasic;
using System.Collections.Generic;
using System.Collections.ObjectModel;
using System.Net.Http;
using System.Text;
using System.Text.Json;
using System.Threading.Tasks;
using System.Windows;
using System.Windows.Controls;
using szovalwpf.Models;

namespace CipoBoltAdmin.Views
{
    public partial class CipokView : UserControl
    {
        public Cipo? SelectedCipo { get; set; } // a kerdojel azert kell mert azt jelenti hogy ez a változó lehet null ami lesz is pl az oldal betöltésekor meg akkor maikor ugye nem vagyunk egy adott soron vagyis nincs kivalasztva ugye egy sor sem 
        private readonly List<string> Markak = new(){"Nike","Adidas","Puma","New Balance","Asics"};

        private readonly List<string> Tipusok = new() { "focicipő", "utcai cipő", "kosárcipő" };

    

        public ObservableCollection<Cipo> Cipok { get; set; } = new ObservableCollection<Cipo>();
        private  CipoControl cipocontrol;

        public CipokView()
        {
            InitializeComponent();
            DataContext = this;
            cipocontrol = new CipoControl();
            _ = LoadCipokAsync();
        }

        private async Task LoadCipokAsync()
        {
            var lista = await cipocontrol.GetCipokAsync();

            Cipok.Clear();
            foreach (var c in lista)
                Cipok.Add(c);
           

        }



        private async void BtnModifyPrice_Click(object sender, RoutedEventArgs e)
        {
            if (SelectedCipo == null)
            {
                MessageBox.Show(
                    "Előbb válassz ki egy cipőt!",
                    "Hiba",
                    MessageBoxButton.OK,
                    MessageBoxImage.Warning);
                return;
            }

            // Egyszerű input ablak
            string input = Microsoft.VisualBasic.Interaction.InputBox(
                $"Cipő: {SelectedCipo.Nev}\nJelenlegi ár: {SelectedCipo.Ar}\n\nAdd meg az új árat:",
                "Ár módosítása",
                SelectedCipo.Ar.ToString()
            );

            if (!int.TryParse(input, out int ujAr) || ujAr <= 0)
            {
                MessageBox.Show(
                    "Érvénytelen ár!",
                    "Hiba",
                    MessageBoxButton.OK,
                    MessageBoxImage.Error);
                return;
            }

            await cipocontrol.UpdateArAsync(SelectedCipo.Id, ujAr);

            SelectedCipo.Ar = ujAr; // DataGrid frissül
            await LoadCipokAsync();
        }
        
        private async void BtnCreateCipo_Click(object sender, RoutedEventArgs e)
        {
            // ---- UI elemek ----
            var txtNev = new TextBox { Width = 200, Margin = new Thickness(0, 0, 0, 8) };
            var cmbMarka = new ComboBox { Width = 200, ItemsSource = Markak, Margin = new Thickness(0, 0, 0, 8) };
            var cmbTipus = new ComboBox { Width = 200, ItemsSource = Tipusok, Margin = new Thickness(0, 0, 0, 8) };
            var txtMeret = new TextBox { Width = 200, Margin = new Thickness(0, 0, 0, 8) };
            var txtAr = new TextBox { Width = 200 };

            cmbMarka.SelectedIndex = 0;
            cmbTipus.SelectedIndex = 0;

            var panel = new StackPanel { Margin = new Thickness(16) };

            panel.Children.Add(new TextBlock { Text = "Cipő neve:" });
            panel.Children.Add(txtNev);

            panel.Children.Add(new TextBlock { Text = "Márka:" });
            panel.Children.Add(cmbMarka);

            panel.Children.Add(new TextBlock { Text = "Típus:" });
            panel.Children.Add(cmbTipus);

            panel.Children.Add(new TextBlock { Text = "Méret (pl. 41):" });
            panel.Children.Add(txtMeret);

            panel.Children.Add(new TextBlock { Text = "Ár (Ft):" });
            panel.Children.Add(txtAr);

            var btnOk = new Button { Content = "Mentés", Width = 90, Margin = new Thickness(0, 12, 8, 0) };
            var btnCancel = new Button { Content = "Mégse", Width = 90, Margin = new Thickness(0, 12, 0, 0) };

            var btnRow = new StackPanel
            {
                Orientation = Orientation.Horizontal,
                HorizontalAlignment = HorizontalAlignment.Right
            };
            btnRow.Children.Add(btnOk);
            btnRow.Children.Add(btnCancel);

            panel.Children.Add(btnRow);

            var win = new Window
            {
                Title = "Új cipő",
                Content = panel,
                SizeToContent = SizeToContent.WidthAndHeight,
                WindowStartupLocation = WindowStartupLocation.CenterOwner,
                ResizeMode = ResizeMode.NoResize,
                Owner = Window.GetWindow(this)
            };

            btnCancel.Click += (_, _) => win.Close();

            btnOk.Click += async (_, _) =>
            {
                // ---- VALIDÁLÁS ----
                if (string.IsNullOrWhiteSpace(txtNev.Text))
                {
                    MessageBox.Show("A név nem lehet üres!");
                    return;
                }

                if (!int.TryParse(txtMeret.Text, out int meret) || meret < 15 || meret > 60)
                {
                    MessageBox.Show("A méret nem megfelelő!");
                    return;
                }

                if (!int.TryParse(txtAr.Text, out int ar) || ar <= 0)
                {
                    MessageBox.Show("Az ár nem megfelelő!");
                    return;
                }

                string nev = txtNev.Text.Trim();
                string marka = cmbMarka.SelectedItem!.ToString()!;
                string tipus = cmbTipus.SelectedItem!.ToString()!;

                bool ok = await cipocontrol.CreateCipoAsync(nev, marka, meret, ar, tipus);

                if (ok)
                {
                    MessageBox.Show("Új cipő létrehozva!");
                    await LoadCipokAsync();
                    win.Close();
                }
            };

            win.ShowDialog();
        }

        
        private async void BtnDeleteCipo_Click(object sender, RoutedEventArgs e)
        {
            if (SelectedCipo == null)
            {
                MessageBox.Show(
                    "Előbb válassz ki egy cipőt!",
                    "Hiba",
                    MessageBoxButton.OK,
                    MessageBoxImage.Warning);
                return;
            }

            var res = MessageBox.Show(
                $"Biztosan törlöd ezt a cipőt?\n\n" +
                $"Név: {SelectedCipo.Nev}\n" +
                $"Márka: {SelectedCipo.Marka}\n" +
                $"Ár: {SelectedCipo.Ar} Ft",
                "Cipő törlése",
                MessageBoxButton.YesNo,
                MessageBoxImage.Question
            );

            if (res != MessageBoxResult.Yes)
                return;

            bool ok = await cipocontrol.DeleteCipoAsync(SelectedCipo.Id);

            if (ok)
            {
                MessageBox.Show("Cipő törölve!");
                await LoadCipokAsync();   // automatikus frissítés
                SelectedCipo = null;      // biztonság kedvéért
            }
        }
       


    }
}
