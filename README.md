

# 🤖 Design and Implementation of an AI-Powered Resume Parsing and Screening System


Welcome to **AI Recruiter** – an end-to-end intelligent recruitment platform that automates resume analysis, predicts candidate salary, visualizes model performance, and offers an interactive frontend for HR professionals and job applicants alike.

> 📂 Built with Python (Flask), TypeScript (React), XGBoost, and more — it's your AI-powered recruitment sidekick!

---

## 🌟 Features

✅ Resume analysis powered by ML  
✅ Salary prediction based on experience and skills  
✅ Data dashboards for model insights  
✅ Multiple XGBoost models (basic, text, improved)  
✅ Feature importance and confusion matrix visualizations  
✅ User-friendly web interface built using `React + TypeScript`  
✅ Secure form handling with Flask backend  
✅ Modular, scalable, and extensible project structure  

---

## 🧠 Tech Stack

| Layer | Technology |
|-------|------------|
| Backend | Python, Flask |
| Frontend | React, TypeScript |
| Machine Learning | XGBoost, Sklearn, Pandas |
| Visualization | Matplotlib |
| Storage | CSVs, Pickle Models |
| Styling | CSS |
| Deployment | Flask App (Local or Cloud) |

---

## 📁 Folder Structure

```

.
├── App.tsx                # Main React App component
├── Index.tsx              # ReactDOM render
├── app.py                 # Flask API entry point
├── data/                  # CSV data files
├── models/                # Trained ML models (.pkl)
├── src/                   # Python ML pipeline scripts
│   ├── data\_preparation.py
│   ├── model\_training.py
│   ├── model\_evaluation.py
│   └── ...
├── templates/             # HTML templates for Flask
├── styles.css             # Global frontend styles
├── requirements.txt       # Python dependencies
├── \*.png                  # Model plots and visualizations

````

---

## ⚙️ Installation & Setup

### 1. Clone the repository

```bash
git clone https://github.com/sanket-07/RESUMATE.git
cd Resumate
```

### 2. Create a virtual environment & activate



```bash
python -m venv venv      # python version 3.11
source venv/bin/activate  # Linux/macOS
venv\Scripts\activate     # Windows
```

### 3. Install Python dependencies

```bash

python -m pip install -r requirements-py311.txt --prefer-binary


```

```bash
python -c "import sys, numpy, pandas; print('Python:', sys.version.split()[0]); print('numpy:', numpy.__version__); print('pandas:', pandas.__version__)" 

```

```bash
python -m pip install -r backend/requirements.txt --prefer-binary 

```
```bash
python -m pip install flask flask-cors
python -m pip install spacy
python -m spacy download en_core_web_sm 
python -m pip install numpy==1.26.1 pandas==2.1.3 --force-reinstall --no-cache-dir 

python backend/app.py

python backend/main.py
#run both commands app and main both for python backend in different terminals or command prompts or powershell

```
```bash
cd Resumate

rmdir /s /q node_modules 

Remove-Item -Recurse -Force node_modules; Remove-Item package-lock.json -ErrorAction SilentlyContinue; npm cache clean --force 

npm install 

npm run dev 
```

```bash

# 1. after start app go to login :- sign up 
# 2. use correct credientials
# 2. sign up with same email and password
# 4. all functionalities working except Q&A
# 5. mai baad mai solve krta hu wo error 

```





## 🧪 Machine Learning Models

🧩 Models are trained and saved in `/models` directory:

* `xgboost_basic.pkl`
* `xgboost_text.pkl`
* `xgboost_basic_improved.pkl`
* `xgboost_text_improved.pkl`

💡 Use `src/model_training.py` and `train_salary_model.py` to retrain models on new data.

📊 Visualizations (already generated):

* `confusion_matrix.png`
* `feature_importance.png`
* `model_comparison.png`

---

## 📄 Resume Analyzer (Frontend)

📍 Located in `resumeAnalyzer.tsx`
📦 Upload a resume → Analyze → Predict salary → Display results

> Integrated with backend via Flask API

---

## 📊 Data Sources

Stored in `data/`:

* `Salary_Data.csv`
* `hiring_data.csv`

Used for training salary prediction and classification models.

---

## 🌐 Web Interface

HTML templates:

* `index.html` – Homepage
* `salary_form.html` – Input for salary prediction
* `result.html` – Result display
* `error.html` – Fallback UI

---





## 🤝 Contributing

We welcome contributions! 🚀

1. Fork this repo 🍴
2. Create a feature branch 🌱
3. Commit your changes ✅
4. Submit a pull request 🚀

---

## 📜 License

This project is licensed under the MIT License. See `LICENSE` for details.

---

## 👨‍💻 Team

Built with ❤️ by **Team Buri-Buri Jaimons**
Final year  EXTC Engineering project 

---

## 🧠 Fun Fact

> "You don’t hire for skills, you hire for attitude. You can always teach skills."
> – Simon Sinek


