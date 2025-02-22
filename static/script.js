document.addEventListener("DOMContentLoaded", function () {
    document.getElementById("vpnForm").addEventListener("submit", async function (event) {
        event.preventDefault(); // Mencegah form melakukan reload halaman

        const username = document.getElementById("username").value.trim();
        const sni = document.getElementById("sni").value.trim();
        const protocol = document.getElementById("protocol").value;
        const captcha = document.getElementById("captcha").value;

        if (!username || !sni || !protocol || !captcha) {
            alert("⚠️ Semua kolom harus diisi sebelum mengirim!");
            return;
        }

        try {
            // 🔄 Ambil `serverid` dan `ssid` secara otomatis dari FastSSH
            const { serverid, ssid } = await fetchServerData();
            if (!serverid || !ssid) {
                throw new Error("Server ID atau SSID tidak ditemukan!");
            }

            // Buat payload untuk dikirim ke FastSSH
            const payload = new URLSearchParams({
                "serverid": serverid,
                "username": username,
                "sni_bug": sni,
                "protocol": protocol,
                "ssid": ssid,
                "captcha": captcha
            });

            const apiUrl = "https://sparkling-limit-b5ca.corspass.workers.dev/?apiurl=https://www.fastssh.com/page/create-obfs-process";

            console.log("🚀 Mengirim permintaan ke:", apiUrl);
            console.log("📩 Payload:", Object.fromEntries(payload));

            const response = await fetch(apiUrl, {
                method: "POST",
                headers: { "Content-Type": "application/x-www-form-urlencoded" },
                body: payload
            });

            const responseText = await response.text();
            console.log("✅ Respons Server:", responseText);

            document.getElementById("responseBox").value = responseText;
        } catch (error) {
            console.error("❌ Gagal mengirim permintaan:", error);
            alert("⚠️ Gagal membuat akun. Silakan coba lagi.");
        }
    });
});

/**
 * 🔍 Ambil Server ID dan SSID dari FastSSH
 */
async function fetchServerData() {
    const apiUrl = "https://sparkling-limit-b5ca.corspass.workers.dev/?apiurl=https://www.fastssh.com/page/create-obfs-account/server/3/obfs-asia-sg/";

    try {
        const response = await fetch(apiUrl);
        const text = await response.text();

        const serverIdMatch = text.match(/name="serverid" value="(\d+)"/);
        const ssidMatch = text.match(/name="ssid" value="([\w-]+)"/);

        if (!serverIdMatch || !ssidMatch) {
            throw new Error("Server ID atau SSID tidak ditemukan dalam halaman FastSSH.");
        }

        return {
            serverid: serverIdMatch[1],
            ssid: ssidMatch[1]
        };
    } catch (error) {
        console.error("❌ Gagal mengambil Server ID atau SSID:", error);
        return { serverid: null, ssid: null };
    }
}

function onCaptchaSuccess(token) {
    document.getElementById("captcha").value = token;
}
