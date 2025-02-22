document.addEventListener("DOMContentLoaded", function () {
    document.getElementById("vpnForm").addEventListener("submit", async function (event) {
        event.preventDefault();

        const formData = new FormData(this);

        try {
            const response = await fetch("https://fastssh-test.vercel.app/create_vpn", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ username: "testUser" })
            })
            .then(response => response.text())  // Pastikan membaca response sebagai teks
            .then(text => {
                try {
                    let data = JSON.parse(text);
                    console.log("✅ Data JSON:", data);
                } catch (error) {
                    console.warn("⚠️ Respons bukan JSON:", text);
                }
            })
            .catch(error => console.error("❌ Error:", error));
            const data = await response.json();
            document.getElementById("responseBox").value = JSON.stringify(data, null, 2);
        } catch (error) {
            console.error("❌ Gagal mengirim permintaan:", error);
            document.getElementById("responseBox").value = "⚠️ Terjadi kesalahan, coba lagi!";
        }
    });
});

function onCaptchaSuccess(token) {
    document.getElementById("captcha").value = token;
}
