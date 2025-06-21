import flask
import os
import csv
from datetime import datetime
from fpdf import FPDF
import matplotlib.pyplot as plt
from flask import Flask, render_template, request, redirect, url_for

app = flask.Flask(__name__, template_folder='templates')

# Configure folders
app.config['UPLOAD_FOLDER'] = 'static/pdfs'
app.config['IMAGE_FOLDER'] = 'static/images'
os.makedirs(app.config['UPLOAD_FOLDER'], exist_ok=True)
os.makedirs(app.config['IMAGE_FOLDER'], exist_ok=True)
os.makedirs('data', exist_ok=True)

# Categories and their question ranges
CATEGORIES = {
    "Organizer": range(0, 7),      # q1-q7
    "Empath": range(7, 15),        # q8-q15
    "Analyst": range(15, 23),      # q16-q23
    "Innovator": range(23, 31),    # q24-q31
    "Doer": range(31, 42)          # q32-q42
}

@app.route('/')
def home():
    return render_template('beranda.html')

@app.route('/form')
def form():
    return render_template('form.html')


# @app.route('/', methods=['GET'])
# def home():
#     return render_template('form.html')

@app.route('/result', methods=['POST'])  # Ini route yang benar untuk handle form submission
def handle_result():
    try:
        # Validate required fields
        name = request.form.get('name')
        email = request.form.get('email')
        birthdate = request.form.get('birthdate')
        
        if not all([name, email, birthdate]):
            return render_template('error.html',
                                message="Harap isi semua data pribadi",
                                back_link=url_for('home')), 400
        
        # Collect all answers
        answers = []
        for i in range(1, 43):
            answer = request.form.get(f'q{i}')
            if not answer:
                return render_template('error.html',
                                    message=f"Pertanyaan q{i} belum dijawab",
                                    back_link=url_for('home')), 400
            answers.append(int(answer))
        
        # Calculate category scores
        category_scores = {}
        for category, q_range in CATEGORIES.items():
            category_scores[category] = sum(answers[q_range.start:q_range.stop])
        
        # Determine interpretations
        interpretations = {}
        for category, score in category_scores.items():
            if score < 25:
                interpretations[category] = "Tidak Dominan"
            elif 25 <= score <= 29:
                interpretations[category] = "Cenderung Dominan"
            elif 30 <= score <= 34:
                interpretations[category] = "Dominan"
            elif score >= 35:
                interpretations[category] = "Sangat Dominan"
        
        # Mastermind Color Interpretation
        very_dominant = sum(1 for v in interpretations.values() if v == "Sangat Dominan")
        dominant = sum(1 for v in interpretations.values() if v == "Dominan")
        tend_to_dominant = sum(1 for v in interpretations.values() if v == "Cenderung Dominan")
        not_dominant = sum(1 for v in interpretations.values() if v == "Tidak Dominan")
        
        color_interpretation = determine_color_interpretation(
            very_dominant, dominant, tend_to_dominant, not_dominant)
        
        # Save results
        save_to_csv(name, email, birthdate, answers, category_scores, interpretations, color_interpretation)
        pdf_path = generate_pdf(name, email, birthdate, category_scores, interpretations, color_interpretation)
        generate_chart(category_scores)
        
        return render_template('result.html',
                            name=name,
                            email=email,
                            birthdate=birthdate,
                            category_scores=category_scores,
                            interpretations=interpretations,
                            color_interpretation=color_interpretation,
                            pdf_path=pdf_path)
    
    except Exception as e:
        return render_template('error.html',
                            message=f"Terjadi kesalahan: {str(e)}",
                            back_link=url_for('home')), 500

def determine_color_interpretation(vd, d, ttd, nd):
    if vd >= 3 and d >= 2 and ttd == 0 and nd == 0:
        return "Mastermind (Ungu)"
    elif 1 <= vd <= 3 and d == 4 and ttd <= 1 and nd <= 1:
        return "Multi-Brain Master (Biru)"
    elif 0 <= vd <= 1 and 1 <= d <= 3 and ttd <= 1 and nd <= 1:
        return "Balanced Mind (Hijau Tua)"
    elif vd == 0 and 1 <= d <= 2 and 1 <= ttd <= 4 and nd <= 1:
        return "Dual Strength (Hijau Muda)"
    elif vd == 0 and d == 0 and 1 <= ttd <= 2 and 1 <= nd <= 2:
        return "Single Focus (Kuning)"
    return "Belum Terlihat (Abu-abu)"

def save_to_csv(name, email, birthdate, answers, scores, interpretations, color_interpretation):
    timestamp = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
    file_path = 'data/results.csv'
    
    row = {
        'timestamp': timestamp,
        'name': name,
        'email': email,
        'birthdate': birthdate,
        **{f'q{i}': answers[i-1] for i in range(1, 43)},
        **{f'score_{cat}': score for cat, score in scores.items()},
        **{f'interpretation_{cat}': interp for cat, interp in interpretations.items()},
        'color_interpretation': color_interpretation
    }
    
    file_exists = os.path.isfile(file_path)
    with open(file_path, 'a', newline='', encoding='utf-8') as csvfile:
        writer = csv.DictWriter(csvfile, fieldnames=row.keys())
        if not file_exists:
            writer.writeheader()
        writer.writerow(row)

def generate_pdf(name, email, birthdate, scores, interpretations, color_interpretation):
    pdf = FPDF()
    pdf.add_page()
    pdf.set_font("Arial", size=12)
    
    # Title
    pdf.set_font("Arial", 'B', 16)
    pdf.cell(200, 10, txt="Hasil Tes Morphosis", ln=1, align='C')
    pdf.ln(10)
    
    # User info
    pdf.set_font("Arial", size=12)
    pdf.cell(200, 10, txt=f"Nama: {name}", ln=1)
    pdf.cell(200, 10, txt=f"Email: {email}", ln=1)
    pdf.cell(200, 10, txt=f"Tanggal Lahir: {birthdate}", ln=1)
    pdf.ln(10)
    
    # Scores
    pdf.set_font("Arial", 'B', 14)
    pdf.cell(200, 10, txt="Hasil Kategori:", ln=1)
    pdf.set_font("Arial", size=12)
    
    for category, score in scores.items():
        interpretation = interpretations[category]
        pdf.cell(200, 10, txt=f"{category}: Skor {score} ({interpretation})", ln=1)
    
    pdf.ln(10)
    
    # Color interpretation
    pdf.set_font("Arial", 'B', 14)
    pdf.cell(200, 10, txt="Interpretasi Warna Mastermind:", ln=1)
    pdf.set_font("Arial", size=12)
    pdf.cell(200, 10, txt=color_interpretation, ln=1)
    
    # Save PDF
    filename = f"{name.replace(' ', '_')}_{datetime.now().strftime('%Y%m%d%H%M%S')}.pdf"
    pdf_path = os.path.join(app.config['UPLOAD_FOLDER'], filename)
    pdf.output(pdf_path)
    
    return f"pdfs/{filename}"

def generate_chart(scores):
    plt.figure(figsize=(10, 6))
    bars = plt.barh(list(scores.keys()), list(scores.values()), color=['blue', 'green', 'purple', 'orange', 'red'])
    plt.xlabel('Skor')
    plt.ylabel('Kategori')
    plt.title('Skor Kategori Morphosis')
    
    for bar in bars:
        plt.text(bar.get_width() + 1, bar.get_y() + bar.get_height()/2, 
                f'{bar.get_width()}', va='center', ha='left')
    
    image_path = os.path.join(app.config['IMAGE_FOLDER'], 'chart.png')
    plt.savefig(image_path)
    plt.close()

@app.route('/admin')
def admin():
    results = []
    file_path = 'data/results.csv'
    
    if os.path.isfile(file_path):
        with open(file_path, 'r', encoding='utf-8') as csvfile:
            reader = csv.DictReader(csvfile)
            results = list(reader)
    
    return render_template('admin.html', results=results)

if __name__ == '__main__':
    app.run(debug=True)