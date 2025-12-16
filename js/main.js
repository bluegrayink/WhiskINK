const uidToPageMap = {
  "contentaika.html": [
    "5D5E93C4", "9D22A0C4", "3DC197C4", "2D2193C4", "AD7388C4", 
    "5D26A2C4", "BD2011C4", "CD06A2C4", "ED3D88C4", "5DE57DC4",
    "4D9A4BC4", "4D2B91C4", "8DF69FC4", "EDF38EC4", "6D868CC4",
    "1D089EC4", "4D117AC4", "AD6576C4", "FD12A0C4"
  ],
  "contentlily.html": [
    "BD16A0C4", "DD1AA2C4", "ED1686C4", "8D0B8FC4", "2D2386C4",
    "4DAF3AC4", "8D00A4C4", "FD3A88C4", "9D2784C4", "3D1782C4",
    "4D09A2C4", "DDFB9BC4", "CDC38EC4", "ED5F76C4", "DDFEA1C4",
    "3D3C95C4", "BD12A0C4", "2DFA79C4", "1DDA81C4", "5DF67DC4"
  ],
  "contentthela.html": [
    "CDA3A7C4", "6D078FC4", "3D0C9EC4", "0D7A97C4", "FDCD8CC4",
    "2D1782C4", "ED13A4C4", "ED0A86C4", "BD4B95C4", "2D12A4C4",
    "6D4C8AC4", "DDCB0AC4", "7D4893C4", "0D498AC4", "FDEA79C4",
    "ED6193C4", "2D10A4C4", "BD6888C4", "4DEA79C4", "EDB78EC4"
  ]
};

// Elements
    const iphoneButton = document.getElementById("iphoneButton");
    const androidButton = document.getElementById("scanButton");
    const iphoneSection = document.getElementById("iphoneSection");
    const androidSection = document.getElementById("androidSection");
    const submitUidButton = document.getElementById("submitUidButton");
    const uidInput = document.getElementById("uidInput");
    const statusDiv = document.getElementById("status");
    const logDiv = document.getElementById("log");


// Helper functions
const setStatus = (status) => {
    statusDiv.textContent = status;
};

const log = (message) => {
    logDiv.innerHTML += message + "<br>";
};

// Function to sanitize UID
const sanitizeUID = (uid) => uid.replace(/:/g, "").toUpperCase();

// Function to validate UID and redirect
const validateAndRedirect = (rawUid) => {
    const uid = sanitizeUID(rawUid);
    let redirectTo = Object.keys(uidToPageMap).find(page => uidToPageMap[page].includes(uid));

    if (redirectTo) {
        setStatus("Access granted. Redirecting...");
        setTimeout(() => {
            localStorage.setItem("isLoggedIn", "true");
            window.location.href = redirectTo;
        }, 1000);
    } else {
        setStatus("Access denied: Invalid UID.");
    }
};

// Show iPhone section when iPhone button is clicked
    iphoneButton.addEventListener("click", () => {
        console.log("iPhone button clicked");
        iphoneSection.style.display = "block";
        androidSection.style.display = "none";
    });

    // Show Android section when Android button is clicked
    androidButton.addEventListener("click", () => {
        console.log("Android button clicked");
        androidSection.style.display = "block";
        iphoneSection.style.display = "none";
    });

    // Handle UID submission for iPhone users
    submitUidButton.addEventListener("click", () => {
        const rawUid = uidInput.value.trim();
        console.log("Submitted UID:", rawUid);
        if (rawUid) {
            validateAndRedirect(rawUid);
        } else {
            setStatus("Please enter a valid UID.");
        }
    });

    // NFC scanning logic for Android
    androidButton.addEventListener("click", async () => {
        log("Please scan your NFC card...");

        try {
            const ndef = new NDEFReader();
            await ndef.scan();
            log("<i>&gt; Scan started &lt;</i>");
            console.log("NFC scan started");

            ndef.addEventListener("readingerror", () => {
                log("Cannot read data from the NFC tag. Try another one?");
                console.log("NFC reading error");
            });

            ndef.addEventListener("reading", ({ serialNumber }) => {
                if (!serialNumber) {
                    log("No serial number detected!");
                    console.log("No serial number detected");
                    return;
                }
                const scannedUID = sanitizeUID(serialNumber);
                log(`Scanned UID: ${scannedUID}`);
                console.log("Scanned UID:", scannedUID);
                validateAndRedirect(scannedUID);
            });
        } catch (error) {
            log("Error: " + error.message);
            console.error("NFC error:", error);
        }
    });
