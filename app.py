from flask import Flask, request, jsonify, render_template
import requests

app = Flask(__name__)

# URL tujuan untuk API FastSSH
TARGET_URL = "https://sparkling-limit-b5ca.corspass.workers.dev/?apiurl=https://www.fastssh.com/page/create-obfs-process"

@app.route('/')
def index():
    return render_template("index.html")

@app.route('/create_vpn', methods=['POST'])
def create_vpn():
    try:
        # Ambil data dari request form
        username = request.form.get("username")
        sni_bug = request.form.get("sni")
        protocol = request.form.get("protocol")
        serverid = request.form.get("serverid", "3")  # Default ke 3 jika tidak diberikan
        ssid = request.form.get("ssid", "324543")  # Default jika tidak diberikan
        captcha = request.form.get("captcha")

        if not username or not sni_bug or not protocol or not captcha:
            return jsonify({"error": "Semua kolom wajib diisi!"}), 400

        # Siapkan payload
        payload = {
            "serverid": serverid,
            "username": username,
            "sni_bug": sni_bug,
            "protocol": protocol,
            "ssid": ssid,
            "captcha": captcha,
        }

        # Kirim permintaan ke API tujuan
        response = requests.post(TARGET_URL, data=payload, headers={"Content-Type": "application/x-www-form-urlencoded"})
        response_text = response.text

        # Cek apakah respons berupa JSON atau HTML
        try:
            response_json = response.json()
            return jsonify({"status": "success", "data": response_json})
        except ValueError:
            return jsonify({"status": "warning", "message": "Respons bukan JSON", "data": response_text})

    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True)
