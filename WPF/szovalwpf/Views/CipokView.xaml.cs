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
using System.IO;
using CipoBoltAdmin.Services;

namespace CipoBoltAdmin.Views
{
    public partial class CipokView : UserControl
    {
        public Cipo? SelectedCipo { get; set; }

        private readonly List<string> Markak = new() { "Nike", "Adidas", "Puma", "New Balance", "Asics" };

        private readonly List<string> Tipusok = new() { "focicipő", "utcai cipő", "kosárcipő" };

        public ObservableCollection<Cipo> Cipok { get; set; } = new ObservableCollection<Cipo>();

        private CipoService cipocontrol;

        public CipokView()
        {
            InitializeComponent();
            DataContext = this;
            cipocontrol = new CipoService();
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

            SelectedCipo.Ar = ujAr;
            await LoadCipokAsync();
        }

        private async void BtnCreateCipo_Click(object sender, RoutedEventArgs e)
        {
            var txtNev = new TextBox { Width = 200, Margin = new Thickness(0, 0, 0, 8) };

            var cmbMarka = new ComboBox
            {
                Width = 200,
                ItemsSource = Markak,
                Margin = new Thickness(0, 0, 0, 8)
            };

            var cmbTipus = new ComboBox
            {
                Width = 200,
                ItemsSource = Tipusok,
                Margin = new Thickness(0, 0, 0, 8)
            };

            var txtAr = new TextBox
            {
                Width = 200,
                Margin = new Thickness(0, 0, 0, 8)
            };

            //  MÉRETEK
            var meretekPanel = new WrapPanel
            {
                Margin = new Thickness(0, 0, 0, 8)
            };

            for (int i = 38; i <= 46; i++)
            {
                meretekPanel.Children.Add(new CheckBox
                {
                    Content = i.ToString(),
                    Margin = new Thickness(4)
                });
            }

            //  KÉPEK 
            var txtKep = new TextBox
            {
                Width = 200,
                IsReadOnly = true,
                Margin = new Thickness(0, 0, 0, 8),
                Text = "nincs kép kiválasztva"
            };

            var btnBrowse = new Button
            {
                Content = "Tallózás",
                Width = 120,
                Margin = new Thickness(0, 0, 0, 8)
            };

            //  ide tároljuk a kiválasztott képeket
            List<string> selectedFiles = new();

            btnBrowse.Click += (_, _) =>
            {
                var dialog = new Microsoft.Win32.OpenFileDialog();

                dialog.Filter = "Images|*.png;*.jpg;*.avif";
                dialog.Multiselect = true;

                if (dialog.ShowDialog() == true)
                {
                    selectedFiles.AddRange(dialog.FileNames);

                    txtKep.Text = $"{selectedFiles.Count} kép kiválasztva";
                }
            };

            var panel = new StackPanel
            {
                Margin = new Thickness(16)
            };

            panel.Children.Add(new TextBlock { Text = "Cipő neve:" });
            panel.Children.Add(txtNev);

            panel.Children.Add(new TextBlock { Text = "Márka:" });
            panel.Children.Add(cmbMarka);

            panel.Children.Add(new TextBlock { Text = "Típus:" });
            panel.Children.Add(cmbTipus);

            panel.Children.Add(new TextBlock { Text = "Méret:" });
            panel.Children.Add(meretekPanel);

            panel.Children.Add(new TextBlock { Text = "Ár (Ft):" });
            panel.Children.Add(txtAr);

            panel.Children.Add(new TextBlock { Text = "Kép:" });
            panel.Children.Add(txtKep);
            panel.Children.Add(btnBrowse);

            var btnOk = new Button
            {
                Content = "Mentés",
                Width = 90,
                Margin = new Thickness(0, 12, 8, 0)
            };

            var btnCancel = new Button
            {
                Content = "Mégse",
                Width = 90,
                Margin = new Thickness(0, 12, 0, 0)
            };

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

            cmbMarka.SelectedIndex = 0;
            cmbTipus.SelectedIndex = 0;

            btnCancel.Click += (_, _) => win.Close();

            btnOk.Click += async (_, _) =>
            {
                if (string.IsNullOrWhiteSpace(txtNev.Text))
                {
                    MessageBox.Show("A név nem lehet üres!");
                    return;
                }

                if (!int.TryParse(txtAr.Text, out int ar) || ar <= 0)
                {
                    MessageBox.Show("Az ár nem megfelelő!");
                    return;
                }

                var meretek = meretekPanel.Children
                    .OfType<CheckBox>()
                    .Where(c => c.IsChecked == true)
                    .Select(c => int.Parse(c.Content!.ToString()!))
                    .ToList();

                if (meretek.Count == 0)
                {
                    MessageBox.Show("Legalább egy méretet válassz ki!");
                    return;
                }

                string nev = txtNev.Text.Trim();
                string marka = cmbMarka.SelectedItem!.ToString()!;
                string tipus = cmbTipus.SelectedItem!.ToString()!;

                var ujCipo = await cipocontrol.CreateCipoAsync(nev, marka, ar, tipus);

                if (ujCipo != null)
                {
                    // MÉRETEK FELTÖLTÉSE
                    await cipocontrol.AddCipoMeretAsync(ujCipo.Id, meretek);

                    // KÉPEK FELTÖLTÉSE
                    if (selectedFiles.Count > 0)
                    {
                        var urls = selectedFiles
                            .Select(Path.GetFileName)
                            .ToList();

                        await cipocontrol.AddCipoKepAsync(ujCipo.Id, urls);
                    }

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
                await LoadCipokAsync();
                SelectedCipo = null;
            }
        }
    }
}