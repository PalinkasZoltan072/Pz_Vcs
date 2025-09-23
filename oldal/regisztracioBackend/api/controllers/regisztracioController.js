exports.regisztralas((req,res,next) =>{
    try {
        // 1. adatok kivétele a body-ból
        const { username, email, password } = req.body; // a regisztracioban ugye bekerjuk es a fetchben a databan van ugye benne és onnan kapja meg itt
    
        // 2. alap validáció (pl. ne legyen üres)
        if (!username || !email || !password) {
          return res.status(400).json({ message: "Hiányzó adat!" });
        }
    
        // (később: beszúrás az adatbázisba) // itt kell beszurni ezeket a szarokat tovabb az adatbazisba
        console.log("Új regisztráció:", username, email, password);
    
        // 3. sikeres válasz visszaküldése
        res.status(201).json({ message: "Sikeres regisztráció!" });
    
      } catch (error) {
            next(error);
      }
    })
