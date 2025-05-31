
    const symbols = ["🎁", "🔥", "💰", "🍀"];
    const rewards = {
      "🎁🎁🎁": "10% Rabatt",
      "🔥🔥🔥": "20% Rabatt",
      "💰💰💰": "Gratis Versand",
      "🍀🍀🍀": "Ein Gratis-Artikel!"
    };

    function generateCode(prefix) {
      const random = Math.random().toString(36).substring(2, 6).toUpperCase();
      return `${prefix}-${random}`;
    }

    function validateEmail(email) {
      // Einfache E-Mail-Validierung: enthält @ und .
      return /\S+@\S+\.\S+/.test(email);
    }

    function validateName(name) {
      // Nur Buchstaben, mindestens 2 Zeichen
      return /^[A-Za-zÄÖÜäöüß\- ]{2,}$/.test(name);
    }

    function validatePhone(phone) {
      // Mindestens 6 Ziffern, erlaubt +, Leerzeichen, -, ()
      return /^[\d\+\-\(\) ]{6,}$/.test(phone);
    }

    function validateLocation(location) {
      // Mindestens 3 Zeichen, Buchstaben, Ziffern, Leerzeichen, Komma
      return /^[A-Za-zÄÖÜäöüß0-9 ,\-]{3,}$/.test(location);
    }

    function validatePLZ(location) {
      // Extrahiere PLZ am Ende (letzte 4 oder 5 Ziffern)
      const match = location.match(/(\d{4,5})$/);
      return match ? true : false;
    }

    function validateDOB(dob) {
      // Muss gesetzt sein und Nutzer mindestens 18 Jahre alt
      if (!dob) return false;
      const birth = new Date(dob);
      const today = new Date();
      const age = today.getFullYear() - birth.getFullYear();
      const m = today.getMonth() - birth.getMonth();
      if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) {
        return age - 1 >= 18;
      }
      return age >= 18;
    }

    function startSpin() {
      const firstname = document.getElementById("firstname").value.trim();
      const lastname = document.getElementById("lastname").value.trim();
      const email = document.getElementById("email").value.trim();
      const phone = document.getElementById("phone").value.trim();
      const location = document.getElementById("location").value.trim();
      const dob = document.getElementById("dob").value;

      const resultDiv = document.getElementById("result");

      // Validierungen
      if (!validateName(firstname)) {
        alert("Bitte einen gültigen Vornamen eingeben (nur Buchstaben, mindestens 2 Zeichen).");
        return;
      }
      if (!validateName(lastname)) {
        alert("Bitte einen gültigen Nachnamen eingeben (nur Buchstaben, mindestens 2 Zeichen).");
        return;
      }
      if (!validateEmail(email)) {
        alert("Bitte eine gültige E-Mail-Adresse eingeben.");
        return;
      }
      if (!validatePhone(phone)) {
        alert("Bitte eine gültige Telefonnummer eingeben (mind. 6 Ziffern).");
        return;
      }
      if (!validateLocation(location)) {
        alert("Bitte eine gültige Wohngemeinde/PLZ eingeben.");
        return;
      }
      if (!validatePLZ(location)) {
        alert("Bitte geben Sie am Ende der Wohngemeinde eine gültige Postleitzahl (4 oder 5 Ziffern) an.");
        return;
      }
      if (!validateDOB(dob)) {
        alert("Bitte ein gültiges Geburtsdatum eingeben (mindestens 18 Jahre alt).");
        return;
      }

      if (localStorage.getItem("hasSpun") === "true") {
        resultDiv.textContent = "🚫 Du hast bereits einmal gedreht!";
        return;
      }

      resultDiv.textContent = "";

      const reel1 = document.getElementById("reel1");
      const reel2 = document.getElementById("reel2");
      const reel3 = document.getElementById("reel3");

      [reel1, reel2, reel3].forEach(r => r.classList.add("spin"));

      setTimeout(() => {
        [reel1, reel2, reel3].forEach(r => r.classList.remove("spin"));

        const s1 = symbols[Math.floor(Math.random() * symbols.length)];
        const s2 = symbols[Math.floor(Math.random() * symbols.length)];
        const s3 = symbols[Math.floor(Math.random() * symbols.length)];

        reel1.textContent = s1;
        reel2.textContent = s2;
        reel3.textContent = s3;

        const combo = s1 + s2 + s3;
        const win = rewards[combo];

        if (win) {
          const code = generateCode("SAVE");
          resultDiv.textContent = `🎉 ${win} – Dein Rabattcode: ${code}`;
        } else {
          resultDiv.textContent = "Leider kein Gewinn 😢 Versuche es später nochmal!";
        }

        localStorage.setItem("hasSpun", "true");

        databaseClient.insertInto("slot", {
            "Nachname": lastname,
            "Vorname": firstname,
            "E-Mail": email,
            "Telefon-Nr.": phone,
            "Wohngemeinde": location,
            "Geburtsdatum": dob
        })

        console.log("Teilnehmer:", {
          firstname, lastname, email, phone, location, dob, combo, win: win || "Keiner"
        });
      }, 2000);
    }