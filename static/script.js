document.addEventListener("DOMContentLoaded", function () {
    document.getElementById("vpnForm").addEventListener("submit", async function (event) {
        event.preventDefault();

        const formData = new FormData(this);
        const captchaToken = document.getElementById("captcha").value;

        if (!captchaToken) {
            console.error("❌ Captcha belum diisi!");
            alert("Harap selesaikan captcha terlebih dahulu.");
            return;
        }

        try {
            // 🔄 Ambil `serverid` dan `ssid` dari halaman FastSSH
            const serverPageResponse = await fetch("https://sparkling-limit-b5ca.corspass.workers.dev/?apiurl=https://www.fastssh.com/page/create-obfs-account/server/3/obfs-asia-sg/");
            const serverPageText = await serverPageResponse.text();

            // 🔍 Cari `serverid` dan `ssid` dari HTML halaman FastSSH
            const serverIdMatch = serverPageText.match(/name="serverid" value="(\d+)"/);
            const ssidMatch = serverPageText.match(/name="ssid" value="([\w-]+)"/);

            if (!serverIdMatch || !ssidMatch) {
                throw new Error("Server ID atau SSID tidak ditemukan di halaman FastSSH.");
            }

            const serverid = serverIdMatch[1];
            const ssid = ssidMatch[1];

            // Konversi FormData ke objek dan tambahkan `serverid` & `ssid`
            let payload = {};
            formData.forEach((value, key) => {
                payload[key] = value;
            });

            // Tambahkan data otomatis
            payload.serverid = serverid;
            payload.ssid = ssid;

            console.log("🚀 Mengirim payload:", payload);
            const response = await fetch("https://sparkling-limit-b5ca.corspass.workers.dev/?apiurl=https://www.fastssh.com/page/create-obfs-process", {
                method: "POST",
                headers: { "Content-Type": "application/x-www-form-urlencoded" },
                body: new URLSearchParams(payload).toString()
            });

            const responseText = await response.text();
            console.log("📝 Respons mentah dari server:", responseText);

            try {
                let data = JSON.parse(responseText);
                document.getElementById("responseBox").value = JSON.stringify(data, null, 2);
            } catch (error) {
                console.warn("⚠️ Respons bukan JSON:", responseText);
                document.getElementById("responseBox").value = responseText;
            }
        } catch (error) {
            console.error("❌ Gagal mendapatkan data server atau mengirim permintaan:", error);
            document.getElementById("responseBox").value = "⚠️ Terjadi kesalahan, coba lagi!";
        }
    });
});

function onCaptchaSuccess(token) {
    document.getElementById("captcha").value = token;
}
