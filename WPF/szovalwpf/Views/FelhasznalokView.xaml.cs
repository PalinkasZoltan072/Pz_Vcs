using CipoBoltAdmin.Models;
using CipoBoltAdmin.Services;
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
    public partial class FelhasznalokView : UserControl
    {
        public ObservableCollection<Felhasznalo> Felhasznalok { get; set; }
            = new ObservableCollection<Felhasznalo>();

        public Felhasznalo? SelectedFelhasznalo { get; set; }
        FelhasznaloService felhasznaloControl;

        public FelhasznalokView()
        {
            InitializeComponent();
            felhasznaloControl = new FelhasznaloService();
            DataContext = this;
            _ = LoadFelhasznalokAsync();

        }

        
        private async Task LoadFelhasznalokAsync()
        {
            List<Felhasznalo> lista = await felhasznaloControl.LoadFelhasznalokAsync();

            Felhasznalok.Clear();
            foreach (var f in lista)
                Felhasznalok.Add(f);
        }

        

        private async void BtnRefresh_Click(object sender, RoutedEventArgs e)
        {
            await LoadFelhasznalokAsync();
        }

        
        private async void BtnModifyUser_Click(object sender, RoutedEventArgs e)
        {
            if (SelectedFelhasznalo == null)
            {
                MessageBox.Show("Előbb válassz ki egy felhasználót!");
                return;
            }

            if (!ShowEditPopup(out string field, out string newValue))
                return;

            bool ok = await felhasznaloControl.PatchSingleFieldAsync(SelectedFelhasznalo.Id, field, newValue);

            if (ok)
            {
                MessageBox.Show("Mentve!");
                await LoadFelhasznalokAsync();
            }
        }

        
        private bool ShowEditPopup(out string field, out string newValue)
        {
            field = "";
            newValue = "";

            // ide mentjük majd, amit a user kiválasztott
            string selectedField = "";
            string selectedValue = "";
            bool accepted = false;

            //  UI elemek
            var cmb = new ComboBox { Width = 160, Height = 30, Margin = new Thickness(0, 0, 10, 0) };
            cmb.Items.Add("Email");
            cmb.Items.Add("Felhasználónév");
            cmb.Items.Add("Jelszó");
            cmb.Items.Add("Település"); 
            cmb.Items.Add("Irányítószám");
            cmb.SelectedIndex = 0;

            var txt = new TextBox { Width = 200, Height = 30, VerticalContentAlignment = VerticalAlignment.Center };

            var okBtn = new Button { Content = "OK", Width = 90, Height = 30, Margin = new Thickness(0, 0, 10, 0) };
            var cancelBtn = new Button { Content = "Mégse", Width = 90, Height = 30 };

            // Layout 
            var row1 = new StackPanel { Orientation = Orientation.Horizontal, Margin = new Thickness(0, 0, 0, 10) };
            row1.Children.Add(cmb);
            row1.Children.Add(txt);

            var row2 = new StackPanel { Orientation = Orientation.Horizontal, HorizontalAlignment = HorizontalAlignment.Right };
            row2.Children.Add(okBtn);
            row2.Children.Add(cancelBtn);

            var root = new StackPanel { Margin = new Thickness(16) };
            root.Children.Add(new TextBlock
            {
                Text = "Mit szeretnél módosítani?",
                FontWeight = FontWeights.SemiBold,
                Margin = new Thickness(0, 0, 0, 4)
            });
            
            root.Children.Add(new TextBlock
            {
                Text = "Cím esetén minta: Budapest, Kossuth u. 12.",
                FontSize = 11,
                Foreground = System.Windows.Media.Brushes.Gray,
                Margin = new Thickness(0, 0, 0, 10)
            });
            root.Children.Add(row1);
            root.Children.Add(row2);

            
            var win = new Window
            {
                Title = "Felhasználó módosítása",
                Width = 420, 
                Height = 200,
                ResizeMode = ResizeMode.NoResize,
                WindowStartupLocation = WindowStartupLocation.CenterOwner,
                Owner = Window.GetWindow(this),
                Content = root
            };

            okBtn.Click += (s, e) =>
            {
                string f = cmb.SelectedItem?.ToString() ?? "";
                string v = txt.Text.Trim();

                if (string.IsNullOrWhiteSpace(v))
                {
                    MessageBox.Show("Adj meg új értéket!");
                    return;
                }

                if (f == "Irányítószám")
                {
                    if (!int.TryParse(v, out int irsz) || irsz < 1000 || irsz > 9999)
                    {
                        MessageBox.Show("Az irányítószám 4 számjegy legyen!");
                        return;
                    }
                }

                // IDE mentjük
                selectedField = f;
                selectedValue = v;
                accepted = true;

                win.Close();
            };

            cancelBtn.Click += (s, e) =>
            {
                accepted = false;
                win.Close();
            };

            win.ShowDialog();

            if (!accepted) return false;

            field = selectedField;
            newValue = selectedValue;
            return true;
        }

        
        private async void BtnDeleteUser_Click(object sender, RoutedEventArgs e)
        {
            if (SelectedFelhasznalo == null)
            {
                MessageBox.Show("Előbb válassz ki egy felhasználót!", "Hiba",
                    MessageBoxButton.OK, MessageBoxImage.Warning);
                return;
            }

            var res = MessageBox.Show(
                $"Biztos törlöd ezt a felhasználót?\n\nID: {SelectedFelhasznalo.Id}\nFelhasználónév: {SelectedFelhasznalo.Felhasznalonev}",
                "Törlés megerősítése",
                MessageBoxButton.YesNo,
                MessageBoxImage.Question);

            if (res != MessageBoxResult.Yes) return;

            bool ok = await felhasznaloControl.DeleteFelhasznaloAsync(SelectedFelhasznalo.Id);

            if (ok)
            {
                MessageBox.Show("Felhasználó törölve!", "OK",
                    MessageBoxButton.OK, MessageBoxImage.Information);

                SelectedFelhasznalo = null;
                await LoadFelhasznalokAsync();
            }
        }

        

    }
}
