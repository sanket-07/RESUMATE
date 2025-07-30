@echo off
echo Installing AI Recruiter dependencies for Windows...
echo.

:: Install pre-compiled numpy and pandas first
echo Installing numpy and pandas (pre-compiled wheels)...
pip install https://download.lfd.uci.edu/pythonlibs/archived/numpy-1.26.4-cp312-cp312-win_amd64.whl
pip install https://download.lfd.uci.edu/pythonlibs/archived/pandas-2.1.4-cp312-cp312-win_amd64.whl

:: Install remaining packages without compilation
echo Installing remaining dependencies...
pip install fastapi==0.104.1 uvicorn==0.23.2 sqlalchemy==2.0.23 alembic==1.12.1 psycopg2-binary==2.9.9 pymysql==1.1.0 python-jose==3.3.0 passlib==1.7.4 python-multipart==0.0.6 bcrypt==4.0.1 httpx==0.25.1 openai==1.2.4 langchain==0.0.335 langchain-openai==0.0.2 pydantic==2.4.2 tiktoken==0.5.1 python-docx==1.0.1 pypdf==3.17.1 docx2txt==0.8 pdfminer.six==20221105 python-dotenv==1.0.0 email-validator==2.1.0.post1 jinja2==3.1.2 tqdm==4.66.1 pytest==7.4.3 pytest-asyncio==0.21.1 --prefer-binary --only-binary=:all:

echo.
echo Installation complete!
echo Verifying installation...
python -c "import numpy, pandas, fastapi; print('✅ All packages installed successfully!')"
pause