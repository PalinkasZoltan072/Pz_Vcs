using System.Net;
using System.Net.Http;
using System.Text;
using System.Text.Json;
using CipoBoltAdmin.Models;
using CipoBoltAdmin.Services;

namespace CipoBoltAdmin.Tests
{
    [TestFixture]
    public class FelhasznaloControlTests
    {
        private FelhasznaloService control;
        private AdminService admin;

        private const string BASE_URL = "http://localhost:4000/felhasznalok";

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

            
             control = new FelhasznaloService();
        }

        // =========================
        // GET TESZTEK
        // =========================

        [Test]
        public async Task LoadFelhasznalokAsync_ShouldReturnList()
        {
            var result = await control.LoadFelhasznalokAsync();

            Assert.IsNotNull(result);
            Assert.IsInstanceOf<List<Felhasznalo>>(result);
        }

        [Test]
        public async Task LoadFelhasznalokAsync_StatusCode_ShouldBe200()
        {
            var res = await ApiClient.Client.GetAsync(BASE_URL);

            Assert.AreEqual(HttpStatusCode.OK, res.StatusCode);
        }

        // =========================
        // DELETE TESZT (HIBÁS)
        // =========================

        [Test]
        public async Task DeleteFelhasznaloAsync_InvalidId_ShouldReturnFalse()
        {
            bool result = await control.DeleteFelhasznaloAsync(-5);

            Assert.IsFalse(result);
        }

        [Test]
        public async Task DeleteFelhasznaloAsync_InvalidId_StatusCode_ShouldBe404()
        {
            var res = await ApiClient.Client.DeleteAsync($"{BASE_URL}/-5");

            Assert.AreEqual(HttpStatusCode.NotFound, res.StatusCode);
        }

        // =========================
        // PATCH TESZTEK
        // =========================

        [Test]
        public async Task PatchSingleFieldAsync_ValidField_ShouldReturnTrue()
        {
            var users = await control.LoadFelhasznalokAsync();

            int id = users[0].Id;

            bool result = await control.PatchSingleFieldAsync(
                id,
                "Település",
                "Budapest"
            );

            Assert.IsTrue(result);
        }

        [Test]
        public async Task PatchSingleFieldAsync_InvalidField_ShouldReturnFalse()
        {
            var users = await control.LoadFelhasznalokAsync();

            int id = users[0].Id;

            bool result = await control.PatchSingleFieldAsync(
                id,
                "NemLetezo",
                "Teszt"
            );

            Assert.IsFalse(result);
        }

        [Test]
        public async Task PatchSingleFieldAsync_StatusCode_ShouldBe200()
        {
            var users = await control.LoadFelhasznalokAsync();

            int id = users[0].Id;

            var body = JsonSerializer.Serialize(new
            {
                telepules = "Szeged"
            });

            var content = new StringContent(body, Encoding.UTF8, "application/json");

            var req = new HttpRequestMessage(
                HttpMethod.Patch,
                $"{BASE_URL}/{id}"
            )
            {
                Content = content
            };

            var res = await ApiClient.Client.SendAsync(req);

            Assert.AreEqual(HttpStatusCode.OK, res.StatusCode);
        }

        // =========================
        // FILTER TESZTEK
        // =========================

        [Test]
        public async Task GetFelhasznalokFilteredAsync_FilterByEmail_ShouldReturnList()
        {
            var filter = new FelhasznaloFilter
            {
                Email = "@"
            };

            var result = await control.GetFelhasznalokFilteredAsync(filter);

            Assert.IsNotNull(result);
            Assert.IsInstanceOf<List<Felhasznalo>>(result);
        }

        [Test]
        public async Task GetFelhasznalokFilteredAsync_EmptyFilter_ShouldReturnList()
        {
            var filter = new FelhasznaloFilter();

            var result = await control.GetFelhasznalokFilteredAsync(filter);

            Assert.IsNotNull(result);
        }

        // =========================
        // FULL CRUD TESZT
        // =========================
        [Test]
        public async Task Felhasznalo_FullCrud_Test()
        {
            




            string email = "ugysemleszilyenemail@gmail.com";
            var body = JsonSerializer.Serialize(new
            {
                email = email,
                felhasznalonev = "ugysemlesziylenfelhasznalonev",
                jelszo = "123456",
                telepules = "Budapest",
                iranyitoszam = 1111
            });

            

            var content = new StringContent(body, Encoding.UTF8, "application/json");

            var createRes = await ApiClient.Client.PostAsync(BASE_URL, content);

            

            var createText = await createRes.Content.ReadAsStringAsync();

            

            Assert.IsTrue(createRes.IsSuccessStatusCode, "CREATE FAILED");



            

            var createdUser = JsonSerializer.Deserialize<Felhasznalo>(
                createText,
                new JsonSerializerOptions { PropertyNameCaseInsensitive = true }
            );

            

            Assert.IsNotNull(createdUser);

            

            int id = createdUser.Id;



            

            bool updated = await control.PatchSingleFieldAsync(
                id,
                "Település",
                "Szeged"
            );

            

            Assert.IsTrue(updated);



            

            var filter = new FelhasznaloFilter
            {
                Email = email
            };

            var filtered = await control.GetFelhasznalokFilteredAsync(filter);

            

            Assert.IsTrue(filtered.Count > 0);



            

            bool deleted = await control.DeleteFelhasznaloAsync(id);

            

            Assert.IsTrue(deleted);



            

            var users = await control.LoadFelhasznalokAsync();

            var deletedUser = users.FirstOrDefault(u => u.Id == id);

            

            Assert.IsNull(deletedUser);

           
        }
    }

    }