FROM python:3.6

WORKDIR /app

COPY requirements.txt .

RUN python -m pip install --upgrade pip


RUN pip install --no-cache-dir --upgrade -r requirements.txt

RUN pip install "uvicorn[standard]"

COPY . .


CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]