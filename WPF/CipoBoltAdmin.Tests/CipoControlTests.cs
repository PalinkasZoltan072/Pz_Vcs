using CipoBoltAdmin.Models;
using szovalwpf.Models;
using NUnit.Framework;
using System.Collections.Generic;
using System.Threading.Tasks;
using CipoBoltAdmin.Services;

namespace CipoBoltAdmin.Tests
{
    [TestFixture]
    public class CipoControlTests
    {
        private CipoService control;
        private AdminService admin;

        [SetUp]
        public async Task Setup()
        {
            // Token törlése a biztonság kedvéért
            ApiClient.ClearToken();

            admin = new AdminService();

            // 1. Megpróbálunk belépni a seedelt adminnal
            bool ok = await admin.LoginAsync("admin@gmail.com", "admin123");

            // 2. HA NINCS ILYEN ADMIN, a teszt automatikusan létrehozza!
            if (!ok)
            {
                await admin.RegisterAsync("admin", "admin@gmail.com", "admin123");
                // Újra megpróbálunk belépni
                ok = await admin.LoginAsync("admin@gmail.com", "admin123");
            }

            Assert.IsTrue(ok, "Admin login failed in test setup");

            // FIGYELEM: Itt a control példányosítása fájlonként változik!
             control = new CipoService();
            
        }

        // ============================
        // GET TESZT
        // ============================

        [Test]
        public async Task GetCipokAsync_ShouldReturnList()
        {
            // Act
            var result = await control.GetCipokAsync();

            // Assert
            Assert.IsNotNull(result);
            Assert.IsInstanceOf<List<Cipo>>(result);
        }

        // ============================
        // CREATE TESZT
        // ============================

        [Test]
        public async Task CreateCipoAsync_ValidData_ShouldReturnTrue()
        {
            // 1. Létrehozzuk a cipõt
            var result = await control.CreateCipoAsync(
                "TesztCipo",
                "Nike",
                20000,
                "focicipõ"
            );

            // 2. Ellenõrizzük, hogy sikeres volt-e a létrehozás
            Assert.IsNotNull(result);
            Assert.AreEqual("TesztCipo", result.Nev);

            // 3. TAKARÍTÁS (Cleanup): Töröljük ki az adatbázisból, hogy ne jelenjen meg az Admin felületen!
            bool isDeleted = await control.DeleteCipoAsync(result.Id);
            Assert.IsTrue(isDeleted, "A tesztcipõ törlése nem sikerült a teszt végén!");
        }

        // Hibás input teszt (perem eset)
        [Test]
        public async Task CreateCipoAsync_InvalidData_ShouldReturnFalse()
        {
            var result = await control.CreateCipoAsync(
                "",
                "",
                -100,
                ""
            );

            // Hibás adatnál a backend null-t kell hogy visszaadjon
            Assert.IsNull(result);
        }

        // ============================
        // UPDATE TESZT
        // ============================

        [Test]
        public async Task UpdateArAsync_ExistingId_ShouldReturnTrue()
        {
            bool result = await control.UpdateArAsync(1, 25000);

            Assert.IsTrue(result);
        }

        // hibás ID teszt
        [Test]
        public async Task UpdateArAsync_InvalidId_ShouldReturnFalse()
        {
            bool result = await control.UpdateArAsync(-1, 25000);

            Assert.IsFalse(result);
        }

        // ============================
        // DELETE TESZT
        // ============================
        [Test]
        public async Task DeleteCipoAsync_ValidId_ShouldReturnTrue()
        {
            // 1. Létrehozunk egy teszt cipõt (Méret nélkül)
            var createdCipo = await control.CreateCipoAsync(
                "DeleteTesztCipo",
                "Adidas",
                19000,
                "focicipõ"
            );

            Assert.IsNotNull(createdCipo);

            // 2. Töröljük rögtön a visszakapott ID alapján
            bool deleted = await control.DeleteCipoAsync(createdCipo.Id);

            // 3. Ellenõrizzük a törlést
            Assert.IsTrue(deleted);
        }

        // rossz delete teszt
        [Test]
        public async Task DeleteCipoAsync_InvalidId_ShouldReturnFalse()
        {
            bool result = await control.DeleteCipoAsync(-5);

            Assert.IsFalse(result);
        }

        // ============================
        // FILTER TESZT
        // ============================

        [Test]
        public async Task GetCipokFilteredAsync_FilterByMarka_ShouldReturnList()
        {
            var filter = new CipoFilter
            {
                Marka = "Nike"
            };

            var result = await control.GetCipokFilteredAsync(filter);

            Assert.IsNotNull(result);
            Assert.IsInstanceOf<List<Cipo>>(result);
        }

        // üres filter teszt
        [Test]
        public async Task GetCipokFilteredAsync_EmptyFilter_ShouldReturnList()
        {
            var filter = new CipoFilter();

            var result = await control.GetCipokFilteredAsync(filter);

            Assert.IsNotNull(result);
        }
    }
}