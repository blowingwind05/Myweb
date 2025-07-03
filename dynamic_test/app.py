from flask import Flask, render_template, request, redirect, url_for
import os
import csv
import json
from datetime import datetime

app = Flask(__name__)

# 确保data目录存在
DATA_DIR = 'data'
if not os.path.exists(DATA_DIR):
    os.makedirs(DATA_DIR)

CSV_FILE = os.path.join(DATA_DIR, 'secrets.csv')
JSON_FILE = os.path.join(DATA_DIR, 'secrets.json')

# 初始化CSV文件（如果不存在）
def init_csv():
    if not os.path.exists(CSV_FILE):
        with open(CSV_FILE, 'w', newline='', encoding='utf-8') as f:
            writer = csv.writer(f)
            writer.writerow(['timestamp', 'username', 'secret_code'])

# 保存数据到CSV和JSON
def save_secret(username, secret_code):
    timestamp = datetime.now().strftime('%Y-%m-%d %H:%M:%S')
    
    # 保存到CSV
    with open(CSV_FILE, 'a', newline='', encoding='utf-8') as f:
        writer = csv.writer(f)
        writer.writerow([timestamp, username, secret_code])
    
    # 保存到JSON
    new_entry = {
        'timestamp': timestamp,
        'username': username,
        'secret_code': secret_code
    }
    
    data = []
    if os.path.exists(JSON_FILE):
        with open(JSON_FILE, 'r', encoding='utf-8') as f:
            data = json.load(f)
    
    data.append(new_entry)
    with open(JSON_FILE, 'w', encoding='utf-8') as f:
        json.dump(data, f, indent=2)

# 从CSV查询数据
def query_secrets(username):
    secrets = []
    with open(CSV_FILE, 'r', encoding='utf-8') as f:
        reader = csv.DictReader(f)
        for row in reader:
            if row['username'] == username:
                secrets.append(row)
    return secrets

# 主页 - 提交暗号
@app.route('/', methods=['GET', 'POST'])
def index():
    if request.method == 'POST':
        username = request.form['username']
        secret_code = request.form['secret_code']
        if username and secret_code:
            save_secret(username, secret_code)
            return redirect(url_for('index'))
    return render_template('index.html')

# 查询页面
@app.route('/query', methods=['GET', 'POST'])
def query():
    results = []
    if request.method == 'POST':
        username = request.form['username']
        if username:
            results = query_secrets(username)
    return render_template('query.html', results=results)

if __name__ == '__main__':
    init_csv()
    app.run(debug=True)